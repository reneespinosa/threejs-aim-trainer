import * as THREE from "three";

/**
 * Creates a custom shader material for a visual effect that supports
 * appearing and absorbing animations, edge highlighting, and RGB distortion.
 *
 * @param color - Base color of the object (default: white).
 * @returns A THREE.ShaderMaterial with custom vertex and fragment shaders.
 */
export function createAbsorbShaderMaterial(
  color: THREE.Color | number = 0xffffff
) {
  // Shader uniforms: external values passed into the shader program
  const uniforms = {
    uTime: { value: 0 },                 // Time value for animations
    uAbsorbing: { value: 0 },            // Trigger for absorption effect
    uAppearing: { value: 0 },            // Trigger for appearing effect
    uColor: { value: new THREE.Color(color) }, // Main object color
    uShowEdges: { value: 0 },            // Toggle for always showing edges
  };

  // Vertex shader: handles position transformations and animation
  const vertexShader = `
    uniform float uTime;
    uniform float uAbsorbing;
    uniform float uAppearing;
    varying vec2 vUv;

    void main() {
      vUv = uv;

      vec3 transformed = position;

      // Absorption: shrink and swirl the geometry inward
      if (uAbsorbing > 0.5) {
        float swirl = sin(uTime * 10.0 + position.y * 5.0) * 0.1;
        transformed.xz *= 1.0 - uTime;  // collapse x and z
        transformed.x += swirl;
        transformed.z += swirl;
      }

      // Appearing: scale the geometry up from the center
      if (uAppearing > 0.5) {
        transformed *= uTime;
      }

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `;

  // Fragment shader: handles color, alpha transparency, glitch and edge effects
  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uAbsorbing;
    uniform float uAppearing;
    uniform vec3 uColor;
    uniform float uShowEdges;

    // Simple pseudo-random function
    float random(vec2 uv) {
      return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      float alpha = 1.0;

      // Fade out when absorbing
      if (uAbsorbing > 0.5) {
        alpha = 1.0 - uTime;
      }

      // Fade in when appearing
      if (uAppearing > 0.5) {
        alpha = uTime;
      }

      // Simulated edge detection using UV bounds
      float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
      float border = smoothstep(0.0, 0.02, edge); // edge thickness

      // RGB distortion: slight offset per color channel
      float shift = 0.005;

      vec2 uvR = vUv + vec2(shift, 0.0);
      vec2 uvG = vUv;
      vec2 uvB = vUv - vec2(shift, 0.0);

      // Glitch effect using noise-based horizontal offset
      float glitchStrength = (uAbsorbing + uAppearing) * 0.03;
      float glitch = step(0.95, fract(sin(uTime * 50.0 + vUv.y * 100.0) * 43758.5453));
      float glitchOffset = glitch * glitchStrength;

      uvR.x += glitchOffset;
      uvG.x -= glitchOffset * 0.5;
      uvB.x += glitchOffset * 0.25;

      // Apply RGB split with color masking and edge blending
      vec3 r = vec3(uColor.r * border, 0.0, 0.0);
      vec3 g = vec3(0.0, uColor.g * border, 0.0);
      vec3 b = vec3(0.0, 0.0, uColor.b * border);

      vec3 finalColor = r + g + b;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // Create and return the ShaderMaterial
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true, // allow fading in/out
  });
}
