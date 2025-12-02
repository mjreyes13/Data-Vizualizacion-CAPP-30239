# World Illicit Drug Patterns Explorer

Maria Jose Reyes

## Goal

The core contribution of the project lies in placing trafficking flows and consumption patterns in a single analytic environment. This dual perspective makes it possible to explore questions such as: 
- Do shifts in trafficking routes coincide with changes in domestic consumption patterns? 
- Are countries that receive large quantities of trafficked drugs also experiencing rising prevalence among specific age groups? 
- Could supply-side disruptions or expansions be reflected in demographic shifts in use? 

While the project does not attempt to establish causality, the visualization could highlight temporal correlations, geographic overlaps and population impacts that may point to connections between trafficking behaviors and consumption outcomes. 

It hasn't change

## Data Challenges

1. Currently, my data is in Excel files, and each drug has information on a different sheet. To use the data with D3 I converted it to CSV. For now, I'm only using two countries to see how the data would look, but I'm not sure how to handle all the information I have. Should I create separate CSV files for each type of drug, or should I merge everything into a single csv file?

2. My data doesn’t include any geographical coordinates, so I would need to manually add them for each country. I’m not sure if there’s a better way to approach this problem or to automate the process.

## Walk Through

The idea of the project is to let users explore regional patterns of drug consumption through an interactive website. The main view would be a map where you can see consumption rates for different types of drugs by country and region. From there, users could drill down into more disaggregated data to get a demographic view of consumption patterns, for example, by age group, gender, and other relevant characteristics. 
## Questions

1. Currently, my data is in Excel files, and each drug has information on a different sheet. To use the data with D3 I converted it to CSV. For now, I'm only using two countries to see how the data would look, but I'm not sure how to handle all the information I have. Should I create separate CSV files for each type of drug, or should I merge everything into a single csv file?

2. My data doesn’t include any geographical coordinates, so I would need to manually add them for each country. I’m not sure if there’s a better way to approach this problem or to automate the process.