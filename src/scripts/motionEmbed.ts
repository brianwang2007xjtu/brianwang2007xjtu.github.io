// Motion-embed interactions (markup rendered at build time by MotionEmbed.astro):
// loading card + progress, folder list, filtering, replay-only playback.

function initEmbed(embed: HTMLElement) {
  if (embed.dataset.inited === "1") return;
  embed.dataset.inited = "1";

  const video = embed.querySelector("[data-me-video]") as HTMLVideoElement | null;
  const openBtn = embed.querySelector("[data-me-open]") as HTMLButtonElement | null;
  const nameEl = embed.querySelector("[data-me-name]") as HTMLElement | null;
  const catEl = embed.querySelector("[data-me-cat]") as HTMLElement | null;
  const retEl = embed.querySelector("[data-me-ret]") as HTMLElement | null;
  const replayOverlay = embed.querySelector("[data-me-replay]") as HTMLButtonElement | null;
  const replayIcon = embed.querySelector("[data-me-icon-replay]") as HTMLButtonElement | null;
  const playOverlay = embed.querySelector("[data-me-play]") as HTMLButtonElement | null;
  const loader = embed.querySelector("[data-me-loader]") as HTMLElement | null;
  const barBox = embed.querySelector(".loader-bar") as HTMLElement | null;
  const bar = embed.querySelector("[data-me-bar]") as HTMLElement | null;
  const pct = embed.querySelector("[data-me-pct]") as HTMLElement | null;
  const sheet = embed.querySelector("[data-me-sheet]") as HTMLElement | null;
  const list = embed.querySelector("[data-me-list]") as HTMLElement | null;
  const filter = embed.querySelector("[data-me-filter]") as HTMLInputElement | null;
  if (!video || !openBtn || !nameEl || !sheet || !list) return;

  const items = Array.from(list.querySelectorAll<HTMLButtonElement>(".item"));

  const setOpen = (open: boolean) => {
    sheet.hidden = !open;
    embed.dataset.open = open ? "1" : "0";
  };

  const showLoader = (indeterminate: boolean) => {
    if (!loader) return;
    loader.hidden = false;
    barBox?.classList.toggle("indeterminate", indeterminate);
    if (indeterminate) {
      if (bar) bar.style.width = "40%";
      if (pct) pct.textContent = "0%";
    }
  };
  const hideLoader = () => {
    if (loader) loader.hidden = true;
  };
  const updateProgress = () => {
    if (!video.duration || !isFinite(video.duration) || video.duration <= 0) return;
    let bufferedEnd = 0;
    for (let i = 0; i < video.buffered.length; i++) {
      bufferedEnd = Math.max(bufferedEnd, video.buffered.end(i));
    }
    const p = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
    barBox?.classList.remove("indeterminate");
    if (bar) bar.style.width = `${p}%`;
    if (pct) pct.textContent = `${p}%`;
  };

  const play = (item: HTMLButtonElement) => {
    const src = item.dataset.src;
    if (!src) return;
    playOverlay?.classList.remove("is-visible");
    replayOverlay?.classList.remove("is-visible");
    showLoader(true);
    video.src = `/supermimic-demo/videos/${src}`;
    video.load();
    if (nameEl) nameEl.textContent = item.dataset.name ?? "";
    if (catEl) catEl.textContent = (item.dataset.group ?? "").replace(/([A-Z])/g, " $1").toLowerCase();
    if (retEl) retEl.textContent = `return ${item.dataset.return ?? "—"}`;
    items.forEach(el => el.classList.toggle("active", el === item));
    armWatchdog();
    const attempt = video.play();
    if (attempt && attempt.catch) {
      attempt.catch(() => {
        window.clearTimeout(watchdog);
        hideLoader();
        playOverlay?.classList.add("is-visible");
      });
    }
  };

  let watchdog: number | undefined;
  const armWatchdog = () => {
    window.clearTimeout(watchdog);
    // If the clip has not started within 4 s, drop the loader and offer play.
    watchdog = window.setTimeout(() => {
      if (video.paused && video.currentTime === 0) {
        hideLoader();
        playOverlay?.classList.add("is-visible");
      }
    }, 4000);
  };
  const started = () => {
    window.clearTimeout(watchdog);
    hideLoader();
  };

  video.addEventListener("progress", updateProgress);
  video.addEventListener("loadedmetadata", updateProgress);
  video.addEventListener("loadeddata", () => {
    updateProgress();
    if (video.readyState >= 2) hideLoader();
  });
  video.addEventListener("canplay", hideLoader);
  video.addEventListener("canplaythrough", hideLoader);
  video.addEventListener("playing", started);
  video.addEventListener("timeupdate", () => {
    if (video.currentTime > 0) started();
  });
  video.addEventListener("waiting", () => showLoader(true));
  video.addEventListener("error", () => {
    window.clearTimeout(watchdog);
    hideLoader();
    playOverlay?.classList.add("is-visible");
    if (nameEl) nameEl.textContent = "加载失败";
  });
  playOverlay?.addEventListener("click", () => {
    playOverlay.classList.remove("is-visible");
    showLoader(true);
    video.play().catch(() => {
      hideLoader();
      playOverlay?.classList.add("is-visible");
    });
  });

  list.querySelectorAll<HTMLElement>("[data-folder-head]").forEach(head => {
    head.addEventListener("click", () => {
      const folder = head.closest<HTMLElement>(".folder");
      if (folder) folder.dataset.collapsed = folder.dataset.collapsed === "0" ? "1" : "0";
    });
  });

  filter?.addEventListener("input", () => {
    const q = filter.value.trim().toLowerCase();
    list.querySelectorAll<HTMLElement>(".folder").forEach(folder => {
      let shown = 0;
      folder.querySelectorAll<HTMLButtonElement>(".item").forEach(item => {
        const hit = !q || (item.dataset.name ?? "").toLowerCase().includes(q);
        item.style.display = hit ? "" : "none";
        if (hit) shown += 1;
      });
      folder.style.display = shown ? "" : "none";
      if (q && shown) folder.dataset.collapsed = "0";
    });
  });

  items.forEach(item => {
    item.addEventListener("click", () => {
      play(item);
      setOpen(false);
    });
  });

  openBtn.addEventListener("click", e => {
    e.stopPropagation();
    setOpen(sheet.hasAttribute("hidden")); // hidden -> open
  });
  document.addEventListener("click", e => {
    const open = !sheet.hasAttribute("hidden");
    if (open && !embed.contains(e.target as Node)) setOpen(false);
  });

  const replay = () => {
    video.currentTime = 0;
    replayOverlay?.classList.remove("is-visible");
    showLoader(false);
    video.play().catch(() => {});
  };
  replayOverlay?.addEventListener("click", replay);
  replayIcon?.addEventListener("click", replay);

  video.addEventListener("ended", () => replayOverlay?.classList.add("is-visible"));

  if (items.length) play(items[0]);
}

