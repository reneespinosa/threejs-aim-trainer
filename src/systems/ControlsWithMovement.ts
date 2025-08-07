// src/systems/Controls.ts
import * as THREE from "three";

export default class Controls {
  private camera: THREE.Camera;
  private domElement: HTMLCanvasElement;
  private pitchObject = new THREE.Object3D(); // Up/down
  private yawObject = new THREE.Object3D(); // Left/right

  private sensitivity = 0.0002;
  private PI_2 = Math.PI / 2;
  private moveSpeed = 1;
  // Add this property to the class
  private velocity = new THREE.Vector3();
  private acceleration = 0.002; // how fast it speeds up
  private damping = 0.9; // how fast it slows down (0.9 = smoother)

  private keysPressed: Record<string, boolean> = {};

 
  constructor(camera: THREE.Camera, domElement: HTMLCanvasElement ) {
    this.camera = camera;
    this.domElement = domElement;
    

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

  // Replace update() with this:
  public update() {
    const targetDirection = new THREE.Vector3();

    // Forward/backward
    if (this.keysPressed["a"]) targetDirection.z -= 1;
    if (this.keysPressed["d"]) targetDirection.z += 1;

    // Left/right
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

    // Apply camera rotation to direction
    targetDirection.applyQuaternion(this.yawObject.quaternion);
    targetDirection.y = 0; // Lock to horizontal plane

    // Accelerate towards the target direction
    this.velocity.lerp(
      targetDirection.multiplyScalar(this.moveSpeed),
      this.acceleration
    );

    // Apply damping
    this.velocity.multiplyScalar(this.damping);

    // Move the yawObject
    this.yawObject.position.add(this.velocity);
  }
}



