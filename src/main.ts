import * as rive from "@rive-app/canvas";
import './style.css';


const img2 = (imageProperty) => {
  fetch("/test-image-2.png").then(async (res) => {
    // Decode the image from the response. This object is used to set the image property.
    const image = await rive.decodeImage(
      new Uint8Array(await res.arrayBuffer())
    );
    imageProperty.value = image;
    // Rive will automatically clean this up. But it's good practice to dispose this manually
    // after you have already set the decoded image. Don't call `unref` if you intend
    // to use the decoded asset again.
    image.unref();
  });
};

const img1 = (imageProperty) => {
  fetch("/test-image.png").then(async (res) => {
    // Decode the image from the response. This object is used to set the image property.
    const image = await rive.decodeImage(
      new Uint8Array(await res.arrayBuffer())
    );
    imageProperty.value = image;
    // Rive will automatically clean this up. But it's good practice to dispose this manually
    // after you have already set the decoded image. Don't call `unref` if you intend
    // to use the decoded asset again.
    image.unref();
  });
};




// Prepare outside references to the Rive ViewModel instances
const riveRefs = {
  tileInstances: {
    wasteManagementPlant: null as rive.ViewModelInstance | null,
  }
};

const r = new rive.Rive({
  src: "/poc_tile_animation.riv",
  canvas: document.querySelector<HTMLCanvasElement>('#canvas')!,
  autoplay: true,
  autoBind: true,
  stateMachines: ['SM_Main'], // Ensure the state machine is loaded even if using data binding only -> triggers!
  onLoad: () => {
    r.resizeDrawingSurfaceToCanvas();
    r.enableFPSCounter();
    console.log('State Machine Inputs:', r.stateMachineInputs('SM_Main'));

    const vmi = r.viewModelInstance;
    if (vmi) {
      const mainProperties = vmi.properties;
      console.log('Main Properties:', mainProperties);
      console.log('View Model - tileWasteManagement properties:', vmi.viewModel('tileWasteManagement')?.properties);
      console.log('Nested View Model - indicatorArrowSaegi properties:', vmi.viewModel('tileWasteManagement')?.viewModel('indicatorArrowSaegi')?.properties);


      // add References to the tile instances
      riveRefs.tileInstances.wasteManagementPlant = vmi.viewModel('tileWasteManagement');

      // load image
      img2(vmi.viewModel('tileWasteManagement')?.image('personSlot'));

      // add Observers
      vmi.viewModel('tileWasteManagement')?.trigger('moveTruck')?.on((event) => {
        console.log('triggered?', event);
      });
      vmi.viewModel('tileWasteManagement')?.boolean('discovered')?.on((event) => {
        console.log('changed?', event);
      });
      vmi.viewModel('tileWasteManagement')?.viewModel('indicatorArrowSaegi')?.trigger('clicked')?.on(() => {
        console.log('sägi clicked');
        alert('Event from nested ViewModel: indicatorArrowSaegi clicked');
      });
    }
  },
});

const toggleTileDiscoveredState = (tile: rive.ViewModelInstance | null) => {
  console.log('riveRefs', riveRefs);

  if (tile) {
    const discovered = tile.boolean('discovered');
    discovered.value = !discovered.value;
    console.log(`${tile} discovered set to`, discovered.value);
  } else {
    console.warn(`${tile} instance not yet available`);
  }
};


document.querySelector<HTMLButtonElement>('#toggle-waste-management-plant')!.addEventListener('click', () => {
  toggleTileDiscoveredState(riveRefs.tileInstances.wasteManagementPlant);
});


document.querySelector<HTMLButtonElement>('#trigger-truck')!.addEventListener('click', () => {
  console.log('Triggering truck animation');
  riveRefs.tileInstances.wasteManagementPlant?.trigger('moveTruck')?.trigger();
  console.log(riveRefs.tileInstances.wasteManagementPlant?.trigger('moveTruck'));
});



document.querySelector<HTMLButtonElement>('#toggle-image')!.addEventListener('click', () => {
  img1(riveRefs.tileInstances.wasteManagementPlant?.image('personSlot'));
  console.log(riveRefs.tileInstances.wasteManagementPlant?.image('personSlot')?.value);
});

