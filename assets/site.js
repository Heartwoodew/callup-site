(function(){var i=document.getElementById('staff');if(!i)return;var m=function(n){return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(n)};
function u(){var s=Math.min(999,Math.max(0,Math.floor(Number(i.value)||0)));var t=20+5*s;document.getElementById('subtotal').textContent=m(t);document.getElementById('gst').textContent=m(t*.1);document.getElementById('total').textContent=m(t*1.1)}
i.addEventListener('input',u);i.addEventListener('change',function(){i.value=Math.min(999,Math.max(0,Math.floor(Number(i.value)||0)));u()});u()})();

(function(){
  var items=[].slice.call(document.querySelectorAll("[data-zoom]"));
  if(!items.length) return;
  var pop, back, openFor=null;

  function el(tag, cls, html){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(html!=null) n.innerHTML=html;
    return n;
  }
  function rootOf(item){
    return item.closest("figure, article") || item;
  }
  function ensure(){
    if(pop) return;
    back=el("button","zoom-back");
    back.type="button";
    back.setAttribute("aria-label","Close enlarged screenshot");
    back.addEventListener("click", function(){ close(true); });
    pop=el("div","zoom-pop");
    pop.setAttribute("role","dialog");
    pop.setAttribute("aria-modal","true");
    document.body.appendChild(back);
    document.body.appendChild(pop);
  }
  function fill(item){
    var title=item.getAttribute("data-zoom-title")||"";
    var root=rootOf(item);
    var deep=root.querySelector(".feat-deep");
    var imgs=[].slice.call(root.querySelectorAll(".frame img"));
    var desk=!!root.querySelector(".shot.desk, .shot.row-desk") || root.classList.contains("wide");
    var pair=imgs.length>1;
    pop.className="zoom-pop"+(desk?" is-desk":"")+(pair?" is-pair":"");
    pop.innerHTML="";
    var closeBtn=el("button","zoom-close","×");
    closeBtn.type="button";
    closeBtn.setAttribute("aria-label","Close");
    closeBtn.addEventListener("click", function(){ close(true); });
    var shots=el("div","zoom-shots"+(pair?" is-pair":""));
    imgs.forEach(function(img){
      var c=document.createElement("img");
      c.src=img.currentSrc||img.src;
      c.alt=img.alt||"";
      c.width=img.getAttribute("width")||img.naturalWidth||"";
      c.height=img.getAttribute("height")||img.naturalHeight||"";
      shots.appendChild(c);
    });
    var h=el("h3","", "");
    h.id="zoom-title";
    h.textContent=title.replace(/&amp;/g,"&");
    var p=el("p","zoom-text", "");
    p.id="zoom-text";
    p.textContent=deep?deep.textContent.trim():"";
    pop.setAttribute("aria-labelledby","zoom-title");
    pop.setAttribute("aria-describedby","zoom-text");
    pop.appendChild(closeBtn);
    pop.appendChild(shots);
    pop.appendChild(h);
    pop.appendChild(p);
  }
  function place(){
    pop.style.left="0px";
    pop.style.top="0px";
    var pw=pop.offsetWidth, ph=pop.offsetHeight, pad=12;
    var left=Math.round((window.innerWidth-pw)/2);
    var top=Math.round((window.innerHeight-ph)/2);
    left=Math.max(pad, Math.min(left, window.innerWidth-pw-pad));
    top=Math.max(pad, Math.min(top, window.innerHeight-ph-pad));
    pop.style.left=left+"px";
    pop.style.top=top+"px";
  }
  function setExpanded(item, on){
    items.forEach(function(el){ el.setAttribute("aria-expanded", el===item && on ? "true":"false"); });
  }
  function open(item){
    ensure();
    fill(item);
    openFor=item;
    pop.classList.add("on");
    back.classList.add("on");
    back.classList.add("clickable");
    setExpanded(item, true);
    place();
    requestAnimationFrame(function(){ if(openFor===item) place(); });
    var btn=pop.querySelector(".zoom-close");
    if(btn) btn.focus();
  }
  function close(fromAction){
    if(!openFor) return;
    var was=openFor;
    openFor=null;
    if(pop) pop.classList.remove("on");
    if(back){ back.classList.remove("on"); back.classList.remove("clickable"); }
    setExpanded(was, false);
    if(fromAction && was && typeof was.focus==="function") was.focus();
  }
  items.forEach(function(item){
    item.setAttribute("aria-haspopup","dialog");
    if(!item.hasAttribute("aria-expanded")) item.setAttribute("aria-expanded","false");
    item.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      if(openFor===item){ close(true); return; }
      open(item);
    });
  });
  document.addEventListener("keydown", function(e){ if(e.key==="Escape") close(true); });
  window.addEventListener("resize", function(){ if(openFor) place(); });
  window.addEventListener("scroll", function(){ if(openFor) place(); }, {passive:true});
})();
