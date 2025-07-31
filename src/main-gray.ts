import * as rive from "@rive-app/canvas";
import './style.css';


// Prepare outside references to the Rive ViewModel instances
const riveRefs = {
  tileInstances: {
    station: null as rive.ViewModelInstance | null,
    wasteManagementPlant: null as rive.ViewModelInstance | null,
    workshop: null as rive.ViewModelInstance | null, 
  }
};

const r = new rive.Rive({
  src: "/tbf-poc.riv",
  canvas: document.querySelector<HTMLCanvasElement>('#canvas')!,
  autoplay: true,
  autoBind: true,
  onLoad: () => {
    r.resizeDrawingSurfaceToCanvas();
    r.enableFPSCounter();

    const vmi = r.viewModelInstance;
    if (vmi) {
      const properties = vmi.properties;
      console.log(properties);
      console.log('x', vmi.viewModel('tileStation'));
      

      // add References to the tile instances
      riveRefs.tileInstances.station = vmi.viewModel('tileStation');
      riveRefs.tileInstances.wasteManagementPlant = vmi.viewModel('tileWasteManagementPlant');
      riveRefs.tileInstances.workshop = vmi.viewModel('tileWorkshop');
      
      // add Listeners
    }
  },
});

const toggleTileDiscoveredState = (tile: rive.ViewModelInstance | null, tileName: string) => {
  console.log('riveRefs', riveRefs);
  
  if (tile) {
    const discovered = tile.boolean('discovered');
    discovered.value = !discovered.value;
    console.log(`${tileName} discovered set to`, discovered.value);
  } else {
    console.warn(`${tileName} instance not yet available`);
  }
};

document.querySelector<HTMLButtonElement>('#toggle-station')!.addEventListener('click', () => {
  toggleTileDiscoveredState(riveRefs.tileInstances.station, 'Station');
});
document.querySelector<HTMLButtonElement>('#toggle-waste-management-plant')!.addEventListener('click', () => {
  toggleTileDiscoveredState(riveRefs.tileInstances.wasteManagementPlant, 'Waste Management Plant');
});
document.querySelector<HTMLButtonElement>('#toggle-workshop')!.addEventListener('click', () => {
  toggleTileDiscoveredState(riveRefs.tileInstances.workshop, 'Workshop');
});
