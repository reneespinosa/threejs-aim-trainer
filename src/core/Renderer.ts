// Renderer setup
import * as THREE from "three";

export default class Renderer {
  renderer: THREE.WebGLRenderer;
  constructor(canvas?: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  get instance() {
    return this.renderer;
  }
}
