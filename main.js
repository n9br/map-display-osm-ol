import {Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import LayerGroup from 'ol/layer/Group';
import { displayCities } from './displayCities';

const rainURL = new URL(
  'px/rain.jpg?as=webp&width=47',
  import.meta.url
)
const countryURL = new URL(
  'px/country.png?as=webp&width=40',
  import.meta.url
)
const sunURL = new URL(
  'px/sun.png?as=webp&width=33',
  import.meta.url
)

useGeographic();

const center = ["6.13","49.61"]
let popover;

export class City {
  cname;
  country;
  latitude;
  longitude;
  founding_year;
  rainy_days;
  sun_hours;

  constructor(data) {
      this.cname = data.name.S;
      this.country = data.country.S;
      this.latitude = data.geography.M.latitude.N;
      this.longitude = data.geography.M.longitude.N;
      this.founding_year = data.founding_year.S;
      this.rainy_days = data.geography.M.rainy_days.N;
      this.sun_hours = data.geography.M.monthly_sunshine_hours.N;
  }
}

// Map
const map = new Map({
  target: 'map',
  view: new View({
    center: center,
    zoom: 4.5,
  })
});

// Source
export const citySource = new VectorSource()

// Layers

const openStreetMapStandard = new TileLayer({
  source: new OSM(),
  visible: true,
  title: "OSMStandard"
})

const openStreetCycle = new TileLayer({
  source: new OSM({
    url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
   }),
  visible : false,
  title : 'OSMCycle' 
})

const cityLayer = new VectorLayer({
  style: {
    'circle-radius': 3,
    'circle-fill-color': 'blue'
    },
  source: citySource,
})

// LayerGroup
const baseLayerGroup = new LayerGroup({
  layers: [ openStreetMapStandard, openStreetCycle, cityLayer ]
})

map.addLayer(baseLayerGroup)

// Get and Feed Features
displayCities()

console.log(citySource)
citySource.clear()
console.log(citySource)


// ####### POPUP OVerlay #######
const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  stopEvent: false,
});
map.addOverlay(popup);

// Format Popover
function formatPopover(city) {

  return `
  <div>
      <div class="d-flex flex-row align-items-start"> 
        <div class="p-1"> <img src=${countryURL}/> </div>
        <div class="p-1"> ${city.country} </div>
      </div>
      <div class="d-flex flex-row align-items-start"> 
        <div class="p-1"> <img src=${sunURL}> </div>
        <div class="p-1"> ${city.sun_hours} h/m </div>
      </div>
      <div class="d-flex flex-row align-items-start"> 
        <div class="p-1"> <img src=${rainURL}> </div>
        <div class="p-1"> ${city.rainy_days} d/a </div>
      </div>
  </div>  
  `;
}

// Handle Popover

map.on('click', function (event) {
  
  if (popover) {
    popover.dispose();
    popover = undefined;
  }

  const feature = map.getFeaturesAtPixel(event.pixel)[0];
  if (!feature) {
    return;
  }
  
  let featureProps = feature.getProperties();
  const coordinate = feature.getGeometry().getFlatCoordinates();
    
  // console.log(featureProps)
  popup.setPosition([
    // coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
    coordinate[0],
    coordinate[1],
  ]);

  popover = new bootstrap.Popover(element, {
    container: element.parentElement,
    title: featureProps.cname,
    content: formatPopover(featureProps),
    html: true,
    offset: [0, 20],
    placement: 'top',
    sanitize: false,
  });
  // console.log(element);
  popover.show();
});

// change Pointer over Feature
map.on('pointermove', function (event) {
  const type = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
  map.getViewport().style.cursor = type;
});





