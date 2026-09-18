const API_URL = "https://desa-kula-ai.bangziest.workers.dev/generate";

const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

function list(items){
  if(!Array.isArray(items)) return "";
  return items.map(x => `<span class="pill">${esc(x)}</span>`).join("");
}

function render(data){
  $("result").classList.remove("hidden");
  const c = data.story_concept || {};
  const ch = data.character_bible || {};
  const s = data.story_bible || {};
  const y = data.youtube_package || {};

  $("concept").innerHTML = `
    <h3>Premis</h3><div class="result-block">${esc(c.premise)}</div>
    <h3>Hook</h3><div class="result-block">${esc(c.hook)}</div>
    <h3>Konflik Utama</h3><div class="result-block">${esc(c.main_conflict)}</div>
    <h3>Emosi</h3><div>${list(c.emotional_arc)}</div>
    <h3>Visual Style Bible</h3><div class="result-block">${esc(c.visual_style_bible)}</div>`;

  $("character").innerHTML = `
    <h3>Nama</h3><div>${esc(ch.name)}</div>
    <h3>Profil</h3><div class="result-block">${esc(ch.profile)}</div>
    <h3>Ciri Visual Konsisten</h3><div class="result-block">${esc(ch.visual_traits)}</div>
    <h3>Kepribadian</h3><div class="result-block">${esc(ch.personality)}</div>`;

  $("story").innerHTML = `
    <h3>Story Beats</h3><div>${list(s.story_beats)}</div>
    <h3>Alur</h3><div class="result-block">${esc(s.arc)}</div>
    <h3>Solusi / Refleksi</h3><div class="result-block">${esc(s.reflection)}</div>`;

  $("script").innerHTML = `
    <div class="meta">${esc(data.meta?.word_count || "")} kata • minimum ${esc(data.meta?.minimum_duration || "10 menit")}</div>
    <div class="result-block">${esc(data.script?.narration || "")}</div>`;

  const scenes = data.storyboard || [];
  $("storyboard").innerHTML = scenes.map(sc => `
    <div class="scene">
      <div class="scene-title">Scene ${esc(sc.scene)} — ${esc(sc.duration)}</div>
      <p><b>Story Beat:</b> ${esc(sc.story_beat)}</p>
      <p><b>Karakter:</b> ${esc(sc.character)}</p>
      <p><b>Emosi:</b> ${esc(sc.emotion)}</p>
      <p><b>Visual:</b> ${esc(sc.visual)}</p>
      <p><b>Kamera:</b> ${esc(sc.camera)}</p>
      <p><b>Narasi:</b> ${esc(sc.voice_over)}</p>
      <p><b>Kinetic Text:</b> ${esc(sc.on_screen)}</p>
      <p><b>AI Visual Prompt:</b> ${esc(sc.ai_visual_prompt)}</p>
      <p><b>Continuity:</b> ${esc(sc.continuity)}</p>
    </div>`).join("");

  $("youtube").innerHTML = `
    <h3>Judul</h3><div>${list(y.titles)}</div>
    <h3>Deskripsi</h3><div class="result-block">${esc(y.description)}</div>
    <h3>Thumbnail Text</h3><div>${esc(y.thumbnail_text)}</div>
    <h3>Tags</h3><div>${list(y.tags)}</div>
    <h3>Sumber / Verifikasi</h3><div class="result-block">${esc(y.source_note)}</div>`;
}

$("generateBtn").addEventListener("click", async () => {
  const topic = $("topic").value.trim();
  const sourceText = $("sourceText").value.trim();
  const direction = $("direction").value.trim();

  if(!topic && !sourceText){
    $("status").textContent = "Isi topik atau paste artikel/bahan cerita terlebih dahulu.";
    return;
  }

  const btn = $("generateBtn");
  btn.disabled = true;
  $("status").textContent = "AI sedang menyusun cerita, karakter, naskah, dan storyboard...";

  try{
    const res = await fetch(API_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        topic,
        source_text:sourceText,
        direction,
        category:$("category").value,
        style:$("style").value,
        character_mode:$("characterMode").value,
        duration:$("duration").value
      })
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Gagal menghubungi AI.");
    render(data);
    $("status").textContent = "Selesai. Story Engine berhasil membuat rancangan video.";
    window.scrollTo({top:document.getElementById("result").offsetTop-20,behavior:"smooth"});
  }catch(err){
    $("status").textContent = "Terjadi kesalahan: " + err.message;
  }finally{
    btn.disabled = false;
  }
});