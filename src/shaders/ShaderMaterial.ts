import * as THREE from "three";
export function createAbsorbShaderMaterial(
  color: THREE.Color | number = 0xffffff
) {
  const uniforms = {
    uTime: { value: 0 },
    uAbsorbing: { value: 0 },
    uAppearing: { value: 0 },
    uColor: { value: new THREE.Color(color) }, // permite pasar color externo
    uShowEdges: { value: 0 },
  };

  const vertexShader = `
    uniform float uTime;
    uniform float uAbsorbing;
    uniform float uAppearing;
    varying vec2 vUv;

    void main() {
      vUv = uv;

      vec3 transformed = position;

      // Absorption effect: swirl & collapse
      if (uAbsorbing > 0.5) {
        float swirl = sin(uTime * 10.0 + position.y * 5.0) * 0.1;
        transformed.xz *= 1.0 - uTime;
        transformed.x += swirl;
        transformed.z += swirl;
      }

      // Appearing effect: grow from center
      if (uAppearing > 0.5) {
        transformed *= uTime;
      }

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `;
  const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAbsorbing;
  uniform float uAppearing;
  uniform vec3 uColor;
  uniform float uShowEdges;

  // Simple random noise
  float random(vec2 uv) {
    return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    float alpha = 1.0;

    if (uAbsorbing > 0.5) {
      alpha = 1.0 - uTime;
    }

    if (uAppearing > 0.5) {
      alpha = uTime;
    }

    // Simulate border
    float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float border = smoothstep(0.0, 0.02, edge); // edge thickness

    if (uShowEdges > 0.5) {
      border = 1.0;
    }

    // RGB Distortion: shift UV slightly for each channel
    float shift = 0.005;

    vec2 uvR = vUv + vec2(shift, 0.0);
    vec2 uvG = vUv;
    vec2 uvB = vUv - vec2(shift, 0.0);

    // Simulated glitch: horizontal offset with noise
    float glitchStrength = (uAbsorbing + uAppearing) * 0.03;
    float glitch = step(0.95, fract(sin(uTime * 50.0 + vUv.y * 100.0) * 43758.5453));
    float glitchOffset = glitch * glitchStrength;

    uvR.x += glitchOffset;
    uvG.x -= glitchOffset * 0.5;
    uvB.x += glitchOffset * 0.25;

    vec3 r = vec3(uColor.r * border, 0.0, 0.0);
    vec3 g = vec3(0.0, uColor.g * border, 0.0);
    vec3 b = vec3(0.0, 0.0, uColor.b * border);

    vec3 finalColor = r + g + b;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;


  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  });
}
