import * as THREE from "three";
import { EffectComposer, FXAAShader, RenderPass, ShaderPass } from "three/examples/jsm/Addons.js";
const minPixelRatio = 1;
const maxPixelRatio = 1.5;
const pixelRatio = Math.min(maxPixelRatio, Math.max(minPixelRatio, window.devicePixelRatio));


export default class Renderer {
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;  
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera , canvas?: HTMLCanvasElement  ) {
    this.camera = camera;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });


    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);
    
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms["resolution"].value.set(
      1 / (window.innerWidth * pixelRatio),
      1 / (window.innerHeight * pixelRatio)
    );
    this.composer.addPass(fxaaPass);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(pixelRatio);

    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
    
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    
      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);
    
      fxaaPass.material.uniforms["resolution"].value.set(
        1 / (width * pixelRatio),
        1 / (height * pixelRatio)
      );
    });
    
  }
  get instance() {
    return this.composer;
  }
}
