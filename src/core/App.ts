import Renderer from "./Renderer";
import Camera from "./Camera";
import MainScene from "../scenes/MainScene";
import Loop from "./Loop";
import Controls from "../systems/Controls";
import StartScreen from "../ui/StartScreen";
const canvas = document.querySelector("canvas") as HTMLCanvasElement;

export default class App {
  renderer: Renderer;
  camera: Camera;
  scene: MainScene;
  loop: Loop;
  controls: Controls;
  constructor() {
    this.renderer = new Renderer(canvas);
    this.camera = new Camera();
    this.scene = new MainScene();
    this.loop = new Loop(
      this.renderer.instance,
      this.scene,
      this.camera.instance
    );
    this.controls = new Controls(this.camera.instance, canvas);
    this.scene.add(this.controls.object);
    this.camera.instance.position.set(0, 0, 0);
    this.camera.instance.rotation.set(0, (Math.PI / 2) * 3, 0);
    // Handle resize
    window.addEventListener("resize", () => {
      this.camera.instance.aspect = window.innerWidth / window.innerHeight;
      this.camera.instance.updateProjectionMatrix();
      this.renderer.instance.setSize(window.innerWidth, window.innerHeight);
    });
  }
  start() {
    /* Build the start overlay and wait until user presses Start */

    new StartScreen(canvas, () => {
      this.loop.start();
      this.controls.initPointerLock();
    });
  }
  level1() {}
}
