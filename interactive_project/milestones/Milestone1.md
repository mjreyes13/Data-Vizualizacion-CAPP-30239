# Maria Jose Reyes

## Description
This project explores the global dynamics of narcotrafficking and drug consumption through an integrated interactive visualization system. The central idea is to understand how international trafficking routes of hard drugs (cocaine, heroin, and other opioids) evolve over time, and how these patterns relate to consumption trends within different populations and around the world. 

The project focuses on two interconnected dimensions: 
**1. Trafficking Routes and Supply Dynamics**
Using global seizure data and UNODC trafficking route reports, the visualization maps the main export origins, transit corridos, and destination regions for major drug categories. Users will be able to explore:
- How trafficking flows have changed historically
- Which countries serve as producers, transit hubs, or primary destinations
- Regional patterns such as the Andean cocaine routes toward North America and Europe, or heroin flows from Golden Crescent into Europe, Africa, and Asia. 
- How the scale of seizures or supply indicators has shifted over time

Representing trafficking routes spatially and temporally allows users to see narcotrafficking as a global supply system, shaped by geopolitical context, enforcement intensity, and market demand. 

**2. Consumption Patterns and Demographic Insights**

Parallel to supply dynamics, the project examines how drug use prevalence varies accross countries and demographic groups. Using publicly available prevalence data, the visualization enables users to analyze:

- Overall consumption levels by country and year
- Breakdown of use by age group (e.g., 15-24, 25-34, etc.)
- Difference in drug consumption by *gender*
- Long-term trends in use of cocaine, opioids, and heroin

This allows for a demographic understanding of how drug use is distributed within societies and how it changes across generations and time. 
**3. Conneting two sides: Supply and Demand**

The core contribution of the project lies in placing trafficking flows and consumption patterns in a single analytic environment. This dual perspective makes it possible to explore questions such as: 
- Do shifts in trafficking routes coincide with changes in domestic consumption patterns? 
- Are countries that receive large quantities of trafficked drugs also experiencing rising prevalence among specific age groups? 
- Could supply-side disruptions or expansions be reflected in demographic shifts in use? 

While the project does not attempt to establish causality, the visualization could highlight temporal correlations, geographic overlaps and population impacts that may point to connections between trafficking behaviors and consumption outcomes. 

## Technical Plan re: Option A/B/C/D
My initial plan is to have an interactive, web-based visualization. My topic combines geography, time and demographics, so a dynamic web page is a good fit: users need to move across years, drugs, and regions to see how trafficking and consumption evolve together. 

**Path and libraries**
I will build a single-page interactive website using: 
- **HTML + CSS** for the layout and narrative
-**Javascript + D3.js** for the custom interactive map and flow visualization of trafficking routes (curved links between origin and destination regions, hover tooltips, and brushing to filter destinations). 
- **Vega-Lite or small D3 chart module** for the analytic charts on the consumption side (time-series and bar charts by age and gender). 

- data will be pre-processed in python (Jupyter) to produce csv files that can be loaded directly by the web app. 

**Inspirational pieces**
My main inspiration is the **Our World in Data "Share with drug use disorders" grapher:**

https://ourworldindata.org/grapher/share-with-drug-use-disorders?time=1990..2002

I want to use the design ideas from this example:
![Preview1](../milestones/preview1.png)


**1. Map + time controls**

The OWID grapher uses a chropleth world map with a time slider and play button to show how drug use disorders change between 1990 and 2021. I plan to adapt this idea for trafficking side: a world or regional map where color encodes seizure intensity or trafficking relevance, with a time slider that updates both the map and the charts. 

**2. Linked views (map + chart)**
In the OWID interface, users can switch between map and chart views and see how values evolve over time. In my project, I will extend this concept by having two coordinated views at the same time: 
*Left* trafficking map with flows (D3)
*Right* consumption charts by country, agem and gender (Vega-Lite/ D3)

Clicking a country or region on the map will update the charts, maintaining the same "clean, minimalist" style as OWID (simple color scales, clear legends, responsive tooltips). 

In short, technically the project will be a dynamic, browser-based visualization that takes OWID grapher philosophy (map + time + simple interations) and extends it into a two-panel, linked view that brings together global trafficking routes ajnd demographic consumption patterns. 

## Mockup

Below is a screenshot taken from *Our World in Data - Share with Drug Use Disorders*. This visualization is one of my primary design inspirations. My final project will not replicate this figure, but it will adopt several of its core interaciton ideas: a world map, a time slider, tooltips, and dynamic updates based on user input. 

The mockup below illustrates the type of interaction and layout I intend to build. My own visulization will extejnd this structure by adding a second panel showing consumption trends by age and gender, and by integrating D3-based routed flows for trafficking

## Data Sources

The main data source for this project would be UNODC - Drug Seizures/ trafficking

### Data Source 1: Prevalence of drug use in the general population national data

URL: https://www.unodc.org/unodc/en/data-and-analysis/world-drug-report-2025-annex.html

Size: This data set contains 10 sheets, clasifying national consumption for: cannabis (439 Rows), Cocaine (354 rows), Anphetamines (340 rows), Ecstasy  (350 rows), Prescription Stimulants  (340 rows), Opioids  (51 rows), opiates (300 rows), tranquilizers and sendatives (181 rows), and NPS (309 rows). 

Each of the sheets contains information related to Prevalence of Use as a percentage of the population aged 15-64 (unless otherwise stated), it contains data related to the average consumption in a lifetime, Past yearm Past month, by age and gender. 


### Data Source 2: Prevalence of drug use in the youth population, including NPS - national data

URL: (https://www.unodc.org/unodc/en/data-and-analysis/world-drug-report-2025-annex.html)

Size: This data set contains 8 sheets, clasifying national consumption among youth population for: cannabis (285 Rows), Cocaine (884 rows), Anphetamines (720 rows), Ecstasy  (372 rows), Opioids  (574 rows), tranquilizers and sendatives (401 rows), and NPS (453 rows). 

Each of the sheets contains information related to Prevalence of Use as a percentage of the population aged 15-64 (unless otherwise stated), it contains data related to the average consumption in a lifetime, Past yearm Past month, by age and gender. 

### Data Source 3: Drug Seizures 2019-2023

URL: https://www.unodc.org/unodc/en/data-and-analysis/world-drug-report-2025-annex.html

Size: {Number of Rows} rows, {Number of Columns} columns

This data set contains 11274 rows and 8 columns, the columns contain information related with: Country where the drug was found, the type of drug and subgroup of drug, as well as the quantity in Kilograms for each of the incautations. The data is from 2019 -2023. 

## Questions


1. Is the scope of combining a D3 flow map (trafficking routes) with linked Vega-Lite charts (consumption patterns) reasonable for the final project, or should I simplify either the map or the demographic breakdowns?

2. For representing traffiking routes, do you recommend using region-region flows (aggregated) or country-coutnry flows (more granular) Given data limitations from UNODC which approach would make the visualization more interpretable and technically feasiable? 

3. What is the best practice for coordinating interactions between D3 elements and embeded Vega-Lite charts:manual JS messaging, Vega-Lite slections, or another method? 