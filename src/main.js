import * as THREE from "three";
import { projects as P } from "./projects.js";

const V = document.getElementById("view");
const zoom = document.getElementById("zoom");
const zi = document.getElementById("zi");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function openZoom() {
  const dm = document.getElementById("dm");
  if (!dm.src) return;
  zi.src = dm.currentSrc || dm.src;
  zi.alt = dm.alt;
  zoom.hidden = false;
  document.getElementById("zc").focus();
}

function closeZoom() {
  if (zoom.hidden) return;
  zoom.hidden = true;
  zi.removeAttribute("src");
  document.getElementById("db").focus();
}

function fill(p) {
  V.style.setProperty("--c", p.c);
  document.getElementById("t").textContent = p.n;
  document.getElementById("aw").textContent = p.a;
  document.getElementById("tc").textContent = p.t;
  const df = document.getElementById("df");
  const dm = document.getElementById("dm");
  if (p.img) {
    dm.src = p.img;
    dm.alt = `${p.n} demo screenshot`;
    df.classList.toggle("fit", !!p.imgFit);
    df.hidden = false;
  } else {
    dm.removeAttribute("src");
    dm.alt = "";
    df.classList.remove("fit");
    df.hidden = true;
  }
  document.getElementById("sum").textContent = p.d;
  const lk = document.getElementById("lk");
  lk.textContent = "";
  p.l.forEach((x, i) => {
    const a = document.createElement("a");
    a.href = x[1];
    a.textContent = x[0];
    a.target = "_blank";
    a.rel = "noopener";
    if (i) a.style.marginLeft = "16px";
    lk.appendChild(a);
  });
}

document.getElementById("db").addEventListener("click", openZoom);
document.getElementById("zc").addEventListener("click", (e) => {
  e.stopPropagation();
  closeZoom();
});
zoom.addEventListener("click", closeZoom);
zi.addEventListener("click", (e) => e.stopPropagation());

