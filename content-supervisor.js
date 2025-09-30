(function () {
  if (window.__nexora_supervisor_video) return;
  window.__nexora_supervisor_video = true;

  // --- video element ---
  const video = document.createElement("video");
  video.src = chrome.runtime.getURL("assets/default-video.mp4");
  video.autoplay = true;
  video.controls = true;
  video.muted = false;
  Object.assign(video.style, {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "0px",
    position: "relative",
    top: "-3.8px",
    left: "-8px",
  });

  // --- wrapper ---
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position: "fixed",
    top: "calc(4rem - 6px)",
    left: "calc(6% + 1rem - 6px)",
    width: "calc(94% - 2rem)",
    height: "calc(100vh - 0rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    zIndex: 2147483647,
  });

  // --- card container (outer frame) ---
  const card = document.createElement("div");
  Object.assign(card.style, {
    margin: "auto",
    width: "clamp(1388px, 90%, 1588px)",
    height: "clamp(680px, 70%, 880px)",
    background: "var(--surface, #1e1e1e)",
    border: "2px solid rgba(253,253,253,0.9)",
    borderRadius: "8px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "row",
    pointerEvents: "auto",
  });

  // --- left pane (captions) ---
  const leftPane = document.createElement("div");
  Object.assign(leftPane.style, {
    flex: "2.6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "'Courier New', monospace",
    fontSize: "1.5rem",
    lineHeight: "2.2rem",
    padding: "2rem",
    textAlign: "left",
    whiteSpace: "pre-wrap",
  });

  // Create caption container
  const captionEl = document.createElement("div");
  leftPane.appendChild(captionEl);

  // --- vertical divider ---
  const divider = document.createElement("div");
  Object.assign(divider.style, {
    width: "1px",
    background: "rgba(255,255,255,0.15)",
    margin: "0 1rem",
  });

  // --- right pane (video) ---
  const rightPane = document.createElement("div");
  Object.assign(rightPane.style, {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  rightPane.appendChild(video);

  // --- assemble ---
  card.appendChild(leftPane);
  card.appendChild(divider);
  card.appendChild(rightPane);
  wrapper.appendChild(card);
  document.body.appendChild(wrapper);

  // --- caption text ---
  const captionText =
    "Improving focus is not about force, it's about clarity, cut distractions, set clear goals and work in fixed blocks, when your mind drifts, guide it back gently, practice daily, determination will grow strong";

  const words = captionText.split(" ");
  let index = 0;

  function showNextWord() {
    if (index < words.length) {
      captionEl.innerHTML += `<span style="opacity:0; display:inline-block; margin-right:6px; transition:opacity 0.5s;">${words[index]}</span>`;
      const span = captionEl.lastChild;
      requestAnimationFrame(() => {
        span.style.opacity = 1;
      });
      index++;
      setTimeout(showNextWord, 450); // adjust speed like human speech
    }
  }

  // Start showing captions
  showNextWord();

  // --- remove when video ends ---
  video.addEventListener("ended", () => wrapper.remove());
})();
