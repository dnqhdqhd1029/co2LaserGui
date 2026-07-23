/**
 * SCREENS EXPORT CATALOG
 * ─────────────────────────────────────────────────────────────────────────────
 * DWIN DGUS II  ·  1024 × 768 px  ·  PNG Export 기준
 *
 * 모든 화면(State)을 독립적인 1024×768 Frame으로 렌더링합니다.
 * 개발자에게 전달할 PNG를 상태별로 확인하고 캡처할 수 있습니다.
 *
 * Frame 목록 (39개):
 *   SCR-001  Splash
 *   SCR-002  Mode_Select
 *   COS-001 ~ COS-016  (COS 전체 상태)
 *   FRX-001 ~ FRX-017  (FRX 전체 상태)
 *   SYS-001  Setup (예약)
 *   SYS-002  System_Check (예약)
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import html2canvas from "html2canvas";
import {
  H, LAYOUT,
  HMIState2, HMI2_DEFAULT, LaserState2,
  HTopBar, HLaserBar,
  HMI2Splash, HMI2Home, HMI2COS, HMI2FRX,
  HModal, HMemoModal, HCallModal, HSaveModal,
} from "./hmi2";

// ── noop helpers ──────────────────────────────────────────────────────────────
const noop = () => {};
const noopUpd = (_: Partial<HMIState2>) => {};
const noopMenu = (_: "memo" | "call" | "save") => {};
const noopAim  = (_: 0|1|2|3|4|5) => {};

function HCameraModal({ onClose = noop }: { onClose?: () => void }) {
  return (
    <HModal badge="CAMERA" onClose={onClose}>
      <div style={{ height:388, borderRadius:14, border:`1px solid ${H.borderB}`, background:"rgba(0,0,0,0.42)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:H.textSub }}>
        <svg width={42} height={42} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
        <span style={{ fontSize:16, fontWeight:600 }}>Camera Preview</span>
      </div>
    </HModal>
  );
}

// ── Base states ───────────────────────────────────────────────────────────────
const COS_BASE: HMIState2 = {
  ...HMI2_DEFAULT,
  screen: "cos", laserState: "standby",
  co2LaserMode: "Pulse", co2PulseMode: "Repeat",
  soundOn: true, aimingLevel: 2,
};
const FRX_BASE: HMIState2 = {
  ...HMI2_DEFAULT,
  screen: "frx", laserState: "standby",
  frxShape: "Triangle", frxScanMode: "Random",
  soundOn: true, aimingLevel: 2,
};

// ── StaticHMIFrame — renders one 1024×768 export frame ───────────────────────
interface FrameProps {
  id: string;
  name: string;
  mode?: "cos" | "frx" | null;
  soundOn?: boolean;
  aimingLevel?: 0|1|2|3|4|5;
  laserState?: LaserState2;
  showTopBar?: boolean;
  showLaserBar?: boolean;
  children: React.ReactNode;
  overlay?: React.ReactNode;
}
function StaticFrame({
  id, name,
  mode = null,
  soundOn = true,
  aimingLevel = 2,
  laserState = "standby",
  showTopBar = true,
  showLaserBar = false,
  children,
  overlay,
}: FrameProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Frame label — for developer reference */}
      <div style={{
        height: 36, display: "flex", alignItems: "center", gap: 10,
        padding: "0 14px",
        background: "#060d1a",
        borderTop: "2px solid rgba(30,126,245,0.4)",
        borderLeft: "2px solid rgba(30,126,245,0.4)",
        borderRight: "2px solid rgba(30,126,245,0.4)",
      }}>
        <span style={{
          fontSize: 14, fontFamily: "'JetBrains Mono',monospace",
          color: "rgba(30,126,245,0.7)", letterSpacing: "0.08em",
        }}>{id}</span>
        <span style={{
          fontSize: 14, fontFamily: "'JetBrains Mono',monospace",
          color: "#d8e8ff", fontWeight: 700, letterSpacing: "0.04em",
        }}>{name}</span>
        <span style={{
          marginLeft: "auto", fontSize: 14,
          color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em",
        }}>1024 × 768  ·  PNG Export</span>
      </div>
      {/* 1024×768 canvas */}
      <div style={{
        width: LAYOUT.canvasW,
        height: LAYOUT.canvasH,
        display: "flex",
        flexDirection: "column",
        background: H.bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter','Noto Sans KR',system-ui,sans-serif",
        border: "2px solid rgba(30,126,245,0.4)",
        borderTop: "none",
        flexShrink: 0,
      }}>
        {showTopBar && (
          <HTopBar
            mode={mode}
            soundOn={soundOn}
            aimingLevel={aimingLevel}
            onMenu={mode ? noopMenu : undefined}
            onCamera={noop}
            onSound={noop}
            onAiming={noopAim}
          />
        )}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          overflow: "hidden", position: "relative", minHeight: 0,
        }}>
          {children}
        </div>
        {showLaserBar && (
          <HLaserBar state={laserState} onPress={noop} />
        )}
        {overlay && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 60,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(5,10,20,0.75)", backdropFilter: "blur(6px)",
          }}>
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "28px 0 14px",
    }}>
      <div style={{ width: 4, height: 28, borderRadius: 2, background: H.blue, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: H.text, letterSpacing: "0.06em" }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: H.textSub, marginTop: 2, letterSpacing: "0.04em" }}>
          {count} frames  ·  1024 × 768 px  ·  PNG Export
        </div>
      </div>
    </div>
  );
}

