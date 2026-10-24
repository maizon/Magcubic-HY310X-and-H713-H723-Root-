"use strict";
const expectedZip="04a7f6be27b9b80e93f572aaeca2b4ceca538cd63b893f6fd5d27271a9c60362";
const imgs=[
["boot_a","64 MiB","1b7b7e4f7d4b198d7fe6f51e31b424f19e12b11920e45351f0d19b8bbd5909b7"],
["boot_b","64 MiB","1adaec29f597390af71872976ba09ee07ffb2b2afb8ae90bd521b88580c82b2a"],
["vendor_boot_a","32 MiB","db6ce05e1004df519face482ac89109235f64d0aab3e48aad9c773ad37248c89"],
["vendor_boot_b","32 MiB","81c05bc1f75c56de4a2b7da0239999bd252a4fc364e65448e68cd9c4835f735f"],
["dtbo_a","2 MiB","62eaa10a38aaaedfda3d6579926f1217f4488bd289c50bcaec8a630f6628881a"],
["dtbo_b","2 MiB","c7f01e315cd8cf20f0df4b3b5f80ce765c6890f53935735c2447134fb0ac9be1"],
["vbmeta_a","128 KiB","6575d17eb9c6bc526676ce955c9fb8cc4327b6de83bce0002873016dc56a2868"],
["vbmeta_b","128 KiB","c09526875211fc64946ef75a3b6a5cc3217a377dfb40aac6fc3eab51c3cd95e7"],
["vbmeta_system_a","64 KiB","8e99caa8333c649a872a457c9421891ceea8e2103698d04cb57c8bbe09e23b41"],
["vbmeta_system_b","64 KiB","295a941dd1afd92c7c2ae578c51dc7ad8101a81daded3640d38432739acda1ca"],
["vbmeta_vendor_a","64 KiB","014e3563e6d28274776ac603ef215ef7417120aa8e5998766de6c059423b7eae"],
["vbmeta_vendor_b","64 KiB","b332e521240a160f00a98f845a3deed3362a7dc927121fedd54c4c64e2fd7d0e"]
];
const body=document.getElementById("recovery-table");
for(const [name,size,sha] of imgs){const tr=document.createElement("tr");[name+".img",size,sha.slice(0,16)+"…","Referência validada"].forEach((value,i)=>{const td=document.createElement("td");td.textContent=value;if(i===3)td.classList.add("status-ok");tr.append(td);});body.append(tr);}
document.getElementById("check").addEventListener("click",async()=>{
const file=document.getElementById("file").files[0],out=document.getElementById("result");
if(!file){out.textContent="Selecione o ZIP local.";return;}
if(file.size>100*1024*1024){out.textContent="Limite de 100 MiB neste navegador. Use sha256sum / Get-FileHash no PC.";return;}
if(!globalThis.crypto?.subtle){out.textContent="É necessário HTTPS. Use GitHub Pages ou verifique no PC.";return;}
out.textContent="Verificando localmente... Nenhum arquivo enviado.";
try {const h=await crypto.subtle.digest("SHA-256",await file.arrayBuffer());
const hash=Array.from(new Uint8Array(h),x=>x.toString(16).padStart(2,"0")).join("");
out.textContent="SHA-256: "+hash+(hash===expectedZip?" · ✓ ZIP de boot original corresponde ao pacote validado.":" · Sem correspondência com o pacote reduzido esperado. Pode ser um outro backup; compare com o manifesto correto.");
}catch(e){out.textContent="Falha ao calcular SHA-256. Use ferramenta offline no PC.";}
});

(async function discoverRecoveryRelease() {
 const status=document.getElementById("release-status");
 const statusField=document.getElementById("hosting-status");
 const filename="HY310X_H713_BOOT_Recovery_20251013.zip";
 const url="https://api.github.com/repos/maizon/Magcubic-HY310X-and-H713-H723-Root-/releases?per_page=20";
 try {
   const response=await fetch(url,{headers:{"Accept":"application/vnd.github+json"}});
   if(!response.ok)throw new Error("GitHub API "+response.status);
   const releases=await response.json();
   const assets=releases.filter(r=>!r.draft&&!r.prerelease).flatMap(r=>r.assets||[]);
   const asset=assets.find(a=>a.name===filename&&a.size===47074287);
   if(!asset){
     status.textContent="Ainda sem binário público em Releases. Use a referência SHA-256 e o ZIP privado do proprietário; não publique partições sensíveis.";
     return;
   }
   const a=document.createElement("a");
   a.className="primary small";a.textContent="Baixar ZIP de boot via GitHub Releases ↓";
   a.href=asset.browser_download_url;a.rel="noopener noreferrer";
   status.replaceChildren(document.createTextNode("Arquivo disponível no Release público (confira SHA-256 após baixar). "),a);
   statusField.textContent="Pacote reduzido disponibilizado em Releases";
   statusField.classList.remove("yellow");
 } catch(e){
   status.textContent="Não foi possível consultar Releases agora. O manifesto SHA-256 permanece disponível nesta página.";
 }
})();
