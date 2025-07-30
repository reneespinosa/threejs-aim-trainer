// Camera setup
import * as THREE from "three";

export default class Camera {
  camera: THREE.PerspectiveCamera;
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
  }
  get instance() {
    return this.camera;
  }
}