// ── All frame definitions ─────────────────────────────────────────────────────

export function ScreensExportPage({ liveState = HMI2_DEFAULT }: { liveState?: HMIState2 }) {
  const cos = (patch: Partial<HMIState2>): HMIState2 => ({ ...COS_BASE, ...patch });
  const frx = (patch: Partial<HMIState2>): HMIState2 => ({ ...FRX_BASE, ...patch });
  // This ref points to the preview mount only. The actual screen frame is its
  // single, top-level child returned by FrameDef.render().
  const previewMountRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [liveCameraOpen, setLiveCameraOpen] = useState(false);

  const exportPNG = useCallback(async (filename: string) => {
    const screenFrame = previewMountRef.current?.firstElementChild;
    if (!(screenFrame instanceof HTMLElement)) return;
    console.log(screenFrame.getBoundingClientRect());
    setExporting(true);
    try {
      if (document.fonts) {
        await Promise.all([
          document.fonts.load("500 13px Inter"),
          document.fonts.load("700 15px Inter"),
          document.fonts.load("500 13px 'JetBrains Mono'"),
        ]);
        await document.fonts.ready;
      }

      // Allow the browser to recalculate layout with the final font metrics.
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      const canvas = await html2canvas(screenFrame, {
        width: LAYOUT.canvasW,
        height: LAYOUT.canvasH,
        scale: 1,
        useCORS: true,
        backgroundColor: H.bg,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(false);
    }
  }, []);

  // ── Popup cards (static renders for export) ─────────────────────────────────
  const MemoCard = () => (
    <div style={{ width:500, borderRadius:20, background:"#0f1928", border:`1px solid rgba(42,110,220,0.35)`, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"18px 22px", borderBottom:`1px solid ${H.border}` }}>
        <span style={{ fontSize: 14, padding:"2px 8px", borderRadius:5, background:"rgba(30,126,245,0.18)", border:"1px solid rgba(30,126,245,0.25)", color:H.blue, fontWeight:700, letterSpacing:"0.08em" }}>MEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:H.text, flex:1 }}>메모 관리</span>
        <div style={{ width:30, height:30, borderRadius:8, border:`1px solid ${H.border}`, background:"rgba(255,255,255,0.05)", color:H.textSub, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</div>
      </div>
      <div style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:8 }}>
        {[{date:"2026.07.13  14:22",text:"환자 민감성 높음. 저출력 권장."},{date:"2026.07.11  10:05",text:"세션 2 완료. 경미한 홍반 관찰."},{date:"2026.07.08  09:40",text:"Protocol A 적용. 이상 없음."}].map((m,i)=>(
          <div key={i} style={{ display:"flex", gap:10, padding:"12px 14px", borderRadius:12, background:"rgba(255,255,255,0.03)", border:`1px solid ${H.border}` }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize: 14, color:H.textSub, marginBottom:4 }}>{m.date}</div>
              <div style={{ fontSize: 14, color:H.text, lineHeight:1.5 }}>{m.text}</div>
            </div>
            <div style={{ width:24, height:24, borderRadius:6, border:`1px solid ${H.border}`, color:H.textSub, fontSize: 14, display:"flex", alignItems:"center", justifyContent:"center" }}>×</div>
          </div>
        ))}
      </div>
    </div>
  );

  const CallCard = () => (
    <div style={{ width:500, borderRadius:20, background:"#0f1928", border:`1px solid rgba(42,110,220,0.35)`, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"18px 22px", borderBottom:`1px solid ${H.border}` }}>
        <span style={{ fontSize: 14, padding:"2px 8px", borderRadius:5, background:"rgba(30,126,245,0.18)", border:"1px solid rgba(30,126,245,0.25)", color:H.blue, fontWeight:700, letterSpacing:"0.08em" }}>CALL</span>
        <span style={{ fontSize:14, fontWeight:700, color:H.text, flex:1 }}>프리셋 선택</span>
        <div style={{ width:30, height:30, borderRadius:8, border:`1px solid ${H.border}`, background:"rgba(255,255,255,0.05)", color:H.textSub, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</div>
      </div>
      <div style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:6 }}>
        {["Protocol A","Protocol B","Protocol C","Light Tx","Deep Resurfacing"].map((name,i)=>{
          const sel=i===1;
          return <div key={i} style={{ display:"flex", alignItems:"center", gap:14, height:58, padding:"0 16px", borderRadius:12, border:`1px solid ${sel?H.blue:H.border}`, background:sel?"rgba(30,126,245,0.18)":"rgba(255,255,255,0.02)" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:sel?"rgba(30,126,245,0.25)":"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize: 14, fontWeight:700, color:sel?H.blue:H.textSub }}>{i+1}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize: 14, fontWeight:600, color:sel?H.text:"#8ab0d8" }}>{name}</div>
              <div style={{ fontSize: 14, color:H.textSub, marginTop:2 }}>표준 치료 프로토콜</div>
            </div>
            <div style={{ fontSize: 14, fontFamily:"'JetBrains Mono',monospace", color:H.textSub, textAlign:"right", lineHeight:1.8 }}><div>30 W</div><div>0.7 ms</div></div>
          </div>;
        })}
      </div>
      <div style={{ padding:"0 22px 18px" }}>
        <div style={{ width:"100%", height:42, borderRadius:11, background:H.blue, color:"#fff", fontSize: 14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center" }}>프리셋 적용</div>
      </div>
    </div>
  );

  const SaveCard = () => (
    <div style={{ width:500, borderRadius:20, background:"#0f1928", border:`1px solid rgba(42,110,220,0.35)`, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"18px 22px", borderBottom:`1px solid ${H.border}` }}>
        <span style={{ fontSize: 14, padding:"2px 8px", borderRadius:5, background:"rgba(30,126,245,0.18)", border:"1px solid rgba(30,126,245,0.25)", color:H.blue, fontWeight:700, letterSpacing:"0.08em" }}>SAVE</span>
        <span style={{ fontSize:14, fontWeight:700, color:H.text, flex:1 }}>현재 설정 저장</span>
        <div style={{ width:30, height:30, borderRadius:8, border:`1px solid ${H.border}`, background:"rgba(255,255,255,0.05)", color:H.textSub, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</div>
      </div>
      <div style={{ padding:"18px 22px" }}>
        <div style={{ fontSize: 14, color:H.textSub, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>프리셋 이름</div>
        <div style={{ height:40, borderRadius:9, border:`1px solid ${H.border}`, background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", padding:"0 14px", marginBottom:18 }}>
          <span style={{ fontSize: 14, color:"rgba(255,255,255,0.25)" }}>예: 나의 프로토콜 A</span>
        </div>
        <div style={{ fontSize: 14, color:H.textSub, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>저장될 파라미터</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {[["Power","30 W"],["Duration","0.7 ms"],["Interval","9 ms"]].map(([k,v])=>(
            <div key={k} style={{ padding:"8px 14px", borderRadius:9, background:"rgba(255,255,255,0.04)", border:`1px solid ${H.border}` }}>
              <div style={{ fontSize: 14, color:H.textSub, marginBottom:2, textTransform:"uppercase" }}>{k}</div>
              <div style={{ fontSize:14, fontFamily:"'JetBrains Mono',monospace", color:H.text, fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ width:"100%", height:42, borderRadius:11, background:"rgba(255,255,255,0.06)", color:H.textSub, fontSize: 14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center" }}>저장</div>
      </div>
    </div>
  );

  // ── Frame registry ──────────────────────────────────────────────────────────
  interface FrameDef { id: string; name: string; render: () => React.ReactNode; }
  interface Section  { section: string; frames: FrameDef[]; }

  const buildFrame = (
    id: string, name: string,
    mode: "cos"|"frx"|null,
    s: HMIState2|null,
    showTopBar: boolean,
    showLaserBar: boolean,
    overlay?: React.ReactNode,
    children?: React.ReactNode,
    activeMenu?: "memo"|"call"|"save"|null,
    cameraActive = false,
  ): FrameDef => ({
    id, name,
    render: () => (
      <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif", flexShrink:0 }}>
        {showTopBar && <HTopBar mode={mode} onBack={mode ? noop : undefined} soundOn={s?.soundOn??true} aimingLevel={(s?.aimingLevel??2) as 0|1|2|3|4|5} onMenu={mode ? noopMenu : undefined} activeMenu={activeMenu} cameraActive={cameraActive} onCamera={noop} onSound={noop} onAiming={noopAim} />}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {children ?? (
              s?.screen==="cos"
                ? <HMI2COS s={s} upd={noopUpd} onMenu={noopMenu} />
                : s?.screen==="frx"
                ? <HMI2FRX s={s} upd={noopUpd} onMenu={noopMenu} />
                : null
            )}
          </div>
          {showLaserBar && s && <HLaserBar state={s.laserState} onPress={noop} />}
          {overlay}
        </div>
      </div>
    ),
  });

  // LIVE frame — renders current prototype state
  const liveScreen = liveState.screen;
  const liveFrame: FrameDef = {
    id: "LIVE",
    name: "현재 프로토타입",
    render: () => (
      <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif", flexShrink:0 }}>
        {(liveScreen === "cos" || liveScreen === "frx") && (
          <HTopBar mode={liveScreen==="cos"?"cos":liveScreen==="frx"?"frx":null}
            onBack={liveScreen==="cos"||liveScreen==="frx" ? noop : undefined}
            soundOn={liveState.soundOn} aimingLevel={liveState.aimingLevel}
            onMenu={liveScreen==="cos"||liveScreen==="frx" ? noopMenu : undefined}
            cameraActive={liveCameraOpen}
            onCamera={() => setLiveCameraOpen(true)}
            onSound={noop} onAiming={noopAim} />
        )}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {liveScreen==="splash" && <HMI2Splash onDone={noop} />}
            {liveScreen==="home"   && <HMI2Home onCOS={noop} onFRX={noop} />}
            {liveScreen==="cos"    && <HMI2COS s={liveState} upd={noopUpd} onMenu={noopMenu} />}
            {liveScreen==="frx"    && <HMI2FRX s={liveState} upd={noopUpd} onMenu={noopMenu} />}
          </div>
        </div>
        {(liveScreen==="cos"||liveScreen==="frx") && <HLaserBar state={liveState.laserState} onPress={noop} />}
        {liveCameraOpen && (liveScreen==="cos"||liveScreen==="frx") && (
          <HCameraModal onClose={() => setLiveCameraOpen(false)} />
        )}
        {/* LIVE badge */}
        <div style={{ position:"absolute", top:8, right:8, padding:"3px 9px", borderRadius:6, background:"rgba(234,179,8,0.2)", border:"1px solid rgba(234,179,8,0.5)", color:"#fde047", fontSize: 14, fontWeight:700, letterSpacing:"0.1em", zIndex:100 }}>
          ● LIVE
        </div>
      </div>
    ),
  };

  const sections: Section[] = [
    { section: "LIVE", frames: [liveFrame] },
    {
      section: "SYSTEM",
      frames: [
        { id:"SCR-001", name:"Splash 0%",
          render: () => (
            <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <HMI2Splash onDone={noop} forcedProgress={0} />
                </div>
              </div>
            </div>
          )},
        { id:"SCR-001A", name:"Splash 50%",
          render: () => (
            <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <HMI2Splash onDone={noop} forcedProgress={50} />
                </div>
              </div>
            </div>
          )},
        { id:"SCR-001B", name:"Splash 100%",
          render: () => (
            <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <HMI2Splash onDone={noop} forcedProgress={100} />
                </div>
              </div>
            </div>
          )},
        { id:"SCR-002", name:"Mode Select",
          render: () => (
            <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <HMI2Home onCOS={noop} onFRX={noop} />
                </div>
              </div>
            </div>
          )},
        { id:"SCR-002A", name:"Mode Select COS Active",
          render: () => (
            <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <HMI2Home onCOS={noop} onFRX={noop} forcedActive="cos" />
                </div>
              </div>
            </div>
          )},
        { id:"SCR-002B", name:"Mode Select FRX Active",
          render: () => (
            <div data-screen-frame="true" style={{ width:LAYOUT.canvasW, height:LAYOUT.canvasH, display:"flex", flexDirection:"column", background:H.bg, position:"relative", overflow:"hidden", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", minHeight:0 }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <HMI2Home onCOS={noop} onFRX={noop} forcedActive="frx" />
                </div>
              </div>
            </div>
          )},
      ],
    },
    {
      section: "COS",
      frames: [
        buildFrame("COS-001","Default",           "cos", cos({}),                                                           true, true),
        buildFrame("COS-002","CW",                "cos", cos({ co2LaserMode:"CW" }),                                        true, true),
        buildFrame("COS-003","Pulse",             "cos", cos({ co2LaserMode:"Pulse" }),                                     true, true),
        buildFrame("COS-004","Pulse Single",      "cos", cos({ co2LaserMode:"Pulse", co2PulseMode:"Single" }),              true, true),
        buildFrame("COS-005","Pulse Repeat",      "cos", cos({ co2LaserMode:"Pulse", co2PulseMode:"Repeat" }),              true, true),
        buildFrame("COS-006","Pulse Stream",      "cos", cos({ co2LaserMode:"Pulse", co2PulseMode:"Stream" }),              true, true),
        buildFrame("COS-007","Pulse Series",      "cos", cos({ co2LaserMode:"Pulse", co2PulseMode:"Series" }),              true, true),
        buildFrame("COS-008","Memo",              "cos", cos({}),                                                           true, true, <HMemoModal onClose={noop} />, undefined, "memo"),
        buildFrame("COS-009","Call",              "cos", cos({}),                                                           true, true, <HCallModal s={cos({})} upd={noopUpd} onClose={noop} />, undefined, "call"),
        buildFrame("COS-010","Save",              "cos", cos({}),                                                           true, true, <HSaveModal s={cos({})} onClose={noop} />, undefined, "save"),
        buildFrame("COS-011","Aiming OFF",        "cos", cos({ aimingLevel:0 as 0|1|2|3|4|5 }),                            true, true),
        buildFrame("COS-012","Aiming Level 1",    "cos", cos({ aimingLevel:1 as 0|1|2|3|4|5 }),                            true, true),
        buildFrame("COS-013","Aiming Level 2",    "cos", cos({ aimingLevel:2 as 0|1|2|3|4|5 }),                            true, true),
        buildFrame("COS-014","Aiming Level 3",    "cos", cos({ aimingLevel:3 as 0|1|2|3|4|5 }),                            true, true),
        buildFrame("COS-015","Aiming Level 4",    "cos", cos({ aimingLevel:4 as 0|1|2|3|4|5 }),                            true, true),
        buildFrame("COS-016","Aiming Level 5",    "cos", cos({ aimingLevel:5 as 0|1|2|3|4|5 }),                            true, true),
        buildFrame("COS-017","Sound OFF",         "cos", cos({ soundOn:false }),                                            true, true),
        buildFrame("COS-018","Standby",           "cos", cos({ laserState:"standby" }),                                     true, true),
        buildFrame("COS-019","Ready",             "cos", cos({ laserState:"ready" }),                                       true, true),
        buildFrame("COS-020","Laser Emission",    "cos", cos({ laserState:"lasering" }),                                    true, true),
        buildFrame("COS-021","Paused",            "cos", cos({ laserState:"paused" }),                                      true, true),
        buildFrame("COS-022","Parameter Duration", "cos", cos({}),                                                           true, true, undefined, <HMI2COS s={cos({})} upd={noopUpd} onMenu={noopMenu} forcedParam="duration" />),
        buildFrame("COS-023","Parameter Interval", "cos", cos({}),                                                           true, true, undefined, <HMI2COS s={cos({})} upd={noopUpd} onMenu={noopMenu} forcedParam="interval" />),
        buildFrame("COS-024","Camera Preview",     "cos", cos({}),                                                           true, true, <HCameraModal />, undefined, null, true),
      ],
    },
    {
      section: "FRX",
      frames: [
        buildFrame("FRX-001","Default",           "frx", frx({}),                                                           true, true),
        buildFrame("FRX-002","Line",              "frx", frx({ frxShape:"Line" }),                                           true, true),
        buildFrame("FRX-003","Triangle",          "frx", frx({ frxShape:"Triangle" }),                                       true, true),
        buildFrame("FRX-004","Square",            "frx", frx({ frxShape:"Square" }),                                         true, true),
        buildFrame("FRX-005","Oval",              "frx", frx({ frxShape:"Oval" }),                                           true, true),
        buildFrame("FRX-006","Rim",               "frx", frx({ frxShape:"Rim" }),                                            true, true),
        buildFrame("FRX-007","Lining",            "frx", frx({ frxScanMode:"Lining" }),                                      true, true),
        buildFrame("FRX-008","Random",            "frx", frx({ frxScanMode:"Random" }),                                      true, true),
        buildFrame("FRX-009","Memo",              "frx", frx({}),                                                            true, true, <HMemoModal onClose={noop} />, undefined, "memo"),
        buildFrame("FRX-010","Call",              "frx", frx({}),                                                            true, true, <HCallModal s={frx({})} upd={noopUpd} onClose={noop} />, undefined, "call"),
        buildFrame("FRX-011","Save",              "frx", frx({}),                                                            true, true, <HSaveModal s={frx({})} onClose={noop} />, undefined, "save"),
        buildFrame("FRX-012","Aiming OFF",        "frx", frx({ aimingLevel:0 as 0|1|2|3|4|5 }),                             true, true),
        buildFrame("FRX-013","Aiming Level 1",    "frx", frx({ aimingLevel:1 as 0|1|2|3|4|5 }),                             true, true),
        buildFrame("FRX-014","Aiming Level 2",    "frx", frx({ aimingLevel:2 as 0|1|2|3|4|5 }),                             true, true),
        buildFrame("FRX-015","Aiming Level 3",    "frx", frx({ aimingLevel:3 as 0|1|2|3|4|5 }),                             true, true),
        buildFrame("FRX-016","Aiming Level 4",    "frx", frx({ aimingLevel:4 as 0|1|2|3|4|5 }),                             true, true),
        buildFrame("FRX-017","Aiming Level 5",    "frx", frx({ aimingLevel:5 as 0|1|2|3|4|5 }),                             true, true),
        buildFrame("FRX-018","Sound OFF",         "frx", frx({ soundOn:false }),                                             true, true),
        buildFrame("FRX-019","Standby",           "frx", frx({ laserState:"standby" }),                                      true, true),
        buildFrame("FRX-020","Ready",             "frx", frx({ laserState:"ready" }),                                        true, true),
        buildFrame("FRX-021","Laser Emission",    "frx", frx({ laserState:"lasering" }),                                     true, true),
        buildFrame("FRX-022","Paused",            "frx", frx({ laserState:"paused" }),                                       true, true),
        buildFrame("FRX-023","Parameter Degree",  "frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedParam="degree" />),
        buildFrame("FRX-024","Parameter Density", "frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedParam="density" />),
        buildFrame("FRX-025","Parameter Pause",   "frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedParam="pause" />),
        buildFrame("FRX-026","Size Lock Active",   "frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedSizeLocked />),
        buildFrame("FRX-027","Width Plus Active",  "frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedSizeControl="frxWidth-inc" />),
        buildFrame("FRX-028","Width Minus Active", "frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedSizeControl="frxWidth-dec" />),
        buildFrame("FRX-029","Length Plus Active", "frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedSizeControl="frxLength-inc" />),
        buildFrame("FRX-030","Length Minus Active","frx", frx({}),                                                            true, true, undefined, <HMI2FRX s={frx({})} upd={noopUpd} onMenu={noopMenu} forcedSizeControl="frxLength-dec" />),
        buildFrame("FRX-031","Camera Preview",     "frx", frx({}),                                                            true, true, <HCameraModal />, undefined, null, true),
      ],
    },
  ];

  const allFrames = sections.flatMap(s => s.frames);
  const [selectedId, setSelectedId] = useState<string>("LIVE");
  const [collapsed, setCollapsed] = useState<Record<string,boolean>>({});

  const selected = allFrames.find(f => f.id === selectedId)!;
  const totalCount = allFrames.length;

  const sidebarW = 232;

  return (
    <div style={{ display:"flex", height:"100%", background:"#04090f", fontFamily:"'Inter','Noto Sans KR',system-ui,sans-serif", overflow:"hidden" }}>

      {/* ── Left sidebar — frame tree ─────────────────────────────────────────── */}
      <div style={{ width:sidebarW, flexShrink:0, display:"flex", flexDirection:"column", borderRight:`1px solid ${H.border}`, background:"#060d1a", overflow:"hidden" }}>
        {/* sidebar header */}
        <div style={{ padding:"14px 16px 10px", borderBottom:`1px solid ${H.border}`, flexShrink:0 }}>
          <div style={{ fontSize: 14, fontWeight:700, color:H.text, letterSpacing:"0.08em" }}>SCREENS</div>
          <div style={{ fontSize: 14, color:H.textSub, marginTop:3, letterSpacing:"0.05em" }}>{totalCount} frames  ·  1024×768 px</div>
        </div>
        {/* tree */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {sections.map(sec => {
            const isOpen = !collapsed[sec.section];
            return (
              <div key={sec.section}>
                {/* section header */}
                <button
                  onClick={() => setCollapsed(p => ({ ...p, [sec.section]: !p[sec.section] }))}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:6, padding:"6px 14px", border:"none", background:"none", color:H.textSub, fontSize: 14, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", textAlign:"left" }}>
                  <svg width={8} height={8} viewBox="0 0 8 8" fill="none">
                    <path d={isOpen?"M1 2l3 3 3-3":"M2 1l3 3-3 3"} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {sec.section}
                  <span style={{ marginLeft:"auto", fontSize: 14, opacity:0.5 }}>{sec.frames.length}</span>
                </button>
                {/* frame items */}
                {isOpen && sec.frames.map(f => {
                  const active = f.id === selectedId;
                  return (
                    <button key={f.id} data-frame-id={f.id} data-frame-name={f.name} onClick={() => setSelectedId(f.id)}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"5px 14px 5px 26px", border:"none", background:active?"rgba(30,126,245,0.14)":"none", cursor:"pointer", textAlign:"left", borderLeft:active?`2px solid ${H.blue}`:"2px solid transparent" }}>
                      <span style={{ fontSize: 14, fontFamily:"'JetBrains Mono',monospace", color:active?H.blue:H.textDim, minWidth:52, letterSpacing:"0.04em" }}>{f.id}</span>
                      <span style={{ fontSize: 14, color:active?H.text:H.textSub, fontWeight:active?600:400 }}>{f.name}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right — 1024×768 frame preview ───────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* preview toolbar */}
        <div style={{ height:44, flexShrink:0, display:"flex", alignItems:"center", gap:10, padding:"0 20px", borderBottom:`1px solid ${H.border}`, background:"#060d1a" }}>
          <span style={{ fontSize: 14, fontFamily:"'JetBrains Mono',monospace", color:H.blue, letterSpacing:"0.06em" }}>{selected.id}</span>
          <span style={{ fontSize: 14, fontWeight:700, color:H.text }}>{selected.name}</span>
          <div style={{ flex:1 }} />
          <span style={{ fontSize: 14, color:H.textSub, letterSpacing:"0.06em" }}>1024 × 768 px</span>
          <div style={{ width:1, height:16, background:H.border }} />
          <span style={{ fontSize: 14, color:H.textDim, letterSpacing:"0.05em" }}>
            {allFrames.findIndex(f=>f.id===selectedId)+1} / {totalCount}
          </span>
          {/* prev / next */}
          {([-1, 1] as const).map(dir => {
            const idx = allFrames.findIndex(f => f.id === selectedId);
            const target = allFrames[idx + dir];
            return (
              <button key={dir} onClick={() => target && setSelectedId(target.id)}
                disabled={!target}
                style={{ width:26, height:26, borderRadius:6, border:`1px solid ${H.border}`, background:"rgba(255,255,255,0.04)", color:target?H.textSub:H.textDim, fontSize: 14, cursor:target?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {dir===-1?"◀":"▶"}
              </button>
            );
          })}
          <div style={{ width:1, height:16, background:H.border }} />
          {/* Export PNG button */}
          <button
            onClick={() => exportPNG(`${selected.id}_${selected.name.replace(/\s+/g,"_")}`)}
            disabled={exporting}
            style={{ height:28, padding:"0 14px", borderRadius:7, border:"none", background:exporting?"rgba(30,126,245,0.3)":H.blue, color:"#fff", fontSize: 14, fontWeight:700, letterSpacing:"0.06em", cursor:exporting?"default":"pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.12s", flexShrink:0 }}>
            {exporting ? (
              <>
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ animation:"spin 0.8s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Exporting…
              </>
            ) : (
              <>
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                PNG 저장
              </>
            )}
          </button>
        </div>

        {/* canvas area — scrollable if viewport too small */}
        <div style={{ flex:1, overflow:"auto", display:"flex", alignItems:"flex-start", justifyContent:"flex-start", padding:24, background:"#04090f" }}>
          <div key={selected.id} ref={previewMountRef}>
            {selected.render()}
          </div>
        </div>
      </div>
    </div>
  );
}
