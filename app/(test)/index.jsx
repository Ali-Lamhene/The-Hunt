import { useState, useEffect, useRef } from "react";

/* ─── FONTS ─────────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Special+Elite&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  `}</style>
);

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────── */
const T = {
  parchment: "#f4ede0",
  cream: "#faf6ee",
  inkDark: "#1a0e05",
  inkMid: "#3d2410",
  inkLight: "#7a5c3a",
  inkFaint: "#c4a882",
  hunterRed: "#c0392b",
  preyGreen: "#2d6a4f",
  alertAmber: "#d4830a",
  white: "#ffffff",
  shadow: "rgba(26,14,5,0.12)",
};

/* ─── JUNGLE ILLUSTRATIONS ───────────────────────────────────────────────── */
const JungleCorners = ({ intensity = 1, dark = false }) => {
  const col = dark ? "#e8d5a3" : "#1a5c30";
  const op = dark ? 0.13 * intensity : 0.08 * intensity;
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
      {/* TOP-LEFT large frond cluster */}
      <g opacity={op} fill={col}>
        <path d="M-20 -10 Q60 10 90 80 Q50 95 10 60 Q-15 35 -20 -10Z"/>
        <path d="M-30 30 Q50 25 75 100 Q30 105 -10 70 Q-28 55 -30 30Z"/>
        <path d="M5 -20 Q80 30 70 110 Q30 95 5 -20Z"/>
        <path d="M-25 70 Q45 55 65 130 Q20 138 -15 100 Q-28 85 -25 70Z"/>
        <path d="M40 -30 Q95 20 85 90 Q55 80 40 -30Z"/>
        {/* stem lines */}
        <path d="M-5 5 Q30 45 20 90" fill="none" stroke={col} strokeWidth="1.5" opacity="0.6"/>
        <path d="M10 -10 Q55 30 45 100" fill="none" stroke={col} strokeWidth="1" opacity="0.4"/>
      </g>
      {/* TOP-RIGHT fronds */}
      <g opacity={op} fill={col}>
        <path d="M410 -10 Q330 10 300 80 Q340 95 380 60 Q415 35 410 -10Z"/>
        <path d="M420 30 Q340 25 315 100 Q360 105 400 70 Q418 55 420 30Z"/>
        <path d="M385 -20 Q310 30 320 110 Q360 95 385 -20Z"/>
        <path d="M415 70 Q345 55 325 130 Q370 138 405 100 Q418 85 415 70Z"/>
        <path d="M350 -30 Q295 20 305 90 Q335 80 350 -30Z"/>
        <path d="M395 5 Q360 45 370 90" fill="none" stroke={col} strokeWidth="1.5" opacity="0.6"/>
        <path d="M380 -10 Q335 30 345 100" fill="none" stroke={col} strokeWidth="1" opacity="0.4"/>
      </g>
      {/* BOTTOM-LEFT */}
      <g opacity={op} fill={col}>
        <path d="M-20 854 Q60 834 90 764 Q50 749 10 784 Q-15 809 -20 854Z"/>
        <path d="M-30 814 Q50 819 75 744 Q30 739 -10 774 Q-28 789 -30 814Z"/>
        <path d="M5 864 Q80 814 70 734 Q30 749 5 864Z"/>
        <path d="M-25 774 Q45 789 65 714 Q20 706 -15 744 Q-28 759 -25 774Z"/>
      </g>
      {/* BOTTOM-RIGHT */}
      <g opacity={op} fill={col}>
        <path d="M410 854 Q330 834 300 764 Q340 749 380 784 Q415 809 410 854Z"/>
        <path d="M420 814 Q340 819 315 744 Q360 739 400 774 Q418 789 420 814Z"/>
        <path d="M385 864 Q310 814 320 734 Q360 749 385 864Z"/>
      </g>
      {/* side vines */}
      <g opacity={op * 0.7} fill="none" stroke={col} strokeWidth="1.5">
        <path d="M-5 200 Q15 230 5 270 Q-8 260 -5 200Z" fill={col}/>
        <path d="M395 350 Q378 380 388 420 Q400 410 395 350Z" fill={col}/>
        <path d="M-5 450 Q15 480 5 520 Q-8 510 -5 450Z" fill={col}/>
        <path d="M395 550 Q378 580 388 620 Q400 610 395 550Z" fill={col}/>
      </g>
      {/* scattered mid leaves */}
      <g opacity={op * 0.8} fill={col}>
        <path d="M2 310 Q22 295 32 320 Q15 328 2 310Z"/>
        <path d="M358 400 Q378 385 388 410 Q371 418 358 400Z"/>
        <path d="M2 520 Q22 505 32 530 Q15 538 2 520Z"/>
        <path d="M358 600 Q378 585 388 610 Q371 618 358 600Z"/>
      </g>
    </svg>
  );
};

const CrosshairWatermark = ({ dark = false }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 390 844">
    <g opacity={dark ? 0.06 : 0.04} stroke={dark ? "#e8d5a3" : "#1a0e05"} strokeWidth="1" fill="none" transform="translate(195,422)">
      <circle r="60"/>
      <circle r="38"/>
      <circle r="12"/>
      <line x1="-80" y1="0" x2="-45" y2="0"/>
      <line x1="45" y1="0" x2="80" y2="0"/>
      <line x1="0" y1="-80" x2="0" y2="-45"/>
      <line x1="0" y1="45" x2="0" y2="80"/>
      <line x1="-80" y1="-80" x2="-60" y2="-60" opacity="0.4"/>
      <line x1="60" y1="-60" x2="80" y2="-80" opacity="0.4"/>
      <line x1="-80" y1="80" x2="-60" y2="60" opacity="0.4"/>
      <line x1="60" y1="60" x2="80" y2="80" opacity="0.4"/>
    </g>
    <g opacity={dark ? 0.04 : 0.03} fill={dark ? "#e8d5a3" : "#1a0e05"}>
      <ellipse cx="80" cy="500" rx="6" ry="9" transform="rotate(-20 80 500)"/>
      <ellipse cx="96" cy="522" rx="6" ry="9" transform="rotate(20 96 522)"/>
      <ellipse cx="82" cy="543" rx="6" ry="9" transform="rotate(-20 82 543)"/>
      <ellipse cx="310" cy="320" rx="6" ry="9" transform="rotate(160 310 320)"/>
      <ellipse cx="296" cy="342" rx="6" ry="9" transform="rotate(200 296 342)"/>
    </g>
  </svg>
);

