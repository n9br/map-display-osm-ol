import { Feature } from 'ol/index.js';
import { Point } from 'ol/geom.js';

import { City } from './City.js';
import { citySource } from './map.js';

const citiesURL = 'https://gimz520pd7.execute-api.eu-central-1.amazonaws.com/cities'
let feature 


function toDaily(hours){
  return parseFloat((hours/30.437).toFixed(1));
}

function toMonthly(days){
  return parseFloat((days/12).toFixed(1));
}

export function displayCities(MinSunHours, MaxSunHours, MinRainDays, MaxRainDays) {
  // clear layer 
  citySource.clear()
  let featureList = []

  console.log(MinSunHours, MaxSunHours, MinRainDays, MaxRainDays)

  fetch(citiesURL)
    // to JSON
    .then(res => res.json())
    // but still marshalled ; uncomment to see in console
    // .then(json => console.log(json.Items[0].geography.M.rainy_days.N))
    .then(json => {
      const cities = json.Items.map(item => new City(item));
      cities.forEach((c) => {
        // console.log(c.cname)
        feature = new Feature(new Point([c.longitude, c.latitude]));
        // console.log(feature.getProperties())
        c.rainy_days = toMonthly(c.rainy_days)
        c.sun_hours = toDaily(c.sun_hours)
        feature.setProperties(c);

        // if (MinRainDays <= c.rainy_days && toMonthly(c.rainy_days) <= MaxRainDays && MinSunHours <= c.sun_hours && c.sun_hours <= MaxSunHours) {
        if (MinRainDays <= c.rainy_days && c.rainy_days <= MaxRainDays && MinSunHours <= c.sun_hours && c.sun_hours <= MaxSunHours) {

          featureList.push(feature);
        }
      });
      console.log(featureList.length)
      citySource.addFeatures(featureList);
    });
}
