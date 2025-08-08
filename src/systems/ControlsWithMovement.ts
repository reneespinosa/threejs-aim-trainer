// src/systems/Controls.ts
import * as THREE from "three";

export default class Controls {
  private camera: THREE.Camera;
  private domElement: HTMLCanvasElement;
  private pitchObject = new THREE.Object3D();
  private yawObject = new THREE.Object3D();

  private sensitivity = 0.0002;
  private PI_2 = Math.PI / 2;
  private moveSpeed = 1;
  private velocity = new THREE.Vector3();
  private acceleration = 0.002;
  private damping = 0.9;

  private keysPressed: Record<string, boolean> = {};

  constructor(camera: THREE.Camera, domElement: HTMLCanvasElement) {
    this.camera = camera;
    this.domElement = domElement;
    const sensitivitySlider = document.getElementById(
      "sensitivityRange"
    ) as HTMLInputElement;

    sensitivitySlider.addEventListener("input", () => {
      const value = parseFloat(sensitivitySlider.value);
      this.sensitivity = value * 0.0002;
    });

    this.pitchObject.add(this.camera);
    this.yawObject.add(this.pitchObject);

    this.initPointerLock();
    this.initKeyboardListeners();
  }

  get object() {
    return this.yawObject;
  }

  private initKeyboardListeners() {
    document.addEventListener("keydown", (e) => {
      this.keysPressed[e.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", (e) => {
      this.keysPressed[e.key.toLowerCase()] = false;
    });
  }

  public initPointerLock() {
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === this.domElement) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        this.yawObject.rotation.y -= movementX * this.sensitivity;
        this.pitchObject.rotation.z -= movementY * this.sensitivity;

        this.pitchObject.rotation.z = Math.max(
          -this.PI_2,
          Math.min(this.PI_2, this.pitchObject.rotation.z)
        );
      }
    };

    document.addEventListener("mousemove", onMouseMove, false);
  }

  public update(deltaTime: number) {
    const targetDirection = new THREE.Vector3();

    if (this.keysPressed["a"]) targetDirection.z -= 1;
    if (this.keysPressed["d"]) targetDirection.z += 1;
    if (this.keysPressed["s"]) targetDirection.x -= 1;
    if (this.keysPressed["w"]) targetDirection.x += 1;
    this.yawObject.position.x = THREE.MathUtils.clamp(
      this.yawObject.position.x,
      -6.2,
      8.2
    );

    this.yawObject.position.z = THREE.MathUtils.clamp(
      this.yawObject.position.z,
      -7.3,
      7.3
    );

    targetDirection.normalize();
    targetDirection.applyQuaternion(this.yawObject.quaternion);
    targetDirection.y = 0;
    this.velocity.lerp(
      targetDirection.multiplyScalar(this.moveSpeed),
      this.acceleration
    );

    this.velocity.multiplyScalar(Math.pow(this.damping, deltaTime));

    this.yawObject.position.addScaledVector(this.velocity, deltaTime);
  }
}
