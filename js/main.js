(function() {
  "use strict";
  
  /* ── constants ─────────────────────────────────────────────────────────── */
  const VALID_IMG_EXT = /\.(jpg|jpeg|png)(\?[^\s]*)?$/i;
  const BLOCKED_DOMAINS = [
    "youtube","youtu.be","vimeo","dailymotion","twitch",
    "facebook","twitter","instagram","tiktok","reddit"
  ];

  /* ── URL validation ────────────────────────────────────────────────────── */
  function validateImageUrl(raw) {
    const url = (raw || "").trim();
    if (!url) return { ok: true };
    if (!VALID_IMG_EXT.test(url))
      return { ok: false, msg: "URL muss auf .jpg, .jpeg oder .png enden." };
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

  /* ── scan DOM for the two target fields and add blur validation ──────────
     Team-Info field: id="edit-foto"
     News field:      id="news-bildurl"
  ── ────────────────────────────────────────────────────────────────────── */
  function scanDOM() {
    // Handle edit-foto input (Team-Infos Bearbeiten)
    const editFotoInput = document.getElementById('edit-foto');
    if (editFotoInput && !editFotoInput.dataset.fcPatched) {
      editFotoInput.dataset.fcPatched = "1";
      editFotoInput.addEventListener("blur", () => {
        const res = validateImageUrl(editFotoInput.value);
        if (!res.ok) {
          showErr(editFotoInput, res.msg);
          editFotoInput.value = "";
        } else {
          clearErr(editFotoInput);
        }
      });
    }

    // Handle news-bildurl input (Neuigkeiten Posten)
    const newsBildInput = document.getElementById('news-bildurl');
    if (newsBildInput && !newsBildInput.dataset.fcPatched) {
      newsBildInput.dataset.fcPatched = "1";
      newsBildInput.addEventListener("blur", () => {
        const res = validateImageUrl(newsBildInput.value);
        if (!res.ok) {
          showErr(newsBildInput, res.msg);
          newsBildInput.value = "";
        } else {
          clearErr(newsBildInput);
        }
      });
    }
  }

  // Initial pass and retry passes
  document.addEventListener("DOMContentLoaded", scanDOM);
  [300, 800, 1500].forEach(t => setTimeout(scanDOM, t));

})();
