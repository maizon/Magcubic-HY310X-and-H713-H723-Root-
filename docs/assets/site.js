"use strict";
const REPO = "https://github.com/maizon/Magcubic-HY310X-and-H713-H723-Root-";
const familyData = {
  hy310x: {name:"HY310X · unidade pesquisada",detail:"H713 / tv303 confirmado por logs reais · root Magisk 30.7 relatado funcional após reboot. Firmware Projector.20251013.1058.",status:"CASO RELATADO · H713"},
  h713: {name:"Outros dispositivos H713",detail:"NT30, HY310/L018 e HY300 Pro+ possuem pesquisas próprias. Hardware parecido não é firmware intercambiável; confira fontes e revisão de placa.",status:"TERCEIROS · RESULTADOS ESPECÍFICOS"},
  h723: {name:"H723 · compatibilidade não demonstrada",detail:"Nenhum H723 foi testado neste laboratório. O firmware, o bootloader e o procedimento de recuperação não devem ser herdados automaticamente do H713.",status:"NÃO TESTADO"}
};
const partitions = [
 ["Reserve0_a",16,"Privada"],["Reserve0_b",16,"Privada"],["boot_a",64,"Boot"],["boot_b",64,"Boot"],
 ["bootloader_b",32,"Boot"],["dtbo_a",2,"Boot"],["dtbo_b",2,"Boot"],["empty",15,"Reservada"],
 ["env_a",0.25,"Privada"],["env_b",0.25,"Privada"],["metadata",16,"Privada"],["misc",16,"Privada"],["private",16,"Privada"],
 ["vbmeta_a",0.125,"Boot"],["vbmeta_b",0.125,"Boot"],["vbmeta_system_a",0.0625,"Boot"],["vbmeta_system_b",0.0625,"Boot"],
 ["vbmeta_vendor_a",0.0625,"Boot"],["vbmeta_vendor_b",0.0625,"Boot"],["vendor_boot_a",32,"Boot"],["vendor_boot_b",32,"Boot"]
];
const known = {
  "boot_a.img":"1b7b7e4f7d4b198d7fe6f51e31b424f19e12b11920e45351f0d19b8bbd5909b7",
  "boot_b.img":"1adaec29f597390af71872976ba09ee07ffb2b2afb8ae90bd521b88580c82b2a",
  "vendor_boot_a.img":"db6ce05e1004df519face482ac89109235f64d0aab3e48aad9c773ad37248c89",
  "vendor_boot_b.img":"81c05bc1f75c56de4a2b7da0239999bd252a4fc364e65448e68cd9c4835f735f",
  "dtbo_a.img":"62eaa10a38aaaedfda3d6579926f1217f4488bd289c50bcaec8a630f6628881a",
  "dtbo_b.img":"c7f01e315cd8cf20f0df4b3b5f80ce765c6890f53935735c2447134fb0ac9be1"
};
const familyPanel = document.getElementById("family-info");
function renderFamily(family) {
  const data = familyData[family];
  familyPanel.replaceChildren();
  const div = document.createElement("div"), h=document.createElement("strong"), p=document.createElement("p"), pill=document.createElement("span");
  h.textContent=data.name;p.textContent=data.detail;pill.textContent=data.status;
  div.append(h,p); familyPanel.append(div,pill);
  document.querySelectorAll(".tab").forEach(b=>{const active=b.dataset.family===family;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active));});
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>renderFamily(b.dataset.family)));
renderFamily("hy310x");
let category="all";
const partBody=document.getElementById("partition-rows"), count=document.getElementById("table-count"), search=document.getElementById("search");
function fmtSize(n){return n>=1 ? n+" MiB" : Math.round(n*1024)+" KiB";}
function renderParts() {
  const q=search.value.trim().toLowerCase();
  const filtered=partitions.filter(p=>(category==="all"|| (category==="boot"?p[2]==="Boot":p[2]==="Privada")) && p[0].toLowerCase().includes(q));
  partBody.replaceChildren();
  for (const p of filtered){
    const tr=document.createElement("tr");
    const cells=[p[0]+".img",fmtSize(p[1]),p[2],"✓ Validado"];
    cells.forEach((value,i)=>{const td=document.createElement("td");td.textContent=value;if(i===2&&p[2]==="Privada")td.classList.add("sensitive");if(i===3)td.classList.add("status-ok");tr.append(td);});
    partBody.append(tr);
  }
  count.textContent=filtered.length+" de 21 imagens listadas · "+partitions.length+" validadas no arquivo pessoal do proprietário";
}
search.addEventListener("input",renderParts);
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderParts();}));
renderParts();
let toastTimer;
function toast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),3200);}
document.querySelectorAll(".copy").forEach(b=>b.addEventListener("click",async()=>{const el=document.getElementById(b.dataset.copy);try{await navigator.clipboard.writeText(el.textContent);toast("Comando copiado — somente leitura.");}catch(_){toast("Não foi possível copiar; selecione o texto manualmente.");}}));
const themeButton=document.getElementById("theme");
const savedTheme=localStorage.getItem("maizon-theme");
if(savedTheme==="light")document.body.classList.add("light");
themeButton.textContent=document.body.classList.contains("light")?"☀":"☾";
themeButton.addEventListener("click",()=>{document.body.classList.toggle("light");const light=document.body.classList.contains("light");localStorage.setItem("maizon-theme",light?"light":"dark");themeButton.textContent=light?"☀":"☾";});
document.getElementById("hash-button").addEventListener("click",async()=>{
  const chosen=document.getElementById("hash-file").files?.[0],out=document.getElementById("hash-output");
  if(!chosen){out.textContent="Escolha um arquivo antes de calcular.";return;}
  if(chosen.size>128*1024*1024){out.textContent="Arquivo maior que 128 MiB: use a ferramenta Python offline.";return;}
  if(!globalThis.crypto?.subtle){out.textContent="WebCrypto exige HTTPS. Abra pelo GitHub Pages ou use Python offline.";return;}
  out.textContent="Calculando localmente…";
  try{
    const bytes=await chosen.arrayBuffer();
    const digest=await crypto.subtle.digest("SHA-256",bytes);
    const hash=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,"0")).join("");
    const expected=known[chosen.name];
    const comparison=expected?(expected===hash?" · ✓ corresponde à referência HY310X":" · ⚠ diferente da referência HY310X"):" · sem referência pública (arquivo privado ou diferente)";
    out.textContent="SHA-256: "+hash+comparison+". O arquivo permaneceu neste navegador.";
  }catch(e){out.textContent="Falha ao calcular hash; teste a ferramenta Python offline.";}
});
