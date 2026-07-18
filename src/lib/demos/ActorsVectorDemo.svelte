<script lang="ts">
  // 第4章「ライティングの登場人物」デモ。
  // 球の表面の1点で、法線N・ライトL・視線V・ハーフH・反射R の矢印を可視化する。
  // ライトの向きと表面点を動かすと、H(=L+Vの中間)とR(=Lの反射)が追従する。
  import * as THREE from 'three';
  import Slider from '../components/Slider.svelte';
  import { lightDirFromAngles } from '../three/pbr';

  let azimuth = $state(-40);
  let elevation = $state(40);
  let surfLat = $state(18); // 表面点の緯度(度)
  let showN = $state(true);
  let showL = $state(true);
  let showV = $state(true);
  let showH = $state(true);
  let showR = $state(true);

  let host: HTMLDivElement;
  const HEIGHT = 360;

  const COL = {
    N: 0x6fb3ff,
    L: 0xffcc66,
    V: 0x7ee0b0,
    H: 0xc59bff,
    R: 0xff9a5a,
  };

  // 表面点の向き(法線)。経度は固定、緯度をスライダーで。
  function surfNormal(): THREE.Vector3 {
    const lon = (18 * Math.PI) / 180;
    const lat = (surfLat * Math.PI) / 180;
    return new THREE.Vector3(
      Math.sin(lon) * Math.cos(lat),
      Math.sin(lat),
      Math.cos(lon) * Math.cos(lat)
    ).normalize();
  }

  $effect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.touchAction = 'none';

    // 半透明の球(表面のイメージ)
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0x1c2333, transparent: true, opacity: 0.55 })
    );
    scene.add(sphere);
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0x3c485f, wireframe: true, transparent: true, opacity: 0.25 })
    );
    scene.add(wire);

    // 接平面(法線に垂直な面)を薄く表示
    const plane = new THREE.Mesh(
      new THREE.CircleGeometry(0.6, 32),
      new THREE.MeshBasicMaterial({ color: 0x6fb3ff, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    scene.add(plane);

    const pointDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    scene.add(pointDot);

    const LEN = 0.95;
    const mkArrow = (color: number) => {
      const a = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), LEN, color, 0.22, 0.13);
      scene.add(a);
      return a;
    };
    const aN = mkArrow(COL.N);
    const aL = mkArrow(COL.L);
    const aV = mkArrow(COL.V);
    const aH = mkArrow(COL.H);
    const aR = mkArrow(COL.R);

    // カメラのオービット(ドラッグで回転)
    let theta = 0.5;
    let phi = 1.15;
    const radius = 4.4;
    let dragging = false;
    let px = 0;
    let py = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      theta -= (e.clientX - px) * 0.008;
      phi -= (e.clientY - py) * 0.008;
      phi = Math.max(0.25, Math.min(Math.PI - 0.25, phi));
      px = e.clientX;
      py = e.clientY;
    };
    const onUp = () => (dragging = false);
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('pointerleave', onUp);

    function resize() {
      const w = host.clientWidth;
      renderer.setSize(w, HEIGHT, false);
      camera.aspect = w / HEIGHT;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);

      camera.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 0, 0);

      const N = surfNormal();
      const P = N.clone(); // 半径1の球上の点
      const V = camera.position.clone().sub(P).normalize();
      const L = lightDirFromAngles(azimuth, elevation);
      const H = L.clone().add(V).normalize();
      // R = 2(N·L)N - L(ライトの反射方向)
      const R = N.clone().multiplyScalar(2 * N.dot(L)).sub(L).normalize();

      pointDot.position.copy(P);
      plane.position.copy(P);
      plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), N);

      const place = (arrow: THREE.ArrowHelper, dir: THREE.Vector3, show: boolean) => {
        arrow.visible = show;
        arrow.position.copy(P);
        arrow.setDirection(dir);
        arrow.setLength(LEN, 0.22, 0.13);
      };
      place(aN, N, showN);
      place(aL, L, showL);
      place(aV, V, showV);
      place(aH, H, showH);
      place(aR, R, showR);

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('pointerleave', onUp);
      renderer.dispose();
      renderer.domElement.remove();
      sphere.geometry.dispose();
      wire.geometry.dispose();
      plane.geometry.dispose();
      pointDot.geometry.dispose();
    };
  });
</script>

<div class="demo">
  <div
    class="view"
    bind:this={host}
    style="height:{HEIGHT}px"
    role="application"
    aria-label="法線・ライト・視線などのベクトルを表示する3Dデモ。ドラッグで視点を回せます"
  ></div>

  <div class="controls">
    <div class="legend">
      <label class="chip" style="--c:#6fb3ff"><input type="checkbox" bind:checked={showN} /><b>N</b> 法線(面の向き)</label>
      <label class="chip" style="--c:#ffcc66"><input type="checkbox" bind:checked={showL} /><b>L</b> ライト方向</label>
      <label class="chip" style="--c:#7ee0b0"><input type="checkbox" bind:checked={showV} /><b>V</b> 視線方向</label>
      <label class="chip" style="--c:#c59bff"><input type="checkbox" bind:checked={showH} /><b>H</b> ハーフ(L と V の中間)</label>
      <label class="chip" style="--c:#ff9a5a"><input type="checkbox" bind:checked={showR} /><b>R</b> 反射(L の跳ね返り)</label>
    </div>

    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={-40} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-20} max={90} step={1} reset={40} unit="°" accent="var(--accent)" />
    <Slider label="表面の点の位置" bind:value={surfLat} min={-60} max={80} step={1} reset={18} unit="°" accent="var(--accent-2)" />

    <p class="note">
      白い点が「いま見ている面の1点」。そこから生える矢印が登場人物です。ライトを動かすと、
      <b style="color:#c59bff">H</b> と <b style="color:#ff9a5a">R</b> がついてくるのがわかります。
      画面をドラッグすると視点を回せます。
    </p>
  </div>
</div>

<style>
  .demo {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 1rem;
    align-items: start;
  }
  @media (max-width: 720px) {
    .demo {
      grid-template-columns: 1fr;
    }
  }
  .view {
    width: 100%;
    background: radial-gradient(circle at 50% 40%, var(--bg-2), var(--bg-0) 78%);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    cursor: grab;
  }
  .view:active {
    cursor: grabbing;
  }
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .legend {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.4rem;
  }
  .chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-1);
    cursor: pointer;
  }
  .chip b {
    color: var(--c);
    font-family: var(--font-mono);
    min-width: 1.2em;
  }
  .note {
    font-size: 0.83rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.4rem 0 0;
  }
</style>
