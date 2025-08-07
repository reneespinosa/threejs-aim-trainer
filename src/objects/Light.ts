// Reusable Light object
import * as THREE from "three";

export default class Light extends THREE.AmbientLight {
  constructor() {
    super(0xffffff, 3);
    this.position.set(5, 10, 7.5);
  }
}