function initTrail(el: HTMLElement) {
  if (el.dataset.inited === "1") return;
  el.dataset.inited = "1";

  const video = el.querySelector("[data-wt-video]") as HTMLVideoElement | null;
  const range = el.querySelector("[data-wt-range]") as HTMLInputElement | null;
  const frameEl = el.querySelector("[data-wt-frame]") as HTMLElement | null;
  const toggle = el.querySelector("[data-wt-toggle]") as HTMLButtonElement | null;
  if (!video || !range || !frameEl || !toggle) return;

  const FPS = 50;
  const max = Number(range.max) || 500;
  const setFill = () => {
    range.style.setProperty("--p", `${(Number(range.value) / max) * 100}%`);
  };
  const sync = () => {
    const f = Math.min(max, Math.round(video.currentTime * FPS));
    frameEl.textContent = String(f);
    range.value = String(f);
    setFill();
  };

  video.addEventListener("timeupdate", sync);
  video.addEventListener("loadedmetadata", sync);
  video.addEventListener("play", () => {
    el.dataset.paused = "0";
  });
  video.addEventListener("pause", () => {
    el.dataset.paused = "1";
  });
  toggle.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  range.addEventListener("input", () => {
    video.currentTime = Number(range.value) / FPS;
    setFill();
  });

  setFill();
  video.play().catch(() => {});
}

function initAllEmbeds() {
  document.querySelectorAll<HTMLElement>("[data-motion-embed]").forEach(initEmbed);
  document.querySelectorAll<HTMLElement>("[data-wm-trail]").forEach(initTrail);
}

initAllEmbeds();
document.addEventListener("astro:page-load", initAllEmbeds);
document.addEventListener("astro:after-swap", () => setTimeout(initAllEmbeds, 0));

const win = window as Window & { __meObserver?: MutationObserver };
if (!win.__meObserver) {
  const start = () => {
    win.__meObserver = new MutationObserver(() => initAllEmbeds());
    win.__meObserver.observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
}
// Safety net: the client router can swap pages without firing any event we see.
setInterval(initAllEmbeds, 500);

export {};
