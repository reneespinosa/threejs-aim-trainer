// src/systems/Controls.ts

import * as THREE from "three";

export default class Controls {
  private camera: THREE.Camera;
  private domElement: HTMLCanvasElement;
  private pitchObject = new THREE.Object3D(); // Up/down
  private yawObject = new THREE.Object3D(); // Left/right

  private sensitivity = 0.001;
  private PI_2 = Math.PI / 2;

  constructor(camera: THREE.Camera, domElement: HTMLCanvasElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.pitchObject.add(this.camera);
    this.yawObject.add(this.pitchObject);
  }

  get object() {
    return this.yawObject;
  }

  public initPointerLock() {
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === this.domElement) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        this.yawObject.rotation.y -= movementX * this.sensitivity;
        this.pitchObject.rotation.z -= movementY * this.sensitivity;

        // Clamp vertical look (pitch)
        this.pitchObject.rotation.z = Math.max(
          -this.PI_2,
          Math.min(this.PI_2, this.pitchObject.rotation.z)
        );
      }
    };

    document.addEventListener("mousemove", onMouseMove, false);

    document.addEventListener("click", () => {
      if (document.pointerLockElement !== this.domElement) {
        this.domElement.requestPointerLock();
      }
    });
  }

  update() {
    // nothing to update unless needed
  }
}
