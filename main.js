import {Feature, Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import LayerGroup from 'ol/layer/Group';

useGeographic();

const citiesURL = 'https://gimz520pd7.execute-api.eu-central-1.amazonaws.com/cities'
const center = ["6.13","49.61"]

class City {
  cname;
  country;
  latitude;
  longitude;
  founding_year;
  rainy_days;

  constructor(data) {
      this.cname = data.name.S;
      this.country = data.country.S;
      this.latitude = data.geography.M.latitude.N;
      this.longitude = data.geography.M.longitude.N;
      this.founding_year = data.founding_year.S;
      this.rainy_days = data.geography.M.rainy_days.N;
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
const citySource = new VectorSource()

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
let feature 
let featureList = []

fetch(citiesURL)
// to JSON
.then(res => res.json())
// but still marshalled ; uncomment to see in console
// .then(json => console.log(json.Items[0].geography.M.rainy_days.N))

.then(json => {
    const cities = json.Items.map(item => new City(item))
    cities.forEach((c) => {
        // console.log(c.name)
        feature = new Feature(new Point([c.longitude, c.latitude]))
        feature.setProperties(c)
        // console.log(feature.getProperties())
        featureList.push(feature)
    });

    citySource.addFeatures(featureList)

})

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
    <table>
      <tbody>
        <tr><th>${city.cname}</th></tr>
        <tr><td>${city.country}</td></tr>
        <tr><td>rainy days: </td><td>${city.rainy_days}</td></tr>
      </tbody>
    </table>`;
}

// Handle Popover
let popover;
map.on('click', function (event) {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
  const feature = map.getFeaturesAtPixel(event.pixel)[0];
  if (!feature) {
    return;
  }
  console.log(feature.getProperties())
  const coordinate = feature.getGeometry().getFlatCoordinates();
  popup.setPosition([
    // coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
    coordinate[0],
    coordinate[1],
    // console.log(coordinate[0])
  ]);

  popover = new bootstrap.Popover(element, {
    container: element.parentElement,
    content: formatPopover(feature.getProperties()),
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