/* ─── SHARED COMPONENTS ──────────────────────────────────────────────────── */
const StatusBar = ({ dark = false }) => {
  const [time, setTime] = useState("09:41");
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`);
    }, 10000);
    return () => clearInterval(t);
  }, []);
  const c = dark ? "#e8d5a3" : T.inkDark;
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px 8px", fontSize:11, fontWeight:600, color:c, letterSpacing:"0.05em", zIndex:2, position:"relative" }}>
      <span>{time}</span>
      <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:"0.1em" }}>THE HUNT</span>
      <span>▲▮▮▮</span>
    </div>
  );
};

const NavBar = ({ active, onNav, dark = false }) => {
  const items = [
    { id:"E", icon:"🗺", label:"Carte" },
    { id:"skills", icon:"⚡", label:"Skills" },
    { id:"F", icon:"🎯", label:"Zone" },
    { id:"G", icon:"📷", label:"Capturer" },
  ];
  const bg = dark ? "#1a0e05" : T.white;
  const border = dark ? "rgba(232,213,163,0.15)" : "rgba(60,30,10,0.1)";
  return (
    <div style={{ position:"sticky", bottom:0, background:bg, borderTop:`1px solid ${border}`, display:"flex", justifyContent:"space-around", padding:"10px 0 18px", zIndex:20 }}>
      {items.map(i => (
        <button key={i.id} onClick={() => onNav(i.id)}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontSize:9, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: active===i.id ? (dark ? "#e8d5a3" : T.inkDark) : (dark ? "#7a5c3a" : T.inkLight), background:"none", border:"none", cursor:"pointer", padding:"6px 12px" }}>
          <span style={{ fontSize:22 }}>{i.icon}</span>
          <span>{i.label}</span>
        </button>
      ))}
    </div>
  );
};

/* ─── SCREEN A : ACCUEIL ─────────────────────────────────────────────────── */
const ScreenA = ({ onNavigate }) => {
  const [pseudo, setPseudo] = useState("");
  const [code, setCode] = useState("");
  const [tab, setTab] = useState("join");

  return (
    <div style={{ background:"#0d0802", minHeight:"100vh", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <JungleCorners dark intensity={1.5} />
      <CrosshairWatermark dark />

      {/* Animated fireflies */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} viewBox="0 0 390 844">
        {[...Array(12)].map((_, i) => (
          <circle key={i} cx={40 + i*28} cy={200 + (i%3)*80} r="2" fill="#e8d5a3" opacity="0.4">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
            <animate attributeName="cy" values={`${200+(i%3)*80};${190+(i%3)*80};${200+(i%3)*80}`} dur={`${3+i*0.3}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      <StatusBar dark />

      {/* Logo zone */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 24px 0", position:"relative", zIndex:2 }}>
        {/* Trophy/skull SVG illustration */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom:8 }}>
          {/* Jungle frame around logo */}
          <g opacity="0.5" fill="#2d6a4f">
            <path d="M5 60 Q2 30 25 15 Q18 35 20 60Z"/>
            <path d="M115 60 Q118 30 95 15 Q102 35 100 60Z"/>
            <path d="M5 60 Q2 90 25 105 Q18 85 20 60Z"/>
            <path d="M115 60 Q118 90 95 105 Q102 85 100 60Z"/>
          </g>
          {/* Crosshair */}
          <circle cx="60" cy="60" r="45" fill="none" stroke="#7a5c3a" strokeWidth="1" opacity="0.5"/>
          <circle cx="60" cy="60" r="30" fill="none" stroke="#c0392b" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="60" cy="60" r="5" fill="#c0392b"/>
          <line x1="10" y1="60" x2="30" y2="60" stroke="#c0392b" strokeWidth="2"/>
          <line x1="90" y1="60" x2="110" y2="60" stroke="#c0392b" strokeWidth="2"/>
          <line x1="60" y1="10" x2="60" y2="30" stroke="#c0392b" strokeWidth="2"/>
          <line x1="60" y1="90" x2="60" y2="110" stroke="#c0392b" strokeWidth="2"/>
          {/* Diagonal ticks */}
          <line x1="20" y1="20" x2="30" y2="30" stroke="#e8d5a3" strokeWidth="1" opacity="0.4"/>
          <line x1="90" y1="20" x2="80" y2="30" stroke="#e8d5a3" strokeWidth="1" opacity="0.4"/>
          <line x1="20" y1="100" x2="30" y2="90" stroke="#e8d5a3" strokeWidth="1" opacity="0.4"/>
          <line x1="90" y1="100" x2="80" y2="90" stroke="#e8d5a3" strokeWidth="1" opacity="0.4"/>
        </svg>

        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:72, color:"#e8d5a3", letterSpacing:"0.08em", lineHeight:1, textAlign:"center" }}>
          THE<br/>HUNT
        </div>
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#7a5c3a", letterSpacing:"0.25em", textTransform:"uppercase", marginTop:4, marginBottom:32 }}>
          Géolocalisation · Traque Réelle
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:"rgba(232,213,163,0.08)", borderRadius:4, padding:3, marginBottom:20, width:"100%" }}>
          {["join","create"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:"10px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:16, letterSpacing:"0.1em", color: tab===t ? "#1a0e05" : "#7a5c3a", background: tab===t ? "#e8d5a3" : "transparent", border:"none", borderRadius:3, cursor:"pointer", transition:"all 0.2s" }}>
              {t==="join" ? "Rejoindre" : "Créer une partie"}
            </button>
          ))}
        </div>

        {/* Input pseudo */}
        <div style={{ width:"100%", marginBottom:12 }}>
          <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:6 }}>Pseudonyme</div>
          <input value={pseudo} onChange={e=>setPseudo(e.target.value)} placeholder="Ex : Shadow_Wolf" maxLength={20}
            style={{ width:"100%", background:"rgba(232,213,163,0.06)", border:"1px solid rgba(232,213,163,0.2)", borderRadius:4, padding:"14px 16px", color:"#e8d5a3", fontSize:16, fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none" }}/>
        </div>

        {tab==="join" ? (
          <div style={{ width:"100%", marginBottom:20 }}>
            <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:6 }}>Code de partie (6 chiffres)</div>
            <input value={code} onChange={e=>setCode(e.target.value.replace(/\D/,"").slice(0,6))} placeholder="• • • • • •" maxLength={6}
              style={{ width:"100%", background:"rgba(232,213,163,0.06)", border:"1px solid rgba(232,213,163,0.2)", borderRadius:4, padding:"14px 16px", color:"#e8d5a3", fontSize:24, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.4em", boxSizing:"border-box", outline:"none", textAlign:"center" }}/>
          </div>
        ) : (
          <div style={{ width:"100%", marginBottom:20 }}>
            <div style={{ background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.3)", borderRadius:4, padding:"12px 16px", marginBottom:8 }}>
              <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#e8d5a3", lineHeight:1.5 }}>
                En créant la partie, vous serez désigné <span style={{ color:"#e8d5a3", fontWeight:700 }}>Hôte</span> et aurez accès à la configuration de la zone.
              </div>
            </div>
          </div>
        )}

        <button onClick={() => onNavigate(tab==="create" ? "B" : "C")}
          style={{ width:"100%", background:"#c0392b", color:"#e8d5a3", border:"none", borderRadius:4, padding:"18px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.2em", cursor:"pointer", marginBottom:16 }}>
          {tab==="join" ? "Rejoindre la chasse →" : "Créer la zone →"}
        </button>

        <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"rgba(122,92,58,0.6)", textAlign:"center", letterSpacing:"0.08em" }}>
          v2.4.1 · Anthropic Demo · GPS requis
        </div>
      </div>
    </div>
  );
};

