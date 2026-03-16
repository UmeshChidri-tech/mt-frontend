import { useState, useEffect } from "react";

/* ================================================================
   MT — Insurance Platform
   Design: ACKO-inspired — Clean, Bold, Modern, Trust-first
   Fonts:  Outfit (headings) + DM Sans (body)
   Colors: Electric Indigo #4F46E5 · Vivid Cyan #06B6D4 · Warm Amber #F59E0B
   Payments: Stripe
   ================================================================ */

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const T = {
  primary:"#4F46E5", primaryDk:"#3730A3", primaryLt:"#EEF2FF", primaryGlow:"#818CF820",
  accent:"#06B6D4", accentDk:"#0891B2", accentLt:"#ECFEFF",
  amber:"#F59E0B", amberLt:"#FFFBEB",
  success:"#10B981", successLt:"#D1FAE5",
  danger:"#EF4444", dangerLt:"#FEE2E2",
  ink:"#0F172A", slate:"#475569", mist:"#94A3B8",
  paper:"#F8FAFC", white:"#FFFFFF", border:"#E2E8F0",
};

const PRODUCTS = [
  { key:"car", emoji:"🚗", label:"Car Insurance",
    color:"#6366F1", bg:"#EEF2FF", dark:"#3730A3",
    tag:"Renew in 2 min", from:"₹2,094/yr",
    blurb:"Comprehensive cover with zero dep & engine protect",
    stats:["6,500+ Garages","Instant Claims","Zero Dep"] },
  { key:"health", emoji:"🏥", label:"Health Insurance",
    color:"#06B6D4", bg:"#ECFEFF", dark:"#0E7490",
    tag:"1 Cr cover available", from:"₹12,800/yr",
    blurb:"Cashless treatment at 13,000+ hospitals",
    stats:["13,000+ Hospitals","No Room Rent Cap","Day 1 Cover"] },
  { key:"life", emoji:"🛡️", label:"Term Life",
    color:"#8B5CF6", bg:"#F5F3FF", dark:"#5B21B6",
    tag:"₹1Cr @ ₹740/mo", from:"₹8,900/yr",
    blurb:"Secure your family's future with India's best term plans",
    stats:["99.1% Claim Ratio","Till Age 85","Tax Benefit 80C"] },
  { key:"travel", emoji:"✈️", label:"Travel Insurance",
    color:"#F59E0B", bg:"#FFFBEB", dark:"#92400E",
    tag:"150+ countries", from:"₹1,200/trip",
    blurb:"Medical emergencies, trip cancellations covered",
    stats:["$2L Medical","Trip Cancel","24×7 Support"] },
];

const INSURERS = {
  hdfc: { name:"HDFC Ergo",     abbr:"HE", claimR:"98.5%", color:"#1E40AF" },
  icici:{ name:"ICICI Lombard", abbr:"IL", claimR:"97.9%", color:"#EA580C" },
  bajaj:{ name:"Bajaj Allianz", abbr:"BA", claimR:"96.8%", color:"#1D4ED8" },
  tata: { name:"Tata AIG",      abbr:"TA", claimR:"99.1%", color:"#DC2626" },
  star: { name:"Star Health",   abbr:"SH", claimR:"95.4%", color:"#059669" },
  niva: { name:"Niva Bupa",     abbr:"NB", claimR:"97.2%", color:"#7C3AED" },
};

const PLANS = {
  car:[
    {id:"c1",insurer:"hdfc",name:"Comprehensive Plus",type:"Comprehensive",premium:8499,orig:10200,
     features:["Zero Depreciation","Engine Protection","Roadside Assistance","PA Cover ₹15L"],
     idv:"₹6,50,000",network:"6,500+ Garages",rating:4.5,popular:true},
    {id:"c2",insurer:"icici",name:"Motor Shield",type:"Comprehensive",premium:7899,orig:9500,
     features:["Zero Depreciation","24×7 Assistance","PA Cover ₹15L","Towing Cover"],
     idv:"₹6,50,000",network:"7,200+ Garages",rating:4.4,popular:false},
    {id:"c3",insurer:"tata",name:"AutoSecure Elite",type:"Comprehensive",premium:9299,orig:11000,
     features:["Zero Depreciation","Engine Protect","Consumables","Return to Invoice"],
     idv:"₹6,60,000",network:"5,800+ Garages",rating:4.6,popular:false},
    {id:"c4",insurer:"bajaj",name:"Drive Smart TP",type:"Third Party",premium:2094,orig:2094,
     features:["Third Party Liability","PA Cover ₹15L","Legal Liability","Compliance"],
     idv:"N/A",network:"Nationwide",rating:4.2,popular:false},
  ],
  health:[
    {id:"h1",insurer:"star",name:"Family Health Optima",type:"Family Floater",premium:18500,orig:22000,
     features:["Sum Insured ₹10L","No Room Rent Limit","Daycare Procedures","Pre-Post Hosp."],
     coverage:"₹10 Lakhs",network:"12,000+ Hospitals",rating:4.5,popular:true},
    {id:"h2",insurer:"niva",name:"ReAssure 2.0",type:"Individual",premium:12800,orig:15000,
     features:["Sum Insured ₹5L","Unlimited Restore","No Sub-Limits","AYUSH Cover"],
     coverage:"₹5 Lakhs",network:"10,000+ Hospitals",rating:4.4,popular:false},
    {id:"h3",insurer:"hdfc",name:"Optima Secure",type:"Family Floater",premium:24500,orig:28000,
     features:["Sum Insured ₹15L","Secure Benefit 2×","Mental Health","Home Care"],
     coverage:"₹15 Lakhs",network:"13,000+ Hospitals",rating:4.7,popular:false},
  ],
  life:[
    {id:"l1",insurer:"hdfc",name:"Click 2 Protect Super",type:"Term Life",premium:9800,orig:11500,
     features:["Cover ₹1 Crore","Till Age 85","Terminal Illness","Tax Benefit 80C"],
     sum:"₹1 Crore",term:"30 Years",rating:4.5,popular:true},
    {id:"l2",insurer:"icici",name:"iProtect Smart",type:"Term Life",premium:8900,orig:10800,
     features:["Cover ₹1 Crore","Till Age 85","Life Stage Benefit","Survival Payout"],
     sum:"₹1 Crore",term:"30 Years",rating:4.4,popular:false},
    {id:"l3",insurer:"tata",name:"Sampoorna Raksha",type:"Term Life",premium:10200,orig:12000,
     features:["Cover ₹1 Crore","Till Age 85","Return of Premium","Joint Life"],
     sum:"₹1 Crore",term:"30 Years",rating:4.6,popular:false},
  ],
  travel:[
    {id:"t1",insurer:"bajaj",name:"Travel Companion",type:"International",premium:1800,orig:2200,
     features:["Medical $1,00,000","Trip Cancellation","Baggage Loss","Passport Loss"],
     coverage:"$1,00,000",days:"15 Days",rating:4.3,popular:true},
    {id:"t2",insurer:"tata",name:"Travel Guard Elite",type:"International",premium:2100,orig:2500,
     features:["Medical $2,00,000","Emergency Evacuation","Personal Liability","24×7 Help"],
     coverage:"$2,00,000",days:"15 Days",rating:4.6,popular:false},
    {id:"t3",insurer:"icici",name:"Travel Shield",type:"Asia Pacific",premium:1200,orig:1500,
     features:["Medical $50,000","Trip Delay","Baggage Delay","Flight Cancel"],
     coverage:"$50,000",days:"15 Days",rating:4.2,popular:false},
  ],
};

const TESTIMONIALS = [
  {name:"Rahul Mehta",city:"Mumbai",product:"Car",rating:5,av:"RM",
   text:"Claim settled in 3 hours flat. Zero Depreciation was worth every rupee. MT made it effortless."},
  {name:"Priya Sharma",city:"Bengaluru",product:"Health",rating:5,av:"PS",
   text:"Saved ₹4,500 on my family floater. Cashless admission was seamless. Best platform in India."},
  {name:"Aditya Kumar",city:"Delhi",product:"Life",rating:5,av:"AK",
   text:"Policy issued in 15 minutes, no medical tests. The advisor walked me through every detail patiently."},
  {name:"Neha Joshi",city:"Pune",product:"Travel",rating:4,av:"NJ",
   text:"Medical emergency in Paris — claim approved remotely in 4 hours. Truly life-saving coverage."},
];

