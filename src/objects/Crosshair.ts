// src/Crosshair.ts
import * as THREE from "three";

export default class Crosshair extends THREE.Object3D {
  constructor(size: number = 0.005, color: number = 0x000000) {
    super();

    const material = new THREE.LineBasicMaterial({ color });

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -size, 0, -0.3,  size, 0, -0.3,   // Horizontal line
       0, -size, -0.3,  0, size, -0.3   // Vertical line
    ]);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const lines = new THREE.LineSegments(geometry, material);
    this.add(lines);
  }
}
