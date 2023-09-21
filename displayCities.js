import { Feature } from 'ol/index.js';
import { Point } from 'ol/geom.js';
import { City, citySource } from './main';

const citiesURL = 'https://gimz520pd7.execute-api.eu-central-1.amazonaws.com/cities'

let feature 
let featureList = []

export function displayCities() {
  fetch(citiesURL)
    // to JSON
    .then(res => res.json())
    // but still marshalled ; uncomment to see in console
    // .then(json => console.log(json.Items[0].geography.M.rainy_days.N))
    .then(json => {
      const cities = json.Items.map(item => new City(item));
      cities.forEach((c) => {
        // console.log(c.name)
        feature = new Feature(new Point([c.longitude, c.latitude]));
        // console.log(feature.getProperties())
        feature.setProperties(c);
        if (c.rainy_days < 100) {
          featureList.push(feature);
        }

      });
      // console.log(featureList)
      citySource.addFeatures(featureList);
    });
}
