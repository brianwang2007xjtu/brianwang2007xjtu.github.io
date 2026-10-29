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
  const replayIcon = embed.querySelector("[data-me-icon-replay]") as HTMLButtonElement | null;
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
    if (bufferedEnd <= 0) return;
    const p = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
    barBox?.classList.remove("indeterminate");
    if (bar) bar.style.width = `${p}%`;
    if (pct) pct.textContent = `${p}%`;
  };

  const play = (item: HTMLButtonElement) => {
    const src = item.dataset.src;
    if (!src) return;
    showLoader(true);
    video.src = `/supermimic-demo/videos/${src}`;
    video.load();
    if (nameEl) nameEl.textContent = item.dataset.name ?? "";
    if (catEl) catEl.textContent = (item.dataset.group ?? "").replace(/([A-Z])/g, " $1").toLowerCase();
    if (retEl) retEl.textContent = `return ${item.dataset.return ?? "—"}`;
    items.forEach(el => el.classList.toggle("active", el === item));
    armWatchdog();
    startPlayback(2);
  };

  let watchdog: number | undefined;

  const startPlayback = (retries: number) => {
    const attempt = video.play();
    if (!attempt || !attempt.catch) return;
    attempt.catch(() => {
      // Autoplay refused or the element is not ready: reload once, then fall
      // back to an explicit play button instead of leaving the loader up.
      if (retries > 0) {
        window.setTimeout(() => startPlayback(retries - 1), 400);
      } else {
        window.clearTimeout(watchdog);
        hideLoader();
      }
    });
  };

  const armWatchdog = () => {
    window.clearTimeout(watchdog);
    // Only intervene when the element has no usable source at all; a slow but
    // working download must not be interrupted (reloading restarts the fetch).
    watchdog = window.setTimeout(() => {
      if (video.readyState >= 2 || video.currentTime > 0) return;
      if (video.networkState === 3 || video.error) {
        video.load();
        startPlayback(1);
      }
    }, 8000);
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
    if (nameEl) nameEl.textContent = "加载失败";
  });
  // The loading card is clickable: if autoplay or the fetch stalled, a tap retries.
  loader?.addEventListener("click", () => {
    hideLoader();
    if (!video.currentSrc && video.getAttribute("src")) video.load();
    startPlayback(1);
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

  const playNext = () => {
    const active = items.findIndex(el => el.classList.contains("active"));
    for (let k = 1; k <= items.length; k++) {
      const candidate = items[(Math.max(active, 0) + k) % items.length];
      if (candidate && candidate.style.display !== "none") {
        play(candidate);
        return;
      }
    }
  };

  const replay = () => {
    video.currentTime = 0;
    showLoader(false);
    video.play().catch(() => {});
  };
  replayIcon?.addEventListener("click", replay);

  video.addEventListener("ended", playNext);

  if (items.length) play(items[0]);

  // Some browsers refuse to start media inserted by the client router, or defer
  // offscreen videos. Retry when the block scrolls into view and on first input.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && video.paused) startPlayback(0);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(embed);
  }
  const kick = () => {
    if (!video.paused) return;
    if (!video.currentSrc) video.load();
    startPlayback(1);
  };
  // Autoplay can be blocked outright (Safari/Chrome policies). Rather than cover
  // the frame with a play button, start on the first scroll/gesture instead.
  for (const ev of ["pointerdown", "keydown", "wheel", "touchstart"] as const) {
    document.addEventListener(ev, kick, { once: true, passive: true });
  }
  window.addEventListener("scroll", kick, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && video.paused) startPlayback(0);
  });
}

function initTrail(el: HTMLElement) {
  if (el.dataset.inited === "1") return;
  el.dataset.inited = "1";

  const video = el.querySelector("[data-wt-video]") as HTMLVideoElement | null;
  const range = el.querySelector("[data-wt-range]") as HTMLInputElement | null;
  const toggle = el.querySelector("[data-wt-toggle]") as HTMLButtonElement | null;
  if (!video || !range || !toggle) return;

  const FPS = 50;
  const max = Number(range.max) || 450;
  let userPaused = false;

  // Force a fresh resource selection: the client router can insert the element
  // without ever starting the load (currentSrc stays empty, error code 4).
  const src = video.getAttribute("src");
  if (src && !video.currentSrc) {
    video.src = src;
    video.load();
  }

  const setFill = () => {
    range.style.setProperty("--p", `${(Number(range.value) / max) * 100}%`);
  };
  const sync = () => {
    range.value = String(Math.min(max, Math.round(video.currentTime * FPS)));
    setFill();
  };
  const tryPlay = () => {
    if (userPaused) return;
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
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
    if (video.paused) {
      userPaused = false;
      tryPlay();
    } else {
      userPaused = true;
      video.pause();
    }
  });
  range.addEventListener("input", () => {
    video.currentTime = Number(range.value) / FPS;
    setFill();
  });

  setFill();
  tryPlay();

  // Offscreen media can be deferred by the browser: retry playback when it
  // scrolls into view, but never reload while a download is still progressing.
  video.addEventListener("error", () => {
    if (video.error) {
      video.load();
      tryPlay();
    }
  });

  // Autoplay can be rejected right after a client-side navigation; retry when
  // the block scrolls into view and on the first user gesture.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && video.paused) tryPlay();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
  }
  const kick = () => {
    if (video.paused) tryPlay();
  };
  document.addEventListener("pointerdown", kick, { once: true });
  document.addEventListener("keydown", kick, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && video.paused) tryPlay();
  });
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
