import {
  Group,
  Mesh,
  MeshBasicMaterial,
  BackSide,
  Vector3,
  Camera,
} from "three";
import GLTFLoader from "../loaders/GLTFLoader";

export default class Pistol extends Group {
  camera: Camera;
  prevRotationY: number;
  constructor(camera: Camera, callback?: (pistol: Pistol) => void) {
    super();
    this.camera = camera;
    this.prevRotationY = 0;
    const loader = new GLTFLoader();
    loader.load("/models/pistol.glb", (gltf) => {
      const model = gltf.scene;

      this.position.set(0.4, -0.3, -0.9);
      this.rotation.set(0, Math.PI / 2, 0);
      this.scale.set(0.1, 0.1, 0.1);


      // Styling the pistol
      model.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;

          if (mesh.userData.isOutline) return;
          mesh.material = new MeshBasicMaterial({ color: "white" });
          const outlineMaterial = new MeshBasicMaterial({
            color: "black",
            side: BackSide,
          });

          const outlineMesh = new Mesh(mesh.geometry.clone(), outlineMaterial);
          outlineMesh.scale.copy(mesh.scale).multiplyScalar(1.02); 
          outlineMesh.position.copy(mesh.position.add(new Vector3(0.01, -0.02, 0)));
          outlineMesh.rotation.copy(mesh.rotation);

          outlineMesh.userData.isOutline = true;

          this.add(outlineMesh); // ✅ no lo metas dentro del mesh original
        }
      });

      this.add(model);
      if (callback) callback(this);
    });
  }
  public update(delta: number, camera: Camera) {
    const pistol = this;
    const targetRotationY = camera.rotation.y;
  
    const rotationDiff = targetRotationY - this.prevRotationY;
    const offsetX = rotationDiff * 5;
    const smoothing = 10;
  
    
    if (this.prevRotationY === null || this.prevRotationY === undefined) {
      pistol.position.x = offsetX;
    } else {
      pistol.position.x += (offsetX - pistol.position.x) * smoothing * delta;
    }
  
    this.prevRotationY = targetRotationY;
  }
  
}