/* ─── SCREEN B : CONFIGURATION ───────────────────────────────────────────── */
const ScreenB = ({ onNavigate }) => {
  const [mode, setMode] = useState("cercle");
  const [radius, setRadius] = useState(400);
  const [duration, setDuration] = useState(60);
  const [ratio, setRatio] = useState(20);
  const [zones, setZones] = useState(4);

  return (
    <div style={{ background:"#0d0802", minHeight:"100vh", position:"relative", overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}>
      <JungleCorners dark intensity={0.8} />
      <StatusBar dark />

      <div style={{ padding:"0 20px 100px", position:"relative", zIndex:2 }}>
        {/* Header */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:"#e8d5a3", letterSpacing:"0.06em", lineHeight:1 }}>Configuration</div>
          <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase" }}>Zone de jeu · Hôte uniquement</div>
        </div>

        {/* Map mode selector */}
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:8 }}>Mode de zone</div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {["cercle","polygone"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex:1, padding:"12px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:16, letterSpacing:"0.1em", color: mode===m ? "#1a0e05" : "#7a5c3a", background: mode===m ? "#e8d5a3" : "rgba(232,213,163,0.08)", border:`1px solid ${mode===m ? "#e8d5a3" : "rgba(232,213,163,0.15)"}`, borderRadius:4, cursor:"pointer" }}>
              {m === "cercle" ? "⬤ Mode Express" : "⬡ Mode Expert"}
            </button>
          ))}
        </div>

        {/* Interactive mini-map */}
        <div style={{ background:"rgba(30,50,25,0.6)", border:"1px solid rgba(45,106,79,0.3)", borderRadius:4, marginBottom:16, overflow:"hidden", position:"relative" }}>
          <svg width="100%" viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg">
            {/* Map bg texture */}
            <rect width="340" height="200" fill="#1a2d1a" opacity="0.8"/>
            {/* Grid */}
            <g stroke="#2d6a4f" strokeWidth="0.3" opacity="0.3">
              {[0,1,2,3,4,5,6].map(i => <line key={`h${i}`} x1="0" y1={i*33} x2="340" y2={i*33}/>)}
              {[0,1,2,3,4,5,6,7,8,9].map(i => <line key={`v${i}`} x1={i*38} y1="0" x2={i*38} y2="200"/>)}
            </g>
            {/* Streets */}
            <g stroke="#3d5c3a" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5">
              <path d="M40 100 Q120 80 200 100 Q280 120 340 95"/>
              <path d="M170 20 Q160 80 175 160"/>
              <path d="M0 140 Q80 130 120 160"/>
              <path d="M220 30 Q210 90 230 140"/>
              <path d="M270 160 Q290 120 330 110"/>
            </g>
            {/* Zone boundary */}
            {mode === "cercle" ? (
              <>
                <circle cx="170" cy="100" r={Math.min(radius/5, 80)} fill="rgba(192,57,43,0.08)" stroke="#c0392b" strokeWidth="1.5" strokeDasharray="5,4"/>
                <circle cx="170" cy="100" r="6" fill="#c0392b"/>
                <circle cx="170" cy="100" r="12" fill="none" stroke="#c0392b" strokeWidth="1" opacity="0.5"/>
                {/* radius label */}
                <text x={170 + Math.min(radius/5,80)/2} y="90" fill="#c0392b" fontSize="9" fontFamily="'Bebas Neue',sans-serif">r={radius}m</text>
                <line x1="170" y1="100" x2={170 + Math.min(radius/5,80)} y2="100" stroke="#c0392b" strokeWidth="1" strokeDasharray="3,2"/>
              </>
            ) : (
              <>
                <polygon points="100,40 250,30 290,120 200,175 80,160 50,90" fill="rgba(192,57,43,0.08)" stroke="#c0392b" strokeWidth="1.5" strokeDasharray="5,4"/>
                {[{x:100,y:40},{x:250,y:30},{x:290,y:120},{x:200,y:175},{x:80,y:160},{x:50,y:90}].map((p,i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="5" fill="#c0392b" stroke="#1a2d1a" strokeWidth="1.5"/>
                ))}
              </>
            )}
            {/* Objective zones */}
            <circle cx="130" cy="80" r="10" fill="none" stroke="#e8d5a3" strokeWidth="1" strokeDasharray="3,2" opacity="0.6"/>
            <circle cx="220" cy="130" r="10" fill="none" stroke="#e8d5a3" strokeWidth="1" strokeDasharray="3,2" opacity="0.6"/>
            <circle cx="160" cy="155" r="10" fill="none" stroke="#e8d5a3" strokeWidth="1" strokeDasharray="3,2" opacity="0.6"/>
            {/* Compass */}
            <text x="15" y="22" fill="#7a5c3a" fontSize="11" fontFamily="'Bebas Neue',sans-serif">N</text>
            <line x1="20" y1="24" x2="20" y2="36" stroke="#7a5c3a" strokeWidth="1.5"/>
            {/* Scale bar */}
            <line x1="260" y1="185" x2="320" y2="185" stroke="#7a5c3a" strokeWidth="1.5"/>
            <text x="275" y="180" fill="#7a5c3a" fontSize="8" fontFamily="sans-serif">{radius}m</text>
          </svg>
          <div style={{ padding:"8px 14px", borderTop:"1px solid rgba(45,106,79,0.2)" }}>
            <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.1em" }}>
              {mode==="cercle" ? "Appuyez longuement pour déplacer le centre" : "Appuyez pour ajouter un point · Maintenez pour supprimer"}
            </div>
          </div>
        </div>

        {/* Radius slider (cercle only) */}
        {mode === "cercle" && (
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase" }}>Rayon</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#e8d5a3" }}>{radius}m</div>
            </div>
            <input type="range" min="100" max="2000" value={radius} onChange={e=>setRadius(+e.target.value)} style={{ width:"100%", accentColor:"#c0392b" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#7a5c3a", marginTop:4 }}>
              <span>100m</span><span>Salon</span><span>Parc</span><span>Quartier</span><span>2km</span>
            </div>
          </div>
        )}

        {/* Game params */}
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:12, marginTop:8 }}>Paramètres de partie</div>

        {[
          { label:"Durée", value:duration, setValue:setDuration, min:20, max:120, unit:"min", key:"duration" },
          { label:"% Chasseurs", value:ratio, setValue:setRatio, min:10, max:40, unit:"%", key:"ratio" },
          { label:"Points d'objectifs", value:zones, setValue:setZones, min:1, max:10, unit:"zones", key:"zones" },
        ].map(s => (
          <div key={s.key} style={{ background:"rgba(232,213,163,0.04)", border:"1px solid rgba(232,213,163,0.1)", borderRadius:4, padding:"12px 14px", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontFamily:"'Special Elite',serif", fontSize:12, color:"#c4a882" }}>{s.label}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#e8d5a3" }}>{s.value} <span style={{ fontSize:13, color:"#7a5c3a" }}>{s.unit}</span></div>
            </div>
            <input type="range" min={s.min} max={s.max} value={s.value} onChange={e=>s.setValue(+e.target.value)} style={{ width:"100%", accentColor:"#2d6a4f" }}/>
          </div>
        ))}

        {/* Summary */}
        <div style={{ background:"rgba(192,57,43,0.08)", border:"1px solid rgba(192,57,43,0.2)", borderRadius:4, padding:"12px 16px", margin:"16px 0" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:"#c0392b", letterSpacing:"0.1em", marginBottom:6 }}>Résumé estimé (20 joueurs)</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, fontSize:11, color:"#c4a882", fontFamily:"'DM Sans',sans-serif" }}>
            <span>🎯 Chasseurs : {Math.round(20 * ratio / 100)}</span>
            <span>🦊 Proies : {Math.round(20 * (100-ratio) / 100)}</span>
            <span>⏱ Durée : {duration} min</span>
            <span>📍 Zones : {zones}</span>
          </div>
        </div>

        <button onClick={() => onNavigate("C")}
          style={{ width:"100%", background:"#c0392b", color:"#e8d5a3", border:"none", borderRadius:4, padding:"18px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.2em", cursor:"pointer" }}>
          Ouvrir le Lobby →
        </button>
      </div>
    </div>
  );
};

