// Reusable Cube object
import * as THREE from "three";

export default class Cube extends THREE.Mesh {
  constructor(position?: THREE.Vector3) {
    const geometry = new THREE.BoxGeometry(
      position?.x || 1,
      position?.y || 1,
      position?.z || 1
    );
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    super(geometry, material);
  }
}
