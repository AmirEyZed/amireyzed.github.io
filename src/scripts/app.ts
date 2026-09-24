/*
  Page behaviour, all in one small module:
  - smooth scrolling (Lenis)
  - the wire and LEDs that light up as you scroll
  - the glass-lens refraction of entries near the top and bottom of the screen
  - mouse interactions: the lamp light, the neon sign, the years, magnetic controls
  Everything degrades to a plain, fully readable page without JS or with reduced motion.
*/
import Lenis from 'lenis';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ---------- Smooth scroll ---------- */
const lenis = reduced ? null : new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true, autoRaf: false });

/* ---------- Elements ---------- */
const header = document.querySelector<HTMLElement>('.header');
const lamp = document.querySelector<HTMLElement>('.ambient-lamp');
const sign = document.querySelector<HTMLElement>('[data-neon]');
const track = document.querySelector<HTMLElement>('[data-track]');
const today = document.querySelector<HTMLElement>('[data-today]');
const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-row]'));

interface LensCell {
  el: HTMLElement;
  rowIndex: number;
  top: number;
  height: number;
  e: number;
  dir: number;
  refracting: boolean;
}

const cells: LensCell[] = rows.flatMap((row, rowIndex) =>
  Array.from(row.querySelectorAll<HTMLElement>('[data-lens]')).map((el) => ({
    el,
    rowIndex,
    top: 0,
    height: 0,
    e: -1,
    dir: 0,
    refracting: false,
  })),
);

let dirty = true;

/* Layout offsets are read without transforms, so the lens never feeds back into itself. */
function measure() {
  for (const cell of cells) {
    cell.top = cell.el.offsetTop;
    cell.height = cell.el.offsetHeight;
  }
  dirty = true;
}

measure();
new ResizeObserver(measure).observe(document.body);
document.fonts?.ready.then(measure);

/* ---------- Scroll-linked state ---------- */
const rowTops: number[] = new Array(rows.length).fill(0);

function updateScrollState(viewportHeight: number) {
  const mid = viewportHeight / 2;

  if (track) {
    const rect = track.getBoundingClientRect();
    const progress = clamp((mid - rect.top) / rect.height, 0, 1);
    track.style.setProperty('--progress', progress.toFixed(4));
    today?.classList.toggle('is-lit', progress >= 0.999);
  }

  rows.forEach((row, i) => {
    const rect = row.getBoundingClientRect();
    rowTops[i] = rect.top;
    row.classList.toggle('is-lit', rect.top + rect.height / 2 <= mid + 1);
  });

  if (reduced) return;

  for (const cell of cells) {
    const center = rowTops[cell.rowIndex]! + cell.top + cell.height / 2;
    const d = (center - mid) / mid; // -1 at the top edge, 1 at the bottom edge
    const e = smoothstep(0.55, 1.08, Math.abs(d));
    const dir = d < 0 ? -1 : 1;
    // Blur and transforms only for cells on or near the screen.
    const refracting = e > 0.02 && Math.abs(d) < 1.4;
    if (Math.abs(e - cell.e) > 0.002 || dir !== cell.dir) {
      cell.el.style.setProperty('--e', e.toFixed(3));
      cell.el.style.setProperty('--dir', String(dir));
      cell.e = e;
      cell.dir = dir;
    }
    if (refracting !== cell.refracting) {
      cell.el.classList.toggle('is-refracting', refracting);
      cell.refracting = refracting;
    }
  }
}

/* ---------- Pointer: the lamp light and the neon sign follow the cursor ---------- */
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight * 0.22,
  sx: window.innerWidth / 2,
  sy: window.innerHeight * 0.22,
  active: false,
};

if (finePointer) {
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'touch') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!pointer.active) {
        pointer.active = true;
        root.classList.add('has-pointer');
      }
    },
    { passive: true },
  );
  root.addEventListener('mouseleave', () => {
    pointer.active = false;
    root.classList.remove('has-pointer');
  });
}

function updateSign() {
  if (!sign) return;
  const rect = sign.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  const dx = pointer.sx - (rect.left + rect.width / 2);
  const dy = pointer.sy - (rect.top + rect.height / 2);
  const reach = Math.max(window.innerWidth, 900) * 0.5;
  const neon = pointer.active ? 0.45 + 0.55 * Math.max(0, 1 - Math.hypot(dx, dy) / reach) : 0.7;
  sign.style.setProperty('--neon', neon.toFixed(3));
  if (!reduced && pointer.active) {
    sign.style.setProperty('--sry', `${(clamp(dx / (window.innerWidth / 2), -1, 1) * 6).toFixed(2)}deg`);
    sign.style.setProperty('--srx', `${(clamp(-dy / (window.innerHeight / 2), -1, 1) * 4).toFixed(2)}deg`);
  }
}