/* ─── SCREEN C : LOBBY ───────────────────────────────────────────────────── */
const ScreenC = ({ onNavigate }) => {
  const players = [
    { id:1, name:"Shadow_Wolf", ready:true, role:"hôte" },
    { id:2, name:"NightRunner", ready:true },
    { id:3, name:"UrbanFox", ready:false },
    { id:4, name:"GhostStep", ready:true },
    { id:5, name:"SilentBlade", ready:true },
    { id:6, name:"DarkHunter", ready:false },
    { id:7, name:"ZeroTrace", ready:true },
    { id:8, name:"IronMask", ready:true },
  ];
  const [msgs, setMsgs] = useState([
    { user:"Shadow_Wolf", text:"RDV devant la fontaine ! 5 min" },
    { user:"NightRunner", text:"J'arrive, j'suis au coin de la rue" },
    { user:"GhostStep", text:"OK prêt 👊" },
  ]);
  const [input, setInput] = useState("");

  return (
    <div style={{ background:"#0d0802", minHeight:"100vh", position:"relative", fontFamily:"'DM Sans',sans-serif" }}>
      <JungleCorners dark intensity={0.7} />
      <StatusBar dark />

      <div style={{ padding:"0 20px 20px", position:"relative", zIndex:2 }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:"#e8d5a3", letterSpacing:"0.06em" }}>Lobby</div>
            <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase" }}>Code : 483-921</div>
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#c0392b" }}>{players.filter(p=>p.ready).length}/{players.length}</div>
        </div>

        {/* Players grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {players.map(p => (
            <div key={p.id} style={{ background:"rgba(232,213,163,0.05)", border:`1px solid ${p.ready ? "rgba(45,106,79,0.4)" : "rgba(232,213,163,0.1)"}`, borderRadius:4, padding:"10px 12px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background: p.ready ? "#2d6a4f" : "#3d2410", flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#e8d5a3", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                {p.role && <div style={{ fontSize:9, color:"#c0392b", letterSpacing:"0.1em", textTransform:"uppercase" }}>{p.role}</div>}
              </div>
              <div style={{ fontSize:10, color: p.ready ? "#2d6a4f" : "#7a5c3a" }}>{p.ready ? "✓" : "…"}</div>
            </div>
          ))}
          {/* Empty slots */}
          {[...Array(4)].map((_, i) => (
            <div key={`e${i}`} style={{ background:"rgba(232,213,163,0.02)", border:"1px dashed rgba(232,213,163,0.08)", borderRadius:4, padding:"10px 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:10, color:"rgba(122,92,58,0.4)", letterSpacing:"0.1em" }}>En attente…</div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:8 }}>Coordination</div>
        <div style={{ background:"rgba(232,213,163,0.03)", border:"1px solid rgba(232,213,163,0.1)", borderRadius:4, marginBottom:8 }}>
          <div style={{ padding:"10px 12px", maxHeight:120, overflowY:"auto" }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ marginBottom:6 }}>
                <span style={{ fontSize:10, fontWeight:600, color:"#c4a882" }}>{m.user}</span>
                <span style={{ fontSize:12, color:"#e8d5a3", marginLeft:6 }}>{m.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", borderTop:"1px solid rgba(232,213,163,0.08)" }}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Message…" onKeyDown={e=>{if(e.key==="Enter"&&input){setMsgs([...msgs,{user:"Vous",text:input}]);setInput("");}}}
              style={{ flex:1, background:"transparent", border:"none", padding:"10px 12px", color:"#e8d5a3", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
            <button onClick={()=>{if(input){setMsgs([...msgs,{user:"Vous",text:input}]);setInput("");}}} style={{ padding:"0 14px", background:"none", border:"none", color:"#7a5c3a", fontSize:18, cursor:"pointer" }}>↑</button>
          </div>
        </div>

        <button onClick={() => onNavigate("D")}
          style={{ width:"100%", background:"#c0392b", color:"#e8d5a3", border:"none", borderRadius:4, padding:"18px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.2em", cursor:"pointer", marginTop:8 }}>
          Lancer la Partie →
        </button>
      </div>
    </div>
  );
};

/* ─── SCREEN D : RÉVÉLATION DU RÔLE ─────────────────────────────────────── */
const ScreenD = ({ onNavigate }) => {
  const [phase, setPhase] = useState("countdown");
  const [count, setCount] = useState(3);
  const [role] = useState("PROIE");
  const isHunter = role === "CHASSEUR";

  useEffect(() => {
    if (phase === "countdown" && count > 0) {
      const t = setTimeout(() => setCount(c => c-1), 900);
      return () => clearTimeout(t);
    } else if (phase === "countdown" && count === 0) {
      setTimeout(() => setPhase("reveal"), 400);
    }
  }, [phase, count]);

  const roleColor = isHunter ? "#c0392b" : "#2d6a4f";
  const roleLight = isHunter ? "#f5c6c5" : "#a8d5bc";

  return (
    <div style={{ background:"#0d0802", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <JungleCorners dark intensity={1.2} />

      {/* Glitch lines */}
      {phase === "reveal" && (
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", animation:"glitch 0.3s steps(2) 3" }} viewBox="0 0 390 844">
          <style>{`@keyframes glitch{0%,100%{opacity:0}50%{opacity:0.15}}`}</style>
          <rect x="0" y="200" width="390" height="3" fill="#c0392b"/>
          <rect x="0" y="400" width="390" height="2" fill="#2d6a4f"/>
          <rect x="0" y="600" width="390" height="2" fill="#c0392b"/>
        </svg>
      )}

      <StatusBar dark />

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%", padding:"0 20px", position:"relative", zIndex:2 }}>

        {phase === "countdown" ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Special Elite',serif", fontSize:14, color:"#7a5c3a", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:20 }}>La chasse commence dans</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:180, color:"#e8d5a3", lineHeight:1, animation:"pop 0.2s ease-out" }}>
              {count === 0 ? "!" : count}
            </div>
          </div>
        ) : (
          <div style={{ textAlign:"center", width:"100%" }}>
            {/* Role illustration */}
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ marginBottom:16, display:"block", margin:"0 auto 16px" }}>
              {/* Jungle frame */}
              <g opacity="0.6" fill={roleColor}>
                <path d="M5 80 Q2 45 30 20 Q22 45 25 80Z"/>
                <path d="M155 80 Q158 45 130 20 Q138 45 135 80Z"/>
                <path d="M5 80 Q2 115 30 140 Q22 115 25 80Z"/>
                <path d="M155 80 Q158 115 130 140 Q138 115 135 80Z"/>
              </g>
              {isHunter ? (
                // Crosshair for hunter
                <g>
                  <circle cx="80" cy="80" r="55" fill="none" stroke={roleColor} strokeWidth="2" opacity="0.5"/>
                  <circle cx="80" cy="80" r="35" fill="none" stroke={roleColor} strokeWidth="2"/>
                  <circle cx="80" cy="80" r="8" fill={roleColor}/>
                  <line x1="20" y1="80" x2="44" y2="80" stroke={roleColor} strokeWidth="2.5"/>
                  <line x1="116" y1="80" x2="140" y2="80" stroke={roleColor} strokeWidth="2.5"/>
                  <line x1="80" y1="20" x2="80" y2="44" stroke={roleColor} strokeWidth="2.5"/>
                  <line x1="80" y1="116" x2="80" y2="140" stroke={roleColor} strokeWidth="2.5"/>
                </g>
              ) : (
                // Fox/prey silhouette
                <g fill={roleColor} opacity="0.9">
                  <path d="M80 100 Q65 90 60 75 Q55 60 65 52 L60 35 L75 50 Q80 45 85 45 L100 30 L95 48 Q105 55 105 70 Q103 88 95 100Z"/>
                  <circle cx="72" cy="68" r="3" fill="#0d0802"/>
                  <circle cx="88" cy="68" r="3" fill="#0d0802"/>
                  <path d="M75 78 Q80 82 85 78" fill="none" stroke="#0d0802" strokeWidth="1.5"/>
                </g>
              )}
            </svg>

            <div style={{ fontFamily:"'Special Elite',serif", fontSize:12, color:"#7a5c3a", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:8 }}>Votre rôle</div>

            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:76, color:roleColor, letterSpacing:"0.05em", lineHeight:1, marginBottom:8, textShadow:`0 0 40px ${roleColor}33` }}>
              {role}
            </div>

            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${roleColor}18`, border:`1px solid ${roleColor}44`, borderRadius:4, padding:"8px 20px", marginBottom:24 }}>
              <span style={{ fontSize:16 }}>{isHunter ? "🎯" : "👁"}</span>
              <span style={{ fontFamily:"'Special Elite',serif", fontSize:12, color:roleLight }}>{isHunter ? "Compétence : Scan Forcé" : "Compétence : Fantôme"}</span>
            </div>

            <div style={{ background:"rgba(232,213,163,0.05)", border:"1px solid rgba(232,213,163,0.1)", borderRadius:4, padding:"14px 16px", marginBottom:24, textAlign:"left" }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#c4a882", lineHeight:1.6 }}>
                {isHunter
                  ? "Traque et capture toutes les proies avant la fin du temps. Scanne leur QR Code pour les éliminer."
                  : "Survie jusqu'à la fin du chrono. Complète les zones d'objectifs pour réduire le temps de jeu."}
              </div>
            </div>

            <button onClick={() => onNavigate("E")}
              style={{ width:"100%", background:roleColor, color:"#e8d5a3", border:"none", borderRadius:4, padding:"18px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.2em", cursor:"pointer" }}>
              Commencer →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── SCREEN E : CARTE PRINCIPALE ────────────────────────────────────────── */
const ScreenE = ({ onNavigate }) => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [radarSweep, setRadarSweep] = useState(false);
  const [timer, setTimer] = useState(37*60+42);

  useEffect(() => {
    const t = setInterval(() => setTimer(s => s > 0 ? s-1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = Math.floor(timer/60), ss = timer%60;

  const skills = [
    { id:"leurre", icon:"📍", label:"Leurre", cd:false },
    { id:"ghost", icon:"👻", label:"Fantôme", cd:true, left:"04:12" },
    { id:"radar", icon:"📡", label:"Radar", cd:false },
  ];

  return (
    <div style={{ background:"#1a2d1a", minHeight:"100vh", position:"relative", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      {/* HUD top */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10 }}>
        <StatusBar dark />
        {/* Timer + danger gauge */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"4px 20px 10px", gap:16 }}>
          <div style={{ flex:1, background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.3)", borderRadius:4, padding:"4px 12px" }}>
            <div style={{ fontSize:9, color:"#c0392b", letterSpacing:"0.15em", textTransform:"uppercase" }}>Danger</div>
            <div style={{ height:4, background:"rgba(232,213,163,0.1)", borderRadius:2, marginTop:4, overflow:"hidden" }}>
              <div style={{ width:"40%", height:"100%", background:"#c0392b", borderRadius:2, animation:"dangerPulse 1.5s infinite" }}/>
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:40, color:"#e8d5a3", lineHeight:1, letterSpacing:"0.05em" }}>
              {String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}
            </div>
          </div>
          <div style={{ flex:1, background:"rgba(232,213,163,0.06)", border:"1px solid rgba(232,213,163,0.1)", borderRadius:4, padding:"4px 12px", textAlign:"right" }}>
            <div style={{ fontSize:9, color:"#7a5c3a", letterSpacing:"0.15em" }}>Proies</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#e8d5a3" }}>6/8</div>
          </div>
        </div>
      </div>

      {/* MAP - Full screen */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <svg width="100%" height="100%" viewBox="0 0 390 600" preserveAspectRatio="xMidYMid slice" style={{ position:"absolute", inset:0 }}>
          {/* Map background - jungle tones */}
          <rect width="390" height="600" fill="#1e3a1e"/>
          {/* Terrain blocks */}
          <rect x="40" y="60" width="120" height="80" fill="#243a24" rx="4" opacity="0.7"/>
          <rect x="230" y="120" width="100" height="60" fill="#243a24" rx="4" opacity="0.7"/>
          <rect x="100" y="280" width="80" height="60" fill="#243a24" rx="4" opacity="0.7"/>
          <rect x="260" y="320" width="90" height="80" fill="#243a24" rx="4" opacity="0.7"/>
          {/* Roads */}
          <g stroke="#2a4a2a" strokeWidth="10" strokeLinecap="round" fill="none">
            <path d="M0 200 Q80 185 195 200 Q310 215 390 190"/>
            <path d="M195 0 Q185 100 200 200 Q212 300 195 400"/>
            <path d="M0 360 Q100 345 195 360"/>
            <path d="M195 360 Q290 345 390 360"/>
          </g>
          {/* Road center lines */}
          <g stroke="#3a5a3a" strokeWidth="1.5" strokeDasharray="12,8" fill="none" opacity="0.5">
            <path d="M0 200 Q80 185 195 200 Q310 215 390 190"/>
            <path d="M195 0 Q185 100 200 200 Q212 300 195 400"/>
          </g>
          {/* Zone boundary */}
          <ellipse cx="195" cy="280" rx="160" ry="230" fill="none" stroke="#c0392b" strokeWidth="2" strokeDasharray="8,5" opacity="0.5"/>
          {/* Objective circles */}
          <circle cx="140" cy="180" r="18" fill="rgba(232,213,163,0.08)" stroke="#e8d5a3" strokeWidth="1.5" strokeDasharray="4,3"/>
          <circle cx="140" cy="180" r="4" fill="#e8d5a3"/>
          <text x="140" y="168" fill="#e8d5a3" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">ALPHA</text>
          <circle cx="280" cy="280" r="18" fill="rgba(232,213,163,0.08)" stroke="#e8d5a3" strokeWidth="1.5" strokeDasharray="4,3"/>
          <circle cx="280" cy="280" r="4" fill="#e8d5a3"/>
          <text x="280" y="268" fill="#e8d5a3" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">BRAVO</text>
          <circle cx="160" cy="360" r="18" fill="rgba(45,106,79,0.2)" stroke="#2d6a4f" strokeWidth="2"/>
          <circle cx="160" cy="360" r="4" fill="#2d6a4f"/>
          <text x="160" y="348" fill="#2d6a4f" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">ACTIF</text>
          {/* Hack progress ring */}
          <circle cx="160" cy="360" r="18" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeDasharray={`${38/100*2*Math.PI*18} ${2*Math.PI*18}`} transform="rotate(-90 160 360)" opacity="0.9"/>

          {/* Radar sweep if active */}
          {radarSweep && (
            <g>
              <circle cx="195" cy="280" r="80" fill="none" stroke="#2d6a4f" strokeWidth="0.5" opacity="0.3"/>
              <circle cx="195" cy="280" r="140" fill="none" stroke="#2d6a4f" strokeWidth="0.5" opacity="0.2"/>
              <path d="M195 280 L275 280 A80 80 0 0 0 195 200Z" fill="rgba(45,106,79,0.1)">
                <animateTransform attributeName="transform" type="rotate" from="0 195 280" to="360 195 280" dur="2s" repeatCount="3"/>
              </path>
            </g>
          )}

          {/* Players */}
          {/* Me (green) */}
          <circle cx="160" cy="360" r="8" fill="#2d6a4f" stroke="#e8d5a3" strokeWidth="2"/>
          <circle cx="160" cy="360" r="16" fill="none" stroke="#2d6a4f" strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="160" y="385" fill="#e8d5a3" fontSize="9" fontFamily="'DM Sans',sans-serif" fontWeight="600" textAnchor="middle">MOI</text>

          {/* Hunters (red) */}
          <circle cx="280" cy="190" r="7" fill="#c0392b" stroke="#e8d5a3" strokeWidth="2"/>
          <circle cx="280" cy="190" r="22" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="4,3" opacity="0.4"/>
          <text x="280" y="175" fill="#c0392b" fontSize="8" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">CHASSEUR</text>
          <circle cx="90" cy="320" r="7" fill="#c0392b" stroke="#e8d5a3" strokeWidth="2" opacity="0.5"/>

          {/* Other prey */}
          <circle cx="230" cy="380" r="6" fill="#1a0e05" stroke="#e8d5a3" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="110" cy="240" r="6" fill="#1a0e05" stroke="#e8d5a3" strokeWidth="1.5" opacity="0.7"/>

          {/* Leurre GPS signal */}
          {activeSkill === "leurre" && (
            <g>
              <circle cx="250" cy="340" r="8" fill="rgba(232,213,163,0.3)" stroke="#e8d5a3" strokeWidth="1.5" strokeDasharray="3,2"/>
              <text x="250" y="328" fill="#e8d5a3" fontSize="8" fontFamily="'DM Sans',sans-serif" textAnchor="middle">LEURRE</text>
            </g>
          )}

          {/* Compass */}
          <g transform="translate(350,30)">
            <circle r="18" fill="rgba(13,8,2,0.7)" stroke="rgba(232,213,163,0.2)" strokeWidth="1"/>
            <text x="0" y="-6" fill="#e8d5a3" fontSize="10" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">N</text>
            <line x1="0" y1="-4" x2="0" y2="8" stroke="#c0392b" strokeWidth="1.5"/>
            <line x1="0" y1="-14" x2="0" y2="-4" stroke="#e8d5a3" strokeWidth="1.5"/>
          </g>

          {/* Scale */}
          <g transform="translate(20,480)">
            <line x1="0" y1="0" x2="50" y2="0" stroke="#7a5c3a" strokeWidth="1.5"/>
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#7a5c3a" strokeWidth="1.5"/>
            <line x1="50" y1="-4" x2="50" y2="4" stroke="#7a5c3a" strokeWidth="1.5"/>
            <text x="25" y="-8" fill="#7a5c3a" fontSize="8" fontFamily="sans-serif" textAnchor="middle">200m</text>
          </g>
        </svg>

        {/* Floating skills */}
        <div style={{ position:"absolute", bottom:16, right:16, display:"flex", flexDirection:"column", gap:10, zIndex:10 }}>
          {skills.map(s => (
            <button key={s.id} onClick={() => { setActiveSkill(activeSkill===s.id ? null : s.id); if(s.id==="radar") setRadarSweep(v=>!v); }}
              style={{ width:56, height:56, background: activeSkill===s.id ? s.cd ? "rgba(122,92,58,0.5)" : "rgba(45,106,79,0.9)" : "rgba(13,8,2,0.85)", border:`2px solid ${activeSkill===s.id ? "#2d6a4f" : "rgba(232,213,163,0.2)"}`, borderRadius:"50%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor: s.cd ? "not-allowed" : "pointer", opacity: s.cd ? 0.5 : 1, gap:1 }}>
              <span style={{ fontSize:22 }}>{s.icon}</span>
              {s.cd && <span style={{ fontSize:8, color:"#7a5c3a", fontFamily:"'Bebas Neue',sans-serif" }}>{s.left}</span>}
            </button>
          ))}
          <button onClick={() => onNavigate("G")}
            style={{ width:56, height:56, background:"rgba(192,57,43,0.9)", border:"2px solid #c0392b", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:24 }}>
            📷
          </button>
        </div>
      </div>

      <NavBar active="E" onNav={onNavigate} dark />
      <style>{`@keyframes dangerPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
};

/* ─── SCREEN F : PIRATAGE DE ZONE ────────────────────────────────────────── */
const ScreenF = ({ onNavigate }) => {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) return;
    const t = setInterval(() => setProgress(p => {
      if (p >= 100) { setComplete(true); clearInterval(t); return 100; }
      return p + 100/60;
    }), 1000);
    return () => clearInterval(t);
  }, [complete]);

  const r = 100, cx = 195, cy = 200;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress/100);

  return (
    <div style={{ background: complete ? "#0a1f0a" : "#0d0802", minHeight:"100vh", position:"relative", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      <JungleCorners dark intensity={complete ? 0.5 : 0.8} />
      <StatusBar dark />

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 20px", position:"relative", zIndex:2 }}>
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#7a5c3a", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:8 }}>
          {complete ? "Zone Validée !" : "Piratage en cours"}
        </div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#e8d5a3", letterSpacing:"0.05em", marginBottom:32 }}>
          Point {complete ? "Bravo ✓" : "Bravo"}
        </div>

        {/* Ring */}
        <div style={{ position:"relative", width:240, height:240, marginBottom:32 }}>
          <svg width="240" height="240" viewBox="0 0 390 400" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
            {/* Background jungle detail in ring area */}
            <g opacity="0.15" fill="#2d6a4f">
              <path d="M50 200 Q30 160 60 130 Q55 160 55 200Z"/>
              <path d="M340 200 Q360 160 330 130 Q335 160 335 200Z"/>
            </g>
            {/* Track */}
            <circle cx="195" cy="200" r={r} fill="none" stroke="rgba(232,213,163,0.1)" strokeWidth="12" strokeLinecap="round"/>
            {/* Progress */}
            <circle cx="195" cy="200" r={r} fill="none"
              stroke={complete ? "#2d6a4f" : progress < 80 ? "#2d6a4f" : "#c0392b"}
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              transform={`rotate(-90 195 200)`}
              style={{ transition:"stroke-dashoffset 0.3s, stroke 0.3s" }}/>
            {/* Center content */}
            <text x="195" y="185" fill="#e8d5a3" fontSize="54" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">{Math.floor(progress)}%</text>
            <text x="195" y="215" fill="#7a5c3a" fontSize="13" fontFamily="'Special Elite',serif" textAnchor="middle">
              {complete ? "Validé !" : `${Math.ceil((100-progress)*60/100)}s restantes`}
            </text>
            {/* Sector marks */}
            {[0,25,50,75].map(pct => {
              const angle = (pct/100)*360 - 90;
              const rad = angle * Math.PI / 180;
              return <circle key={pct} cx={195 + (r+14)*Math.cos(rad)} cy={200 + (r+14)*Math.sin(rad)} r="3" fill="rgba(232,213,163,0.3)"/>;
            })}
          </svg>
        </div>

        {/* -15min chip */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background: complete ? "rgba(45,106,79,0.2)" : "rgba(232,213,163,0.05)", border:`1px solid ${complete ? "rgba(45,106,79,0.5)" : "rgba(232,213,163,0.15)"}`, borderRadius:4, padding:"10px 24px", marginBottom:20 }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color: complete ? "#2d6a4f" : "#e8d5a3" }}>−15 minutes</span>
        </div>

        {!complete && progress > 60 && (
          <div style={{ background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.3)", borderRadius:4, padding:"10px 16px", textAlign:"center", marginBottom:20 }}>
            <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#c0392b" }}>⚠ Ne quittez pas la zone !</div>
          </div>
        )}

        {complete && (
          <button onClick={() => onNavigate("E")}
            style={{ width:"100%", background:"#2d6a4f", color:"#e8d5a3", border:"none", borderRadius:4, padding:"16px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.15em", cursor:"pointer" }}>
            Retour à la Carte →
          </button>
        )}
      </div>
      <NavBar active="F" onNav={onNavigate} dark />
    </div>
  );
};

/* ─── SCREEN G : CAPTURE QR ──────────────────────────────────────────────── */
const ScreenG = ({ onNavigate }) => {
  const [mode, setMode] = useState("prey");
  const [scanned, setScanned] = useState(false);

  return (
    <div style={{ background:"#0d0802", minHeight:"100vh", position:"relative", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      <JungleCorners dark intensity={0.6} />
      <StatusBar dark />

      <div style={{ padding:"0 20px", position:"relative", zIndex:2, flex:1, display:"flex", flexDirection:"column" }}>
        {/* Role toggle */}
        <div style={{ display:"flex", background:"rgba(232,213,163,0.06)", borderRadius:4, padding:3, marginBottom:20 }}>
          {["prey","hunter"].map(m => (
            <button key={m} onClick={() => { setMode(m); setScanned(false); }}
              style={{ flex:1, padding:"10px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:"0.08em", color: mode===m ? "#1a0e05" : "#7a5c3a", background: mode===m ? "#e8d5a3" : "transparent", border:"none", borderRadius:3, cursor:"pointer" }}>
              {m === "prey" ? "🦊 Je suis Proie" : "🎯 Je suis Chasseur"}
            </button>
          ))}
        </div>

        {mode === "prey" ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#c0392b", letterSpacing:"0.06em", marginBottom:4, textAlign:"center" }}>
              Montrez ce code
            </div>
            <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#7a5c3a", letterSpacing:"0.1em", marginBottom:24, textAlign:"center" }}>
              au chasseur qui vous a attrapé
            </div>
            {/* QR Code SVG */}
            <div style={{ background:"#e8d5a3", padding:20, borderRadius:4, marginBottom:20 }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Simplified QR pattern */}
                <rect width="200" height="200" fill="#e8d5a3"/>
                {/* Corner squares */}
                {[[10,10],[140,10],[10,140]].map(([x,y],i) => (
                  <g key={i}>
                    <rect x={x} y={y} width="50" height="50" fill="#1a0e05" rx="4"/>
                    <rect x={x+8} y={y+8} width="34" height="34" fill="#e8d5a3" rx="2"/>
                    <rect x={x+15} y={y+15} width="20" height="20" fill="#1a0e05" rx="1"/>
                  </g>
                ))}
                {/* Data modules */}
                {[...Array(80)].map((_, i) => {
                  const cols = 10, x = 70 + (i%cols)*13, y = 10 + Math.floor(i/cols)*13;
                  if (x > 130 && y < 70) return null;
                  if (x < 70 && y > 130) return null;
                  return Math.random() > 0.45 ? <rect key={i} x={x} y={y} width="9" height="9" fill="#1a0e05" rx="1"/> : null;
                })}
                {/* Center logo area */}
                <rect x="80" y="80" width="40" height="40" fill="#e8d5a3" rx="3"/>
                <circle cx="100" cy="100" r="14" fill="#c0392b"/>
                <line x1="86" y1="100" x2="94" y2="100" stroke="#e8d5a3" strokeWidth="2"/>
                <line x1="106" y1="100" x2="114" y2="100" stroke="#e8d5a3" strokeWidth="2"/>
                <line x1="100" y1="86" x2="100" y2="94" stroke="#e8d5a3" strokeWidth="2"/>
                <line x1="100" y1="106" x2="100" y2="114" stroke="#e8d5a3" strokeWidth="2"/>
              </svg>
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#e8d5a3", letterSpacing:"0.3em", background:"rgba(232,213,163,0.08)", border:"1px solid rgba(232,213,163,0.2)", borderRadius:4, padding:"10px 24px", marginBottom:16 }}>
              7X3-KR9
            </div>
            <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", textAlign:"center" }}>
              Code PIN de secours · Expire dans 10 min
            </div>
          </div>
        ) : (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            {!scanned ? (
              <>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#e8d5a3", letterSpacing:"0.06em", marginBottom:24, textAlign:"center" }}>
                  Scanner la cible
                </div>
                {/* Camera viewfinder */}
                <div style={{ width:260, height:260, position:"relative", marginBottom:20 }}>
                  <div style={{ position:"absolute", inset:0, background:"rgba(13,8,2,0.8)", borderRadius:4 }}/>
                  {/* Corner brackets */}
                  {[["topLeft","tl"],["topRight","tr"],["bottomLeft","bl"],["bottomRight","br"]].map(([corner, cls]) => (
                    <div key={corner} style={{
                      position:"absolute",
                      width:30, height:30,
                      ...(corner.includes("top") ? {top:12} : {bottom:12}),
                      ...(corner.includes("Left") ? {left:12} : {right:12}),
                      borderTop: corner.includes("top") ? "3px solid #c0392b" : "none",
                      borderBottom: corner.includes("bottom") ? "3px solid #c0392b" : "none",
                      borderLeft: corner.includes("Left") ? "3px solid #c0392b" : "none",
                      borderRight: corner.includes("Right") ? "3px solid #c0392b" : "none",
                    }}/>
                  ))}
                  {/* Scan line */}
                  <div style={{ position:"absolute", left:12, right:12, height:2, background:"rgba(192,57,43,0.7)", animation:"scanLine 2s linear infinite", top:"50%" }}/>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:36, opacity:0.3 }}>📷</span>
                  </div>
                </div>
                <button onClick={() => setScanned(true)}
                  style={{ width:"100%", background:"#c0392b", color:"#e8d5a3", border:"none", borderRadius:4, padding:"16px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.15em", cursor:"pointer", marginBottom:12 }}>
                  Simuler un scan réussi →
                </button>
                <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#7a5c3a", textAlign:"center" }}>
                  Ou saisissez le code PIN si le scan échoue
                </div>
              </>
            ) : (
              <div style={{ textAlign:"center", width:"100%" }}>
                <div style={{ fontSize:80, marginBottom:16, animation:"popIn 0.3s ease-out" }}>🎯</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, color:"#c0392b", letterSpacing:"0.06em", marginBottom:8 }}>
                  Cible Neutralisée
                </div>
                <div style={{ fontFamily:"'Special Elite',serif", fontSize:14, color:"#7a5c3a", marginBottom:24 }}>
                  NightRunner — Éliminé
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
                  {[["Proies restantes","5/8"],["Votre score","3 captures"]].map(([l,v]) => (
                    <div key={l} style={{ background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.2)", borderRadius:4, padding:"12px" }}>
                      <div style={{ fontSize:10, color:"#7a5c3a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{l}</div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#e8d5a3" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => onNavigate("E")}
                  style={{ width:"100%", background:"#c0392b", color:"#e8d5a3", border:"none", borderRadius:4, padding:"16px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.15em", cursor:"pointer" }}>
                  Retour à la Traque →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <NavBar active="G" onNav={onNavigate} dark />
      <style>{`
        @keyframes scanLine { 0%{top:15%} 100%{top:85%} }
        @keyframes popIn { 0%{transform:scale(0)} 100%{transform:scale(1)} }
      `}</style>
    </div>
  );
};

/* ─── SCREEN H : HORS ZONE ───────────────────────────────────────────────── */
const ScreenH = ({ onNavigate }) => {
  const [countdown, setCountdown] = useState(30);
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c-1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div style={{ background:"#0d0802", minHeight:"100vh", position:"relative", fontFamily:"'DM Sans',sans-serif" }}>
      {/* Red overlay */}
      <div style={{ position:"absolute", inset:0, background:`rgba(192,57,43,${countdown <= 10 ? 0.35 : 0.2})`, zIndex:1, animation: countdown <= 10 ? "redPulse 0.8s infinite" : "redPulse 2s infinite", pointerEvents:"none" }}/>
      <JungleCorners dark intensity={0.5} />
      <StatusBar dark />

      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh", padding:"0 24px", textAlign:"center" }}>
        {/* Warning icon SVG */}
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ marginBottom:16 }}>
          <polygon points="50,8 95,88 5,88" fill="none" stroke="#c0392b" strokeWidth="4" strokeLinejoin="round"/>
          <line x1="50" y1="38" x2="50" y2="62" stroke="#c0392b" strokeWidth="6" strokeLinecap="round"/>
          <circle cx="50" cy="74" r="4" fill="#c0392b"/>
          {countdown <= 10 && (
            <>
              <polygon points="50,8 95,88 5,88" fill="rgba(192,57,43,0.1)">
                <animate attributeName="opacity" values="0.1;0.3;0.1" dur="0.8s" repeatCount="indefinite"/>
              </polygon>
            </>
          )}
        </svg>

        <div style={{ fontFamily:"'Special Elite',serif", fontSize:13, color:"#c0392b", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:8 }}>
          Alerte Frontière
        </div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#e8d5a3", marginBottom:32 }}>
          Vous avez quitté la zone de jeu !
        </div>

        <div style={{ marginBottom:8 }}>
          <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#7a5c3a", letterSpacing:"0.15em", marginBottom:4 }}>Retournez en zone dans</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:120, color: countdown <= 10 ? "#c0392b" : "#e8d5a3", lineHeight:1, letterSpacing:"0.02em" }}>
            {String(countdown).padStart(2,"0")}
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#7a5c3a", letterSpacing:"0.1em" }}>secondes</div>
        </div>

        {countdown > 0 ? (
          <div style={{ background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.3)", borderRadius:4, padding:"14px 20px", marginTop:24, width:"100%" }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#c4a882", lineHeight:1.6 }}>
              {countdown <= 10
                ? "⚠ Sanction imminente ! Votre position sera révélée à tous les chasseurs pendant 15 minutes."
                : "Si vous ne rentrez pas en zone, vous deviendrez une Cible Prioritaire visible de tous les chasseurs."}
            </div>
          </div>
        ) : (
          <div style={{ background:"rgba(192,57,43,0.25)", border:"1px solid #c0392b", borderRadius:4, padding:"14px 20px", marginTop:24, width:"100%" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#c0392b", letterSpacing:"0.1em", marginBottom:4 }}>🔴 Cible Prioritaire</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#c4a882" }}>
              Votre position est diffusée en temps réel sur le radar de tous les chasseurs pendant 15 minutes.
            </div>
          </div>
        )}

        <button onClick={() => onNavigate("E")} style={{ marginTop:24, width:"100%", background:"#2d6a4f", color:"#e8d5a3", border:"none", borderRadius:4, padding:"16px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.15em", cursor:"pointer" }}>
          Retour à la Carte
        </button>
      </div>
      <style>{`@keyframes redPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
};

/* ─── SCREEN I : FIN DE PARTIE ───────────────────────────────────────────── */
const ScreenI = ({ onNavigate }) => {
  const [winner] = useState("proies");
  const isPreyWin = winner === "proies";

  const stats = [
    { label:"Distance parcourue", value:"3.4 km", icon:"🏃" },
    { label:"Zones piratées", value:"2/4", icon:"🎯" },
    { label:"Temps de survie", value:"38:12", icon:"⏱" },
    { label:"Compétences utilisées", value:"7", icon:"⚡" },
  ];
  const podium = [
    { rank:1, name:"GhostStep", score:1240, role:"Proie" },
    { rank:2, name:"Shadow_Wolf", score:980, role:"Proie" },
    { rank:3, name:"DarkHunter", score:870, role:"Chasseur" },
  ];

  return (
    <div style={{ background: isPreyWin ? "#0a1a0a" : "#1a0505", minHeight:"100vh", position:"relative", fontFamily:"'DM Sans',sans-serif" }}>
      <JungleCorners dark intensity={isPreyWin ? 1.2 : 0.6} />
      <StatusBar dark />

      <div style={{ padding:"0 20px 40px", position:"relative", zIndex:2 }}>
        {/* Victory header */}
        <div style={{ textAlign:"center", marginBottom:24, padding:"20px 0" }}>
          {/* Trophy / skull illustration */}
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ display:"block", margin:"0 auto 12px" }}>
            {isPreyWin ? (
              // Fox escape
              <g>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2d6a4f" strokeWidth="2" opacity="0.3"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="#2d6a4f" strokeWidth="1.5" opacity="0.5"/>
                <g fill="#2d6a4f" opacity="0.9">
                  <path d="M50 62 Q38 55 36 44 Q34 33 42 27 L38 14 L52 28 Q56 23 60 23 L72 12 L66 26 Q74 32 74 44 Q72 56 62 62Z"/>
                  <circle cx="44" cy="42" r="2.5" fill="#0a1a0a"/>
                  <circle cx="56" cy="42" r="2.5" fill="#0a1a0a"/>
                  <path d="M46 50 Q50 54 54 50" fill="none" stroke="#0a1a0a" strokeWidth="1.5"/>
                </g>
                {/* Escape lines */}
                <g stroke="#2d6a4f" strokeWidth="1" opacity="0.4">
                  <path d="M75 30 Q85 25 90 30" strokeDasharray="3,2"/>
                  <path d="M80 45 Q90 45 95 42" strokeDasharray="3,2"/>
                  <path d="M75 60 Q85 65 88 70" strokeDasharray="3,2"/>
                </g>
              </g>
            ) : (
              // Hunter trophy
              <g>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#c0392b" strokeWidth="2" opacity="0.3"/>
                <line x1="10" y1="50" x2="32" y2="50" stroke="#c0392b" strokeWidth="3"/>
                <line x1="68" y1="50" x2="90" y2="50" stroke="#c0392b" strokeWidth="3"/>
                <line x1="50" y1="10" x2="50" y2="32" stroke="#c0392b" strokeWidth="3"/>
                <line x1="50" y1="68" x2="50" y2="90" stroke="#c0392b" strokeWidth="3"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="#c0392b" strokeWidth="2"/>
                <circle cx="50" cy="50" r="5" fill="#c0392b"/>
              </g>
            )}
          </svg>

          <div style={{ fontFamily:"'Special Elite',serif", fontSize:12, color:"#7a5c3a", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:4 }}>
            {isPreyWin ? "Évasion Réussie" : "Victoire des Chasseurs"}
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color: isPreyWin ? "#2d6a4f" : "#c0392b", letterSpacing:"0.05em", lineHeight:1 }}>
            {isPreyWin ? "PROIES" : "CHASSEURS"}
          </div>
          <div style={{ fontFamily:"'Special Elite',serif", fontSize:11, color:"#7a5c3a", marginTop:4 }}>
            {isPreyWin ? "Toutes les proies ont survécu au temps imparti" : "Toutes les proies ont été capturées"}
          </div>
        </div>

        {/* Podium */}
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10 }}>Podium</div>
        <div style={{ marginBottom:16 }}>
          {podium.map((p, i) => (
            <div key={p.rank} style={{ display:"flex", alignItems:"center", gap:12, background:`rgba(232,213,163,${i===0?0.08:0.04})`, border:`1px solid rgba(232,213,163,${i===0?0.2:0.08})`, borderRadius:4, padding:"12px 14px", marginBottom:6 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color: i===0?"#e8d5a3":i===1?"#c4a882":"#7a5c3a", width:32, textAlign:"center" }}>
                {["🥇","🥈","🥉"][i]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:"#e8d5a3" }}>{p.name}</div>
                <div style={{ fontSize:10, color: p.role==="Proie"?"#2d6a4f":"#c0392b", textTransform:"uppercase", letterSpacing:"0.1em" }}>{p.role}</div>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#c4a882" }}>{p.score}</div>
            </div>
          ))}
        </div>

        {/* Mes stats */}
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10 }}>Vos statistiques</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:"rgba(232,213,163,0.05)", border:"1px solid rgba(232,213,163,0.1)", borderRadius:4, padding:"12px" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:"#e8d5a3", lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:10, color:"#7a5c3a", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Replay map mini */}
        <div style={{ fontFamily:"'Special Elite',serif", fontSize:10, color:"#7a5c3a", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10 }}>Historique · Déplacements</div>
        <div style={{ background:"rgba(30,50,25,0.6)", border:"1px solid rgba(45,106,79,0.2)", borderRadius:4, marginBottom:20, overflow:"hidden" }}>
          <svg width="100%" viewBox="0 0 340 160">
            <rect width="340" height="160" fill="#1a2d1a" opacity="0.9"/>
            {/* Grid */}
            <g stroke="#2d6a4f" strokeWidth="0.3" opacity="0.2">
              {[0,1,2,3,4].map(i=><line key={i} x1="0" y1={i*40} x2="340" y2={i*40}/>)}
              {[0,1,2,3,4,5,6,7,8].map(i=><line key={i} x1={i*42} y1="0" x2={i*42} y2="160"/>)}
            </g>
            {/* Zone */}
            <ellipse cx="170" cy="80" rx="140" ry="65" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="5,4" opacity="0.3"/>
            {/* Prey trails */}
            <path d="M170 80 Q150 60 130 70 Q110 80 90 65 Q70 50 60 70 Q50 90 70 100" stroke="#2d6a4f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M170 80 Q190 90 210 80 Q230 70 250 85 Q270 100 260 120" stroke="#2d6a4f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
            {/* Hunter trails */}
            <path d="M200 40 Q220 60 200 80 Q180 100 200 120 Q215 135 230 125" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M140 110 Q120 90 130 70 Q140 50 160 55" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
            {/* End positions */}
            <circle cx="60" cy="100" r="5" fill="#2d6a4f" stroke="#e8d5a3" strokeWidth="1.5"/>
            <circle cx="260" cy="120" r="5" fill="#2d6a4f" stroke="#e8d5a3" strokeWidth="1.5"/>
            <circle cx="230" cy="125" r="5" fill="#c0392b" stroke="#e8d5a3" strokeWidth="1.5"/>
            {/* Capture events */}
            <circle cx="190" cy="95" r="8" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
            <text x="190" y="88" fill="#c0392b" fontSize="7" fontFamily="sans-serif" textAnchor="middle">×</text>
            <circle cx="130" cy="72" r="8" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
            <text x="130" y="65" fill="#c0392b" fontSize="7" fontFamily="sans-serif" textAnchor="middle">×</text>
            {/* Hack zones */}
            <circle cx="100" cy="75" r="12" fill="rgba(45,106,79,0.15)" stroke="#2d6a4f" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
            <circle cx="240" cy="90" r="12" fill="rgba(45,106,79,0.15)" stroke="#2d6a4f" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
            {/* Legend */}
            <rect x="10" y="138" width="8" height="3" fill="#2d6a4f" rx="1"/>
            <text x="22" y="142" fill="#7a5c3a" fontSize="8" fontFamily="sans-serif">Proies</text>
            <rect x="70" y="138" width="8" height="3" fill="#c0392b" rx="1"/>
            <text x="82" y="142" fill="#7a5c3a" fontSize="8" fontFamily="sans-serif">Chasseurs</text>
            <text x="140" y="142" fill="#7a5c3a" fontSize="7" fontFamily="sans-serif">× Capture · ◌ Zone piratée</text>
          </svg>
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => onNavigate("A")}
            style={{ flex:1, background:"rgba(232,213,163,0.08)", color:"#7a5c3a", border:"1px solid rgba(232,213,163,0.15)", borderRadius:4, padding:"14px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:16, letterSpacing:"0.1em", cursor:"pointer" }}>
            Accueil
          </button>
          <button onClick={() => onNavigate("B")}
            style={{ flex:2, background:"#c0392b", color:"#e8d5a3", border:"none", borderRadius:4, padding:"14px 0", fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:"0.12em", cursor:"pointer" }}>
            Rejouer →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN APP ───────────────────────────────────────────────────────────── */
const screens = {
  A: { label:"A · Accueil", comp: ScreenA },
  B: { label:"B · Config Zone", comp: ScreenB },
  C: { label:"C · Lobby", comp: ScreenC },
  D: { label:"D · Rôle", comp: ScreenD },
  E: { label:"E · Jeu · Carte", comp: ScreenE },
  F: { label:"F · Piratage", comp: ScreenF },
  G: { label:"G · Capture QR", comp: ScreenG },
  H: { label:"H · Hors Zone", comp: ScreenH },
  I: { label:"I · Fin de Partie", comp: ScreenI },
};

export default function App() {
  const [current, setCurrent] = useState("A");
  const [menuOpen, setMenuOpen] = useState(false);
  const Screen = screens[current].comp;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#111", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"0 0 40px" }}>
      <FontLoader />

      {/* Navigation bar */}
      <div style={{ width:"100%", maxWidth:600, background:"#1a0e05", borderBottom:"1px solid rgba(232,213,163,0.1)", display:"flex", alignItems:"center", gap:8, padding:"10px 16px", position:"sticky", top:0, zIndex:100, boxSizing:"border-box" }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#e8d5a3", letterSpacing:"0.1em", flex:1 }}>
          THE HUNT · <span style={{ color:"#7a5c3a", fontSize:14 }}>{screens[current].label}</span>
        </div>
        <button onClick={() => setMenuOpen(v=>!v)} style={{ background:"none", border:"1px solid rgba(232,213,163,0.2)", color:"#e8d5a3", borderRadius:3, padding:"6px 12px", fontFamily:"'Special Elite',serif", fontSize:11, cursor:"pointer" }}>
          Écrans ▾
        </button>
      </div>

      {/* Screen menu dropdown */}
      {menuOpen && (
        <div style={{ width:"100%", maxWidth:600, background:"#1a0e05", border:"1px solid rgba(232,213,163,0.15)", borderTop:"none", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, zIndex:99 }}>
          {Object.entries(screens).map(([id, s]) => (
            <button key={id} onClick={() => { setCurrent(id); setMenuOpen(false); }}
              style={{ padding:"10px 8px", fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:"0.06em", color: current===id ? "#1a0e05" : "#c4a882", background: current===id ? "#e8d5a3" : "transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Phone frame */}
      <div style={{ width:"100%", maxWidth:390, background:"#000", borderRadius:current==="A"||current==="D"||current==="H"?"0":"0", overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.8)", marginTop:0, minHeight:"100vh" }}>
        <Screen onNavigate={(id) => { setCurrent(id); setMenuOpen(false); }} />
      </div>
    </div>
  );
}