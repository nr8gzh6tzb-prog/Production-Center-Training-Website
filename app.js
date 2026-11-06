// Production Center training flow.
// Watched flags and playback position live in sessionStorage for this tab only.
// Keys are prefixed with SITE_KEY from config.js so they stay separate from retail.

const TOTAL = Object.keys(VIDEOS).length;

function storageKey(name) {
  const prefix = (typeof SITE_KEY === "string" && SITE_KEY.trim()) ? SITE_KEY.trim() : "production";
  return prefix + "_" + name;
}

function watched(n) {
  return sessionStorage.getItem(storageKey("video" + n + "_done")) === "1";
}

function videoUrl(n) {
  const raw = VIDEOS[n];
  if (raw == null) return "";
  return String(raw).trim();
}

function videoTitle(n) {
  const raw = (typeof TITLES !== "undefined") ? TITLES[n] : "";
  const title = raw == null ? "" : String(raw).trim();
  return title || ("Video " + n);
}

function firstUnwatched() {
  for (let i = 1; i <= TOTAL; i++) {
    if (!watched(i)) return i;
  }
  return 0;
}

function markWatched(n) {
  // A blank link cannot be completed, so Next stays locked.
  if (!videoUrl(n)) return;
  sessionStorage.setItem(storageKey("video" + n + "_done"), "1");
  unlockNext();
  renderProgress();
}

function unlockNext() {
  const button = document.getElementById("next");
  if (!button) return;
  button.classList.remove("locked");
  button.removeAttribute("aria-disabled");
  if (button.dataset.href) button.href = button.dataset.href;
  const status = document.getElementById("status");
  if (status) status.textContent = "✓ Watched — you can continue.";
}

// Stay on this video only when every earlier video is already watched.
function guard(required) {
  if (required <= 0) return false;
  const n = firstUnwatched();
  if (n && n <= required) {
    location.replace("video" + n + ".html");
    return true;
  }
  return false;
}

// Sign-off opens only after all five videos are watched.
function guardSignoff() {
  const n = firstUnwatched();
  if (n) {
    location.replace("video" + n + ".html");
    return true;
  }
  return false;
}

// done.html is only for a sign-off that Formspree accepted.
function guardDone() {
  if (sessionStorage.getItem(storageKey("signoff_done")) !== "1") {
    location.replace("index.html");
  }
}

function toEmbed(u) {
  let m = u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (m) return { type: "yt", id: m[1] };
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { type: "vimeo", id: m[1] };
  return { type: "file", src: u };
}

function showPlaceholder(box, text) {
  box.textContent = "";
  const message = document.createElement("div");
  message.className = "ph";
  message.textContent = text;
  box.appendChild(message);
}

function applyTitle(n) {
  const title = videoTitle(n);
  document.title = title;
  const heading = document.querySelector("h1");
  if (heading) heading.textContent = title;
}

function lockNext(next) {
  if (!next) return;
  next.dataset.href = next.getAttribute("href");
  next.removeAttribute("href");
  next.classList.add("locked");
  next.setAttribute("aria-disabled", "true");
}

function setupVideo(n) {
  if (guard(n - 1)) return;
  applyTitle(n);
  const box = document.getElementById("player");
  const next = document.getElementById("next");
  const url = videoUrl(n);
  lockNext(next);
  if (!url) {
    showPlaceholder(box, "Video " + n + " link not added yet. Edit VIDEOS[" + n + "] in config.js.");
    return;
  }
  if (watched(n)) unlockNext();
  if (typeof TEST_MODE !== "undefined" && TEST_MODE) {
    const testButton = document.getElementById("testbtn");
    if (testButton) {
      testButton.hidden = false;
      testButton.onclick = function () { markWatched(n); };
    }
  }
  const embed = toEmbed(url);
  if (embed.type === "file") setupFileVideo(box, embed.src, n);
  else if (embed.type === "yt") setupYouTube(box, embed.id, n);
  else setupVimeo(box, embed.id, n);
}

