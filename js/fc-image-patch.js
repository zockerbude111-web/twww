(function() {
  "use strict";

  /* ── constants ─────────────────────────────────────────────────────────── */
  const VALID_IMG_EXT = /\.(jpg|jpeg|png|gif|webp)(\?[^\s]*)?$/i;
  const VALID_IMG_URL = /^https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)(\?[^\s]*)?$/i;
  const BLOCKED_DOMAINS = [
    "youtube","youtu.be","vimeo","dailymotion","twitch",
    "facebook","twitter","instagram","tiktok","reddit"
  ];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_MIME  = ["image/jpeg","image/png","image/gif","image/webp"];

  /* ── URL validation ────────────────────────────────────────────────────── */
  function validateImageUrl(raw) {
    const url = (raw || "").trim();
    if (!url) return { ok: true };
    if (!VALID_IMG_URL.test(url))
      return { ok: false, msg: "URL muss direkt auf .jpg, .jpeg, .png, .gif oder .webp enden." };
    if (BLOCKED_DOMAINS.some(d => url.toLowerCase().includes(d)))
      return { ok: false, msg: "Video- und Social-Media-Links sind nicht erlaubt." };
    return { ok: true };
  }

  /* ── error display helpers ─────────────────────────────────────────────── */
  function showErr(anchor, msg) {
    let el = anchor.parentNode.querySelector(".fc-img-err");
    if (!el) {
      el = document.createElement("p");
      el.className = "fc-img-err";
      el.style.cssText =
        "color:#d72638;font-size:11px;font-weight:700;margin:4px 0 0;line-height:1.3;";
      anchor.parentNode.appendChild(el);
    }
    el.textContent = msg;
  }
  function clearErr(anchor) {
    const el = anchor.parentNode.querySelector(".fc-img-err");
    if (el) el.remove();
  }

  /* ── simulate React onChange so state updates correctly ────────────────── */
  function triggerReactChange(input, value) {
    try {
      const nativeSet = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      ).set;
      nativeSet.call(input, value);
      ["input","change"].forEach(evt =>
        input.dispatchEvent(new Event(evt, { bubbles: true }))
      );
    } catch (_) {}
  }

  /* ── file upload UI builder ────────────────────────────────────────────── */
  function buildFileUploader(onDataUrl) {
    const wrap = document.createElement("div");
    wrap.className = "fc-file-upload";
    wrap.style.cssText = "margin-top:10px;";

    // drop-zone label
    const lbl = document.createElement("label");
    lbl.style.cssText =
      "display:inline-flex;align-items:center;gap:8px;cursor:pointer;" +
      "background:#f0f4ff;border:2px dashed #94a3b8;border-radius:12px;" +
      "padding:10px 18px;font-size:12px;font-weight:700;color:#142850;" +
      "transition:border-color .2s,background .2s;user-select:none;";
    lbl.innerHTML =
      "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' " +
      "stroke='currentColor' stroke-width='2.5' stroke-linecap='round'>" +
      "<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/>" +
      "<polyline points='17 8 12 3 7 8'/><line x1='12' y1='3' x2='12' y2='15'/></svg>" +
      " Lokale Datei wählen";

    lbl.addEventListener("mouseenter", () => {
      lbl.style.borderColor = "#d72638";
      lbl.style.background  = "#fee2e2";
    });
    lbl.addEventListener("mouseleave", () => {
      lbl.style.borderColor = "#94a3b8";
      lbl.style.background  = "#f0f4ff";
    });

    const fileInput = document.createElement("input");
    fileInput.type   = "file";
    fileInput.accept = "image/jpeg,image/png,image/gif,image/webp";
    fileInput.style.display = "none";
    lbl.appendChild(fileInput);

    // file-name + preview
    const info    = document.createElement("span");
    info.style.cssText = "font-size:11px;color:#64748b;margin-left:10px;";

    const preview = document.createElement("img");
    preview.alt   = "Vorschau";
    preview.style.cssText =
      "display:none;max-width:100%;max-height:130px;border-radius:10px;" +
      "margin-top:8px;object-fit:cover;border:2px solid #e2e8f0;";

    const hint = document.createElement("p");
    hint.style.cssText = "font-size:11px;color:#94a3b8;margin:6px 0 0;";
    hint.textContent   = "Max. 5 MB · JPG / PNG / GIF / WEBP";

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (!ALLOWED_MIME.includes(file.type)) {
        alert("Nur JPG, PNG, GIF und WEBP sind erlaubt.");
        fileInput.value = "";
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("Die Datei ist zu groß. Maximale Größe: 5 MB.");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        preview.src          = e.target.result;
        preview.style.display = "block";
        info.textContent     = file.name;
        onDataUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    wrap.appendChild(lbl);
    wrap.appendChild(info);
    wrap.appendChild(preview);
    wrap.appendChild(hint);
    return { wrap, fileInput, preview };
  }

  /* ── patch URL input: validation + file upload sibling ────────────────── */
  function patchUrlInput(urlInput) {
    if (urlInput.dataset.fcPatched) return;
    urlInput.dataset.fcPatched = "1";

    // Better placeholder
    urlInput.placeholder = "https://example.com/foto.jpg  (nur .jpg/.png/.gif/.webp)";

    // Validate on blur
    urlInput.addEventListener("blur", () => {
      const res = validateImageUrl(urlInput.value);
      if (!res.ok) {
        showErr(urlInput, res.msg);
        triggerReactChange(urlInput, "");
        urlInput.value = "";
      } else {
        clearErr(urlInput);
      }
    });

    // Validate on paste
    urlInput.addEventListener("paste", () => {
      setTimeout(() => {
        const res = validateImageUrl(urlInput.value);
        if (!res.ok) {
          showErr(urlInput, res.msg);
          triggerReactChange(urlInput, "");
          urlInput.value = "";
        } else {
          clearErr(urlInput);
        }
      }, 50);
    });

    // File uploader — feeds data-URL into React state via the URL input
    const { wrap } = buildFileUploader(dataUrl => {
      clearErr(urlInput);
      urlInput.value = "";              // clear text visually
      triggerReactChange(urlInput, dataUrl); // push into React state
    });

    urlInput.after(wrap);
  }

  /* ── scan DOM for the two target fields ──────────────────────────────────
     Team-Info field: label contains "Mannschaftsfoto"
     News field:      label contains "Bild-URL"
  ── ────────────────────────────────────────────────────────────────────── */
  const patched = new WeakSet();

  function scanDOM() {
    document.querySelectorAll("label").forEach(lbl => {
      const text = lbl.textContent || "";
      const isFoto = text.includes("Mannschaftsfoto");
      const isBild = text.includes("Bild-URL");
      if (!isFoto && !isBild) return;

      // Walk up to find the wrapping div that also contains the input
      let container = lbl.closest("div");
      if (!container) return;

      // The input may be a sibling div's child — search within a wider parent
      let input = container.querySelector("input");
      if (!input) {
        container = container.parentElement;
        if (!container) return;
        input = container.querySelector("input");
      }
      if (!input || patched.has(input)) return;
      patched.add(input);
      patchUrlInput(input);
    });
  }

  // MutationObserver keeps patching as React re-renders
  new MutationObserver(scanDOM).observe(document.body, {
    childList: true, subtree: true
  });

  // Initial passes
  document.addEventListener("DOMContentLoaded", scanDOM);
  [300, 800, 1500, 3000].forEach(t => setTimeout(scanDOM, t));

})();