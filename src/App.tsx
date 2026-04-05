import React, { useState, useEffect } from "react";
const STATUSES = [
{ key: "intake", label: "Intake", short: "Intake", color: "#6b7280" },
{ key: "estimate", label: "Estimate", short: "Est.", color: "#3b82f6" },
{ key: "supplement", label: "Supplement", short: "Supp.", color: "#f97316" },
{ key: "approved", label: "Approved", short: "Apprvd", color: "#8b5cf6" },
{ key: "tear_down", label: "Tear-Down", short: "Tear", color: "#f97316" },
{ key: "body_work", label: "Body Work", short: "Body", color: "#eab308" },
{ key: "paint", label: "Paint", short: "Paint", color: "#ef4444" },
{ key: "reassembly", label: "Reassembly", short: "Reassm.", color: "#a855f7" },
{ key: "detail", label: "Detail", short: "Detail", color: "#06b6d4" },
{ key: "ready", label: "Ready", short: "Ready", color: "#10b981" },
{ key: "delivered", label: "Delivered", short: "Done", color: "#059669" },
{ key: "total_loss", label: "Total Loss", short: "T-Loss", color: "#dc2626" },
];
const ACTIVE_PIPELINE = STATUSES.filter(s => s.key !== "total_loss");
const TECHS = ["Mike R.", "Danny C.", "Lupe V.", "Sara T.", "Joe B.", "Unassigned"];
const PAY_TYPES = ["Insurance", "Cash", "Warranty", "Fleet"];
const SUPP_STATUSES = ["Pending", "Submitted", "Under Review", "Approved", "Denied", "Partial
const DEMO_JOBS = [
{ id:"J-1001", customer:"Amanda Reyes", phone:"555-2841", email:"amanda@email.com", vehicle
notes:{ damage:"Rear quarter panel & bumper damage from parking lot collision. Scrapes al
supplements:[{ id:"S-1", num:1, date:"2026-04-01", amount:620, status:"Approved", adjuste
},
{ id:"J-1002", customer:"Derek Thompson", phone:"555-7723", email:"dthompson@mail.com", veh
notes:{ damage:"Full frontal impact — hood buckled, front bumper assembly destroyed, driv
supplements:[
{ id:"S-1", num:1, date:"2026-03-28", amount:980, status:"Approved", adjuster:"Karen Mi
{ id:"S-2", num:2, date:"2026-04-02", amount:540, status:"Under Review", adjuster:"Kare
]
},
vehicl
{ id:"J-1003", customer:"Melissa Grant", phone:"555-3390", email:"mgrant@gmail.com", notes:{ damage:"Door ding driver side B-pillar area — sharp crease approx 3 inches. Scuff
supplements:[]
},
vehicl
{ id:"J-1004", customer:"Carlos Mendez", phone:"555-9134", email:"cmendez@work.net", notes:{ damage:"Hail damage across all exterior panels — hood, roof, trunk lid, all four
supplements:[
{ id:"S-1", num:1, date:"2026-03-24", amount:880, status:"Approved", adjuster:"Diana Sh
{ id:"S-2", num:2, date:"2026-03-27", amount:95, status:"Approved", adjuster:"Diana Sha
]
},
{ id:"J-1005", customer:"Bethany Walsh", phone:"555-6671", email:"bwalsh@email.com", vehicl
notes:{ damage:"Paint peel on roof panel — factory defect confirmed by Subaru dealer. Ful
supplements:[]
},
{ id:"J-1006", customer:"Frank O'Brien", phone:"555-2200", email:"fobrien@biz.com", vehicle
notes:{ damage:"Side swipe — passenger front door and rear door. Deep scrapes through cle
supplements:[]
},
{ id:"J-1007", customer:"Priya Nair", phone:"555-5518", email:"pnair@home.com", vehicle:"20
notes:{ damage:"Rear collision — bumper cover destroyed, rear foam absorber gone, trunk l
supplements:[
{ id:"S-1", num:1, date:"2026-04-03", amount:1100, status:"Submitted", adjuster:"Tom Gr
]
},
{ id:"J-1008", customer:"Tony Ferraro", phone:"555-8832", email:"tony.f@email.com", vehicle
notes:{ damage:"Minor front bumper scuff with paint transfer. Cracked fog light bezel — n
supplements:[]
},
{ id:"J-1009", customer:"Rachel Kim", phone:"555-4490", email:"rkim@email.com", vehicle:"20
notes:{ damage:"T-bone collision — full driver side structural damage. B-pillar collapsed
supplements:[]
},
];
function daysInShop(dateIn) {
if (!dateIn) return 0;
return Math.floor((new Date() - new Date(dateIn)) / 86400000);
}
function statusObj(key) { return STATUSES.find(s => s.key === key) || STATUSES[0]; }
function generateId(jobs) {
const nums = jobs.map(j => parseInt(j.id.replace("J-", ""))).filter(n => !isNaN(n));
return `J-${(nums.length ? Math.max(...nums) : 1000) + 1}`;
}
function genSuppId(supps) {
const nums = supps.map(s => parseInt(s.id.replace("S-", ""))).filter(n => !isNaN(n));
return `S-${(nums.length ? Math.max(...nums) : 0) + 1}`;
}
const EMPTY_NOTES = { damage:"", parts:"", supplements:"", customer:"", internal:"", instruct
const EMPTY_JOB = { customer:"", phone:"", email:"", vehicle:"", color:"", vin:"", status:"in
const EMPTY_SUPP = { num:"", date:new Date().toISOString().slice(0,10), amount:"", status:"Su
export default function App() {
const [jobs, setJobs] = useState([]);
const [loaded, setLoaded] = useState(false);
const [search, setSearch] = useState("");
const [filterStatus, setFilterStatus] = useState("all");
const [view, setView] = useState("board");
const [modal, setModal] = useState(null);
const [form, setForm] = useState(EMPTY_JOB);
const [editMode, setEditMode] = useState(false);
const [activeTab, setActiveTab] = useState("details");
const [suppForm, setSuppForm] = useState(null);
const [toast, setToast] = useState(null);
useEffect(() => {
async function load() {
try {
const res = await window.storage.get("autobody_v3");
setJobs(res?.value ? JSON.parse(res.value) : DEMO_JOBS);
} catch { setJobs(DEMO_JOBS); }
setLoaded(true);
}
load();
}, []);
useEffect(() => {
if (!loaded) return;
window.storage.set("autobody_v3", JSON.stringify(jobs)).catch(() => {});
}, [jobs, loaded]);
function showToast(msg, type = "success") {
setToast({ msg, type });
setTimeout(() => setToast(null), 3000);
}
function openJob(job) {
setForm(JSON.parse(JSON.stringify(job)));
setEditMode(false); setActiveTab("details"); setSuppForm(null); setModal(job.id);
}
function openAdd() {
setForm({ ...EMPTY_JOB, dateIn:new Date().toISOString().slice(0,10), notes:{...EMPTY_NOTE
setEditMode(true); setActiveTab("details"); setSuppForm(null); setModal("add");
}
};
function saveJob() {
if (!form.customer || !form.vehicle) return showToast("Customer & vehicle required", "err
if (modal === "add") {
const nj = { ...form, id:generateId(jobs), estimate:parseFloat(form.estimate)||0 setJobs(p => [nj, ...p]); showToast(`Job ${nj.id} created`);
} else {
setJobs(p => p.map(j => j.id===modal ? {...form,estimate:parseFloat(form.estimate)||0}
showToast("Job updated");
}
setEditMode(false);
if (modal === "add") setModal(null);
}
function deleteJob(id) {
if (!window.confirm("Delete this job?")) return;
setJobs(p => p.filter(j => j.id !== id)); setModal(null); showToast("Job deleted","error"
}
function advanceStatus(jobId) {
setJobs(p => p.map(j => {
if (j.id !== jobId || j.totalLoss) return j;
const idx = ACTIVE_PIPELINE.findIndex(s => s.key === j.status);
return { ...j, status: ACTIVE_PIPELINE[Math.min(idx+1, ACTIVE_PIPELINE.length-1)].key }
}));
showToast("Status advanced");
}
function toggleTotalLoss() {
const tl = !form.totalLoss;
const updated = { ...form, totalLoss:tl, status:tl?"total_loss":"intake" };
setForm(updated);
setJobs(p => p.map(j => j.id===modal ? updated : j));
showToast(tl ? "Marked as Total Loss" : "Total Loss removed", tl?"error":"success");
}
function saveSupp() {
if (!suppForm.description) return showToast("Description required","error");
const isNew = !suppForm.id;
const s = isNew
? { ...suppForm, id:genSuppId(form.supplements), num:form.supplements.length+1, amount:
: { ...suppForm, amount:parseFloat(suppForm.amount)||0 };
const upd = isNew ? [...form.supplements, s] : form.supplements.map(x => x.id===s.id?s:x)
setForm(f => ({...f, supplements:upd}));
setJobs(p => p.map(j => j.id===modal ? {...j,supplements:upd} : j));
setSuppForm(null); showToast(isNew?"Supplement added":"Supplement updated");
}
function deleteSupp(id) {
const upd = form.supplements.filter(s => s.id !== id);
setForm(f => ({...f, supplements:upd}));
setJobs(p => p.map(j => j.id===modal ? {...j,supplements:upd} : j));
setSuppForm(null); showToast("Supplement removed","error");
}
function saveNotes() {
setJobs(p => p.map(j => j.id===modal ? {...j,notes:form.notes} : j));
showToast("Notes saved");
}
const filtered = jobs.filter(j => {
if (j.archived) return false;
const q = search.toLowerCase();
const ms = !q || [j.customer,j.vehicle,j.id,j.claimNo,j.insurance,j.tech].some(v=>v?.toLo
const mst = filterStatus==="all" || (filterStatus==="total_loss"?j.totalLoss:j.status===f
return ms&&mst;
});
const activeJobs = jobs.filter(j => !["delivered","total_loss"].includes(j.status) && !j.to
const readyCount = jobs.filter(j => j.status==="ready" && !j.archived).length;
const tlCount = jobs.filter(j => j.totalLoss && !j.archived).length;
const setNote = (field, val) => setForm(f => ({...f, notes:{...f.notes,[field]:val}}));
function archiveJob(id) {
setJobs(p => p.map(j => j.id===id ? {...j, archived:true} : j));
setModal(null);
showToast("Job archived");
}
function unarchiveJob(id) {
setJobs(p => p.map(j => j.id===id ? {...j, archived:false} : j));
showToast("Job restored to active");
}
const NOTE_FIELDS = [
{ key:"damage", color:"#ef4444", label:"Damage Description", ph:"Describe all
{ key:"parts", color:"#f59e0b", label:"Parts & Orders", ph:"List all par
{ key:"supplements", color:"#8b5cf6", label:"Supplement Log", ph:"Document all
{ key:"customer", color:"#3b82f6", label:"Customer Communications", ph:"Log every cu
{ key:"internal", color:"#10b981", label:"Internal Shop Notes", ph:"Tech observa
{ key:"instructions", color:"#06b6d4", label:"Special Instructions", ph:"Customer pre
];
return (
<div style={{fontFamily:"'DM Mono',monospace",background:"#0d0f12",minHeight:"100vh",colo
<style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:#0d0f1
input,select,textarea{font-family:'DM Mono',monospace;}
.btn{border:none;border-radius:6px;cursor:pointer;font-family:'DM Mono',monospace;fon
.btn-amber{background:#f59e0b;color:#0d0f12;}.btn-amber:hover{background:#fbbf24;}
.btn-ghost{background:transparent;color:#9ca3af;border:1px solid #2d3340;}.btn-ghost:
.btn-danger{background:#1a0f0f;color:#ef4444;border:1px solid #7f1d1d55;}.btn-danger:
.btn-green{background:#06302288;color:#10b981;border:1px solid #10b98155;}.btn-green:
.btn-red{background:#3b000088;color:#ef4444;border:1px solid #dc262655;}.btn-red:hove
.btn-blue{background:#1e3a5f88;color:#3b82f6;border:1px solid #3b82f655;}.btn-blue:ho
.tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;letter-spa
input[type="text"],input[type="tel"],input[type="email"],input[type="number"],input[t
input:focus,select:focus,textarea:focus{border-color:#f59e0b;}
textarea{resize:vertical;line-height:1.7;}
label{display:block;font-size:9px;color:#4b5563;letter-spacing:.12em;text-transform:u
.overlay{position:fixed;inset:0;background:#000c;backdrop-filter:blur(5px);z-index:50
.modal{background:#111318;border:1px solid #1f2937;border-radius:12px;width:800px;max
.mtabs{display:flex;border-bottom:1px solid #1f2937;padding:0 24px;}
.mtab{padding:11px 18px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;c
.mtab.on{color:#f59e0b;border-bottom-color:#f59e0b;}.mtab:hover:not(.on){color:#6b728
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.stat-card{background:#111318;border:1px solid #1f2937;border-radius:8px;padding:17px
.stat-card:hover{border-color:#f59e0b22;}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.sc-a::before{background:#f59e0b;}.sc-g::before{background:#10b981;}.sc-b::before{bac
.job-card{background:#111318;border:1px solid #1f2937;border-radius:8px;padding:12px
.job-card:hover{border-color:#f59e0b44;transform:translateY(-1px);box-shadow:0 4px 18
.board-col{background:#0e1016;border:1px solid #181c24;border-radius:10px;min-width:1
.bcol-hdr{padding:10px 12px;border-bottom:1px solid #181c24;display:flex;align-items:
.pipe-seg{height:3px;flex:1;border-radius:2px;transition:background .3s;}
.sbar{background:#111318;border:1px solid #1f2937;border-radius:7px;padding:9px 13px;
.sbar:focus{border-color:#f59e0b;}
.fsel{background:#111318;border:1px solid #1f2937;border-radius:7px;padding:9px 11px;
.fsel:focus{border-color:#f59e0b;}
.vtab{padding:7px 15px;border-radius:6px;font-size:10px;cursor:pointer;letter-spacing
.vtab.on{background:#1f2937;border-color:#374151;color:#f59e0b;}.vtab.off{color:#3741
.lrow{display:grid;grid-template-columns:86px 1fr 140px 118px 95px 95px 64px 64px;bor
.lrow:hover{background:#13161c;}
.lc{padding:10px 12px;font-size:11px;}
.sc{background:#0d0f12;border:1px solid #1f2937;border-radius:8px;padding:14px .sc:hover{border-color:#8b5cf655;}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#1a1
@keyframes su{from{opacity:0;transform:translateX(-50%) translateY(8px);}to{opacity:1
.tl-banner{background:#160808;border:1px solid #7f1d1d44;border-radius:8px;padding:12
.hr{border:none;border-top:1px solid #1a1d23;margin:14px 0;}
.iv{font-size:12px;color:#e2e8f0;padding:7px 0;line-height:1.5;}
.iv.m{color:#4b5563;}
.nf{display:flex;flex-direction:column;gap:5px;}
.nl{font-size:9px;letter-spacing:.11em;text-transform:uppercase;display:flex;align-it
.nd{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
`}</style>
16px;m
{/* HEADER */}
<div style={{background:"#0d0f12",borderBottom:"1px solid #1f2937",padding:"0 22px",dis
<div style={{display:"flex",alignItems:"center",gap:11}}>
<div style={{width:29,height:29,background:"#f59e0b",borderRadius:7,display:"flex",
<div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:".12e
<div style={{fontSize:9,color:"#2d3340",letterSpacing:".15em"}}>AUTOBODY JOB MANA
</div>
</div>
<div style={{display:"flex",alignItems:"center",gap:9}}>
<div style={{fontSize:10,color:"#2d3340",letterSpacing:".04em"}}>{new Date().toLoca
<button className="btn btn-amber" onClick={openAdd}>+ NEW JOB</button>
</div>
</div>
<div style={{padding:"20px 22px",maxWidth:1700,margin:"0 auto"}}>
{/* STATS */}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:2
{[
{cls:"sc-a", label:"Active Jobs", val:activeJobs.length,
{cls:"sc-g", label:"Ready for Pickup", val:readyCount,
{cls:"sc-r", label:"Total Loss", val:tlCount,
{cls:"sc-p", label:"Archived", val:jobs.filter(j=>j.archived).length,
].map(c=>(
<div key={c.label} className={`stat-card ${c.cls}`}>
<div style={{fontFamily:"'Bebas Neue'",fontSize:9,letterSpacing:".2em",color:"#
<div style={{fontFamily:"'Bebas Neue'",fontSize:44,color:c.cls==="sc-a"?"#f59e0
<div style={{fontSize:9,color:"#2d3340",marginTop:3}}>{c.sub}</div>
</div>
))}
</div>
{/* PIPELINE FILTER */}
<div style={{background:"#111318",border:"1px solid #1f2937",borderRadius:8,padding:"
<div onClick={()=>setFilterStatus("all")} style={{display:"flex",alignItems:"center
<span style={{fontSize:9,color:filterStatus==="all"?"#e2e8f0":"#374151",letterSpa
<span style={{fontFamily:"'Bebas Neue'",fontSize:15,color:filterStatus==="all"?"#
</div>
{STATUSES.map(s=>{
const cnt = s.key==="total_loss"?jobs.filter(j=>j.totalLoss).length:jobs.filter(j
const on = filterStatus===s.key;
return (
<div key={s.key} onClick={()=>setFilterStatus(on?"all":s.key)} style={{display:
<div style={{width:6,height:6,borderRadius:"50%",background:s.color}}/>
<span style={{fontSize:9,color:on?s.color:"#374151",letterSpacing:".07em",tex
<span style={{fontFamily:"'Bebas Neue'",fontSize:15,color:on?s.color:"#1f2937
</div>
);
})}
</div>
insure
{/* CONTROLS */}
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"
<input className="sbar" placeholder="Search customer, vehicle, job #, claim, <div style={{marginLeft:"auto",display:"flex",gap:6}}>
<div className={`vtab ${view==="board"?"on":"off"}`} onClick={()=>setView("board"
<div className={`vtab ${view==="list"?"on":"off"}`} onClick={()=>setView("list")}
<div className={`vtab ${view==="archive"?"on":"off"}`} onClick={()=>setView("arch
</div>
</div>
{/* BOARD */}
{view==="board"&&(
<div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:14,alignItems:"fle
{STATUSES.filter(s=>filterStatus==="all"||s.key===filterStatus).map(s=>{
const cj = filtered.filter(j=>s.key==="total_loss"?j.totalLoss:j.status===s.key
return (
<div key={s.key} className="board-col" style={{width:filterStatus==="all"?195
<div className="bcol-hdr">
<div style={{display:"flex",alignItems:"center",gap:6}}>
<div style={{width:7,height:7,borderRadius:"50%",background:s.color}}/>
<span style={{fontSize:10,color:"#4b5563",letterSpacing:".07em",textTra
</div>
<span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:s.color}}>{cj.l
</div>
<div style={{padding:"8px",display:"flex",flexDirection:"column",gap:8,minH
{cj.map(j=><JobCard key={j.id} job={j} onClick={()=>openJob(j)} onAdvance
{cj.length===0&&<div style={{fontSize:9,color:"#1f2937",textAlign:"center
</div>
</div>
);
})}
</div>
)}
{/* LIST */}
{view==="list"&&(
<div style={{background:"#111318",border:"1px solid #1f2937",borderRadius:10,overfl
<div style={{display:"grid",gridTemplateColumns:"86px 1fr 140px 118px 95px 95px 6
{["JOB #","CUSTOMER / VEHICLE","TECH","STATUS","PAY TYPE","ESTIMATE","DAYS",""]
<div key={i} style={{padding:"9px 12px",fontSize:9,color:"#2d3340",letterSpac
))}
</div>
{filtered.map(j=>{
const s=statusObj(j.status); const days=daysInShop(j.dateIn); const dc=days>14?
const ps=(j.supplements||[]).filter(s=>["Pending","Submitted","Under Review"].i
return (
<div key={j.id} className="lrow" onClick={()=>openJob(j)}>
<div className="lc" style={{color:"#f59e0b",fontWeight:500}}>
<div>{j.id}</div>
{j.totalLoss&&<div style={{fontSize:8,color:"#dc2626",letterSpacing:".07e
{ps.length>0&&<div style={{fontSize:8,color:"#8b5cf6",letterSpacing:".07e
</div>
<div className="lc"><div style={{color:"#e2e8f0",marginBottom:2}}>{j.custom
<div className="lc" style={{color:"#4b5563",fontSize:10}}>{j.tech}</div>
<div className="lc"><span className="tag" style={{background:s.color+"1a",c
<div className="lc"><span className="tag" style={{background:j.payType==="I
<div className="lc" style={{color:"#e2e8f0"}}>{j.estimate?`$${Number(j.esti
<div className="lc"><span style={{color:dc}}>{days}d</span></div>
<div className="lc" onClick={e=>e.stopPropagation()} style={{display:"flex"
{j.status!=="delivered"&&!j.totalLoss&&<button className="btn btn-ghost"
<span title="Archive" onClick={()=>archiveJob(j.id)} style={{fontSize:14,
</div>
</div>
);
})}
</div>
{filtered.length===0&&<div style={{textAlign:"center",padding:36,color:"#1f2937",
)}
{/* ARCHIVE VIEW */}
{view==="archive"&&(
<div>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
<div style={{fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:".12em",color:
<span style={{fontSize:10,color:"#374151",background:"#1a1d23",border:"1px soli
</div>
<div style={{background:"#111318",border:"1px solid #1f2937",borderRadius:10,over
<div style={{display:"grid",gridTemplateColumns:"86px 1fr 118px 95px 64px 64px"
{["JOB #","CUSTOMER / VEHICLE","STATUS","PAY TYPE","DATE IN",""].map((h,i)=>(
<div key={i} style={{padding:"9px 12px",fontSize:9,color:"#2d3340",letterSp
))}
</div>
{jobs.filter(j=>j.archived).filter(j=>{
const q=search.toLowerCase();
return !q||[j.customer,j.vehicle,j.id,j.claimNo,j.insurance].some(v=>v?.toLow
}).map(j=>{
const s=statusObj(j.status);
return (
<div key={j.id} className="lrow" style={{gridTemplateColumns:"86px 1fr 118p
<div className="lc" style={{color:"#6b7280",fontWeight:500}}>
<div>{j.id}</div>
{j.totalLoss&&<div style={{fontSize:8,color:"#dc2626",letterSpacing:".0
</div>
<div className="lc"><div style={{color:"#9ca3af",marginBottom:2}}>{j.cust
<div className="lc"><span className="tag" style={{background:s.color+"18"
<div className="lc"><span className="tag" style={{background:"#1f293788",
<div className="lc" style={{color:"#374151",fontSize:10}}>{j.dateIn}</div
<div className="lc" onClick={e=>{e.stopPropagation();unarchiveJob(j.id);}
<button className="btn btn-ghost" style={{padding:"4px 9px",fontSize:9,
</div>
</div>
);
})}
{jobs.filter(j=>j.archived).length===0&&(
<div style={{textAlign:"center",padding:40,color:"#1f2937",fontSize:12}}>No a
)}
</div>
</div>
)}
</div>
{/* ══════ MODAL ══════ */}
{modal&&(
<div className="overlay" onClick={()=>{if(!editMode&&!suppForm)setModal(null);}}>
<div className="modal" onClick={e=>e.stopPropagation()}>
{/* Modal header */}
<div style={{padding:"18px 24px 0",borderBottom:"1px solid #1f2937"}}>
<div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-betwe
<div>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpaci
{form.totalLoss&&<span style={{fontSize:11,color:"#dc2626",background:"#1
</div>
</div>
<div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0,paddingTop
{modal!=="add"&&!editMode&&<>
{!form.totalLoss&&<button className="btn btn-ghost" onClick={()=>setEditM
<button className={`btn ${form.totalLoss?"btn-ghost":"btn-red"}`} onClick
<button className="btn" style={{background:"#0a1f0a",color:"#10b981",bord
<button className="btn btn-danger" onClick={()=>deleteJob(modal)}>✕ Del</
</>}
{(editMode||modal==="add")&&<>
<button className="btn btn-ghost" onClick={()=>modal==="add"?setModal(nul
<button className="btn btn-amber" onClick={saveJob}>Save</button>
</>}
{!editMode&&<button className="btn btn-ghost" style={{padding:"7px 10px"}}
</div>
</div>
{/* Pipeline bar */}
{!form.totalLoss&&(
<div style={{paddingBottom:0,marginTop:10}}>
<div style={{display:"flex",gap:2}}>
{ACTIVE_PIPELINE.map((s,i)=>{
const ci=ACTIVE_PIPELINE.findIndex(x=>x.key===form.status);
return <div key={s.key} className="pipe-seg" style={{background:i<=ci?s
})}
</div>
<div style={{display:"flex",justifyContent:"space-between",marginTop:4,marg
{ACTIVE_PIPELINE.map(s=>(
<div key={s.key} style={{flex:1,textAlign:"center",fontSize:8,color:for
onClick={()=>editMode&&setForm(f=>({...f,status:s.key}))}>{s.short}</
))}
</div>
</div>
)}
{/* Tabs */}
<div className="mtabs" style={{marginTop:6}}>
{[
{key:"details",label:"Job Details"},
{key:"supps",label:`Supplements${form.supplements?.length?` (${form.supplem
{key:"notes",label:"Notes"},
].map(t=>(
<div key={t.key} className={`mtab ${activeTab===t.key?"on":""}`} onClick={(
))}
</div>
</div>
{/* ── DETAILS TAB ── */}
{activeTab==="details"&&(
<div style={{padding:"18px 24px",display:"flex",flexDirection:"column",gap:14,m
<ScanPanel mode="estimate" form={form} setForm={setForm} setSuppForm={setSupp
{form.totalLoss&&(
<div className="tl-banner">
<span style={{fontSize:18}}>◆</span>
<div>
<div style={{fontSize:11,color:"#dc2626",fontWeight:500,letterSpacing:"
<div style={{fontSize:10,color:"#4b5563",marginTop:2}}>Repair pipeline
</div>
</div>
)}
<div>
<div style={{fontSize:9,color:"#f59e0b",letterSpacing:".15em",marginBottom:
<div className="g3">
<div><label>Name</label>{editMode?<input type="text" value={form.customer
<div><label>Phone</label>{editMode?<input type="tel" value={form.phone} o
<div><label>Email</label>{editMode?<input type="email" value={form.email}
</div>
</div>
<hr className="hr"/>
<div>
<div style={{fontSize:9,color:"#3b82f6",letterSpacing:".15em",marginBottom:
<div className="g3">
<div><label>Year / Make / Model</label>{editMode?<input type="text" value
<div><label>Color</label>{editMode?<input type="text" value={form.color}
<div><label>VIN</label>{editMode?<input type="text" value={form.vin} onCh
</div>
</div>
<hr className="hr"/>
<div>
<div style={{fontSize:9,color:"#10b981",letterSpacing:".15em",marginBottom:
<div className="g3">
<div><label>Technician</label>{editMode?<select value={form.tech} onChang
<div><label>Date In</label>{editMode?<input type="date" value={form.dateI
<div><label>Target Completion</label>{editMode?<input type="date" value={
</div>
</div>
<hr className="hr"/>
<div>
<div style={{fontSize:9,color:"#8b5cf6",letterSpacing:".15em",marginBottom:
<div className="g3">
<div><label>Pay Type</label>{editMode?<select value={form.payType} onChan
<div><label>Estimate ($)</label>{editMode?<input type="number" value={for
<div><label>Insurance Co.</label>{editMode?<input type="text" value={form
</div>
<div className="g3" style={{marginTop:11}}>
<div><label>Claim #</label>{editMode?<input type="text" value={form.claim
<div><label>Adjuster Name</label>{editMode?<input type="text" value={form
<div><label>Adjuster Phone</label>{editMode?<input type="tel" value={form
</div>
</div>
{modal!=="add"&&!editMode&&!form.totalLoss&&form.status!=="delivered"&&(
<button className="btn btn-green" style={{width:"100%",padding:"11px",fontS
onClick={()=>{advanceStatus(form.id);const idx=ACTIVE_PIPELINE.findIndex(
ADVANCE TO {(ACTIVE_PIPELINE[ACTIVE_PIPELINE.findIndex(s=>s.key===form.st
</button>
)}
</div>
)}
{/* ── NOTES TAB ── */}
{activeTab==="notes"&&(
<div style={{padding:"18px 24px",display:"flex",flexDirection:"column",gap:14,m
<div style={{fontSize:9,color:"#2d3340",letterSpacing:".08em",marginBottom:-4
{NOTE_FIELDS.map(n=>(
<div key={n.key} className="nf">
<div className="nl">
<div className="nd" style={{background:n.color}}/>
<span style={{color:n.color,fontWeight:500}}>{n.label}</span>
</div>
<textarea
rows={5}
value={form.notes?.[n.key]||""}
onChange={e=>setNote(n.key,e.target.value)}
placeholder={n.ph}
style={{borderColor:`${n.color}22`,minHeight:100}}
onFocus={e=>e.target.style.borderColor=n.color}
onBlur={e=>e.target.style.borderColor=`${n.color}22`}
/>
</div>
))}
</div>
<button className="btn btn-amber" style={{alignSelf:"flex-start",marginTop:4}
)}
{/* ── SUPPLEMENTS TAB ── */}
{activeTab==="supps"&&(
<div style={{padding:"18px 24px",maxHeight:"68vh",overflowY:"auto"}}>
<ScanPanel mode="supplement" form={form} setForm={setForm} setSuppForm={setSu
{form.supplements?.length>0&&(
<div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
{[
{label:"Total Submitted", val:`$${form.supplements.reduce((s,x)=>s+(par
{label:"Approved", val:`$${form.supplements.filter(s=>s.status==
{label:"Open", val:form.supplements.filter(s=>["Pending","Su
{label:"Denied", val:form.supplements.filter(s=>s.status==="De
].map(c=>(
<div key={c.label} style={{background:"#09090d",border:"1px solid #1f29
<div style={{fontSize:8,color:"#374151",letterSpacing:".12em",textTra
<div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:c.color}}>{c
</div>
))}
</div>
)}
{(form.supplements||[]).map(s=>{
const sc=s.status==="Approved"?"#10b981":s.status==="Denied"?"#ef4444":s.st
return (
<div key={s.id} className="sc" onClick={()=>setSuppForm({...s})}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontFamily:"'Bebas Neue'",fontSize:16,color:"#f59e0b"
<span style={{padding:"2px 8px",borderRadius:4,fontSize:9,letterSpa
</div>
<div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#e2e8f0"}}>
</div>
<div style={{fontSize:11,color:"#9ca3af",lineHeight:1.65,marginBottom:s
{s.response&&<div style={{fontSize:10,color:"#374151",borderTop:"1px so
<div style={{fontSize:9,color:"#2d3340",marginTop:8}}>{s.adjuster?`Adju
</div>
);
})}
{(!form.supplements||form.supplements.length===0)&&!suppForm&&(
<div style={{textAlign:"center",padding:"24px 0",color:"#1f2937",fontSize:1
)}
{suppForm&&(
<div style={{background:"#09090d",border:"1px solid #8b5cf644",borderRadius
<div style={{fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:".1em",c
<div className="g3" style={{marginBottom:12}}>
<div><label>Date Submitted</label><input type="date" value={suppForm.da
<div><label>Amount ($)</label><input type="number" value={suppForm.amou
<div><label>Status</label><select value={suppForm.status} onChange={e=>
</div>
<div style={{marginBottom:12}}>
<label>Adjuster Handling This Supplement</label>
<input type="text" value={suppForm.adjuster} onChange={e=>setSuppForm(f
</div>
<div className="nf" style={{marginBottom:12}}>
<div className="nl"><div className="nd" style={{background:"#8b5cf6"}}/
<textarea rows={5} value={suppForm.description} onChange={e=>setSuppFor
placeholder="Describe the hidden or additional damage found — which p
style={{borderColor:"#8b5cf622",minHeight:100}}
onFocus={e=>e.target.style.borderColor="#8b5cf6"} onBlur={e=>e.target
</div>
<div className="nf">
<div className="nl"><div className="nd" style={{background:"#10b981"}}/
<textarea rows={4} value={suppForm.response} onChange={e=>setSuppForm(f
placeholder="Log all adjuster communications here — date of response,
style={{borderColor:"#10b98122",minHeight:80}}
onFocus={e=>e.target.style.borderColor="#10b981"} onBlur={e=>e.target
</div>
<div style={{display:"flex",gap:8,marginTop:14}}>
<button className="btn btn-amber" onClick={saveSupp}>Save Supplement</b
<button className="btn btn-ghost" onClick={()=>setSuppForm(null)}>Cance
{suppForm.id&&<button className="btn btn-danger" style={{marginLeft:"au
</div>
</div>
)}
{!suppForm&&(
<button className="btn btn-blue" style={{marginTop:12}} onClick={()=>setSup
)}
</div>
)}
</div>
</div>
)}
{/* TOAST */}
{toast&&(
<div className="toast" style={{borderColor:toast.type==="error"?"#7f1d1d":"#1f2937",c
{toast.type==="error"?"✕ ":"✓ "}{toast.msg}
</div>
)}
</div>
);
}
// ─── AI SCAN PANEL ───────────────────────────────────────────────────────────
function ScanPanel({ mode, form, setForm, setSuppForm, showToast }) {
const [stage, setStage] = useState("idle"); // idle | preview | scanning | done
const [preview, setPreview] = useState(null);
const [fileData, setFileData] = useState(null);
const [fileMime, setFileMime] = useState("image/jpeg");
const [dragging, setDragging] = useState(false);
const [result, setResult] = useState(null);
const inputRef = React.useRef();
const isSupp = mode === "supplement";
function loadFile(file) {
if (!file || !file.type.startsWith("image/")) return showToast("Please upload an image fi
setFileMime(file.type);
const reader = new FileReader();
reader.onload = (ev) => {
setPreview(ev.target.result);
setFileData(ev.target.result.split(",")[1]);
setStage("preview");
setResult(null);
};
reader.readAsDataURL(file);
}
function onDrop(e) {
e.preventDefault(); setDragging(false);
loadFile(e.dataTransfer.files?.[0]);
}
photo.
async function runScan() {
if (!fileData) return;
setStage("scanning");
try {
const systemPrompt = isSupp
? `You are an autobody shop assistant reading an insurance supplement document date (submission date as YYYY-MM-DD, or "" if not found),
amount (supplement dollar total as a plain number no $ sign, or "" if not found),
adjuster (adjuster full name, or ""),
description (full detailed description of damage and reason for supplement — copy
response (any insurer response, approval notes, denial reason visible on the docum
Return ONLY the JSON. No markdown. No explanation. No backticks.`
: `You are an autobody shop assistant reading an insurance estimate or claim document
customer (full customer name, or ""),
phone (customer phone number, or ""),
vehicle (year make model as one string, or ""),
color (vehicle color, or ""),
vin (full VIN number, or ""),
insurance (insurance company name, or ""),
claimNo (claim or file number, or ""),
adjuster (adjuster full name, or ""),
adjusterPhone (adjuster phone number, or ""),
estimate (total repair amount as a plain number no $ sign, or ""),
notes_damage (all damage line items or description text visible — copy verbatim if
Return ONLY the JSON. No markdown. No explanation. No backticks.`;
const resp = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 1200,
system: systemPrompt,
messages: [{ role: "user", content: [
{ type: "image", source: { type: "base64", media_type: fileMime, data: fileData }
{ type: "text", text: isSupp ? "Read this supplement document and extract all dat
]}]
})
});
const data = await resp.json();
const raw = data.content?.map(c => c.text || "").join("").replace(/```json|```/g,"").tr
const parsed = JSON.parse(raw);
setResult(parsed);
setStage("done");
} catch(err) {
showToast("Scan failed — try a clearer photo", "error");
setStage("preview");
}
}
function applyResult() {
if (!result) return;
if (isSupp) {
const base = { num:"", date:new Date().toISOString().slice(0,10), amount:"", status:"Su
setSuppForm({ ...base,
date: result.date || base.date,
amount: result.amount || base.amount,
adjuster: result.adjuster || base.adjuster,
description: result.description || base.description,
response: result.response || base.response,
});
showToast("Supplement form filled ✓");
} else {
setForm(prev => ({
...prev,
customer: result.customer || prev.customer,
phone: result.phone || prev.phone,
vehicle: result.vehicle || prev.vehicle,
color: result.color || prev.color,
vin: result.vin || prev.vin,
insurance: result.insurance || prev.insurance,
claimNo: result.claimNo || prev.claimNo,
adjuster: result.adjuster || prev.adjuster,
adjusterPhone: result.adjusterPhone || prev.adjusterPhone,
estimate: result.estimate || prev.estimate,
notes: { ...prev.notes,
damage: result.notes_damage
? (prev.notes.damage ? prev.notes.damage + "\n\n[SCAN] " + result.notes_damage :
: prev.notes.damage,
}
}));
showToast("Job form filled from scan ✓");
}
reset();
}
function reset() { setStage("idle"); setPreview(null); setFileData(null); setResult(null);
const accentColor = isSupp ? "#8b5cf6" : "#f59e0b";
const label = isSupp ? "SUPPLEMENT DOCUMENT" : "ESTIMATE / CLAIM DOCUMENT";
return (
<div style={{marginBottom:4}}>
<style>{`
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.scan-drop{border:1.5px dashed ${accentColor}44;border-radius:10px;transition:all .18
.scan-drop.drag{border-color:${accentColor};background:${accentColor}0d;}
.scan-drop:hover{border-color:${accentColor}88;}
.field-row{display:flex;align-items:baseline;gap:8px;padding:5px 0;border-bottom:1px
.field-row:last-child{border-bottom:none;}
.field-key{font-size:9px;color:#4b5563;letter-spacing:.1em;text-transform:uppercase;m
.field-val{font-size:11px;color:#e2e8f0;line-height:1.5;}
.field-val.empty{color:#2d3340;font-style:italic;}
`}</style>
{/* ── IDLE: drop zone ── */}
{stage === "idle" && (
<div className={`scan-drop${dragging?" drag":""}`}
onDragOver={e=>{e.preventDefault();setDragging(true);}}
onDragLeave={()=>setDragging(false)}
onDrop={onDrop}
style={{padding:"18px 20px",display:"flex",alignItems:"center",gap:16,cursor:"point
onClick={()=>inputRef.current?.click()}
>
<input ref={inputRef} type="file" accept="image/*" capture="environment" style={{di
<div style={{width:44,height:44,borderRadius:10,background:`${accentColor}18`,borde
</div>
<div>
<div style={{fontSize:11,color:accentColor,fontWeight:500,letterSpacing:".06em",m
<div style={{fontSize:10,color:"#4b5563",lineHeight:1.5}}>
Tap to take a photo or upload an image — Claude will read the document and auto
</div>
<div style={{display:"flex",gap:8,marginTop:8}}>
<span style={{fontSize:9,color:"#2d3340",background:"#1a1d23",border:"1px solid
<span style={{fontSize:9,color:"#2d3340",background:"#1a1d23",border:"1px solid
<span style={{fontSize:9,color:"#2d3340",background:"#1a1d23",border:"1px solid
</div>
</div>
</div>
)}
{/* ── PREVIEW: image loaded, ready to scan ── */}
{(stage === "preview" || stage === "scanning") && (
<div style={{background:"#09090d",border:`1px solid ${accentColor}33`,borderRadius:10
<div style={{display:"flex",gap:0}}>
{/* Thumbnail */}
<div style={{width:120,flexShrink:0,background:"#0d0f12",display:"flex",alignItem
<img src={preview} alt="scan" style={{maxWidth:"100%",maxHeight:100,borderRadiu
</div>
{/* Actions */}
<div style={{flex:1,padding:"14px 16px",display:"flex",flexDirection:"column",jus
<div style={{fontSize:10,color:accentColor,fontWeight:500,letterSpacing:".08em"
<div style={{fontSize:10,color:"#4b5563"}}>Claude will read this image and extr
<div style={{display:"flex",gap:8,alignItems:"center"}}>
{stage === "preview" ? (
<>
<button className="btn btn-amber" style={{background:accentColor,color:"#
✦ Scan & Fill Form
</button>
<button className="btn btn-ghost" style={{fontSize:10}} onClick={()=>inpu
<button className="btn btn-ghost" style={{fontSize:10,padding:"7px 10px"}
</>
) : (
</div>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<span style={{fontSize:16,animation:"spin 1s linear infinite",display:"in
<span style={{fontSize:11,color:"#6b7280",animation:"pulse 1.5s ease infi
)}
</div>
</div>
</div>
</div>
<input ref={inputRef} type="file" accept="image/*" capture="environment" style={{di
)}
{/* ── DONE: show extracted fields ── */}
{stage === "done" && result && (
<div style={{background:"#09090d",border:`1px solid ${accentColor}55`,borderRadius:10
<div style={{padding:"12px 16px",background:`${accentColor}0d`,borderBottom:`1px so
<div style={{fontSize:11,color:accentColor,fontWeight:500,letterSpacing:".07em"}}
<div style={{display:"flex",gap:8}}>
<button className="btn" style={{background:accentColor,color:"#0d0f12",fontSize
<button className="btn btn-ghost" style={{fontSize:10}} onClick={reset}>✕ Disca
</div>
</div>
<div style={{display:"flex",gap:0}}>
<div style={{width:90,flexShrink:0,background:"#0d0f12",display:"flex",alignItems
<img src={preview} alt="scan" style={{maxWidth:"100%",maxHeight:80,borderRadius
</div>
<div style={{flex:1,padding:"10px 14px"}}>
{isSupp ? (
<>
{[
{k:"Date",v:result.date},{k:"Amount",v:result.amount?`$${Number(result.am
{k:"Description",v:result.description},{k:"Response",v:result.response},
].map(f=>(
<div key={f.k} className="field-row">
<span className="field-key">{f.k}</span>
<span className={`field-val${!f.v?" empty":""}`}>{f.v||"not found"}</sp
</div>
))}
</>
) : (
<>
{[
{k:"Customer",v:result.customer},{k:"Phone",v:result.phone},{k:"Vehicle",
{k:"Color",v:result.color},{k:"VIN",v:result.vin},{k:"Insurance",v:result
{k:"Claim #",v:result.claimNo},{k:"Adjuster",v:result.adjuster},{k:"Adj.
{k:"Estimate",v:result.estimate?`$${Number(result.estimate).toLocaleStrin
].map(f=>(
<div key={f.k} className="field-row">
<span className="field-key">{f.k}</span>
<span className={`field-val${!f.v?" empty":""}`}>{f.v||"not found"}</sp
</div>
))}
</>
)}
</div>
</div>
</div>
)}
</div>
);
}
function JobCard({job,onClick,onAdvance,onArchive}) {
const s = statusObj(job.status);
const days = daysInShop(job.dateIn);
const dc = days>14?"#ef4444":days>7?"#f59e0b":"#374151";
const ps = (job.supplements||[]).filter(s=>["Pending","Submitted","Under Review"].includes(
return (
<div className="job-card" onClick={onClick} style={{borderLeft:`3px solid ${job.totalLoss
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marg
<span style={{fontSize:10,color:"#f59e0b",letterSpacing:".07em",fontWeight:500}}>{job
<div style={{display:"flex",alignItems:"center",gap:5}}>
<span style={{fontSize:9,color:dc,background:dc+"14",padding:"1px 7px",borderRadius
<span title="Archive this job" onClick={e=>{e.stopPropagation();onArchive();}}
style={{fontSize:13,color:"#10b98166",cursor:"pointer",lineHeight:1,padding:"1px
onMouseEnter={e=>e.target.style.color="#10b981"} onMouseLeave={e=>e.target.style.
</div>
</div>
<div style={{fontSize:12,color:"#e2e8f0",marginBottom:2,fontWeight:500,lineHeight:1.3}}
<div style={{fontSize:9,color:"#374151",marginBottom:7}}>{job.vehicle}</div>
{job.totalLoss&&<div style={{fontSize:8,color:"#dc2626",background:"#1a080833",border:"
{ps.length>0&&<div style={{fontSize:8,color:"#8b5cf6",background:"#8b5cf611",border:"1p
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:9,color:"#374151"}}>{job.tech}</span>
{job.estimate>0&&<span style={{fontSize:10,color:"#6b7280"}}>${Number(job.estimate).t
</div>
{!job.totalLoss&&job.status!=="delivered"&&(
<div style={{marginTop:8}} onClick={e=>{e.stopPropagation();onAdvance();}}>
<button className="btn btn-ghost" style={{width:"100%",fontSize:9,padding:"4px"}}>→
</div>
)}
</div>
);
}
