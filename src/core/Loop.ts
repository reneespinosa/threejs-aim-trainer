// Animation/render loop
import * as THREE from "three";
import ControlsWithMovement from "../systems/ControlsWithMovement";
import Pistol from "../objects/Pistol";
export default class Loop {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  active: boolean;  
  public deltaTime: number;
  public lastTime: number;
  controls: ControlsWithMovement;
  pistol: Pistol;
  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    controls: ControlsWithMovement,
    pistol: Pistol,
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.pistol = pistol;
    this.active = false;
    
    this.deltaTime = 0;
    this.lastTime = performance.now();
  }
  start() {
    this.active = true;
    this.animate();
  }
  stop() {
    this.active = false;
  }
  animate = () => {
    if (!this.active) return;

    const now = performance.now();
    this.deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.controls.update();
    this.pistol.update(this.deltaTime, this.camera);
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