function setupFileVideo(box, src, n) {
  const video = document.createElement("video");
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.onended = function () { markWatched(n); };
  // NO SKIPPING for HTML5 MP4/file videos: remember the furthest point played.
  // Jumping ahead snaps back. Rewinding is allowed. After the video ends,
  // reviewing can use the normal controls.
  // RESUME: that point is kept for this browser tab, so opening an earlier
  // video and coming back picks up where they left off.
  const posKey = storageKey("video" + n + "_pos");
  let maxT = Number(sessionStorage.getItem(posKey)) || 0;
  let snapping = false;
  function snapBack() {
    if (snapping || watched(n)) return;
    if (video.currentTime > maxT + 0.5) {
      snapping = true;
      video.currentTime = maxT;
      snapping = false;
    }
  }
  // Chrome ignores currentTime inside loadedmetadata, and ignores it entirely
  // until the file is seekable (the host must support byte ranges).
  function resume() {
    if (maxT > 0 && !watched(n) && video.currentTime + 0.25 < maxT) video.currentTime = maxT;
  }
  video.addEventListener("loadedmetadata", function () { setTimeout(resume, 0); });
  video.addEventListener("loadeddata", resume);
  video.addEventListener("canplay", resume);
  video.addEventListener("timeupdate", function () {
    if (!video.seeking && video.currentTime > maxT && video.currentTime - maxT < 1.5) {
      maxT = video.currentTime;
      sessionStorage.setItem(posKey, String(maxT));
    }
  });
  video.addEventListener("seeking", snapBack);
  video.addEventListener("seeked", snapBack);
  video.addEventListener("ratechange", function () {
    if (!watched(n) && video.playbackRate > 1) video.playbackRate = 1;
  });
  video.onerror = function () {
    showPlaceholder(box, "Video file not found or not playable: " + src);
  };
  video.src = src;
  box.textContent = "";
  box.appendChild(video);
}

function setupYouTube(box, id, n) {
  box.innerHTML = '<div id="yt"></div>';
  window.onYouTubeIframeAPIReady = function () {
    new YT.Player("yt", {
      videoId: id,
      events: {
        onStateChange: function (event) {
          if (event.data === 0) markWatched(n);
        }
      }
    });
  };
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
}

function setupVimeo(box, id, n) {
  const frame = document.createElement("iframe");
  frame.id = "vm";
  frame.src = "https://player.vimeo.com/video/" + id;
  frame.allowFullscreen = true;
  box.textContent = "";
  box.appendChild(frame);
  const script = document.createElement("script");
  script.src = "https://player.vimeo.com/api/player.js";
  script.onload = function () {
    new Vimeo.Player(frame).on("ended", function () { markWatched(n); });
  };
  document.head.appendChild(script);
}

function renderProgress() {
  let bar = document.getElementById("progress");
  if (!bar) {
    bar = document.createElement("footer");
    bar.id = "progress";
    bar.innerHTML = '<div class="track"><div class="fill"></div></div><span class="label"></span>';
    document.body.appendChild(bar);
  }
  const doneCount = Object.keys(VIDEOS).map(Number).filter(function (n) { return watched(n); }).length;
  const signed = sessionStorage.getItem(storageKey("signoff_done")) === "1";
  bar.querySelector(".fill").style.width = (signed ? 100 : (doneCount / TOTAL) * 100) + "%";
  bar.querySelector(".label").textContent = signed
    ? "Training complete"
    : (doneCount + " of " + TOTAL + " videos complete");
}

document.addEventListener("DOMContentLoaded", renderProgress);

function setupSignoff() {
  if (guardSignoff()) return;
  const form = document.getElementById("f");
  if (!form) return;
  form.action = FORMSPREE_URL;
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  if (form.date && !form.date.value) {
    form.date.value = now.getFullYear() + "-" + month + "-" + day;
  }
}

// Send the form to Formspree. Remember success only when the response is OK,
// then open the completion page. A network or server error leaves progress unsigned.
document.addEventListener("submit", async function (event) {
  if (event.target.id !== "f") return;
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Sending...";
  try {
    if (!/^https?:\/\//i.test(String(FORMSPREE_URL || ""))) throw new Error("missing endpoint");
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("form failed");
    sessionStorage.setItem(storageKey("signoff_done"), "1");
    location.href = "done.html";
  } catch (err) {
    button.disabled = false;
    button.textContent = "Submit sign-off";
    alert("Sorry, your sign-off didn't send. Check your internet connection and try again.");
  }
});
