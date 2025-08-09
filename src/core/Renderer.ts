import * as THREE from "three";
import { EffectComposer, FXAAShader, RenderPass, ShaderPass } from "three/examples/jsm/Addons.js";
import CustomOutlinePass from "./CustomPass/CustomOutlinePass";

const minPixelRatio = 1;
const maxPixelRatio = 1.5;
const pixelRatio = Math.min(maxPixelRatio, Math.max(minPixelRatio, window.devicePixelRatio));

export default class Renderer {
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  private fxaaPass: ShaderPass;
  private outlinePass: CustomOutlinePass;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, canvas?: HTMLCanvasElement) {
    this.camera = camera;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(pixelRatio);

    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(window.innerWidth, window.innerHeight);

    // 1) Base render
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // 2) Outline (after scene render, before AA)
    this.outlinePass = new CustomOutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera,
      {
        edgeStrength: 1.0,
        edgeThreshold: 0.0025,
        thickness: 1.0,
        normalThreshold: 0.15,
        normalStrength: 1.0,
        outlineColor: 0x000000,
      }
    );
    this.composer.addPass(this.outlinePass);

    // 3) FXAA at the end
    this.fxaaPass = new ShaderPass(FXAAShader);
    this.fxaaPass.material.uniforms["resolution"].value.set(
      1 / (window.innerWidth * pixelRatio),
      1 / (window.innerHeight * pixelRatio)
    );
    this.composer.addPass(this.fxaaPass);

    // Handle resize
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);

      // update passes
      this.fxaaPass.material.uniforms["resolution"].value.set(
        1 / (width * pixelRatio),
        1 / (height * pixelRatio)
      );
      this.outlinePass.setSize(width, height);
    });
  }

  get instance() {
    // Return composer so your Loop uses composer.render()
    return this.composer;
  }
}
