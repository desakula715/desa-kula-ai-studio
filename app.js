/*
  Desa Kula AI Studio V3
  Frontend untuk backend Cloudflare Worker.
*/

const API_URL = "https://desa-kula-ai.bangziest.workers.dev/generate";

const $ = (id) => document.getElementById(id);

function esc(s = "") {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function render(data) {
  const plan = data.content_plan || {};
  const outline = Array.isArray(plan.outline)
    ? plan.outline
    : [];

  $("contentPlan").innerHTML = `
    <div class="card">
      <h3>Judul kerja</h3>
      <p>${esc(plan.judul_kerja || "")}</p>
    </div>

    <div class="card">
      <h3>Hook</h3>
      <p>${esc(plan.hook || "")}</p>
    </div>

    <div class="card">
      <h3>Pertanyaan utama</h3>
      <p>${esc(plan.pertanyaan_utama || "")}</p>
    </div>

    <div class="card">
      <h3>Angle</h3>
      <p>${esc(plan.angle || "")}</p>
    </div>

    <div class="card">
      <h3>Outline</h3>
      <p>
        ${outline.map((x, i) =>
          `${String(i + 1).padStart(2, "0")}. ${esc(x)}`
        ).join("<br>")}
      </p>
    </div>
  `;

  const script = data.script || "";

  $("scriptText").textContent = script;

  const words = script.trim()
    ? script.trim().split(/\s+/).length
    : 0;

  $("wordCount").textContent =
    `${words.toLocaleString("id-ID")} kata`;

  const scenes = Array.isArray(data.storyboard)
    ? data.storyboard
    : [];

  $("storyboard").innerHTML = scenes.map((s, i) => `
    <div class="scene">

      <div class="scene-num">
        ${esc(
          s.scene ||
          String(i + 1).padStart(2, "0")
        )}
      </div>

      <div>
        <b>Scene ${i + 1}</b>

        <small>
          <strong>Durasi:</strong><br>
          ${esc(s.duration || "")}
        </small>

        <small>
          <strong>Voice Over:</strong><br>
          ${esc(s.voice_over || "")}
        </small>
      </div>

      <div class="scene-visual">

        <b>VISUAL</b><br>
        ${esc(s.visual || "")}

        <br><br>

        <b>ON-SCREEN</b><br>
        ${esc(s.on_screen || "")}

        <br><br>

        <b>FOOTAGE TYPE</b><br>
        ${esc(s.footage_type || "")}

        <br><br>

        <b>AI VISUAL PROMPT</b><br>
        ${esc(s.ai_visual_prompt || "")}

      </div>

    </div>
  `).join("");

  const yt = data.youtube_package || {};

  const titles = Array.isArray(yt.titles)
    ? yt.titles
    : [];

  const tags = Array.isArray(yt.tags)
    ? yt.tags
    : [];

  $("youtubePack").innerHTML = `

    <div class="card">
      <h3>Alternatif judul</h3>
      <p>
        ${titles.map((x, i) =>
          `${i + 1}. ${esc(x)}`
        ).join("<br>")}
      </p>
    </div>

    <div class="card">
      <h3>Deskripsi</h3>
      <p>
        ${esc(yt.description || "")}
      </p>
    </div>

    <div class="card">
      <h3>Thumbnail text</h3>
      <p>
        ${esc(yt.thumbnail_text || "")}
      </p>
    </div>

    <div class="card">
      <h3>Tag</h3>
      <p>
        ${tags.map(x =>
          `<span class="tag">${esc(x)}</span>`
        ).join(" ")}
      </p>
    </div>

  `;
}


$("generateBtn").addEventListener(
  "click",
  async () => {

    const topic = $("topic").value.trim();

    if (!topic) {
      $("topic").focus();
      $("status").textContent =
        "Masukkan topik";
      return;
    }

    const payload = {
      topic,
      category: $("category").value,
      duration: Number($("duration").value),
      style: $("style").value
    };

    $("generateBtn").disabled = true;

    $("status").textContent =
      "AI sedang menulis...";

    $("result").classList.remove("hidden");

    $("contentPlan").innerHTML = `
      <div class="card">
        <p>
          AI sedang menyusun content plan,
          naskah 10+ menit, storyboard,
          dan paket YouTube. Mohon tunggu...
        </p>
      </div>
    `;

    $("scriptText").textContent = "";

    $("storyboard").innerHTML = "";

    $("youtubePack").innerHTML = "";


    try {

      const res = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)

      });


      const raw = await res.text();

      let data;


      try {

        data = JSON.parse(raw);

      } catch {

        throw new Error(
          raw ||
          "Respons backend tidak valid."
        );

      }


      if (!res.ok) {

        throw new Error(
          data.error ||
          "Backend AI gagal."
        );

      }


      render(data);

      $("status").textContent =
        "Selesai";

      window.currentData = data;


      window.scrollTo({

        top:
          $("result").offsetTop - 15,

        behavior:
          "smooth"

      });


    } catch (err) {

      $("status").textContent =
        "Gagal";

      $("contentPlan").innerHTML = `
        <div class="error">

          <b>
            Gagal membuat konten.
          </b>

          <br>

          ${esc(err.message)}

        </div>
      `;

    } finally {

      $("generateBtn").disabled =
        false;

    }

  }
);


$("copyBtn").addEventListener(
  "click",
  async () => {

    const d = window.currentData;

    if (!d) return;


    const plan =
      d.content_plan || {};

    const yt =
      d.youtube_package || {};


    const text = [

      "DESA KULA AI STUDIO",

      plan.judul_kerja || "",

      "",

      "HOOK",

      plan.hook || "",

      "",

      "PERTANYAAN UTAMA",

      plan.pertanyaan_utama || "",

      "",

      "ANGLE",

      plan.angle || "",

      "",

      "OUTLINE",

      ...(plan.outline || []).map(
        (x, i) =>
          `${i + 1}. ${x}`
      ),

      "",

      "NASKAH",

      d.script || "",

      "",

      "ALTERNATIF JUDUL",

      ...(yt.titles || []).map(
        (x, i) =>
          `${i + 1}. ${x}`
      ),

      "",

      "DESKRIPSI",

      yt.description || "",

      "",

      "THUMBNAIL TEXT",

      yt.thumbnail_text || "",

      "",

      "TAGS",

      (yt.tags || []).join(", ")

    ].join("\n");


    try {

      await navigator.clipboard
        .writeText(text);

      $("copyBtn").textContent =
        "Tersalin ✓";


      setTimeout(() => {

        $("copyBtn").textContent =
          "Salin";

      }, 1500);


    } catch {

      alert(text);

    }

  }
);
