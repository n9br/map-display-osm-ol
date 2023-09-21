
import { displayCities } from './displayCities';
import { map } from './map';
import { formatPopover, popup, element } from './popUpOver.js';

let popover

eleMinSH = document.getElementById('minSunHours')
eleMaxSH = document.getElementById('maxSunHours')
eleMinRD = document.getElementById('minRainDays')
eleMaxRD = document.getElementById('maxRainDays')

eleMinSH.addEventListener("change", function() {getValuesAndDisplay()})
eleMaxSH.addEventListener("change", function() {getValuesAndDisplay()})
eleMinRD.addEventListener("change", function() {getValuesAndDisplay()})
eleMaxRD.addEventListener("change", function() {getValuesAndDisplay()})

let MinSunHours
let MaxSunHours
let MinRainDays
let MaxRainDays

function getValuesAndDisplay() {
  console.log(MinSunHours, MaxSunHours, MinRainDays, MaxRainDays)

  MinSunHours = eleMinSH.value
  MaxSunHours = eleMaxSH.value
  MinRainDays = eleMinRD.value
  MaxRainDays = eleMaxRD.value

  displayCities(MinSunHours, MaxSunHours, MinRainDays, MaxRainDays)

}

getValuesAndDisplay()


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

  // Bootstrap Popover 

  popover = new bootstrap.Popover(element, {
    container: element.parentElement,
    html: true,
    offset: [0, 20],
    placement: 'top',
    title: featureProps.cname,
    content: formatPopover(featureProps),
    sanitize: false
  }); 

  // Show Overlay in Popup Layer

    // coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
  popup.setPosition([ coordinate[0], coordinate[1], ]);
  popover.show();
});