const FAQ_DATA = [
  {q:"Is MT IRDAI registered?",
   a:"Yes. MT is a licensed insurance web aggregator registered with IRDAI. We only partner with IRDAI-approved insurers."},
  {q:"How does free comparison work?",
   a:"We aggregate real-time quotes from 30+ insurer APIs, rank them by value, claim ratio, and network — no bias, no hidden promotions."},
  {q:"Is Stripe payment safe?",
   a:"All payments go through Stripe's PCI-DSS Level 1 compliant gateway with 256-bit TLS encryption. We never store card data. Policies are issued directly by the insurer."},
  {q:"What is the free-look period?",
   a:"All plans include a 15-day free-look period per IRDAI rules. Cancel within 15 days for a prorated refund."},
  {q:"How does MT earn?",
   a:"We earn a referral commission from insurers — this never changes the premium you see. Our comparison is always 100% neutral."},
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'DM Sans',sans-serif;background:#F8FAFC;color:#0F172A;-webkit-font-smoothing:antialiased}
  button,input,select,textarea{font-family:inherit}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
  .fadeUp{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both}
  .fadeUp2{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .08s both}
  .fadeUp3{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .16s both}
  .fadeUp4{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .24s both}
  .hover-lift{transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;cursor:pointer}
  .hover-lift:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(15,23,42,.1)!important}
  .btn-press{transition:all .15s cubic-bezier(.22,1,.36,1)}
  .btn-press:hover{transform:scale(1.02)}
  .btn-press:active{transform:scale(.97)}
  input:focus,select:focus{outline:none;border-color:#4F46E5!important;box-shadow:0 0 0 3px rgba(79,70,229,.12)!important}
  .ticker-wrap{overflow:hidden;white-space:nowrap}
  .ticker-inner{display:inline-flex;animation:ticker 35s linear infinite}
  @media(max-width:768px){
    .hide-mobile{display:none!important}
    .hero-grid{grid-template-columns:1fr!important}
    .footer-grid{grid-template-columns:1fr 1fr!important}
    .nav-links{display:none!important}
    .stats-row{grid-template-columns:1fr 1fr!important}
  }
`;

// ── TINY COMPONENTS ──────────────────────────────────────────────
const Stars = ({n=5}) => (
  <span style={{display:"flex",gap:2}}>
    {[1,2,3,4,5].map(i=>(
      <svg key={i} width="14" height="14" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={i<=Math.round(n)?"#F59E0B":"#E2E8F0"} stroke="none"/>
      </svg>
    ))}
  </span>
);

const Chip = ({children,color=T.primary,bg}) => (
  <span style={{display:"inline-flex",alignItems:"center",background:bg||color+"14",color,
    fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,
    letterSpacing:".06em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>
    {children}
  </span>
);

const Btn = ({children,onClick,variant="primary",size="md",full,disabled,style:sx={}}) => {
  const sz = {
    sm:{fontSize:13,padding:"10px 20px",borderRadius:12},
    md:{fontSize:15,padding:"14px 28px",borderRadius:14},
    lg:{fontSize:16,padding:"16px 36px",borderRadius:16}
  };
  const vr = {
    primary:{background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,color:"#fff",border:"none",boxShadow:`0 4px 20px ${T.primary}35`},
    accent:{background:`linear-gradient(135deg,${T.accent},${T.accentDk})`,color:"#fff",border:"none",boxShadow:`0 4px 20px ${T.accent}35`},
    outline:{background:"transparent",color:T.primary,border:`2px solid ${T.primary}`},
    ghost:{background:"transparent",color:T.slate,border:`1.5px solid ${T.border}`},
    white:{background:"#fff",color:T.primary,border:"none",boxShadow:"0 4px 24px rgba(0,0,0,.1)"},
    dark:{background:T.ink,color:"#fff",border:"none",boxShadow:"0 4px 24px rgba(15,23,42,.3)"},
  };
  return (
    <button className="btn-press" onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
        fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.55:1,
        fontFamily:"'Outfit',sans-serif",letterSpacing:"-.01em",
        ...(full?{width:"100%"}:{}), ...sz[size], ...vr[variant], ...sx}}>
      {children}
    </button>
  );
};

const InsurerBadge = ({id,size=48}) => {
  const ins=INSURERS[id]; if(!ins) return null;
  return (
    <div style={{width:size,height:size,borderRadius:14,background:`${ins.color}0C`,
      border:`1.5px solid ${ins.color}20`,display:"flex",alignItems:"center",
      justifyContent:"center",fontSize:size*.26,fontWeight:800,color:ins.color,
      fontFamily:"'Outfit',monospace",flexShrink:0}}>
      {ins.abbr}
    </div>
  );
};

const MTLogo = ({size=42,dark=false}) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <div style={{width:size,height:size,borderRadius:Math.round(size*.3),
      background:`linear-gradient(135deg,${T.primary},${T.accent})`,
      display:"flex",alignItems:"center",justifyContent:"center",
      boxShadow:`0 4px 20px ${T.primary}40`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 40%,rgba(255,255,255,.15))"}}/>
      <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:size*.45,
        color:"#fff",letterSpacing:"-1px",position:"relative",zIndex:1}}>MT</span>
    </div>
    <div style={{lineHeight:1}}>
      <div style={{fontWeight:900,fontSize:size*.45,color:dark?"#fff":T.ink,letterSpacing:"-1px",
        fontFamily:"'Outfit',sans-serif"}}>MT</div>
      <div style={{fontSize:Math.max(8,size*.2),color:dark?"rgba(255,255,255,.5)":T.mist,
        letterSpacing:".2em",textTransform:"uppercase",marginTop:1,fontWeight:500}}>Insurance</div>
    </div>
  </div>
);

// ── PLAN CARD ─────────────────────────────────────────────────────
const PlanCard = ({plan,product,onBuy,onCompare,isCompared}) => {
  const ins=INSURERS[plan.insurer];
  const prod=PRODUCTS.find(p=>p.key===product);
  const disc=plan.orig>plan.premium?Math.round((1-plan.premium/plan.orig)*100):0;
  return (
    <div className="hover-lift" style={{background:T.white,borderRadius:24,
      border:`1.5px solid ${isCompared?T.primary:T.border}`,overflow:"hidden",
      display:"flex",flexDirection:"column",
      boxShadow:plan.popular?`0 8px 40px ${prod.color}18`:"0 2px 16px rgba(0,0,0,.04)"}}>
      {plan.popular&&(
        <div style={{background:`linear-gradient(135deg,${prod.color},${prod.dark})`,color:"#fff",
          fontSize:11,fontWeight:700,textAlign:"center",padding:"7px",
          letterSpacing:".08em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>
          ⭐ Most Popular Choice
        </div>
      )}
      <div style={{padding:"24px 24px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <InsurerBadge id={plan.insurer}/>
            <div>
              <div style={{fontWeight:800,fontSize:15,color:T.ink,fontFamily:"'Outfit',sans-serif"}}>{ins.name}</div>
              <div style={{fontSize:12,color:T.mist,marginTop:2}}>{plan.name}</div>
              <div style={{marginTop:5,display:"flex",alignItems:"center",gap:5}}>
                <Stars n={plan.rating}/>
                <span style={{fontSize:11,color:T.slate}}>({plan.rating})</span>
              </div>
            </div>
          </div>
          <Chip color={prod.dark} bg={prod.bg}>{plan.type}</Chip>
        </div>
        <div style={{background:`linear-gradient(135deg,${prod.bg},${prod.bg}66)`,
          borderRadius:16,padding:"18px 20px",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{fontSize:32,fontWeight:900,color:T.ink,
              fontFamily:"'Outfit',sans-serif",letterSpacing:"-1.5px"}}>
              ₹{plan.premium.toLocaleString()}
            </span>
            <span style={{fontSize:13,color:T.mist,fontWeight:500}}>/year</span>
            {disc>0&&<span style={{fontSize:12,background:T.successLt,color:T.success,
              fontWeight:700,padding:"3px 10px",borderRadius:99,marginLeft:4}}>{disc}% off</span>}
          </div>
          {disc>0&&<div style={{fontSize:12,color:T.mist,marginTop:3,textDecoration:"line-through"}}>
            MRP ₹{plan.orig.toLocaleString()}/year</div>}
          <div style={{marginTop:10,fontSize:12,color:T.slate}}>
            Claim Ratio: <strong style={{color:T.success}}>{ins.claimR}</strong>
            {plan.network&&plan.network!=="Nationwide"&&plan.network!=="N/A"&&<span> · {plan.network}</span>}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
          {plan.features.map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:13.5,color:T.ink}}>
              <div style={{width:20,height:20,borderRadius:99,
                background:`linear-gradient(135deg,${T.primaryLt},${T.accentLt})`,
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="10" height="10" viewBox="0 0 12 10">
                  <polyline points="1 5 4.5 8.5 11 1" stroke={T.primary} strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"0 24px 24px",marginTop:"auto",display:"flex",gap:10}}>
        <button className="btn-press" onClick={()=>onBuy(plan)} style={{flex:2,padding:"14px",
          borderRadius:14,border:"none",background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,
          color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",
          boxShadow:`0 4px 20px ${T.primary}35`,fontFamily:"'Outfit',sans-serif"}}>
          Buy Now →
        </button>
        <button className="btn-press" onClick={()=>onCompare(plan)} style={{flex:1,padding:"14px",
          borderRadius:14,cursor:"pointer",
          border:`1.5px solid ${isCompared?T.primary:T.border}`,
          background:isCompared?T.primaryLt:"transparent",
          color:isCompared?T.primary:T.slate,fontWeight:600,fontSize:13,
          fontFamily:"'Outfit',sans-serif"}}>
          {isCompared?"✓ Added":"Compare"}
        </button>
      </div>
    </div>
  );
};

// ── CHECKOUT MODAL (STRIPE) ──────────────────────────────────────
const CheckoutModal = ({plan,product,onClose}) => {
  const ins=INSURERS[plan.insurer];
  const prod=PRODUCTS.find(p=>p.key===product);
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",email:"",phone:"",dob:"",nominee:""});
  const [errors,setErrors]=useState({});
  const [policyNo,setPolicyNo]=useState("");
  const [payErr,setPayErr]=useState("");

  const validate=()=>{
    const e={};
    if(!form.name.trim()) e.name="Required";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email="Valid email needed";
    if(!/^[6-9]\d{9}$/.test(form.phone)) e.phone="Valid 10-digit mobile";
    if(!form.dob) e.dob="Required";
    setErrors(e); return !Object.keys(e).length;
  };

  const pay = async () => {
    setStep(3); setPayErr("");
    try {
      const sessionRes = await fetch(`${API}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.premium,
          planId: plan.id,
          planName: `${ins.name} — ${plan.name}`,
          userDetails: form,
        }),
      });
      const { url, error: sErr } = await sessionRes.json();
      if (sErr) throw new Error(sErr);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Could not create payment session");
      }
    } catch(err) {
      setPayErr(err.message || "Payment failed. Please try again.");
      setStep(2);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setPolicyNo(params.get("policy") || "MT-XXXXXXXX");
      setStep(4);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const inp = (key, label, type="text", placeholder="") => (
    <div style={{marginBottom:16}}>
      <label style={{fontSize:11,fontWeight:700,color:T.slate,display:"block",
        marginBottom:6,textTransform:"uppercase",letterSpacing:".06em",
        fontFamily:"'Outfit',sans-serif"}}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[key]}
        onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
        style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:14,
          border:`1.5px solid ${errors[key]?T.danger:T.border}`,
          background:T.paper,color:T.ink,boxSizing:"border-box",transition:"all .2s"}}/>
      {errors[key]&&<div style={{color:T.danger,fontSize:11,marginTop:4,fontWeight:500}}>{errors[key]}</div>}
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(15,23,42,.65)",
      backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.white,borderRadius:28,width:"100%",maxWidth:520,
        maxHeight:"92vh",overflowY:"auto",boxShadow:"0 32px 100px rgba(0,0,0,.25)",
        animation:"scaleIn .25s cubic-bezier(.22,1,.36,1)"}}>
        <div style={{background:`linear-gradient(135deg,${prod.bg},${prod.color}18)`,
          padding:"26px 30px",borderBottom:`1px solid ${T.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"flex-start",
          borderRadius:"28px 28px 0 0"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:26}}>{prod.emoji}</span>
              <span style={{fontWeight:900,fontSize:19,color:T.ink,
                fontFamily:"'Outfit',sans-serif",letterSpacing:"-.5px"}}>
                {step===4?"Policy Issued! 🎉":"Secure Checkout"}
              </span>
            </div>
            <div style={{fontSize:13,color:T.slate}}>{ins.name} · {plan.name}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.85)",border:"none",
            borderRadius:99,width:36,height:36,cursor:"pointer",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center",color:T.slate}}>×</button>
        </div>
        <div style={{padding:"26px 30px"}}>
          <div style={{background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,borderRadius:18,
            padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26}}>
            <div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:600,
                letterSpacing:".06em",textTransform:"uppercase"}}>Annual Premium</div>
              <div style={{fontSize:30,fontWeight:900,color:"#fff",
                fontFamily:"'Outfit',sans-serif",letterSpacing:"-1.5px"}}>
                ₹{plan.premium.toLocaleString()}
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>Incl. GST · Renews annually</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginBottom:5}}>Claim Ratio</div>
              <div style={{fontSize:24,fontWeight:800,color:"#06B6D4",fontFamily:"'Outfit',sans-serif"}}>{ins.claimR}</div>
              <div style={{background:T.accent,color:"#fff",fontSize:10,fontWeight:700,
                padding:"3px 10px",borderRadius:99,display:"inline-block",marginTop:4}}>IRDAI ✓</div>
            </div>
          </div>
          {step<4&&(
            <div style={{display:"flex",alignItems:"center",marginBottom:26}}>
              {["Details","Review","Payment"].map((s,i)=>(
                <div key={s} style={{display:"flex",alignItems:"center",flex:i<2?1:"auto"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{width:30,height:30,borderRadius:99,
                      background:i+1<step?T.accent:i+1===step?T.primary:T.border,
                      color:i+1<step?"#fff":i+1===step?"#fff":T.mist,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:12,fontWeight:800,transition:"all .3s",fontFamily:"'Outfit',sans-serif"}}>
                      {i+1<step?"✓":i+1}
                    </div>
                    <div style={{fontSize:10,color:i+1===step?T.primary:T.mist,fontWeight:600,
                      fontFamily:"'Outfit',sans-serif"}}>{s}</div>
                  </div>
                  {i<2&&<div style={{flex:1,height:2,background:i+1<step?T.accent:T.border,
                    margin:"0 8px",marginBottom:20,transition:"all .3s",borderRadius:2}}/>}
                </div>
              ))}
            </div>
          )}
          {step===1&&(
            <div style={{animation:"fadeIn .3s ease"}}>
              {inp("name","Full Name","text","As per Aadhaar")}
              {inp("email","Email Address","email","you@example.com")}
              {inp("phone","Mobile Number","tel","10-digit mobile")}
              {inp("dob","Date of Birth","date","")}
              {inp("nominee","Nominee Name","text","Optional")}
              <Btn onClick={()=>{if(validate())setStep(2);}} variant="primary" size="md" full>
                Continue to Review →
              </Btn>
            </div>
          )}
          {step===2&&(
            <div style={{animation:"fadeIn .3s ease"}}>
              <div style={{fontWeight:700,fontSize:16,color:T.ink,marginBottom:16,
                fontFamily:"'Outfit',sans-serif"}}>Review Your Details</div>
              <div style={{background:T.paper,borderRadius:16,overflow:"hidden",marginBottom:22}}>
                {[["Name",form.name],["Email",form.email],["Phone",form.phone],
                  ["Date of Birth",form.dob],["Nominee",form.nominee||"—"],
                  ["Plan",plan.name],["Insurer",ins.name]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",
                    padding:"12px 18px",borderBottom:`1px solid ${T.border}`,fontSize:14}}>
                    <span style={{color:T.mist}}>{k}</span>
                    <span style={{fontWeight:600,color:T.ink}}>{v}</span>
                  </div>
                ))}
              </div>
              {payErr&&<div style={{background:T.dangerLt,border:"1px solid #FECACA",
                borderRadius:12,padding:"12px 16px",fontSize:13,color:T.danger,marginBottom:18}}>⚠ {payErr}</div>}
              <div style={{fontSize:12,color:T.mist,lineHeight:1.7,marginBottom:22}}>
                By proceeding you authorise MT to share your details with {ins.name} for policy issuance per IRDAI guidelines.
              </div>
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={()=>setStep(1)} variant="ghost" size="md" style={{flex:1}}>← Edit</Btn>
                <Btn onClick={pay} variant="primary" size="md" style={{flex:2}}>
                  Pay ₹{plan.premium.toLocaleString()} via Stripe 🔒
                </Btn>
              </div>
            </div>
          )}
          {step===3&&(
            <div style={{textAlign:"center",padding:"44px 0",animation:"fadeIn .3s ease"}}>
              <div style={{fontSize:52,marginBottom:22}}>🔐</div>
              <div style={{fontWeight:800,fontSize:19,color:T.ink,marginBottom:8,
                fontFamily:"'Outfit',sans-serif"}}>Redirecting to Stripe</div>
              <div style={{color:T.mist,fontSize:14,marginBottom:30}}>Connecting securely to payment gateway...</div>
              <div style={{display:"flex",justifyContent:"center"}}>
                <div style={{width:40,height:40,borderRadius:"50%",
                  border:`3px solid ${T.border}`,borderTopColor:T.primary,
                  animation:"spin .8s linear infinite"}}/>
              </div>
            </div>
          )}
          {step===4&&(
            <div style={{textAlign:"center",padding:"8px 0",animation:"fadeUp .4s ease"}}>
              <div style={{width:76,height:76,borderRadius:"50%",
                background:`linear-gradient(135deg,${T.accent},${T.primary})`,
                display:"flex",alignItems:"center",justifyContent:"center",
                margin:"0 auto 22px",fontSize:34,color:"#fff"}}>✓</div>
              <div style={{fontWeight:900,fontSize:24,color:T.ink,marginBottom:10,
                fontFamily:"'Outfit',sans-serif",letterSpacing:"-1px"}}>Policy Issued Successfully!</div>
              <div style={{color:T.slate,fontSize:14,lineHeight:1.7,marginBottom:24}}>
                Your <strong>{plan.name}</strong> from <strong>{ins.name}</strong> is active.
                Documents sent to <strong>{form.email}</strong>.
              </div>
              <div style={{background:`linear-gradient(135deg,${T.primaryLt},${T.accentLt})`,
                borderRadius:16,padding:"18px 22px",marginBottom:26}}>
                <div style={{fontSize:11,color:T.mist,marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>Policy Number</div>
                <div style={{fontSize:24,fontWeight:900,color:T.primary,fontFamily:"'Outfit',monospace",letterSpacing:"1px"}}>{policyNo}</div>
              </div>
              <Btn onClick={onClose} variant="primary" size="md" full>Done</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── COMPARE DRAWER ────────────────────────────────────────────────
const CompareDrawer = ({plans,onRemove}) => {
  if(!plans.length) return null;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:300,background:T.white,
      borderTop:`3px solid ${T.primary}`,boxShadow:"0 -8px 40px rgba(79,70,229,.12)"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"14px 28px",
        display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{fontWeight:800,fontSize:13,color:T.primary,fontFamily:"'Outfit',sans-serif",flexShrink:0}}>
          COMPARE ({plans.length}/3)
        </div>
        {plans.map(p=>{
          const ins=INSURERS[p.insurer];
          return (
            <div key={p.id} style={{background:T.primaryLt,borderRadius:10,padding:"8px 14px",
              display:"flex",alignItems:"center",gap:10,border:`1px solid ${T.primary}25`}}>
              <div style={{fontSize:12,fontWeight:700,color:T.ink}}>
                {ins?.name} <span style={{color:T.mist,fontWeight:400}}>· {p.name}</span>
              </div>
              <button onClick={()=>onRemove(p.id)} style={{background:"none",border:"none",
                cursor:"pointer",color:T.mist,fontSize:18,padding:2,lineHeight:1}}>×</button>
            </div>
          );
        })}
        {plans.length>=2&&(
          <Btn variant="primary" size="sm" onClick={()=>alert("Side-by-side comparison — coming soon!")}>Compare →</Btn>
        )}
      </div>
    </div>
  );
};

// ── NAVBAR ────────────────────────────────────────────────────────
const Navbar = ({page,setPage}) => {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  const links=[
    {label:"Car",p:"car"},{label:"Health",p:"health"},
    {label:"Life",p:"life"},{label:"Travel",p:"travel"},
    {label:"Claims",p:"claims"},{label:"About",p:"about"},
  ];
  return (
    <nav style={{position:"sticky",top:0,zIndex:200,
      background:scrolled?"rgba(248,250,252,.95)":T.white,
      borderBottom:`1px solid ${scrolled?T.border:"transparent"}`,
      backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
      boxShadow:scrolled?"0 4px 30px rgba(15,23,42,.06)":"none",transition:"all .25s"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 28px",
        display:"flex",alignItems:"center",height:70,gap:20}}>
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
          <MTLogo size={38}/>
        </button>
        <div className="nav-links" style={{display:"flex",gap:4,flex:1,justifyContent:"center"}}>
          {links.map(l=>(
            <button key={l.p} onClick={()=>setPage(l.p)} style={{
              background:page===l.p?T.primaryLt:"transparent",border:"none",cursor:"pointer",
              fontFamily:"'Outfit',sans-serif",padding:"8px 16px",borderRadius:10,
              fontSize:14,fontWeight:600,color:page===l.p?T.primary:T.slate,transition:"all .15s"}}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
          <Btn onClick={()=>setPage("login")} variant="ghost" size="sm">Login</Btn>
          <Btn onClick={()=>setPage("home")} variant="primary" size="sm">Free Quote</Btn>
        </div>
      </div>
    </nav>
  );
};

// ── HOME PAGE ─────────────────────────────────────────────────────
const HomePage = ({setPage}) => {
  const [tIdx,setTIdx]=useState(0);
  const [faqOpen,setFaqOpen]=useState(null);
  useEffect(()=>{const t=setInterval(()=>setTIdx(i=>(i+1)%TESTIMONIALS.length),4500);return()=>clearInterval(t);},[]);
  return (
    <div>
      {/* HERO */}
      <section style={{background:"linear-gradient(160deg,#1E1B4B 0%,#312E81 35%,#4338CA 65%,#4F46E5 100%)",
        padding:"80px 28px 0",overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",top:-120,right:-80,width:500,height:500,
          borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,.15),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-100,left:-100,width:400,height:400,
          borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.12),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1200,margin:"0 auto",position:"relative"}}>
          <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:10,
            background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",
            borderRadius:99,padding:"8px 20px",marginBottom:32}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#06B6D4",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.85)"}}>IRDAI Licensed Web Aggregator</span>
          </div>
          <h1 className="fadeUp2" style={{fontFamily:"'Outfit',sans-serif",
            fontSize:"clamp(38px,6vw,72px)",fontWeight:900,color:"#fff",
            lineHeight:1.05,letterSpacing:"-3px",maxWidth:700,marginBottom:24}}>
            Insurance that<br/>
            <span style={{background:"linear-gradient(135deg,#06B6D4,#22D3EE,#67E8F9)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>just works.</span>
          </h1>
          <p className="fadeUp3" style={{color:"rgba(255,255,255,.6)",fontSize:18,lineHeight:1.7,
            maxWidth:520,marginBottom:44}}>
            Compare 200+ plans from 30+ trusted insurers. Buy in 2 minutes.
            Trusted by <strong style={{color:"#fff"}}>50 Lakh+</strong> Indians.
          </p>
          <div className="fadeUp4" style={{display:"flex",gap:36,marginBottom:56,flexWrap:"wrap"}}>
            {[["50L+","Lives Insured"],["₹1200Cr+","Claims Settled"],["30+","Insurer Partners"],["4.8★","User Rating"]].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:900,color:"#06B6D4",letterSpacing:"-1px"}}>{v}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:3}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
            {PRODUCTS.map((p,i)=>(
              <button key={p.key} onClick={()=>setPage(p.key)} className="hover-lift"
                style={{background:i===0?"#fff":"rgba(255,255,255,.06)",
                  backdropFilter:"blur(16px)",border:i===0?"none":"1px solid rgba(255,255,255,.1)",
                  borderRadius:24,padding:"28px 24px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",
                  boxShadow:i===0?"0 16px 50px rgba(0,0,0,.2)":"none",
                  transform:i===0?"translateY(-6px)":"none",
                  animation:`fadeUp .55s ease ${i*.07}s both`}}>
                <div style={{fontSize:40,marginBottom:14,animation:"float 3s ease-in-out infinite",animationDelay:`${i*.5}s`}}>{p.emoji}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,
                  color:i===0?T.ink:"#fff",marginBottom:6}}>{p.label}</div>
                <div style={{fontSize:12.5,color:i===0?T.slate:"rgba(255,255,255,.5)",marginBottom:14,lineHeight:1.5}}>{p.blurb}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                  {p.stats.map(s=>(
                    <span key={s} style={{fontSize:10,fontWeight:600,padding:"4px 9px",borderRadius:99,
                      background:i===0?T.primaryLt:"rgba(255,255,255,.1)",color:i===0?T.primary:"#06B6D4"}}>{s}</span>
                  ))}
                </div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,
                  color:i===0?T.primary:"#06B6D4"}}>From {p.from} →</div>
              </button>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 1440 60" style={{display:"block",width:"100%",marginTop:36}}>
          <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" fill={T.paper}/>
        </svg>
      </section>

      {/* TICKER */}
      <div style={{background:`linear-gradient(135deg,${T.primary},${T.accent})`,padding:"11px 0",overflow:"hidden"}}>
        <div className="ticker-wrap"><div className="ticker-inner">
          {Array(8).fill(["🚗 Car from ₹2,094/yr","🏥 Health from ₹12,800/yr","🛡️ ₹1Cr Life from ₹740/mo","✈️ Travel from ₹1,200","⚡ Policy in 2 min","📞 24×7 Support","✅ IRDAI Licensed"]).flat().map((t,i)=>(
            <span key={i} style={{fontSize:12,fontWeight:700,color:"#fff",padding:"0 30px",fontFamily:"'Outfit',sans-serif"}}>{t}</span>
          ))}
        </div></div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{padding:"88px 28px",background:T.white}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <Chip>How It Works</Chip>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,
              color:T.ink,marginTop:14,letterSpacing:"-1.5px"}}>Insured in under 3 minutes</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20}}>
            {[{n:"1",e:"📋",t:"Tell Us About You",d:"Share basic details — 90 seconds."},
              {n:"2",e:"⚡",t:"Compare Live Quotes",d:"Real-time quotes from 30+ insurers."},
              {n:"3",e:"💳",t:"Pay Securely via Stripe",d:"Bank-grade encryption. PCI Level 1."},
              {n:"4",e:"📄",t:"Policy in Minutes",d:"Documents on email & WhatsApp instantly."},
            ].map(s=>(
              <div key={s.n} style={{background:T.paper,borderRadius:24,padding:30,
                border:`1.5px solid ${T.border}`,position:"relative",overflow:"hidden",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.primary+"40";e.currentTarget.style.transform="translateY(-4px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{position:"absolute",top:18,right:22,fontFamily:"'Outfit',sans-serif",
                  fontSize:72,fontWeight:900,color:T.primary,opacity:.04,lineHeight:1}}>{s.n}</div>
                <div style={{width:56,height:56,borderRadius:16,
                  background:`linear-gradient(135deg,${T.primaryLt},${T.accentLt})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:26,marginBottom:18}}>{s.e}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:T.ink,marginBottom:8}}>Step {s.n}: {s.t}</div>
                <div style={{fontSize:14,color:T.slate,lineHeight:1.65}}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{padding:"88px 28px",background:T.paper}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <Chip>Our Products</Chip>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,
              color:T.ink,marginTop:14,letterSpacing:"-1.5px"}}>Protection for every chapter of life</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:20}}>
            {PRODUCTS.map(p=>(
              <div key={p.key} className="hover-lift" onClick={()=>setPage(p.key)}
                style={{background:T.white,borderRadius:24,overflow:"hidden",border:`1.5px solid ${T.border}`}}>
                <div style={{background:`linear-gradient(135deg,${p.color}20,${p.bg})`,padding:"30px 28px 22px",position:"relative"}}>
                  <div style={{fontSize:48,marginBottom:14}}>{p.emoji}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:21,color:T.ink,marginBottom:6}}>{p.label}</div>
                  <div style={{fontSize:13.5,color:T.slate,lineHeight:1.5}}>{p.blurb}</div>
                  <div style={{position:"absolute",top:22,right:22}}><Chip color={p.dark} bg={p.bg}>{p.tag}</Chip></div>
                </div>
                <div style={{padding:"20px 28px 26px"}}>
                  <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
                    {p.stats.map(s=>(
                      <span key={s} style={{fontSize:11,fontWeight:600,padding:"4px 11px",borderRadius:99,
                        background:T.paper,color:T.slate,border:`1px solid ${T.border}`}}>{s}</span>
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:11,color:T.mist,marginBottom:3}}>Starting from</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:900,color:T.primary}}>{p.from}</div>
                    </div>
                    <div style={{width:44,height:44,borderRadius:14,
                      background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,
                      display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18}}>→</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"88px 28px",background:"linear-gradient(160deg,#1E1B4B,#312E81,#4338CA)",
        position:"relative",overflow:"hidden"}}>
        <div style={{maxWidth:960,margin:"0 auto",position:"relative"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <Chip color="#06B6D4" bg="rgba(6,182,212,.15)">Customer Stories</Chip>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,3.5vw,44px)",
              fontWeight:900,color:"#fff",marginTop:14,letterSpacing:"-1.5px"}}>Real people. Real claims.</h2>
          </div>
          <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(20px)",
            borderRadius:28,padding:"44px 48px",border:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{fontSize:60,color:"#06B6D4",lineHeight:1,marginBottom:22,fontFamily:"'Outfit',sans-serif",fontWeight:900}}>"</div>
            <div style={{fontSize:20,color:"#fff",lineHeight:1.7,marginBottom:30,minHeight:80,fontStyle:"italic"}}>{TESTIMONIALS[tIdx].text}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#06B6D4,#4F46E5)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#fff",
                  fontFamily:"'Outfit',sans-serif"}}>{TESTIMONIALS[tIdx].av}</div>
                <div>
                  <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{TESTIMONIALS[tIdx].name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.45)"}}>{TESTIMONIALS[tIdx].city} · {TESTIMONIALS[tIdx].product}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {TESTIMONIALS.map((_,i)=>(
                  <button key={i} onClick={()=>setTIdx(i)} style={{width:tIdx===i?28:10,height:10,borderRadius:99,
                    border:"none",cursor:"pointer",background:tIdx===i?"#06B6D4":"rgba(255,255,255,.2)",transition:"all .3s"}}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section style={{padding:"72px 28px",background:T.white}}>
        <div style={{maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
          <Chip>Our Partners</Chip>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(24px,3vw,36px)",
            fontWeight:900,color:T.ink,marginTop:14,marginBottom:40}}>Trusted by India's top insurers</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
            {Object.entries(INSURERS).map(([id,ins])=>(
              <div key={id} style={{background:T.paper,border:`1.5px solid ${T.border}`,borderRadius:16,
                padding:"16px 20px",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=ins.color+"40";e.currentTarget.style.transform="translateY(-3px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{width:40,height:40,borderRadius:12,background:`${ins.color}0C`,display:"flex",
                  alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:ins.color,fontFamily:"'Outfit',monospace"}}>{ins.abbr}</div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:700,fontSize:13,color:T.ink}}>{ins.name}</div>
                  <div style={{fontSize:11,color:T.success,fontWeight:600}}>Claim: {ins.claimR}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY MT */}
      <section style={{padding:"88px 28px",background:T.paper}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
            <div>
              <Chip>Why MT</Chip>
              <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,3vw,44px)",fontWeight:900,
                color:T.ink,marginTop:14,marginBottom:22,letterSpacing:"-1.5px"}}>We put you first.<br/>Always.</h2>
              <div style={{color:T.slate,fontSize:16,lineHeight:1.7,marginBottom:36}}>
                Unlike agents who push high-commission plans, MT ranks every option purely by coverage, claim ratio, and your budget.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                {[["🎯","100% Unbiased","Rankings are purely algorithmic — never commission-driven."],
                  ["🔒","Bank-Grade Security","256-bit TLS via Stripe. PCI-DSS Level 1 compliant."],
                  ["⚡","2-Minute Issuance","Most policies issued instantly. No paperwork."],
                  ["📞","Claims Concierge","Dedicated support from Day 1, not just at sale."],
                ].map(([icon,title,desc])=>(
                  <div key={title} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{width:48,height:48,borderRadius:14,
                      background:`linear-gradient(135deg,${T.primaryLt},${T.accentLt})`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
                    <div>
                      <div style={{fontWeight:700,color:T.ink,marginBottom:3,fontSize:15,fontFamily:"'Outfit',sans-serif"}}>{title}</div>
                      <div style={{fontSize:14,color:T.slate,lineHeight:1.5}}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:`linear-gradient(135deg,${T.primary},#312E81)`,
              borderRadius:28,padding:36,color:"#fff",boxShadow:`0 20px 60px ${T.primary}30`}}>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.5)",marginBottom:22,
                letterSpacing:".06em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>Live Savings Dashboard</div>
              {[{label:"Car Insurance",saving:"₹1,701",from:"₹10,200",to:"₹8,499"},
                {label:"Health Plan",saving:"₹3,500",from:"₹22,000",to:"₹18,500"},
                {label:"Term Life",saving:"₹1,700",from:"₹11,500",to:"₹9,800"},
              ].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"16px 0",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:15}}>{r.label}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}><s>{r.from}</s> → {r.to}</div>
                  </div>
                  <div style={{background:"#06B6D4",color:"#fff",fontWeight:800,fontSize:14,
                    padding:"6px 14px",borderRadius:99,fontFamily:"'Outfit',sans-serif"}}>Save {r.saving}</div>
                </div>
              ))}
              <div style={{marginTop:24,textAlign:"center",fontSize:13,color:"rgba(255,255,255,.5)"}}>
                Avg. savings: <strong style={{color:"#06B6D4",fontSize:20}}>₹6,900/yr</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"88px 28px",background:T.white}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <Chip>FAQ</Chip>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,3.5vw,44px)",
              fontWeight:900,color:T.ink,marginTop:14,letterSpacing:"-1.5px"}}>Common questions</h2>
          </div>
          {FAQ_DATA.map((f,i)=>(
            <div key={i} style={{marginBottom:12,borderRadius:16,overflow:"hidden",
              border:`1.5px solid ${faqOpen===i?T.primary:T.border}`,
              background:faqOpen===i?T.primaryLt+"40":T.white,transition:"all .2s"}}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",
                display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"20px 24px",background:"none",border:"none",cursor:"pointer",
                fontFamily:"'Outfit',sans-serif",textAlign:"left"}}>
                <span style={{fontWeight:700,fontSize:15,color:T.ink}}>{f.q}</span>
                <span style={{fontSize:24,color:T.primary,fontWeight:300,
                  transform:faqOpen===i?"rotate(45deg)":"none",transition:"transform .25s",flexShrink:0,marginLeft:16}}>+</span>
              </button>
              {faqOpen===i&&<div style={{padding:"0 24px 20px",fontSize:14,color:T.slate,lineHeight:1.75,animation:"fadeIn .2s ease"}}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"72px 28px",background:T.paper}}>
        <div style={{maxWidth:900,margin:"0 auto",
          background:"linear-gradient(135deg,#1E1B4B,#312E81,#4338CA)",
          borderRadius:32,padding:"60px 52px",textAlign:"center",position:"relative",overflow:"hidden",
          boxShadow:"0 24px 70px rgba(30,27,75,.4)"}}>
          <div style={{position:"absolute",top:-80,right:-80,width:350,height:350,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(6,182,212,.12),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative"}}>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(26px,3.5vw,44px)",fontWeight:900,
              color:"#fff",marginBottom:14,letterSpacing:"-1.5px"}}>Start protecting what matters.</div>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:16,marginBottom:36}}>
              Free quotes in 60 seconds. No spam calls. No hidden charges.
            </div>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <Btn variant="accent" size="lg" onClick={()=>setPage("car")}>🚗 Insure My Car</Btn>
              <Btn variant="white" size="lg" onClick={()=>setPage("health")}>🏥 Health Insurance</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#0F172A",color:"rgba(255,255,255,.5)",padding:"68px 28px 36px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:40,marginBottom:52}}>
            <div>
              <div style={{marginBottom:20}}><MTLogo size={36} dark/></div>
              <div style={{fontSize:13,lineHeight:1.8,maxWidth:260}}>IRDAI Licensed Web Aggregator.<br/>Making insurance simple for every Indian.</div>
            </div>
            {[{t:"Products",l:["Car Insurance","Health Plans","Term Life","Travel Cover"]},
              {t:"Company",l:["About Us","Careers","Press Kit","Contact"]},
              {t:"Support",l:["Claims Help","Track Policy","Grievance","Partner With Us"]},
              {t:"Legal",l:["Privacy Policy","Terms","Disclaimer","IRDAI Info"]},
            ].map(col=>(
              <div key={col.t}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,color:"#fff",marginBottom:16,
                  fontSize:13,letterSpacing:".06em",textTransform:"uppercase"}}>{col.t}</div>
                {col.l.map(l=>(
                  <div key={l} style={{fontSize:13,marginBottom:10,cursor:"pointer",transition:"color .15s"}}
                    onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:26,
            display:"flex",flexWrap:"wrap",gap:12,justifyContent:"space-between",alignItems:"center",fontSize:11}}>
            <div>© 2025 MT Insurance · IRDAI Licensed</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#10B981",animation:"pulse 2s infinite"}}/>
              <span style={{color:"#10B981",fontWeight:600}}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ── PRODUCT PAGE ──────────────────────────────────────────────────
const ProductPage = ({type,setPage}) => {
  const prod=PRODUCTS.find(p=>p.key===type);
  const plans=PLANS[type]||[];
  const [filter,setFilter]=useState("All");
  const [sort,setSort]=useState("popular");
  const [compared,setCompared]=useState([]);
  const [buyPlan,setBuyPlan]=useState(null);
  const types=["All",...new Set(plans.map(p=>p.type))];
  const filtered=plans.filter(p=>filter==="All"||p.type===filter)
    .sort((a,b)=>sort==="price"?a.premium-b.premium:(b.popular?1:0)-(a.popular?1:0));
  const toggleCompare=plan=>setCompared(prev=>
    prev.find(p=>p.id===plan.id)?prev.filter(p=>p.id!==plan.id):prev.length<3?[...prev,plan]:prev);
  return (
    <div style={{background:T.paper,minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(160deg,#1E1B4B,#312E81,#4F46E5)",padding:"48px 28px 44px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <button onClick={()=>setPage("home")} style={{background:"rgba(255,255,255,.08)",
            border:"1px solid rgba(255,255,255,.15)",borderRadius:99,padding:"7px 18px",
            color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginBottom:24}}>← Home</button>
          <div style={{display:"flex",gap:18,alignItems:"center"}}>
            <div style={{fontSize:52}}>{prod.emoji}</div>
            <div>
              <h1 style={{fontFamily:"'Outfit',sans-serif",color:"#fff",fontSize:"clamp(26px,3vw,40px)",
                fontWeight:900,marginBottom:8,letterSpacing:"-1px"}}>{prod.label}</h1>
              <p style={{color:"rgba(255,255,255,.6)",fontSize:15}}>{prod.blurb} · {plans.length} plans</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"36px 28px",paddingBottom:compared.length?120:36}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:14}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {types.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{padding:"9px 20px",borderRadius:99,
                border:`1.5px solid ${filter===t?T.primary:T.border}`,
                background:filter===t?T.primary:T.white,color:filter===t?"#fff":T.slate,
                fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{t}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            {[["popular","⭐ Popular"],["price","💰 Lowest"]].map(([v,l])=>(
              <button key={v} onClick={()=>setSort(v)} style={{padding:"9px 18px",borderRadius:99,
                border:`1.5px solid ${sort===v?T.primary:T.border}`,
                background:sort===v?T.primaryLt:T.white,color:sort===v?T.primary:T.slate,
                fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(330px,1fr))",gap:20}}>
          {filtered.map(plan=>(<PlanCard key={plan.id} plan={plan} product={type} onBuy={setBuyPlan}
            onCompare={toggleCompare} isCompared={!!compared.find(p=>p.id===plan.id)}/>))}
        </div>
        <div style={{marginTop:44,background:T.white,borderRadius:20,padding:"22px 30px",
          border:`1.5px solid ${T.border}`,display:"flex",flexWrap:"wrap",gap:22,justifyContent:"center"}}>
          {["🔒 Stripe Secure","✅ IRDAI Approved","⚡ Instant Policy","📞 Claims Concierge","💯 Verified"].map(t=>(
            <span key={t} style={{fontSize:12,fontWeight:600,color:T.slate}}>{t}</span>
          ))}
        </div>
      </div>
      {buyPlan&&<CheckoutModal plan={buyPlan} product={type} onClose={()=>setBuyPlan(null)}/>}
      <CompareDrawer plans={compared} onRemove={id=>setCompared(p=>p.filter(x=>x.id!==id))}/>
    </div>
  );
};

// ── CLAIMS PAGE ───────────────────────────────────────────────────
const ClaimsPage = () => (
  <div style={{maxWidth:1000,margin:"0 auto",padding:"60px 28px"}}>
    <Chip>Claims</Chip>
    <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(30px,3.5vw,48px)",fontWeight:900,
      color:T.ink,marginTop:14,marginBottom:14,letterSpacing:"-1.5px"}}>Claims Assistance</h1>
    <p style={{color:T.slate,fontSize:16,marginBottom:52}}>
      Settlement ratio: <strong style={{color:T.success}}>97.8%</strong>. We guide you at every step.
    </p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:20,marginBottom:56}}>
      {[["📞","Notify","Call within 24 hrs."],["📋","Submit","Online form + docs."],
        ["🔍","Verify","Review in 2 days."],["💰","Settle","Bank or cashless."]
      ].map(([e,t,d],i)=>(
        <div key={t} style={{background:T.white,borderRadius:24,padding:30,border:`1.5px solid ${T.border}`,textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:16}}>{e}</div>
          <div style={{fontSize:11,fontWeight:700,color:T.primary,marginBottom:8,letterSpacing:".06em",textTransform:"uppercase",
            fontFamily:"'Outfit',sans-serif"}}>Step {i+1}</div>
          <div style={{fontWeight:800,fontSize:16,color:T.ink,marginBottom:10,fontFamily:"'Outfit',sans-serif"}}>{t}</div>
          <div style={{fontSize:13.5,color:T.slate,lineHeight:1.6}}>{d}</div>
        </div>
      ))}
    </div>
    <div style={{background:`linear-gradient(135deg,${T.primary},#312E81)`,borderRadius:28,
      padding:"48px 44px",textAlign:"center",boxShadow:`0 20px 60px ${T.primary}35`}}>
      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:30,fontWeight:900,color:"#fff",marginBottom:10}}>Need help?</div>
      <div style={{color:"rgba(255,255,255,.6)",marginBottom:32}}>Our team is available 24×7</div>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn variant="accent" size="lg">📞 Call 1800-XXX-XXXX</Btn>
        <Btn size="lg" style={{background:"rgba(255,255,255,.1)",color:"#fff",border:"1px solid rgba(255,255,255,.2)",borderRadius:16}}>💬 WhatsApp</Btn>
      </div>
    </div>
  </div>
);

// ── ABOUT PAGE ────────────────────────────────────────────────────
const AboutPage = () => (
  <div style={{maxWidth:1000,margin:"0 auto",padding:"60px 28px"}}>
    <Chip>About Us</Chip>
    <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(30px,3.5vw,48px)",fontWeight:900,
      color:T.ink,marginTop:14,marginBottom:18,letterSpacing:"-1.5px"}}>Insurance, simplified<br/>for every Indian.</h1>
    <div style={{color:T.slate,fontSize:16,lineHeight:1.8,maxWidth:660,marginBottom:52}}>
      MT is an IRDAI-licensed web aggregator. We compare 200+ plans from 30+ insurers — zero bias, zero hidden charges.
    </div>
    <div className="stats-row" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:56}}>
      {[["50L+","Lives Insured"],["₹1200Cr+","Claims Settled"],["30+","Partners"],["4.8★","Rating"]].map(([v,l])=>(
        <div key={l} style={{background:T.white,borderRadius:20,padding:28,textAlign:"center",border:`1.5px solid ${T.border}`}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:38,fontWeight:900,color:T.primary,marginBottom:8}}>{v}</div>
          <div style={{fontSize:13,color:T.mist}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{background:T.white,borderRadius:24,padding:36,border:`1.5px solid ${T.border}`}}>
      <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:19,color:T.ink,marginBottom:22}}>Our Commitments</div>
      {["100% unbiased recommendations","Zero hidden charges","Dedicated claims concierge","Data never sold","Fully IRDAI regulated"].map((txt,i)=>(
        <div key={i} style={{display:"flex",gap:14,marginBottom:16,fontSize:14.5,color:T.slate}}>
          <div style={{width:24,height:24,borderRadius:99,background:`linear-gradient(135deg,${T.primaryLt},${T.accentLt})`,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="11" height="11" viewBox="0 0 12 10"><polyline points="1 5 4.5 8.5 11 1" stroke={T.primary} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          </div>
          {txt}
        </div>
      ))}
    </div>
  </div>
);

// ── LOGIN PAGE ────────────────────────────────────────────────────
const LoginPage = ({setPage}) => {
  const [tab,setTab]=useState("login");
  const [form,setForm]=useState({name:"",email:"",phone:"",otp:""});
  const [otpSent,setOtpSent]=useState(false);
  const [loading,setLoading]=useState(false);
  const sendOtp=async()=>{
    if(!/^[6-9]\d{9}$/.test(form.phone)){alert("Enter valid 10-digit mobile");return;}
    setLoading(true);setTimeout(()=>{setOtpSent(true);setLoading(false);},800);
  };
  const submit=async()=>{setLoading(true);setTimeout(()=>{setLoading(false);setPage("home");},800);};
  return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,
      background:`radial-gradient(ellipse at 60% 0%,${T.primaryLt} 0%,${T.paper} 60%)`}}>
      <div style={{background:T.white,borderRadius:28,padding:48,width:"100%",maxWidth:440,
        boxShadow:"0 20px 70px rgba(79,70,229,.1)",border:`1.5px solid ${T.border}`}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{margin:"0 auto 20px"}}><MTLogo size={48}/></div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:24,color:T.ink}}>Welcome to MT</div>
          <div style={{fontSize:14,color:T.mist,marginTop:7}}>Login to manage policies & claims</div>
        </div>
        <div style={{display:"flex",background:T.paper,borderRadius:14,padding:4,marginBottom:28,gap:4}}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"11px",borderRadius:11,
              border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,
              background:tab===t?T.white:"transparent",color:tab===t?T.ink:T.mist,
              boxShadow:tab===t?"0 2px 12px rgba(0,0,0,.06)":"none"}}>{t==="login"?"Login":"Sign Up"}</button>
          ))}
        </div>
        {tab==="signup"&&[["Full Name","text","name","As per Aadhaar"],["Email","email","email","you@email.com"]].map(([l,t,k,p])=>(
          <div key={k} style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:700,color:T.mist,display:"block",marginBottom:6,
              textTransform:"uppercase",letterSpacing:".06em",fontFamily:"'Outfit',sans-serif"}}>{l}</label>
            <input type={t} placeholder={p} value={form[k]} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))}
              style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:14,
                border:`1.5px solid ${T.border}`,background:T.paper,boxSizing:"border-box"}}/>
          </div>
        ))}
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:700,color:T.mist,display:"block",marginBottom:6,
            textTransform:"uppercase",letterSpacing:".06em",fontFamily:"'Outfit',sans-serif"}}>Mobile Number</label>
          <div style={{display:"flex",gap:8}}>
            <input placeholder="10-digit mobile" value={form.phone} onChange={e=>setForm(prev=>({...prev,phone:e.target.value}))}
              style={{flex:1,padding:"13px 16px",borderRadius:12,fontSize:14,border:`1.5px solid ${T.border}`,background:T.paper}}/>
            <Btn onClick={sendOtp} variant={otpSent?"ghost":"outline"} size="sm" disabled={loading}>
              {loading?"…":otpSent?"Resend":"Get OTP"}
            </Btn>
          </div>
        </div>
        {otpSent&&(
          <div style={{marginBottom:24}}>
            <label style={{fontSize:11,fontWeight:700,color:T.mist,display:"block",marginBottom:6,
              textTransform:"uppercase",letterSpacing:".06em",fontFamily:"'Outfit',sans-serif"}}>Enter OTP</label>
            <input placeholder="• • • • • •" maxLength={6} value={form.otp}
              onChange={e=>setForm(prev=>({...prev,otp:e.target.value.replace(/\D/g,"")}))}
              style={{width:"100%",padding:"15px",borderRadius:12,fontSize:26,
                border:`1.5px solid ${T.border}`,background:T.paper,
                textAlign:"center",letterSpacing:".4em",fontWeight:700,color:T.primary,boxSizing:"border-box"}}/>
          </div>
        )}
        <Btn onClick={submit} variant="primary" size="md" full disabled={loading} style={{marginBottom:18}}>
          {loading?"Processing…":tab==="login"?"Login →":"Create Account →"}
        </Btn>
        <div style={{fontSize:11,color:T.mist,textAlign:"center",lineHeight:1.7}}>
          By continuing, you agree to our{" "}
          <span style={{color:T.primary,cursor:"pointer",fontWeight:600}}>Terms</span> and{" "}
          <span style={{color:T.primary,cursor:"pointer",fontWeight:600}}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

