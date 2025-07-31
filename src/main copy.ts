import * as rive from "@rive-app/canvas";
import './style.css';

let kvaInstance: rive.ViewModel | null = null;

const r = new rive.Rive({
  src: "/tbf-poc.riv",
  canvas: document.querySelector<HTMLCanvasElement>('#canvas')!,
  autoplay: true,
  autoBind: true,
  onLoad: () => {
    r.resizeDrawingSurfaceToCanvas();
    r.enableFPSCounter();

    const allTilesInstance = r.viewModelInstance;
    kvaInstance = allTilesInstance.viewModel('Kva');

    console.log('kvaInstance props', kvaInstance?.properties);
    kvaInstance.boolean('found').value = true;
  },
});

// Example: toggle with a button
document.getElementById('toggle-kva')?.addEventListener('click', () => {
  if (kvaInstance) {
    const found = kvaInstance.boolean('found');
    found.value = !found.value;
    console.log('kva found set to', found.value);
  } else {
    console.warn('kvaInstance not yet available');
  }
});
