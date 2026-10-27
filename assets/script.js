const state={lang:localStorage.getItem("portfolio-lang")||"fr"};
function nested(source,key){return key.split(".").reduce((value,part)=>value?.[part],source)}
function setLanguage(lang){state.lang=lang;localStorage.setItem("portfolio-lang",lang);document.documentElement.lang=lang;document.querySelectorAll("[data-fr][data-es]").forEach(el=>el.textContent=el.dataset[lang]);document.querySelectorAll("[data-fr-aria-label][data-es-aria-label]").forEach(el=>el.setAttribute("aria-label",el.dataset[`${lang}AriaLabel`]));document.querySelectorAll("[data-fr-alt][data-es-alt]").forEach(el=>el.setAttribute("alt",el.dataset[`${lang}Alt`]));const legacy=typeof translations!=="undefined"?translations:null;if(legacy?.[lang]){document.querySelectorAll("[data-i18n]").forEach(el=>{const value=nested(legacy[lang],el.dataset.i18n);if(typeof value==="string")el.textContent=value});document.querySelectorAll("[data-i18n-attr]").forEach(el=>el.dataset.i18nAttr.split(";").forEach(pair=>{const [attr,key]=pair.split(":");const value=nested(legacy[lang],key);if(value)el.setAttribute(attr,value)}))}document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===lang)));document.querySelectorAll(".cv-link").forEach(a=>{a.href=lang==="es"?(a.getAttribute("href")||"").replace("FR.pdf","ES.pdf"):(a.getAttribute("href")||"").replace("ES.pdf","FR.pdf")})}
document.addEventListener("DOMContentLoaded",()=>{setLanguage(state.lang);document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang)));document.querySelector(".menu-toggle")?.addEventListener("click",e=>{const open=document.querySelector("#main-nav").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",open)});document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".project-card").forEach(c=>{const item=c.closest(".project-card-link")||c;item.hidden=b.dataset.filter!=="all"&&!c.dataset.category.split(" ").includes(b.dataset.filter)})}));const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll(".reveal").forEach(el=>io.observe(el));const y=document.querySelector("#year");if(y)y.textContent=new Date().getFullYear()});
function normalizeProjectLabels(){document.querySelectorAll(".project-card .text-link").forEach(link=>link.textContent=state.lang==="fr"?"Voir le projet →":"Ver el proyecto →")}
document.addEventListener("DOMContentLoaded",()=>{normalizeProjectLabels();document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",normalizeProjectLabels))});
const PAGE_TITLES={
  "index.html":{fr:"Jonas Jungling — Développeur logiciel · IA & Automatisation",es:"Jonas Jungling — Desarrollador de software · IA y Automatización"},
  "projects.html":{fr:"Projets — Jonas Jungling",es:"Proyectos — Jonas Jungling"},
  "about.html":{fr:"À propos — Jonas Jungling",es:"Sobre mí — Jonas Jungling"}
};
function updatePageTitle(){const page=location.pathname.split("/").pop()||"index.html";const title=PAGE_TITLES[page];if(title)document.title=title[state.lang]}
document.addEventListener("DOMContentLoaded",()=>{updatePageTitle();document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",updatePageTitle))});
function initProjectShowcase(){
  const hero=document.querySelector(".hero"),showcase=document.querySelector("[data-project-showcase]");
  if(hero)requestAnimationFrame(()=>hero.classList.add("hero-ready"));
  if(!showcase)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer=matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lowMemory=typeof navigator.deviceMemory==="number"&&navigator.deviceMemory<4;
  if(reduced||!finePointer||lowMemory)return;
  const windows=[...showcase.querySelectorAll("[data-depth]")];
  let frame=0;
  const reset=()=>{
    showcase.style.setProperty("--showcase-rx","0deg");
    showcase.style.setProperty("--showcase-ry","0deg");
    windows.forEach(windowElement=>{
      windowElement.style.setProperty("--shift-x","0px");
      windowElement.style.setProperty("--shift-y","0px");
    });
  };
  showcase.addEventListener("pointermove",event=>{
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      const rect=showcase.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      showcase.style.setProperty("--showcase-rx",`${y*-1.4}deg`);
      showcase.style.setProperty("--showcase-ry",`${x*1.8}deg`);
      windows.forEach(windowElement=>{
        const depth=Number(windowElement.dataset.depth)||1;
        windowElement.style.setProperty("--shift-x",`${x*12*depth}px`);
        windowElement.style.setProperty("--shift-y",`${y*9*depth}px`);
      });
      frame=0;
    });
  },{passive:true});
  showcase.addEventListener("pointerleave",reset);
}
document.addEventListener("DOMContentLoaded",initProjectShowcase);
function initCinematicSections(){
  const elements=document.querySelectorAll(".section-head,.timeline li,.about-copy section,.contact-inner");
  if(!elements.length)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  elements.forEach((element,index)=>{element.classList.add("cinematic");element.style.setProperty("--cinematic-index",String(index%3))});
  if(reduced){elements.forEach(element=>element.classList.add("is-visible"));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -7% 0px"});
  elements.forEach(element=>observer.observe(element));
}
function initProjectDepth(){
  const fine=matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".project-card").forEach(card=>{
    card.closest(".project-card-link")?.addEventListener("click",()=>card.classList.add("is-leaving"));
    if(!fine||reduced)return;
    let frame=0;
    card.addEventListener("pointermove",event=>{
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        const rect=card.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
        card.style.setProperty("--card-ry",`${(x-.5)*4}deg`);
        card.style.setProperty("--card-rx",`${(.5-y)*3.2}deg`);
        card.style.setProperty("--spot-x",`${x*100}%`);
        card.style.setProperty("--spot-y",`${y*100}%`);
        frame=0;
      });
    },{passive:true});
    card.addEventListener("pointerleave",()=>{card.style.setProperty("--card-rx","0deg");card.style.setProperty("--card-ry","0deg")});
  });
}
document.addEventListener("DOMContentLoaded",()=>{initCinematicSections();initProjectDepth()});
function initAgentStory(){
  const section=document.querySelector(".agent-story-section"),visual=section?.querySelector(".story-visual"),steps=[...(section?.querySelectorAll(".story-step")||[])],markers=[...(section?.querySelectorAll(".story-rail i")||[])],count=section?.querySelector(".story-count");
  if(!section||!visual||!steps.length)return;
  const activate=index=>{
    steps.forEach((step,i)=>step.classList.toggle("active",i===index));
    markers.forEach((marker,i)=>marker.classList.toggle("is-active",i<=index));
    visual.style.setProperty("--story-progress",`${index*25}%`);
    visual.style.setProperty("--story-glow-y",`${12+index*18}%`);
    if(count)count.textContent=`${String(index+1).padStart(2,"0")} / 05`;
  };
  activate(0);
  steps.forEach((step,index)=>{step.addEventListener("focus",()=>activate(index));step.addEventListener("pointerenter",()=>activate(index))});
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)activate(Number(visible.target.dataset.storyStep));
  },{threshold:[.35,.55,.75],rootMargin:"-18% 0px -28% 0px"});
  steps.forEach(step=>observer.observe(step));
}
function initMagneticControls(){
  if(!matchMedia("(hover: hover) and (pointer: fine)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  document.querySelectorAll(".button,.run-button,.filter,.lang-switch button").forEach(control=>{
    control.addEventListener("pointermove",event=>{
      const rect=control.getBoundingClientRect();
      control.style.setProperty("--magnet-x",`${((event.clientX-rect.left)/rect.width-.5)*5}px`);
      control.style.setProperty("--magnet-y",`${((event.clientY-rect.top)/rect.height-.5)*4}px`);
    },{passive:true});
    control.addEventListener("pointerleave",()=>{control.style.setProperty("--magnet-x","0px");control.style.setProperty("--magnet-y","0px")});
  });
}
document.addEventListener("DOMContentLoaded",()=>{initAgentStory();initMagneticControls()});



