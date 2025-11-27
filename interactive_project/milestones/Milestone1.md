# Maria Jose Reyes

## Description
This project explores the global dynamics of narcotrafficking and drug consumption thrugh an integrated interactive visualization system. The central idea is to understand how international trafficking routes of hard drugs (cocaione, heroin, and other opioids) evolve over time, and how these patterns relate to consumption trends within different populations and around the world. 

The project focuses on two interconnected dimensions: 
**1. Trafficking Routes and Supply Dynamics**
Using global seizure data and UNODC traffiking route reports, the visualization maps the main export origins, transit corridos, and destination regions for major drug categories. Users will be able to explore:
- How traffiking flows have changed historically
- Which countries serve as producers, transit hubs, or primary destinations
- Regional patterns such as the Andean cocaine routes toward North America and Europe, or heroin flows from Golden Crescent into Europe, Africa, and Asia. 
- How the scale of seizures or supply indicators has shifted over time

Representing trafficking routes spatially and temprally allows users to see narcotrafficking as a global supply system, shaped by geopolitical context, enforcement intensity, and market demand. 

**2. Consumption Patterns and Demographic Insights**

Parallel to supply dynamics, the project examines how drug use prevalence varies accross countries and demographic groups. Using publicly available prevalence data, the visualization enables users to analyze:

- Overall consumption levels by country and year
- Breakdown of use by age group (e.g., 15-24, 25-34, etc.)
- Difference in drug consumption by *gender*
- Long-term trends in use of cocaine, opioids, and heroin

This allowa for a demographic understanding of how drug use is distributed within societies and how it changes across generations and time. 
**3. Conneting two sides: Supply and Demand**

The core contribution of the project lies in placing trafficking flows and consumption patterns in a single analytic environment. This dual perspective makes it possible to explore questions such as: 
- Do shifts in trafficking routes coincide with chanes in domestic consumption patterns? 
- Are countries that reeive large quantities of trafficked drugs also experiencing rising prevalence among specific age groups? 
- Could supply-side disruptions or expansions be reflected in demographic shifts in use? 

While the project does not attempt to establish causality, the visualization could highlight temporal correlations, geogrpahic overlaps and population impacts that may point to connections between trafficking behaviors and consumption outcomes. 

## Technical Plan re: Option A/B/C/D
My initial plan is to have an interactive, web-based visualization. My topic combines geography, time and demographics, so a dynamic web page is a good fit: isers need to move across years, drugs, and regions to see ho trafficking and consumption evolve together. 

**Path and libraries**
I will build a single-page interactive website using: 
- **HTML + CSS** for the layout and narrative
-**Javascript + D3.js** for the custom interactive map and flow visualization of trafficking routes (cirved links between origin and destination regions, hover tooltips, and brushing to filter destinations). 
- **Vega-Lite or small D3 chart module** for the analytic charts on the consumption side (time-series and bar charts by age and gender). 

- data will be pre-processed in python (Jupyter) to produce csv files that can be loaded directly by the web app. 

**Inspirational pieces**
My main inspiration is the **Our World in Data "Share with drug use disorders" grapher:**

https://ourworldindata.org/grapher/share-with-drug-use-disorders?time=1990..2002

I want to use the design ideas from this example:

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

{
include 1-3 data sources with the following,
you may re-use data sources from before or switch topics
}

### Data Source 1: {Name}

URL: {URL}

Size: {Number of Rows} rows, {Number of Columns} columns

{Short Description, including any exploration you've done already}

## Questions

{Numbered list of questions for course staff, if any.}

1.
2.
3.