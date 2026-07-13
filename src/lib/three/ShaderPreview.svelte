<script lang="ts">
  // 汎用シェーダープレビュー。
  // 教えるライティング式をそのまま fragmentShader に書いて表示する
  // (Three.js 組み込みのライティングは使わない)。
  // - geometry を切り替え可能(sphere / box / cylinder / plane)
  // - ドラッグでモデルを回転
  // - uniforms を props で受け取り、変化時のみ再描画(省電力)
  import * as THREE from 'three';

  interface Props {
    fragmentShader: string;
    uniforms: Record<string, { value: unknown }>;
    geometry?: 'sphere' | 'box' | 'cylinder' | 'plane';
    height?: number;
  }
  let { fragmentShader, uniforms, geometry = 'sphere', height = 340 }: Props = $props();

  let host: HTMLDivElement;

  const vertexShader = /* glsl */ `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;
    void main() {
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `;

  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let mesh: THREE.Mesh;
  let material: THREE.ShaderMaterial;
  let group: THREE.Group;
  let raf = 0;
  let needsRender = true;

  function makeGeometry(kind: string): THREE.BufferGeometry {
    switch (kind) {
      case 'box':
        return new THREE.BoxGeometry(1.4, 1.4, 1.4, 1, 1, 1);
      case 'cylinder':
        return new THREE.CylinderGeometry(0.8, 0.8, 1.6, 64, 1);
      case 'plane': {
        const g = new THREE.PlaneGeometry(2.2, 2.2, 1, 1);
        g.rotateX(-Math.PI / 2); // XZ平面(寝かせた板)
        return g;
      }
      default:
        return new THREE.SphereGeometry(1, 96, 64);
    }
  }

  function invalidate() {
    needsRender = true;
  }

  // uniforms / geometry の変化で再描画
  $effect(() => {
    void uniforms;
    void fragmentShader;
    invalidate();
  });

  $effect(() => {
    // geometry 切り替え
    if (mesh && scene) {
      mesh.geometry.dispose();
      mesh.geometry = makeGeometry(geometry);
      invalidate();
    }
  });

  // ドラッグでモデル回転
  let dragging = false;
  let px = 0;
  let py = 0;
  let rotY = 0.5;
  let rotX = 0.15;

  function onPointerDown(e: PointerEvent) {
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    rotY += (e.clientX - px) * 0.008;
    rotX += (e.clientY - py) * 0.008;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    px = e.clientX;
    py = e.clientY;
    invalidate();
  }
  function onPointerUp() {
    dragging = false;
  }

  function resize() {
    if (!renderer || !host) return;
    const w = host.clientWidth;
    const h = height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    invalidate();
  }

  $effect(() => {
    // 初期化(マウント時に1回)
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.touchAction = 'none';

    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniforms as unknown as { [k: string]: THREE.IUniform },
    });

    group = new THREE.Group();
    mesh = new THREE.Mesh(makeGeometry(geometry), material);
    group.add(mesh);
    scene.add(group);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      group.rotation.y = rotY;
      group.rotation.x = rotX;
      // uniforms の .value はデモ側で毎フレーム書き換わるため、常時レンダリングする。
      // プレビューは1ページに1つの想定で、負荷は許容範囲。
      renderer.render(scene, camera);
      needsRender = false;
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  });
</script>

<div
  class="preview"
  bind:this={host}
  style="height:{height}px"
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointerleave={onPointerUp}
  role="application"
  aria-label="3Dプレビュー。ドラッグで回転できます"
></div>

<style>
  .preview {
    width: 100%;
    background: radial-gradient(circle at 50% 35%, var(--bg-2), var(--bg-0) 75%);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    cursor: grab;
  }
  .preview:active {
    cursor: grabbing;
  }
</style>
