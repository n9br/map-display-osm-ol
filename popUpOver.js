import { Overlay } from "ol/index.js";
import { countryURL, sunURL, rainURL } from './picURLs';
import { map } from './map';


// Format Popover
export function formatPopover(city) {

  return `
  <div>
      <div class="d-flex flex-row align-items-start"> 
        <div class="p-1"> <img src=${countryURL}/> </div>
        <div class="p-1"> ${city.country} </div>
      </div>
      <div class="d-flex flex-row align-items-start"> 
        <div class="p-1"> <img src=${sunURL}> </div>
        <div class="p-1"> ${city.sun_hours} h/d </div>
      </div>
      <div class="d-flex flex-row align-items-start"> 
        <div class="p-1"> <img src=${rainURL}> </div>
        <div class="p-1"> ${city.rainy_days} d/m </div>
      </div>
  </div>  
  `;
}

// ####### POPUP OVerlay #######

export const element = document.getElementById('popup');
export const popup = new Overlay({
  element: element,
  stopEvent: false,
});

map.addOverlay(popup);

