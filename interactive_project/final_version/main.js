// main.js
// World choropleth map with D3 using your drug consumption JSON files

document.addEventListener("DOMContentLoaded", () => {
  // -------- CONFIG --------

  const WORLD_GEOJSON_URL =
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

  // Oficial list for substances
  const substanceKeys = [
    "cannabis",
    "cocaine",
    "opioids",
    "amphetamines",
    "ecstasy",
    "opiates",
    "prescription_opioids",
    "prescription_stimulants"
  ];

  let currentSubstance = "cannabis";
  let currentData = null;
  let selectedYear = 2023;

  // JSON Paths
  function getDataFile(substance) {
    return `drugs_directory/${substance}.json`;
  }

  // Map Dimensons
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = 520;
  const height = 280;

  // -------- SLIDER --------
  const yearSlider = document.getElementById("year-slider");
  const currentYearLabel = document.getElementById("current-year-label");
  const startYear = yearSlider ? +yearSlider.min : 2018;
  const endYear = yearSlider ? +yearSlider.max : 2023;

  if (yearSlider && currentYearLabel) {
    selectedYear = +yearSlider.value || endYear;
    currentYearLabel.textContent = selectedYear;
  }

  // -------- SVG + PROYECTIONS --------
  const svg = d3
    .select("#map-chart")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const mapGroup = svg.append("g").attr("class", "map-group");

  const projection = d3.geoNaturalEarth1()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2 + 10]);

  const path = d3.geoPath(projection);

  // -------- TOOLTIP --------
  const tooltip = d3.select("#tooltip");

  // -------- cOLOR PALETTES BY DRUG TYPE --------
  // Domain thresholds to match legends 
  const thresholdDomain = [0.5, 1.0, 2.5, 5.0];

  // Color palettes (from darker to lighter)
  const substancePalettes = {
    cannabis: [
      "#dcfce7", "#86efac", "#22c55e", "#16a34a", "#166534"
    ],
    cocaine: [
      "#fee2e2", "#fecaca", "#f97373", "#ef4444", "#991b1b"
    ],
    opioids: [
      "#fef3c7", "#fde68a", "#fbbf24", "#f59e0b", "#b45309"
    ],
    amphetamines: [
      "#f3e8ff", "#e9d5ff", "#c4b5fd", "#a855f7", "#6b21a8"
    ],
    ecstasy: [
      "#e0f2fe", "#bae6fd", "#60a5fa", "#3b82f6", "#1d4ed8"
    ],
    opiates: [
      "#e0f2f1", "#b2f5ea", "#4fd1c5", "#14b8a6", "#0f766e"
    ],
    prescription_opioids: [
      "#fefce8", "#fef9c3", "#fde68a", "#fbbf24", "#854d0e"
    ],
    prescription_stimulants: [
      "#fdf2ff", "#f5d0fe", "#e879f9", "#d946ef", "#a21caf"
    ],
    default: [
      "#e5e7eb", "#38bdf8", "#3b82f6", "#6366f1", "#7c3aed"
    ]
  };

  let currentColorScale = getColorScaleForSubstance(currentSubstance);
  updateLegendColors();

  // -------- GLOBAL STATE--------
  let worldGeoJSON = null;
  let isPlaying = false;
  let playInterval = null;

  // -------- DOM ELEMENTS --------
  const playButton = document.getElementById("play-animation-btn");
  const prevYearButton = document.getElementById("prev-year-btn");
  const nextYearButton = document.getElementById("next-year-btn");
  const resetViewButton = document.getElementById("reset-view-btn");

  const detailEmpty = document.querySelector(".detail-empty");
  const detailContent = document.getElementById("detail-content");

  // -------- INITIALIATZING HERO STATS --------
  initHeroStats();

  // -------- GEOJSON INITIAL LOAD --------
  d3.json(WORLD_GEOJSON_URL)
    .then(world => {
      console.log("World GeoJSON loaded:", world);
      worldGeoJSON = world;
      loadSubstanceData(currentSubstance);
    })
    .catch(error => {
      console.error("Error loading world GeoJSON:", error);
    });

  // -------- COLOR FUNCTIONS --------
  function getColorScaleForSubstance(substance) {
    const palette = substancePalettes[substance] || substancePalettes.default;
    return d3.scaleThreshold().domain(thresholdDomain).range(palette);
  }

  function updateLegendColors() {
  const palette = substancePalettes[currentSubstance] || substancePalettes.default;
  const legendElems = document.querySelectorAll(".legend-color");

  legendElems.forEach((el, i) => {
    const isNoData = i === legendElems.length - 1; 

    if (isNoData) {
      // Last Item on leged: "No data"
      el.style.backgroundColor = "transparent";
      el.style.border = "1px dashed #d1d5db";
    } else {

      const paletteIndex = palette.length - 1 - i; 
      el.style.backgroundColor = palette[paletteIndex];
      el.style.border = "none";
    }
  });   
    console.log("Legend updated for", currentSubstance);
}



  // -------- LOADING DATA BY SUBSTANCE --------
  function loadSubstanceData(substance) {
    const filePath = getDataFile(substance);

    d3.json(filePath)
      .then(data => {
        if (!Array.isArray(data)) {
          console.warn(`Data for ${substance} is not an array, got:`, data);
        }
        console.log(`Loaded data for ${substance}:`, Array.isArray(data) ? data.slice(0, 5) : data);
        currentData = Array.isArray(data) ? data : data.data || [];

        // Simple validation in single console
        const missingIso = currentData.filter(d => !d.iso3).length;
        const missingBest = currentData.filter(d => d.Best == null || d.Best === "").length;
        console.log(`Validation for ${substance}: missing iso3=${missingIso}, missing Best=${missingBest}`);

        drawMap(worldGeoJSON, currentData);
        updateMainTitle(substance);
      })
      .catch(error => {
        console.error("Error loading substance JSON:", filePath, error);
      });
  }

  // -------- RENDERING MAPS BY YEAR --------
  function drawMap(geojson, data) {
    if (!geojson || !data) {
      console.warn("Missing geojson or data");
      return;
    }

    // iso3: Register number by year
    const dataByIso3 = new Map();

    data.forEach(d => {
      const iso = d.iso3;
      if (!iso) return;

      const year = +d.Year;
      const best = +d.Best;
      if (isNaN(year) || isNaN(best)) return;

      if (year === selectedYear) {
        dataByIso3.set(iso, d);
      }
    });

    console.log(`Year ${selectedYear} - countries with data:`, dataByIso3.size);

    const countries = mapGroup
      .selectAll("path.country")
      .data(geojson.features, d => d.id);

    countries.join(
      enter =>
        enter
          .append("path")
          .attr("class", "country")
          .attr("d", path)
          .attr("fill", d => getCountryColor(d, dataByIso3))
          .attr("stroke", "#94a3b8")
          .attr("stroke-width", 0.5)
          .on("mouseover", (event, d) => handleMouseOver(event, d, dataByIso3))
          .on("mousemove", (event, d) => handleMouseMove(event, d, dataByIso3))
          .on("mouseout", handleMouseOut)
          .on("click", (event, d) => handleCountryClick(d, dataByIso3)),
      update =>
        update
          .on("mouseover", (event, d) => handleMouseOver(event, d, dataByIso3))
          .on("mousemove", (event, d) => handleMouseMove(event, d, dataByIso3))
          .on("mouseout", handleMouseOut)
          .on("click", (event, d) => handleCountryClick(d, dataByIso3))
          .transition()
          .duration(600)
          .attr("fill", d => getCountryColor(d, dataByIso3))
    );
  }

  function getCountryColor(feature, dataByIso3) {
    const iso3 = feature.id;
    const entry = dataByIso3.get(iso3);
    if (!entry || isNaN(+entry.Best)) {
      return "#f3f4f6"; 
    }
    return currentColorScale(+entry.Best);
  }

  // -------- TOOLTIP HANDLERS --------
  function handleMouseOver(event, d, dataByIso3) {
    d3.select(event.currentTarget)
      .attr("stroke-width", 1)
      .attr("stroke", "#0f172a");

    const iso3 = d.id;
    const entry = dataByIso3.get(iso3);
    if (!entry) {
      tooltip.style("opacity", 0);
      return;
    }

    const countryName = d.properties && d.properties.name ? d.properties.name : iso3;

    tooltip
      .style("opacity", 1)
      .html(`
        <div class="tooltip-title">${countryName}</div>
        <div class="tooltip-substance">${toTitleCase(currentSubstance)} – ${selectedYear}</div>
        <div><strong>Prevalence (Best):</strong> ${(+entry.Best).toFixed(2)}%</div>
        <div><strong>Male:</strong> ${entry.Male != null ? (+entry.Male).toFixed(2) + "%" : "n/a"}</div>
        <div><strong>Female:</strong> ${entry.Female != null ? (+entry.Female).toFixed(2) + "%" : "n/a"}</div>
        <div><strong>Change vs. first year:</strong> ${
          entry.difference != null ? (+entry.difference).toFixed(2) + " pp" : "n/a"
        }</div>
      `);
  }

  function handleMouseMove(event, d, dataByIso3) {
    tooltip
      .style("left", event.clientX + 12 + "px")
      .style("top", event.clientY + 12 + "px");
  }

  function handleMouseOut(event, d) {
    d3.select(event.currentTarget)
      .attr("stroke-width", 0.5)
      .attr("stroke", "#94a3b8");

    tooltip.style("opacity", 0);
  }

  // -------- RIGHT PANEL (DETAIL) --------
  function handleCountryClick(feature, dataByIso3) {
    if (!currentData) return;

    const iso3 = feature.id;
    const countryName = feature.properties && feature.properties.name ? feature.properties.name : iso3;

    // All rows by country
    const rows = currentData
      .filter(d => d.iso3 === iso3)
      .map(d => ({
        ...d,
        Year: +d.Year,
        Best: d.Best != null ? +d.Best : null
      }))
      .filter(d => !isNaN(d.Year));

    if (rows.length === 0) {
      showEmptyDetail();
      return;
    }

    // Sorting by year
    rows.sort((a, b) => a.Year - b.Year);

    const first = rows.find(d => d.Best != null);
    const last = [...rows].reverse().find(d => d.Best != null);

    const initialYear = first ? first.Year : null;
    const initialBest = first ? first.Best : null;
    const lastYear = last ? last.Year : null;
    const lastBest = last ? last.Best : null;
    const change = (initialBest != null && lastBest != null)
      ? (lastBest - initialBest)
      : null;

    renderCountryDetail(countryName, iso3, rows, {
      initialYear,
      initialBest,
      lastYear,
      lastBest,
      change
    });
  }

  function showEmptyDetail() {
    if (!detailEmpty || !detailContent) return;
    detailEmpty.style.display = "block";
    detailContent.style.display = "none";
  }

  function renderCountryDetail(countryName, iso3, rows, summary) {
    if (!detailEmpty || !detailContent) return;

    detailEmpty.style.display = "none";
    detailContent.style.display = "block";

    const latest = rows[rows.length - 1];

    detailContent.innerHTML = `
      <h2 class="card-title">${countryName}</h2>
      <p class="card-subtitle" style="margin-bottom: 10px;">
        ${toTitleCase(currentSubstance)} – ${selectedYear} (ISO3: ${iso3})
      </p>
      <div style="font-size: 12px; margin-bottom: 10px;">
        <div><strong>Prevalence (Best):</strong> ${
          latest && latest.Best != null ? latest.Best.toFixed(2) + "%" : "n/a"
        }</div>
        <div><strong>Male:</strong> ${
          latest && latest.Male != null ? (+latest.Male).toFixed(2) + "%" : "n/a"
        }</div>
        <div><strong>Female:</strong> ${
          latest && latest.Female != null ? (+latest.Female).toFixed(2) + "%" : "n/a"
        }</div>
        <div><strong>First year available:</strong> ${
          summary.initialYear != null ? summary.initialYear : "n/a"
        }</div>
        <div><strong>Last year available:</strong> ${
          summary.lastYear != null ? summary.lastYear : "n/a"
        }</div>
        <div><strong>Change (first → last):</strong> ${
          summary.change != null ? summary.change.toFixed(2) + " pp" : "n/a"
        }</div>
      </div>
      <div style="margin-top: 8px;">
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
          Trend 2018–2023 (Best)
        </div>
        <div id="country-trend-chart"></div>
      </div>
    `;

    renderCountryTrend(rows);
  }

  // Line chart with details by country under mao
  function renderCountryTrend(rows) {
    const container = d3.select("#country-trend-chart");
    container.selectAll("*").remove();

    const validRows = rows.filter(d => d.Best != null);
    if (validRows.length === 0) {
      container
        .append("div")
        .style("font-size", "11px")
        .style("color", "#9ca3af")
        .text("No time-series data available for this country.");
      return;
    }

    const trendWidth = 260;
    const trendHeight = 120;
    const marginT = { top: 10, right: 10, bottom: 20, left: 30 };

    const svgTrend = container
      .append("svg")
      .attr("width", trendWidth)
      .attr("height", trendHeight);

    const innerWidth = trendWidth - marginT.left - marginT.right;
    const innerHeight = trendHeight - marginT.top - marginT.bottom;

    const g = svgTrend
      .append("g")
      .attr("transform", `translate(${marginT.left},${marginT.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(validRows, d => d.Year))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(validRows, d => d.Best) || 1])
      .nice()
      .range([innerHeight, 0]);

    const line = d3
      .line()
      .x(d => x(d.Year))
      .y(d => y(d.Best))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(validRows)
      .attr("fill", "none")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    g
      .selectAll("circle.point")
      .data(validRows)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => x(d.Year))
      .attr("cy", d => y(d.Best))
      .attr("r", 2.2)
      .attr("fill", "#4f46e5");

    const xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(y).ticks(4);

    g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "9px");

    g
      .append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "9px");
  }

  // -------- TITULAR --------
  function toTitleCase(str) {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function updateMainTitle(substance) {
    const title = document.getElementById("main-title");
    if (!title) return;
    title.textContent = `${toTitleCase(substance)} Consumption – ${selectedYear}`;
  }

  // -------- SUBSTANCESX BUTTONS --------
  d3.selectAll(".substance-btn").on("click", function () {
    const btn = d3.select(this);
    const substance = btn.attr("data-substance");
    if (!substance) return;

    currentSubstance = substance;
    currentColorScale = getColorScaleForSubstance(currentSubstance);
    updateLegendColors();

    d3.selectAll(".substance-btn").classed("active", false);
    btn.classed("active", true);

    stopAnimation();
    loadSubstanceData(substance);
  });

  // -------- SLIDER: CHANGE YEAR --------
  if (yearSlider && currentYearLabel) {
    yearSlider.addEventListener("input", (event) => {
      selectedYear = +event.target.value;
      currentYearLabel.textContent = selectedYear;
      stopAnimation();
      if (worldGeoJSON && currentData) {
        drawMap(worldGeoJSON, currentData);
        updateMainTitle(currentSubstance);
      }
    });
  }

  // -------- BOTONES PREV / NEXT / RESET --------
  if (prevYearButton) {
    prevYearButton.addEventListener("click", () => {
      stopAnimation();
      selectedYear = Math.max(startYear, selectedYear - 1);
      updateYearAndRedraw();
    });
  }

  if (nextYearButton) {
    nextYearButton.addEventListener("click", () => {
      stopAnimation();
      selectedYear = Math.min(endYear, selectedYear + 1);
      updateYearAndRedraw();
    });
  }

  if (resetViewButton) {
    resetViewButton.addEventListener("click", () => {
      stopAnimation();
      selectedYear = endYear;
      updateYearAndRedraw();
      showEmptyDetail();
    });
  }

  function updateYearAndRedraw() {
    if (yearSlider && currentYearLabel) {
      yearSlider.value = selectedYear;
      currentYearLabel.textContent = selectedYear;
    }
    if (worldGeoJSON && currentData) {
      drawMap(worldGeoJSON, currentData);
      updateMainTitle(currentSubstance);
    }
  }

  // -------- PLAY / PAUSE ANIMATION --------
  if (playButton) {
    playButton.addEventListener("click", () => {
      if (isPlaying) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });
  }

  function startAnimation() {
    if (isPlaying) return;
    isPlaying = true;
    if (playButton) playButton.textContent = "Pause";

    playInterval = setInterval(() => {
      if (selectedYear >= endYear) {
        selectedYear = startYear;
      } else {
        selectedYear += 1;
      }
      updateYearAndRedraw();
    }, 1200);
  }

  function stopAnimation() {
    if (!isPlaying) return;
    isPlaying = false;
    if (playButton) playButton.textContent = "Play Animation";
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
  }

  // -------- HERO STATS (countries, years, drugs) --------
  function initHeroStats() {
    // Years in the slider
    const yearsSpan = document.getElementById("years-count-number");
    if (yearSlider && yearsSpan) {
      const minY = +yearSlider.min;
      const maxY = +yearSlider.max;
      const nYears = maxY - minY + 1;
      yearsSpan.textContent = nYears;
    }

    // Number of types of drugs
    const drugSpan = document.getElementById("drug-count-number");
    if (drugSpan) {
      drugSpan.textContent = substanceKeys.length;
    }

    // Countries in data
    const countriesSpan = document.getElementById("countries-count-number");
    if (!countriesSpan) return;

    const promises = substanceKeys.map(key =>
      d3.json(getDataFile(key)).catch(() => [])
    );

    Promise.all(promises).then(allArrays => {
      const isoSet = new Set();
      allArrays.forEach(arr => {
        if (!Array.isArray(arr)) return;
        arr.forEach(d => {
          if (d && d.iso3) isoSet.add(d.iso3);
        });
      });
      countriesSpan.textContent = isoSet.size;
      console.log("Unique countries across all substances:", isoSet.size);
    });
  }
});