/* ---------- Years: colour fringes and tilt follow the cursor, like looking through a lens ---------- */
if (finePointer && !reduced) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-year]')) {
    el.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const nx = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
      const ny = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);
      el.style.setProperty('--cx', `${(nx * 7).toFixed(1)}px`);
      el.style.setProperty('--cy', `${(ny * 5).toFixed(1)}px`);
      el.style.setProperty('--fr', '0.55');
      el.style.setProperty('--tx', `${(nx * 12).toFixed(1)}deg`);
      el.style.setProperty('--ty', `${(-ny * 10).toFixed(1)}deg`);
    });
    el.addEventListener('pointerleave', () => {
      for (const prop of ['--cx', '--cy', '--fr', '--tx', '--ty']) el.style.removeProperty(prop);
    });
  }
}

/* ---------- Magnetic controls ---------- */
if (finePointer && !reduced) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
    const strength = Number(el.dataset.magnetic) || 0.3;
    el.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      el.classList.add('is-attracted');
      el.style.setProperty('--mx', `${((event.clientX - (rect.left + rect.width / 2)) * strength).toFixed(1)}px`);
      el.style.setProperty('--my', `${((event.clientY - (rect.top + rect.height / 2)) * strength).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-attracted');
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    });
  }
}

/* ---------- Photo lightbox ----------
   The photo grows out of its thumbnail, the other photos of the same milestone are one arrow,
   key or swipe away, and closing shrinks it back into place. */
const lightbox = document.querySelector<HTMLDialogElement>('dialog.lightbox');
const lbImg = lightbox?.querySelector<HTMLImageElement>('[data-lb-img]');
const lbFrame = lightbox?.querySelector<HTMLElement>('.lb-frame');
const lbAlt = lightbox?.querySelector<HTMLElement>('[data-lb-alt]');
const lbCount = lightbox?.querySelector<HTMLElement>('[data-lb-count]');
const lbStage = lightbox?.querySelector<HTMLElement>('[data-lb-stage]');

if (lightbox && lbImg && lbFrame && lbAlt && lbCount && lbStage) {
  const rtl = document.documentElement.dir === 'rtl';
  const persian = document.documentElement.lang === 'fa';
  const num = (n: number) => (persian ? String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!) : String(n));
  const ease = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

  let group: HTMLElement[] = [];
  let index = 0;
  let busy = false;
  let loadToken = 0;

  const thumbOf = (shot: HTMLElement): HTMLElement => shot.querySelector('img') ?? shot;

  /** Put photo i in the viewer: the loaded thumbnail at once, the full-size file as soon as it decodes. */
  const fill = (i: number) => {
    const shot = group[i]!;
    const token = ++loadToken;
    const alt = shot.dataset.alt ?? '';
    lbImg.alt = alt;
    lbAlt.textContent = alt;
    lbCount.textContent = group.length > 1 ? `${num(i + 1)} / ${num(group.length)}` : '';
    const thumb = shot.querySelector('img');
    if (thumb?.currentSrc) lbImg.src = thumb.currentSrc;
    const full = shot.dataset.full;
    if (!full) return;
    lbFrame.classList.add('is-loading');
    const pre = new Image();
    pre.src = full;
    pre
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (token !== loadToken) return;
        lbImg.src = full;
        lbFrame.classList.remove('is-loading');
      });
  };

  /** Transform that makes the viewer photo sit exactly over `rect` (for the grow and shrink animations). */
  const transformTo = (rect: DOMRect) => {
    const box = lbImg.getBoundingClientRect();
    if (!box.width || !rect.width) return null;
    const dx = rect.left + rect.width / 2 - (box.left + box.width / 2);
    const dy = rect.top + rect.height / 2 - (box.top + box.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${rect.width / box.width})`;
  };

  const open = async (shot: HTMLElement) => {
    const row = shot.closest('[data-row]') ?? document.body;
    group = [...row.querySelectorAll<HTMLElement>('[data-full]')];
    index = Math.max(0, group.indexOf(shot));
    lightbox.classList.toggle('is-single', group.length < 2);
    fill(index);
    lightbox.showModal();
    lenis?.stop();
    await lbImg.decode().catch(() => undefined);
    requestAnimationFrame(() => {
      lightbox.classList.add('is-open');
      if (reduced) return;
      const from = transformTo(thumbOf(shot).getBoundingClientRect());
      if (from) {
        lbImg.animate([{ transform: from, opacity: 0.55 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: ease });
      }
    });
  };

  const close = async () => {
    if (!lightbox.open || busy) return;
    busy = true;
    lightbox.classList.remove('is-open');
    lightbox.classList.add('is-closing');
    const shot = group[index];
    if (!reduced && shot) {
      const rect = thumbOf(shot).getBoundingClientRect();
      const visible = rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      const to = visible ? transformTo(rect) : null;
      const animation = lbImg.animate(
        [{ transform: 'none', opacity: 1 }, to ? { transform: to, opacity: 0.35 } : { transform: 'scale(0.94)', opacity: 0 }],
        { duration: to ? 380 : 240, easing: ease, fill: 'forwards' },
      );
      await animation.finished.catch(() => undefined);
      animation.cancel();
    } else {
      await new Promise((resolve) => setTimeout(resolve, reduced ? 0 : 200));
    }
    lightbox.close();
  };

  /** step: +1 next, -1 previous. In Persian the next photo comes in from the left. */
  const go = async (step: number) => {
    if (group.length < 2 || busy) return;
    busy = true;
    const dir = (rtl ? -1 : 1) * step;
    if (!reduced) {
      const out = lbImg.animate(
        [{ transform: 'none', opacity: 1 }, { transform: `translateX(${-dir * 56}px)`, opacity: 0 }],
        { duration: 170, easing: 'ease-in', fill: 'forwards' },
      );
      await out.finished.catch(() => undefined);
    }
    index = (index + step + group.length) % group.length;
    fill(index);
    await lbImg.decode().catch(() => undefined);
    lbImg.getAnimations().forEach((a) => a.cancel());
    if (!reduced) {
      lbImg.animate([{ transform: `translateX(${dir * 56}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], {
        duration: 280,
        easing: ease,
      });
    }
    busy = false;
  };

  document.addEventListener('click', (event) => {
    const shot = (event.target as HTMLElement).closest<HTMLElement>('[data-full]');
    if (!shot || lightbox.open) return;
    event.preventDefault();
    void open(shot);
  });

  lightbox.querySelector('[data-lb-close]')?.addEventListener('click', () => void close());
  lightbox.querySelector('[data-lb-prev]')?.addEventListener('click', () => void go(-1));
  lightbox.querySelector('[data-lb-next]')?.addEventListener('click', () => void go(1));

  // Escape plays the closing animation instead of the instant native close.
  lightbox.addEventListener('cancel', (event) => {
    event.preventDefault();
    void close();
  });

  lightbox.addEventListener('close', () => {
    lightbox.classList.remove('is-open', 'is-closing', 'is-single');
    lbFrame.classList.remove('is-loading');
    lbImg.getAnimations().forEach((a) => a.cancel());
    lbImg.removeAttribute('src');
    loadToken++;
    busy = false;
    lenis?.start();
  });

  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      void go(rtl ? -1 : 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      void go(rtl ? 1 : -1);
    }
  });

  // Swipe sideways to browse, swipe down or tap outside the photo to close.
  let start: { x: number; y: number } | null = null;
  lbStage.addEventListener('pointerdown', (event) => {
    start = { x: event.clientX, y: event.clientY };
  });
  lbStage.addEventListener('pointerup', (event) => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      void go(dx < 0 !== rtl ? 1 : -1);
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
      void close();
    } else if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && !(event.target as HTMLElement).closest('.lb-figure')) {
      void close();
    }
  });
}

/* ---------- One loop drives everything ---------- */
let lastY = -1;
let lastW = 0;
let lastH = 0;

function frame(time: number) {
  lenis?.raf(time);

  const y = window.scrollY;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (dirty || y !== lastY || w !== lastW || h !== lastH) {
    dirty = false;
    lastY = y;
    lastW = w;
    lastH = h;
    header?.classList.toggle('is-scrolled', y > 8);
    updateScrollState(h);
    updateSign();
  }

  const dx = pointer.x - pointer.sx;
  const dy = pointer.y - pointer.sy;
  if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
    const ease = reduced ? 1 : 0.14;
    pointer.sx += dx * ease;
    pointer.sy += dy * ease;
    if (lamp) lamp.style.transform = `translate3d(${pointer.sx.toFixed(1)}px, ${pointer.sy.toFixed(1)}px, 0)`;
    updateSign();
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