// ── ADMIN PAGE ────────────────────────────────────────────────────
const AdminPage = ({setPage}) => {
  const [tab,setTab]=useState("leads");
  const [data,setData]=useState([]);
  const [loading,setLoading]=useState(true);
  const [adminKey,setAdminKey]=useState("");
  const [authed,setAuthed]=useState(false);
  const ADMIN_KEY=import.meta.env.VITE_ADMIN_KEY||"mt-admin-2025";
  const load=async(t)=>{
    setLoading(true);
    try{const r=await fetch(`${API}/api/admin/${t}`,{headers:{"x-admin-key":adminKey}});const j=await r.json();setData(j[t]||[]);}catch{setData([]);}
    setLoading(false);
  };
  useEffect(()=>{if(authed)load(tab);},[tab,authed]);

  if(!authed) return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:T.white,borderRadius:28,padding:48,width:"100%",maxWidth:400,
        boxShadow:"0 20px 70px rgba(79,70,229,.1)",border:`1.5px solid ${T.border}`,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:18}}>🔐</div>
        <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:24,color:T.ink,marginBottom:10}}>Admin Access</div>
        <div style={{fontSize:14,color:T.mist,marginBottom:26}}>Enter your admin key</div>
        <input type="password" placeholder="Admin key" value={adminKey}
          onChange={e=>setAdminKey(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&setAuthed(adminKey===ADMIN_KEY)}
          style={{width:"100%",padding:"14px 16px",borderRadius:12,fontSize:15,
            border:`1.5px solid ${T.border}`,background:T.paper,marginBottom:16,boxSizing:"border-box",textAlign:"center",letterSpacing:".2em"}}/>
        <Btn onClick={()=>setAuthed(adminKey===ADMIN_KEY)} variant="primary" size="md" full>Access Dashboard →</Btn>
      </div>
    </div>
  );

  const tabs=[
    {k:"leads",label:"📋 Leads",cols:["name","phone","email","product","status","created_at"]},
    {k:"policies",label:"📄 Policies",cols:["policy_number","holder_name","holder_email","plan_id","status","issued_at"]},
    {k:"transactions",label:"💳 Transactions",cols:["stripe_session_id","plan_id","amount","status","created_at"]},
    {k:"claims",label:"🩺 Claims",cols:["claim_number","claim_type","amount_claimed","status","created_at"]},
  ];
  const activeTab=tabs.find(t=>t.k===tab);

  return (
    <div style={{background:T.paper,minHeight:"100vh"}}>
      <div style={{background:`linear-gradient(135deg,${T.primary},#312E81)`,padding:"34px 28px"}}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:26,color:"#fff",marginBottom:6}}>MT Admin</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.55)"}}>Manage leads, policies, transactions & claims</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>load(tab)} variant="white" size="sm">🔄 Refresh</Btn>
            <Btn onClick={()=>setPage("home")} variant="ghost" size="sm" style={{color:"#fff",borderColor:"rgba(255,255,255,.3)"}}>← Site</Btn>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"30px 28px"}}>
        <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"11px 20px",borderRadius:12,
              border:`1.5px solid ${tab===t.k?T.primary:T.border}`,
              background:tab===t.k?T.primary:T.white,color:tab===t.k?"#fff":T.slate,
              fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{t.label}</button>
          ))}
        </div>
        <div style={{background:T.white,borderRadius:18,border:`1.5px solid ${T.border}`,overflow:"hidden"}}>
          <div style={{padding:"18px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
            <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:16,color:T.ink}}>{activeTab.label}</div>
            <div style={{fontSize:12,color:T.mist}}>{data.length} records</div>
          </div>
          {loading?(
            <div style={{padding:52,textAlign:"center"}}>
              <div style={{width:40,height:40,borderRadius:"50%",border:`3px solid ${T.border}`,
                borderTopColor:T.primary,animation:"spin .8s linear infinite",margin:"0 auto 14px"}}/>
              <div style={{color:T.mist,fontSize:14}}>Loading...</div>
            </div>
          ):(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{background:T.paper}}>
                  {activeTab.cols.map(c=>(
                    <th key={c} style={{padding:"13px 18px",textAlign:"left",fontWeight:700,color:T.slate,
                      fontSize:11,textTransform:"uppercase",letterSpacing:".06em",
                      borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif"}}>{c.replace(/_/g," ")}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {data.length===0?(
                    <tr><td colSpan={activeTab.cols.length} style={{padding:36,textAlign:"center",color:T.mist}}>No records yet.</td></tr>
                  ):data.map((row,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${T.border}`}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.paper}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {activeTab.cols.map(c=>(
                        <td key={c} style={{padding:"14px 18px",color:T.ink,whiteSpace:"nowrap",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis"}}>
                          {c==="status"?(
                            <span style={{padding:"4px 12px",borderRadius:99,fontSize:11,fontWeight:700,
                              background:row[c]==="active"||row[c]==="paid"?T.successLt:row[c]==="pending"||row[c]==="new"?T.amberLt:T.dangerLt,
                              color:row[c]==="active"||row[c]==="paid"?T.success:row[c]==="pending"||row[c]==="new"?T.amber:T.danger}}>{row[c]}</span>
                          ):c.includes("_at")?(row[c]?new Date(row[c]).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"-"
                          ):c==="amount"?(row[c]?`₹${Number(row[c]).toLocaleString()}`:"-"):(row[c]||"-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── APP ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("home");
  const render=()=>{
    if(page==="home") return <HomePage setPage={setPage}/>;
    if(page==="claims") return <ClaimsPage/>;
    if(page==="about") return <AboutPage/>;
    if(page==="login") return <LoginPage setPage={setPage}/>;
    if(page==="admin") return <AdminPage setPage={setPage}/>;
    if(["car","health","life","travel"].includes(page)) return <ProductPage type={page} setPage={setPage}/>;
    return <HomePage setPage={setPage}/>;
  };
  return (
    <>
      <style>{STYLES}</style>
      <div style={{minHeight:"100vh",background:T.paper}}>
        <Navbar page={page} setPage={setPage}/>
        {render()}
        <div style={{position:"fixed",bottom:16,right:16,zIndex:999,opacity:0,transition:"opacity .2s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="1"}
          onMouseLeave={e=>e.currentTarget.style.opacity="0"}>
          <button onClick={()=>setPage("admin")} style={{
            background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,
            color:"#fff",border:"none",borderRadius:12,padding:"9px 16px",fontSize:12,
            cursor:"pointer",fontWeight:700,boxShadow:`0 4px 20px ${T.primary}40`,
            fontFamily:"'Outfit',sans-serif"}}>Admin ⚙</button>
        </div>
      </div>
    </>
  );
}
