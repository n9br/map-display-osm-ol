
import { displayCities } from './displayCities';
import { map } from './map';
import { formatPopover, popup, element } from './popUpOver.js';

let popover

// Get and Feed Features
displayCities()

// citySource.clear()


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





