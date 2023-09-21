import { Map, View } from 'ol/index.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import LayerGroup from 'ol/layer/Group';
import {useGeographic} from 'ol/proj.js';

useGeographic();
const center = ["6.13","49.61"]

// Map
export const map = new Map({
  target: 'map',
  view: new View({
    center: center,
    zoom: 4.5,
  })
});

// Source
export const citySource = new VectorSource();

// Layers
const openStreetMapStandard = new TileLayer({
  source: new OSM(),
  visible: true,
  title: "OSMStandard"
});

// const openStreetCycle = new TileLayer({
//   source: new OSM({
//     url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
//   }),
//   visible: false,
//   title: 'OSMCycle'
// });
const cityLayer = new VectorLayer({
  style: {
    'circle-radius': 3,
    'circle-fill-color': 'blue'
  },
  source: citySource,
});

// LayerGroup
const baseLayerGroup = new LayerGroup({
  // layers: [openStreetMapStandard, openStreetCycle, cityLayer]
  layers: [openStreetMapStandard, cityLayer]
});
map.addLayer(baseLayerGroup);


// change Pointer over Feature
map.on('pointermove', function (event) {
  const type = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
  map.getViewport().style.cursor = type;
});


