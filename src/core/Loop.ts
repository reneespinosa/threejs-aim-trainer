// Animation/render loop
import * as THREE from "three";

export default class Loop {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  active: boolean;
  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.active = false;
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

    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
