// Main scene setup
import * as THREE from "three";
import GLTFLoader from "../loaders/GLTFLoader";
import environmentMap from "../objects/MainScene/CubeTextureNature";
import Cube from "../objects/Cube";
export default class MainScene extends THREE.Scene {
  constructor() {
    super();
    // Add objects/lights here

    const gltfLoader = new GLTFLoader();
    gltfLoader.load("models/room.glb", (gltf) => {
      this.add(gltf.scene);
      gltf.scene.position.set(3, -0.5, 0);
      //gltf.scene.rotation.set(0, Math.PI / 2, 0);
    });
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.add(light);

    this.add(new Cube());
    this.background = environmentMap;
  }

  public level1() {}
}
