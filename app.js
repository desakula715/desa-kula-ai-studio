/*
  Desa Kula AI Studio V2
  Set API_URL to your deployed backend URL.
  Example:
  const API_URL = "https://desa-kula-ai.YOUR-SUBDOMAIN.workers.dev/generate";
*/
const API_URL = "PASTE_BACKEND_URL_HERE";

const $ = (id) => document.getElementById(id);

function esc(s=""){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function render(data){
  const plan = data.content_plan || {};
  const outline = plan.outline || [];
  $("contentPlan").innerHTML = `
    <div class="card"><h3>Judul kerja</h3><p>${esc(plan.title)}</p></div>
    <div class="card"><h3>Hook</h3><p>${esc(plan.hook)}</p></div>
    <div class="card"><h3>Pertanyaan utama</h3><p>${esc(plan.main_question)}</p></div>
    <div class="card"><h3>Angle</h3><p>${esc(plan.angle)}</p></div>
    <div class="card"><h3>Outline</h3><p>${outline.map((x,i)=>`${String(i+1).padStart(2,"0")}. ${esc(x)}`).join("\n")}</p></div>
  `;

  const script = data.script || "";
  $("scriptText").textContent = script;
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;
  $("wordCount").textContent = `${words.toLocaleString("id-ID")} kata`;

  const scenes = data.storyboard || [];
  $("storyboard").innerHTML = scenes.map((s,i)=>`
    <div class="scene">
      <div class="scene-num">${String(i+1).padStart(2,"0")}</div>
      <div><b>${esc(s.title || `Scene ${i+1}`)}</b><small>${esc(s.narration || "")}</small></div>
      <div class="scene-visual"><b>VISUAL</b><br>${esc(s.visual_prompt || "")}<br><br><b>ON-SCREEN</b><br>${esc(s.on_screen_text || "-")}</div>
    </div>
  `).join("");

  const yt = data.youtube || {};
  $("youtubePack").innerHTML = `
    <div class="card"><h3>Alternatif judul</h3><p>${(yt.titles||[]).map((x,i)=>`${i+1}. ${esc(x)}`).join("\n")}</p></div>
    <div class="card"><h3>Deskripsi</h3><p>${esc(yt.description)}</p></div>
    <div class="card"><h3>Thumbnail text</h3><p>${esc(yt.thumbnail_text)}</p></div>
    <div class="card"><h3>Tag</h3><p>${(yt.tags||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</p></div>
  `;
}

$("generateBtn").addEventListener("click", async ()=>{
  const topic = $("topic").value.trim();
  if(!topic){ $("topic").focus(); $("status").textContent="Masukkan topik"; return; }
  if(API_URL === "PASTE_BACKEND_URL_HERE"){
    $("status").textContent="Backend belum dipasang";
    $("result").classList.remove("hidden");
    $("contentPlan").innerHTML = `<div class="error"><b>Backend AI belum terhubung.</b><br>Deploy backend terlebih dahulu, lalu masukkan URL-nya ke variabel <code>API_URL</code> di <code>app.js</code>.</div>`;
    return;
  }

  const payload = {
    topic,
    category: $("category").value,
    duration: Number($("duration").value),
    style: $("style").value
  };

  $("generateBtn").disabled = true;
  $("status").textContent = "AI sedang menulis...";
  $("result").classList.remove("hidden");
  $("contentPlan").innerHTML = `<div class="card"><p>AI sedang menyusun riset angle, struktur, naskah 10+ menit, storyboard, dan paket YouTube. Mohon tunggu...</p></div>`;
  $("scriptText").textContent = "";
  $("storyboard").innerHTML = "";
  $("youtubePack").innerHTML = "";

  try{
    const res = await fetch(API_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    const raw = await res.text();
    let data;
    try{ data = JSON.parse(raw); }catch{ throw new Error(raw || "Respons backend tidak valid."); }
    if(!res.ok) throw new Error(data.error || "Backend AI gagal.");
    render(data);
    $("status").textContent = "Selesai";
    window.currentData = data;
    window.scrollTo({top:$("result").offsetTop-15,behavior:"smooth"});
  }catch(err){
    $("status").textContent = "Gagal";
    $("contentPlan").innerHTML = `<div class="error"><b>Gagal membuat konten.</b><br>${esc(err.message)}</div>`;
  }finally{
    $("generateBtn").disabled = false;
  }
});

$("copyBtn").addEventListener("click", async ()=>{
  const d = window.currentData;
  if(!d) return;
  const text = [
    "DESA KULA AI STUDIO",
    d.content_plan?.title || "",
    "",
    "HOOK",
    d.content_plan?.hook || "",
    "",
    "NASKAH",
    d.script || ""
  ].join("\n");
  try{
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent="Tersalin ✓";
    setTimeout(()=>$("copyBtn").textContent="Salin",1500);
  }catch{ alert(text); }
});
