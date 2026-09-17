const $ = (id) => document.getElementById(id);

function titleCase(text){
  return text.trim().replace(/\s+/g," ");
}

function makePlan(topic, category, duration, style){
  const t = titleCase(topic) || "Fenomena yang sedang berubah di desa";
  const minutes = Number(duration);
  const words = Math.round(minutes * 155);

  const hook = `Ada satu hal tentang desa yang sering kita lihat, tetapi jarang kita bedah lebih dalam: ${t.toLowerCase()}. Sebenarnya, apa yang sedang terjadi?`;
  const question = `Mengapa ${t.toLowerCase()} dan apa dampaknya bagi masyarakat desa?`;

  const outline = [
    ["01","Hook & fenomena","Buka dengan pertanyaan yang dekat dengan kehidupan penonton."],
    ["02","Mengapa topik ini penting","Bangun konteks tanpa langsung memberi kesimpulan."],
    ["03","Data & fakta","Masukkan data, regulasi, atau sumber yang relevan dan dapat diverifikasi."],
    ["04","Cerita manusia","Terjemahkan isu menjadi pengalaman warga, pelaku usaha, perangkat desa, atau keluarga."],
    ["05","Bedah penyebab","Uraikan faktor ekonomi, sosial, kebijakan, teknologi, atau kelembagaan yang relevan."],
    ["06","Dampak bagi desa","Tunjukkan siapa yang terdampak dan bagaimana mekanismenya."],
    ["07","Sudut pandang lain","Tampilkan penjelasan alternatif atau keterbatasan agar pembahasan tidak satu sisi."],
    ["08","Apa yang bisa dipelajari","Tarik pelajaran berbasis fakta, bukan vonis."],
    ["09","Penutup reflektif","Akhiri dengan satu pertanyaan yang mengajak penonton berpikir."]
  ];

  const sceneCount = Math.max(18, Math.round(minutes * 3));
  const sceneTemplates = [
    ["Pembuka desa","Establishing shot suasana desa Indonesia, pagi hari, realistis-dokumenter.","Visual pembuka"],
    ["Tokoh manusia","Satu warga sebagai pusat cerita, ekspresi natural, tidak berlebihan.","Human interest"],
    ["Aktivitas","Aktivitas warga yang terkait langsung dengan topik.","Kehidupan nyata"],
    ["Data","Grafik sederhana dengan satu angka/fakta utama.","Data visual"],
    ["Dokumen","Ilustrasi dokumen/aturan/APB Desa yang relevan.","Explainer"],
    ["Kontras","Perbandingan dua kondisi yang membantu menjelaskan masalah.","Kontras"],
    ["Detail","Close-up objek: uang, hasil panen, ponsel, buku, jalan, pasar, dll.","B-roll"],
    ["Transisi","Kembali ke lanskap desa untuk memberi jeda narasi.","Jeda visual"]
  ];

  const scenes = Array.from({length:sceneCount}, (_,i)=>{
    const x = sceneTemplates[i % sceneTemplates.length];
    return {
      no:i+1,
      time:`Scene ${i+1}`,
      label:x[0],
      visual:`${x[1]} Gaya: ${style}.`,
      role:x[2]
    };
  });

  const paragraphs = [
    `Naskah ini dirancang untuk sekitar ${minutes} menit dengan target sekitar ${words.toLocaleString("id-ID")} kata.`, 
    `Topik utama: ${t}.`,
    `Kategori: ${category}.`,
    `Alur: fenomena → pertanyaan → konteks → data → cerita manusia → analisis → sudut pandang lain → pelajaran → penutup.`,
    `Catatan produksi: setiap klaim faktual tentang kebijakan, anggaran, regulasi, atau kondisi terkini harus diverifikasi dengan sumber primer/terpercaya sebelum video dipublikasikan.`
  ];

  return {t, hook, question, outline, scenes, paragraphs, minutes};
}

function renderPlan(plan){
  $("contentPlan").innerHTML = `
    <div class="card"><h3>Hook</h3><p>${plan.hook}</p></div>
    <div class="card"><h3>Pertanyaan Utama</h3><p>${plan.question}</p></div>
    <div class="card"><h3>Target Produksi</h3><p>${plan.minutes} menit minimum • ${Math.round(plan.minutes*155).toLocaleString("id-ID")} kata target • format documentary storytelling.</p></div>
    <div class="card"><h3>Outline</h3><p>${plan.outline.map(x=>`<b>${x[0]} ${x[1]}</b><br>${x[2]}<br>`).join("<br>")}</p></div>
    <div class="card"><h3>Catatan</h3><p>${plan.paragraphs.join("<br>")}</p></div>
  `;
  $("storyboard").innerHTML = plan.scenes.map(s=>`
    <div class="scene">
      <div class="scene-num">${String(s.no).padStart(2,"0")}</div>
      <div><b>${s.label}</b><small>${s.role}</small></div>
      <div class="scene-visual">${s.visual}</div>
    </div>`).join("");

  $("youtubePack").innerHTML = `
    <div class="card"><h3>Judul kerja</h3><p>${plan.t}</p></div>
    <div class="card"><h3>Alternatif judul</h3><p>
      Kenapa ${plan.t.toLowerCase()}?<br>
      Yang Sebenarnya Terjadi di Balik ${plan.t}<br>
      Cerita Desa: ${plan.t}
    </p></div>
    <div class="card"><h3>Deskripsi</h3><p>Video Desa Kula membahas ${plan.t.toLowerCase()} melalui storytelling, data, dan konteks kehidupan masyarakat desa.</p></div>
    <div class="card"><h3>Tag</h3><span class="tag">desa</span><span class="tag">desa indonesia</span><span class="tag">pemerintahan desa</span><span class="tag">ekonomi desa</span><span class="tag">Desa Kula</span></div>
  `;
}

$("generateBtn").addEventListener("click", ()=>{
  const topic = $("topic").value.trim();
  if(!topic){
    $("topic").focus();
    $("status").textContent = "Masukkan topik";
    return;
  }
  $("status").textContent = "Membuat...";
  setTimeout(()=>{
    const plan = makePlan(topic, $("category").value, $("duration").value, $("style").value);
    renderPlan(plan);
    $("result").classList.remove("hidden");
    $("status").textContent = "Selesai";
    window.scrollTo({top:$("result").offsetTop-15, behavior:"smooth"});
    window.currentPlan = plan;
  }, 450);
});

$("copyBtn").addEventListener("click", async ()=>{
  if(!window.currentPlan) return;
  const p = window.currentPlan;
  const text = [
    "DESA KULA AI STUDIO",
    `TOPIK: ${p.t}`,
    `HOOK: ${p.hook}`,
    `PERTANYAAN: ${p.question}`,
    `DURASI: ${p.minutes} menit`,
    "",
    "OUTLINE:",
    ...p.outline.map(x=>`${x[0]} ${x[1]} — ${x[2]}`)
  ].join("\n");
  try{
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent="Tersalin ✓";
    setTimeout(()=>$("copyBtn").textContent="Salin",1500);
  }catch(e){ alert(text); }
});