try {
  const T = THREE;
  const cv = document.getElementById("gl");
  const isMobile = matchMedia("(max-width: 720px), (pointer: coarse)").matches;
  const R = new T.WebGLRenderer({ canvas: cv, antialias: !isMobile, alpha: true, powerPreference: isMobile ? "low-power" : "default" });
  R.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.25 : 2));
  R.shadowMap.enabled = true;
  R.shadowMap.type = isMobile ? T.BasicShadowMap : T.PCFSoftShadowMap;
  R.toneMapping = T.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.15;

  const sc = new T.Scene();
  sc.fog = new T.FogExp2(0xe6b075, 0.04);
  const cam = new T.PerspectiveCamera(55, 1, 0.1, 120);
  const cam0 = new T.PerspectiveCamera();
  sc.add(new T.HemisphereLight(0xffe2b8, 0x3a2218, 0.7));

  const sun = new T.DirectionalLight(0xffc880, 1.5);
  sun.position.set(9, 9, -26);
  sun.target.position.set(0, 0, -8);
  sc.add(sun, sun.target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
  const sc2 = sun.shadow.camera;
  sc2.left = -32;
  sc2.right = 32;
  sc2.top = 32;
  sc2.bottom = -32;
  sc2.near = 1;
  sc2.far = 90;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;

  let seed = 5;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const pal = [0xb5532a, 0xc9822f, 0xb8962f, 0x8f3a2e, 0x9c6a2f, 0xa8532a, 0x7a6a2c, 0xd19a45, 0x6e3a24];
  const gc = document.createElement("canvas");
  gc.width = gc.height = 256;
  const g2 = gc.getContext("2d");
  g2.fillStyle = "#4a2218";
  g2.fillRect(0, 0, 256, 256);
  for (let q = 0; q < 300; q++) {
    g2.fillStyle = `hsla(${8 + rnd() * 34},42%,${18 + rnd() * 18}%,${0.25 + rnd() * 0.35})`;
    g2.beginPath();
    g2.ellipse(rnd() * 256, rnd() * 256, 3 + rnd() * 9, 2 + rnd() * 5, rnd() * 3.14, 0, 6.28);
    g2.fill();
  }
  const gt = new T.CanvasTexture(gc);
  gt.wrapS = gt.wrapT = T.RepeatWrapping;
  gt.repeat.set(16, 16);

  function gh(x, z) {
    return 0.06 * Math.sin(x * 0.7) * Math.cos(z * 0.6) + 0.04 * Math.sin(x * 1.9 + z * 1.3);
  }

  const gSeg = isMobile ? 72 : 160;
  const gg = new T.PlaneGeometry(120, 120, gSeg, gSeg);
  gg.rotateX(-Math.PI / 2);
  const gp = gg.attributes.position;
  for (let q3 = 0; q3 < gp.count; q3++) gp.setY(q3, gh(gp.getX(q3), gp.getZ(q3)));
  gg.computeVertexNormals();
  const g = new T.Mesh(gg, new T.MeshLambertMaterial({ map: gt }));
  g.receiveShadow = true;
  sc.add(g);

  const sh = new T.Shape();
  sh.moveTo(0, 1);
  sh.bezierCurveTo(0.9, 0.5, 0.9, -0.5, 0, -1);
  sh.bezierCurveTo(-0.9, -0.5, -0.9, 0.5, 0, 1);
  const lg = new T.ShapeGeometry(sh, 6);
  const cg = new T.ShapeGeometry(sh, 2);
  const pg = new T.ShapeGeometry(sh, 16);
  (function () {
    const p = pg.attributes.position;
    for (let u = 0; u < p.count; u++) {
      const x = p.getX(u);
      const y = p.getY(u);
      p.setZ(u, 0.25 * x * x + 0.03 * Math.sin(y * 6));
    }
    pg.computeVertexNormals();
  })();

  const mp = [];
  for (let a = 0; a < 64; a++) {
    const an = (a / 64) * 6.2832;
    const rr = 0.5 + 0.5 * Math.pow(Math.abs(Math.cos(2.5 * an)), 1.5);
    mp.push(new T.Vector2(rr * Math.sin(an), rr * Math.cos(an)));
  }
  const mg = new T.ShapeGeometry(new T.Shape(mp));

  const cvv = document.createElement("canvas");
  cvv.width = cvv.height = 128;
  const x2 = cvv.getContext("2d");
  x2.fillStyle = "#fff";
  x2.fillRect(0, 0, 128, 128);
  x2.strokeStyle = "rgba(60,20,10,.5)";
  x2.lineWidth = 2;
  x2.beginPath();
  x2.moveTo(64, 6);
  x2.lineTo(64, 122);
  [30, 52, 74, 96].forEach((y) => {
    x2.moveTo(64, y + 16);
    x2.lineTo(30, y);
    x2.moveTo(64, y + 16);
    x2.lineTo(98, y);
  });
  x2.stroke();
  const vt = new T.CanvasTexture(cvv);
  vt.repeat.set(0.5, 0.5);
  vt.offset.set(0.5, 0.5);

  const lm = new T.MeshLambertMaterial({ side: T.DoubleSide, map: vt });
  const litterMat = new T.MeshLambertMaterial({
    side: T.DoubleSide,
    map: vt,
    transparent: true,
    opacity: 0.82,
  });
  const litterPal = [0xc45a2e, 0xd4882f, 0xc9a03a, 0xb03a2e, 0xe09a45, 0xa8532a, 0xd46a2a, 0xb8962f, 0x8f3a2e];
  const d = new T.Object3D();
  const clears = P.map((p) => {
    const r = 2.2 + p.s * 1.1;
    return { x: p.pos[0], z: p.pos[1], r2: r * r };
  });

  function litter(geo, n) {
    const m = new T.InstancedMesh(geo, litterMat, n);
    let placed = 0;
    for (let tries = 0; placed < n && tries < n * 5; tries++) {
      const band = rnd();
      let x;
      let z;
      if (band < 0.12) {
        x = (rnd() - 0.5) * 16;
        z = 3 - rnd() * 8;
      } else if (band < 0.5) {
        x = (rnd() - 0.5) * 38;
        z = -3 - rnd() * 20;
      } else {
        x = (rnd() - 0.5) * 56;
        z = -14 - rnd() * 36;
      }
      if (clears.some((c) => (x - c.x) * (x - c.x) + (z - c.z) * (z - c.z) < c.r2)) continue;
      const near = z > -1;
      d.position.set(x, gh(x, z) + 0.01 + rnd() * 0.03, z);
      d.rotation.set(-Math.PI / 2 + (rnd() - 0.5) * 0.25, 0, rnd() * 6.28);
      d.scale.setScalar(near ? 0.12 + rnd() * 0.12 : 0.16 + rnd() * 0.22);
      d.updateMatrix();
      m.setMatrixAt(placed, d.matrix);
      m.setColorAt(
        placed,
        new T.Color(litterPal[Math.floor(rnd() * litterPal.length)]).multiplyScalar(0.7 + rnd() * 0.55)
      );
      placed++;
    }
    m.count = placed;
    m.receiveShadow = true;
    sc.add(m);
  }
  litter(lg, isMobile ? 500 : 1100);
  litter(mg, isMobile ? 350 : 800);

  const bc = document.createElement("canvas");
  bc.width = 64;
  bc.height = 256;
  const b2 = bc.getContext("2d");
  b2.fillStyle = "#4a3a30";
  b2.fillRect(0, 0, 64, 256);
  for (let q2 = 0; q2 < 260; q2++) {
    b2.fillStyle = `rgba(${q2 % 2 ? "20,12,8" : "110,90,70"},${0.15 + rnd() * 0.3})`;
    b2.fillRect(rnd() * 64, rnd() * 256, 1 + rnd() * 3, 10 + rnd() * 60);
  }
  const bt = new T.CanvasTexture(bc);
  bt.wrapS = bt.wrapT = T.RepeatWrapping;
  bt.repeat.set(2, 3);
  const bm = new T.MeshLambertMaterial({ map: bt });
  const NT = isMobile ? 36 : 70;
  const canopyN = isMobile ? 90 : 210;
  const can = new T.InstancedMesh(cg, lm, NT * canopyN);
  let ci = 0;

  function treePositions(count) {
    const out = [];
    if (isMobile) {
      const cols = 6;
      const rows = 8;
      for (let row = 0; row < rows && out.length < count; row++) {
        for (let col = 0; col < cols && out.length < count; col++) {
          const x = -20 + (col + 0.5) * (40 / cols) + (rnd() - 0.5) * 1.8;
          const z = -4.5 - (row + 0.5) * (40 / rows) + (rnd() - 0.5) * 1.8;
          // keep a clear lane for the zigzag project leaves
          if (Math.abs(x) < 4.2 && z > -20) continue;
          out.push([x, z]);
        }
      }
      while (out.length < count) {
        const side = rnd() < 0.5 ? -1 : 1;
        out.push([side * (7 + rnd() * 14), -6 - rnd() * 34]);
      }
    } else {
      for (let i = 0; i < count; i++) {
        let x = (rnd() - 0.5) * 50;
        const z = -3 - rnd() * 45;
        if (Math.abs(x) < 1.5 && z > -12) x += x < 0 ? -3 : 3;
        out.push([x, z]);
      }
    }
    return out;
  }

  const treePos = treePositions(NT);
  for (let n = 0; n < NT; n++) {
    const x = treePos[n][0];
    const z = treePos[n][1];
    const h = 5 + rnd() * 4;
    const rb = 0.35 + rnd() * 0.2;
    const y0 = gh(x, z);
    const tr = new T.Mesh(new T.CylinderGeometry(rb * 0.55, rb, h, isMobile ? 6 : 10), bm);
    tr.position.set(x, y0 + h / 2, z);
    tr.castShadow = !isMobile;
    tr.receiveShadow = true;
    sc.add(tr);
    const branchN = isMobile ? 1 : 3;
    for (let k = 0; k < branchN; k++) {
      const br = new T.Mesh(new T.CylinderGeometry(0.05, 0.1, 2.4, 6), bm);
      const ang = rnd() * 6.28;
      br.position.set(x + Math.cos(ang) * 0.9, y0 + h * (0.65 + rnd() * 0.25), z + Math.sin(ang) * 0.9);
      br.rotation.set(Math.sin(ang) * 0.7, 0, -Math.cos(ang) * 0.7);
      br.castShadow = !isMobile;
      sc.add(br);
    }
    const R0 = 2.2 + rnd() * 1.6;
    const cy = y0 + h + 0.5;
    const tone = rnd();
    for (let j = 0; j < canopyN; j++, ci++) {
      const u = rnd() * 6.28;
      const v = Math.acos(2 * rnd() - 1);
      const rr = R0 * Math.cbrt(rnd());
      d.position.set(
        x + rr * Math.sin(v) * Math.cos(u) * 1.2,
        cy + rr * Math.cos(v) * 0.75,
        z + rr * Math.sin(v) * Math.sin(u) * 1.2
      );
      d.rotation.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28);
      d.scale.setScalar(0.38 + rnd() * 0.35);
      d.updateMatrix();
      can.setMatrixAt(ci, d.matrix);
      can.setColorAt(ci, new T.Color(pal[Math.floor((tone * 3 + rnd() * 4) % pal.length)]).multiplyScalar(0.6 + rnd() * 0.7));
    }
  }
  can.castShadow = !isMobile;
  sc.add(can);

  const fallN = isMobile ? 45 : 130;
  const fl = new T.InstancedMesh(cg, lm, fallN);
  const F = [];
  for (let i = 0; i < fallN; i++) {
    F.push({
      x: (rnd() - 0.5) * 30,
      y: rnd() * 9,
      z: 2 - rnd() * 35,
      v: 0.5 + rnd() * 0.6,
      ph: rnd() * 6,
      sp: 0.6 + rnd(),
      s: 0.1 + rnd() * 0.12,
    });
    fl.setColorAt(i, new T.Color(pal[i % pal.length]));
  }
  sc.add(fl);

  let hov = -1;
  let cur = -1;
  let tgt = 0;
  let pr = 0;
  let tx = 0;
  let ty = 0;
  let px = 0;
  let py = 0;
  const ray = new T.Raycaster();
  const mv = new T.Vector2();
  const vec = new T.Vector3();
  const eq = new T.Quaternion();
  const ep = new T.Vector3();
  const c2 = new T.PerspectiveCamera();

  function isPortrait() {
    return innerWidth / Math.max(innerHeight, 1) < 0.85;
  }

  function isLandscapePhone() {
    const aspect = innerWidth / Math.max(innerHeight, 1);
    return !isPortrait() && (innerHeight <= 520 || (isMobile && aspect >= 1.15));
  }

  function layoutScale() {
    const aspect = innerWidth / Math.max(innerHeight, 1);
    if (aspect < 0.65) return 0.52;
    if (aspect < 0.85) return 0.68;
    if (aspect < 1.1) return 0.85;
    return 1;
  }

  function camDist() {
    if (isPortrait()) return 7.4;
    if (isLandscapePhone()) return 6.5;
    const aspect = innerWidth / Math.max(innerHeight, 1);
    if (aspect < 1.1) return 7.2;
    return 6;
  }

  // Front → back order for the mobile vertical path (screen top → bottom)
  const mobileLeafOrder = [...P.keys()].sort((a, b) => P[b].pos[1] - P[a].pos[1]);
  // Left → right for landscape phone
  const landscapeLeafOrder = [...P.keys()].sort((a, b) => P[a].pos[0] - P[b].pos[0]);

  const L = P.map((p, i) => {
    const m = new T.Mesh(
      pg,
      new T.MeshLambertMaterial({
        color: p.c,
        map: vt,
        side: T.DoubleSide,
        emissive: p.c,
        emissiveIntensity: 0,
      })
    );
    m.castShadow = !isMobile;
    m.receiveShadow = true;
    m.rotation.order = "YXZ";
    m.rotation.x = -Math.PI / 2;
    m.rotation.y = p.yaw;
    m.position.set(p.pos[0], 0.2, p.pos[1]);
    m.scale.setScalar(p.s);
    sc.add(m);

    const b = document.createElement("button");
    b.className = "lab";
    b.textContent = p.n;
    b.setAttribute("aria-label", `${p.n} project`);
    b.addEventListener("click", () => openLeaf(i));
    b.addEventListener("pointerenter", () => {
      hov = i;
    });
    b.addEventListener("pointerleave", () => {
      hov = -1;
    });
    document.body.appendChild(b);
    return { m, b, h: 0 };
  });

  function placeLeaves() {
    if (isPortrait()) {
      // Zigzag: near/bottom left, then right, alternating toward far/top
      // Depth stops biased so Cradle Guard & Night City (both on the left) stay apart
      const zNear = -0.6;
      const zFar = -20;
      const xAmp = 2.8;
      const depthT = [0, 0.2, 0.36, 0.55, 1];
      mobileLeafOrder.forEach((pi, rank) => {
        const t = depthT[rank] ?? rank / Math.max(mobileLeafOrder.length - 1, 1);
        L[pi].m.position.x = (rank % 2 === 0 ? -1 : 1) * xAmp;
        L[pi].m.position.z = zNear + (zFar - zNear) * t;
      });
      return;
    }
    if (isLandscapePhone()) {
      // Wide even fan that fits a short landscape viewport
      const xMin = -6.2;
      const xMax = 6.2;
      const n = landscapeLeafOrder.length;
      landscapeLeafOrder.forEach((pi, rank) => {
        const t = n <= 1 ? 0.5 : rank / (n - 1);
        L[pi].m.position.x = xMin + (xMax - xMin) * t;
        L[pi].m.position.z = -3.4 - Math.abs(t - 0.5) * 3.2;
      });
      return;
    }
    const ls = layoutScale();
    L.forEach((l, i) => {
      l.m.position.x = P[i].pos[0] * ls;
      l.m.position.z = P[i].pos[1];
    });
  }

  function syncChrome() {
    document.body.classList.toggle("portrait", isPortrait());
    document.body.classList.toggle("landscape-phone", isLandscapePhone());
  }

  function size() {
    const w = innerWidth;
    const h = innerHeight;
    R.setSize(w, h, false);
    let fov = 55;
    if (isPortrait()) fov = 64;
    else if (isLandscapePhone()) fov = 50;
    else if (w / h < 0.75) fov = 62;
    cam.fov = fov;
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    placeLeaves();
    syncChrome();
  }
  addEventListener("resize", size);
  addEventListener("orientationchange", () => setTimeout(size, 120));
  if (window.visualViewport) {
    visualViewport.addEventListener("resize", size);
  }
  size();

  function pick(e) {
    mv.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(mv, cam);
    const h = ray.intersectObjects(L.map((l) => l.m));
    return h.length ? L.findIndex((l) => l.m === h[0].object) : -1;
  }

  cv.addEventListener("pointermove", (e) => {
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
    if (tgt === 0) {
      hov = pick(e);
      cv.style.cursor = hov >= 0 ? "pointer" : "default";
    }
  });
  cv.addEventListener("pointerup", (e) => {
    if (e.pointerType === "touch" && tgt === 0) {
      const i = pick(e);
      if (i >= 0) openLeaf(i);
    }
  });
  cv.addEventListener("click", (e) => {
    if (e.pointerType === "touch") return;
    const i = pick(e);
    if (i >= 0) openLeaf(i);
  });

  function openLeaf(i) {
    if (tgt || cur >= 0) return;
    cur = i;
    fill(P[i]);
    const l = L[i].m;
    const lift = innerWidth / Math.max(innerHeight, 1) < 0.75 ? 3.1 : 2.6;
    c2.position.set(l.position.x, lift, l.position.z + 0.001);
    c2.up.set(0, 0, -1);
    c2.lookAt(l.position.x, 0, l.position.z);
    ep.copy(c2.position);
    eq.copy(c2.quaternion);
    tgt = 1;
  }

  function show() {
    V.style.display = "block";
    void V.offsetWidth;
    V.classList.add("on");
    document.getElementById("cl").focus();
  }

  function closeLeaf() {
    if (cur < 0 || !V.classList.contains("on")) return;
    closeZoom();
    V.classList.remove("on");
    setTimeout(
      () => {
        V.style.display = "none";
        tgt = 0;
      },
      reduce ? 10 : 600
    );
  }

  document.getElementById("cl").addEventListener("click", closeLeaf);
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!zoom.hidden) {
      closeZoom();
      return;
    }
    closeLeaf();
  });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    if (tgt > pr) pr = Math.min(1, pr + dt / (reduce ? 0.05 : 1.2));
    else if (tgt < pr) pr = Math.max(0, pr - dt / (reduce ? 0.05 : 1.2));
    if (tgt === 1 && pr === 1 && !V.classList.contains("on") && V.style.display !== "block") show();
    if (tgt === 0 && pr === 0 && cur >= 0) {
      L[cur].b.style.visibility = "";
      L[cur].b.focus();
      cur = -1;
    }
    if (!reduce) {
      const damp = isMobile ? 0.03 : 0.05;
      px += (tx - px) * damp;
      py += (ty - py) * damp;
    }
    const portrait = isPortrait();
    const landPhone = isLandscapePhone();
    const pan = portrait ? 0.35 : landPhone ? 1.1 : isMobile ? 0.7 : 1.6;
    const camY = portrait ? 2.8 - py * 0.2 : landPhone ? 1.9 - py * 0.2 : 2.1 - py * 0.35;
    cam0.position.set(px * pan, camY + Math.sin(t * 0.5) * 0.03, camDist());
    cam0.lookAt(
      px * (portrait ? 0.1 : landPhone ? 0.55 : isMobile ? 0.35 : 0.8),
      portrait ? 0.2 : landPhone ? 0.4 : 0.5,
      portrait ? -14 : landPhone ? -8 : -10
    );
    const e = pr * pr * (3 - 2 * pr);
    cam.position.lerpVectors(cam0.position, cur >= 0 ? ep : cam0.position, e);
    cam.quaternion.copy(cam0.quaternion);
    if (cur >= 0) cam.quaternion.slerp(eq, e);
    const edgeX = landPhone ? 72 : isMobile ? 56 : 24;
    const edgeY = landPhone ? 36 : isMobile ? 96 : 28;
    const sMul = portrait ? 0.72 : landPhone ? 0.8 : 1;
    L.forEach((l, i) => {
      const on = i === hov && cur < 0;
      l.h += ((on ? 1 : 0) - l.h) * 0.15;
      const s = P[i].s * sMul * (1 + l.h * 0.08 + (i === cur ? e * 2.7 : 0));
      l.m.scale.setScalar(s);
      l.m.position.y = 0.2 + l.h * 0.25;
      l.m.material.emissiveIntensity = l.h * 0.45;
      vec.copy(l.m.position);
      vec.y += 0.1;
      vec.z += P[i].s * 1.15;
      vec.project(cam);
      const sx = Math.min(innerWidth - edgeX, Math.max(edgeX, (vec.x * 0.5 + 0.5) * innerWidth));
      const sy = Math.min(innerHeight - edgeY, Math.max(edgeY, (-vec.y * 0.5 + 0.5) * innerHeight));
      l.b.style.transform = `translate(${sx}px,${sy}px) translate(-50%,0)`;
      l.b.style.opacity = pr > 0.02 || vec.z > 1 ? 0 : 1;
      l.b.tabIndex = pr > 0.02 ? -1 : 0;
    });
    for (let j = 0; j < F.length; j++) {
      const f = F[j];
      if (!reduce) {
        f.y -= f.v * dt;
        if (f.y < 0.05) {
          f.y = 9;
          f.x = (rnd() - 0.5) * 30;
        }
      }
      d.position.set(f.x + Math.sin(t * f.sp + f.ph) * 0.8, f.y, f.z);
      d.rotation.set(t * f.sp + f.ph, t * f.sp * 0.7, f.ph);
      d.scale.setScalar(f.s);
      d.updateMatrix();
      fl.setMatrixAt(j, d.matrix);
    }
    fl.instanceMatrix.needsUpdate = true;
    R.render(sc, cam);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
} catch (err) {
  P.forEach((p) => {
    const b = document.createElement("button");
    b.className = "lab";
    b.style.cssText = "position:static;transform:none;display:block;margin:12px auto";
    b.textContent = p.n;
    b.addEventListener("click", () => {
      fill(p);
      showFallback();
    });
    document.body.appendChild(b);
  });
  function showFallback() {
    V.style.display = "block";
    void V.offsetWidth;
    V.classList.add("on");
  }
  document.getElementById("cl").addEventListener("click", () => {
    V.classList.remove("on");
    V.style.display = "none";
  });
}
