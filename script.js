async function loadData(){
  const res=await fetch("data.json");
  if(!res.ok) throw new Error("Could not load data.json");
  return res.json();
}

function escapeHtml(v){
  return String(v).replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function makeProject(project){
  const card=document.createElement("article");
  card.className="project-card";
  const safeUrl=escapeHtml(project.video);
  card.innerHTML=`
    <div class="video-wrap">
      <iframe
        src="${safeUrl}"
        title="${escapeHtml(project.title)}"
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen></iframe>
    </div>
    <div class="project-body">
      <h3 class="project-title">${escapeHtml(project.title)}</h3>
      <p class="project-meta">${escapeHtml(project.meta)}</p>
      <a class="project-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
        Open ${escapeHtml(project.platform || "video")} ↗
      </a>
    </div>`;
  return card;
}

function makeService(service,index){
  const card=document.createElement("article");
  card.className="service";
  card.innerHTML=`
    <div class="service-number">0${index+1}</div>
    <h3>${escapeHtml(service.title)}</h3>
    <p>${escapeHtml(service.description)}</p>`;
  return card;
}

loadData().then(data=>{
  document.title=`${data.name} — ${data.headline}`;
  document.getElementById("brand").textContent=data.name;
  document.getElementById("footer-name").textContent=data.name;
  document.getElementById("location").textContent=data.location;
  document.getElementById("headline").textContent=data.headline;
  document.getElementById("description").textContent=data.description;
  document.getElementById("year").textContent=new Date().getFullYear();

  const projects=document.getElementById("projects");
  data.projects.forEach(p=>projects.appendChild(makeProject(p)));

  const bio=document.getElementById("bio");
  data.bio.forEach(t=>{
    const p=document.createElement("p");
    p.textContent=t;
    bio.appendChild(p);
  });

  const services=document.getElementById("services-grid");
  data.services.forEach((s,i)=>services.appendChild(makeService(s,i)));

  const contacts=document.getElementById("contact-links");
  const entries=[
    ["Email", data.contact.email ? `mailto:${data.contact.email}` : ""],
    ["Phone", data.contact.phone ? `tel:${data.contact.phone}` : ""],
    ["LinkedIn", data.contact.linkedin || ""],
    ["Instagram", data.contact.instagram || ""]
  ];
  entries.filter(x=>x[1]).forEach(([label,href])=>{
    const a=document.createElement("a");
    a.href=href;
    a.textContent=label;
    if(href.startsWith("http")){
      a.target="_blank";
      a.rel="noopener noreferrer";
    }
    contacts.appendChild(a);
  });
}).catch(err=>console.error(err));
