import {Feature, Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';

useGeographic();

center = [6.13,49.61]

const map = new Map({
  target: 'map',
  view: new View({
    // center: place,
    center: center,
    zoom: 4,
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
      visible: true
    })
    // pointLayer
    // new VectorLayer({
    //   source: new VectorSource({
    //     features: [new Feature(point)],
    //   }),
    //   style: {
    //     'circle-radius': 4,
    //     'circle-fill-color': 'red',
    //   },
    // }),
  ],
});


const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  stopEvent: false,
});
map.addOverlay(popup);

function formatCoordinate(coordinate) {
  return `
    <table>
      <tbody>
        <tr><th>lon</th><td>${coordinate[0].toFixed(2)}</td></tr>
        <tr><th>lat</th><td>${coordinate[1].toFixed(2)}</td></tr>
      </tbody>
    </table>`;
}

const info = document.getElementById('info');
map.on('moveend', function () {
  const view = map.getView();
  const center = view.getCenter();
  info.innerHTML = formatCoordinate(center);
});

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
  const coordinate = feature.getGeometry().getCoordinates();
  popup.setPosition([
    coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
    coordinate[1],
  ]);

  popover = new bootstrap.Popover(element, {
    container: element.parentElement,
    content: formatCoordinate(coordinate),
    html: true,
    offset: [0, 20],
    placement: 'top',
    sanitize: false,
  });
  popover.show();
});

map.on('pointermove', function (event) {
  const type = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
  map.getViewport().style.cursor = type;
});

class City {
    name;
    country;
    latitude;
    longitude;

    constructor(data) {
        this.name = data.name.S;
        this.country = data.country.S;
        this.latitude = data.geography.M.latitude.N;
        this.longitude = data.geography.M.longitude.N;
    }
}


// #######  ORIGINAL #########
// const place = [lon, lat];
// const place = [19.49, 40.47]
// const point = new Point(place)
// feature = new Feature(point)

let feature 
featureList = []


fetch('https://phgvfum0bc.execute-api.eu-central-1.amazonaws.com/cities')
// to JSON
.then(res => res.json())
// but still marshalled
// .then(json => console.log(json.Items[0].name.S))

.then(json => {
    const cities = json.Items.map(item => new City(item))
    cities.forEach((c) => {
        feature = new Feature(new Point([c.longitude, c.latitude]))
        // console.log(feature)
        featureList.push(feature)
    // console.log(cities)

    // console.log(pointLayer)

    });

    // #######  MEINS #########
    // let feature

    var pointLayer = new VectorLayer({
        source: new VectorSource({
            features: featureList
        }),
        style: {
            'circle-radius': 3,
            'circle-fill-color': 'blue'
        }
        })
   
    // console.log(pointLayer)
    // console.log(featureList)
    // pointLayer.features = featureList
    map.addLayer(pointLayer)
    // pointLayer.setVisible(true)
})



