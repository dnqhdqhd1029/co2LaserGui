import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import modeSelectBackground from "../assets/mode-select-background.png";

export type HMIScreen2 = "splash" | "home" | "cos" | "frx";
export type LaserState2 = "standby" | "ready" | "lasering" | "paused";

export interface HMIState2 {
  screen: HMIScreen2;
  laserState: LaserState2;
  soundOn: boolean;
  aimingLevel: 0 | 1 | 2 | 3 | 4 | 5;
  // COS params
  co2Power: number;
  co2Duration: number;
  co2Interval: number;
  co2LaserMode: "CW" | "Pulse";
  co2PulseMode: "Single" | "Repeat" | "Stream" | "Series";
  co2Tab: "Normal" | "Fractional";
  // FRX params
  frxPower: number;
  frxDuration: number;
  frxDegree: number;
  frxDensity: number;
  frxPauseTime: number;
  frxShape: "Line" | "Triangle" | "Square" | "Oval" | "Rim";
  frxScanMode: "Lining" | "Random";
  frxWidth: number;
  frxLength: number;
  frxTab: "Normal" | "Fractional";
}

export const HMI2_DEFAULT: HMIState2 = {
  screen: "splash",
  laserState: "standby",
  soundOn: true,
  aimingLevel: 2,
  co2Power: 30,
  co2Duration: 0.7,
  co2Interval: 9,
  co2LaserMode: "Pulse",
  co2PulseMode: "Repeat",
  co2Tab: "Normal",
  frxPower: 20,
  frxDuration: 0.5,
  frxDegree: 1,
  frxDensity: 0.5,
  frxPauseTime: 1.0,
  frxShape: "Triangle",
  frxScanMode: "Random" as "Lining" | "Random",
  frxWidth: 18,
  frxLength: 18,
  frxTab: "Fractional",
};

// ── HMI Design Tokens ────────────────────────────────────────────────────────
export const H = {
  bg: "#09101f", // 최외각 배경
  panel: "#0d1628", // 패널/카드 배경
  card: "#111e35", // 카드
  cardHov: "#162440",
  border: "rgba(255,255,255,0.07)",
  borderB: "rgba(42,110,220,0.35)", // blue tinted border
  blue: "#1e7ef5",
  blueDim: "rgba(30,126,245,0.18)",
  cyan: "#00cae4",
  cyanDim: "rgba(0,202,228,0.15)",
  text: "#d8e8ff",
  textSub: "#4e6e9a",
  textDim: "#1e3050",
  green: "#22c55e",
};

// ── 레이아웃 수치 — 여기서 미세 조정 ─────────────────────────────────────────────
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  LAYOUT — DGUS II 개발 기준 수치                                             │
// │  DWIN DGUS II · 1024×768 · BMP Export 기준                                  │
// │  각 수치를 변경하면 해당 요소 전체에 반영됩니다                                  │
// └─────────────────────────────────────────────────────────────────────────────┘
export const LAYOUT = {
  // ── 캔버스 (DGUS 해상도) ──────────────────────────────────────────────────────
  canvasW:             1024,  // DGUS 화면 가로 (px)
  canvasH:             768,   // DGUS 화면 세로 (px) ← 600→768

  // ── TopBar ────────────────────────────────────────────────────────────────────
  topbarHeight:        58,    // 상단 바 높이
  topbarPadX:          18,    // 상단 바 좌우 패딩
  topbarGap:           12,    // 상단 바 아이템 간격

  // ── TopBar 버튼 (Sound / Aiming) ──────────────────────────────────────────────
  topBtnHeight:        38,    // 버튼 높이
  topBtnPadX:          14,    // 버튼 좌우 패딩
  topBtnRadius:        9,     // 버튼 모서리
  // ── Section header vertical rhythm ────────────────────────────────────────
  sectionHeaderPadY:   10,    // 기존 영역에 추가되는 상·하 여백
  sectionContentGap:   12,    // Header와 콘텐츠 사이 간격
  sectionAccentGap:    12,    // Accent bar와 제목 사이 간격
  sectionAccentHeight: 22,    // 공통 Accent bar 높이

  // ── Aiming 드롭다운 ───────────────────────────────────────────────────────────
  aimDropTop:          58,    // topbar 기준 top 위치
  aimDropRight:        63,    // 우측 여백
  aimDropWidth:        145,   // 드롭다운 너비
  aimDropItemHeight:   42,    // 항목 높이
  aimDropRadius:       12,    // 모서리

  // ── Left panel (COS / FRX) ────────────────────────────────────────────────────
  cosPanelWidth:       451,   // COS 좌측 패널 너비 (canvas 44%)
  frxPanelWidth:       451,   // FRX 좌측 패널 너비 (canvas 44%)
  panelPadX:           16,    // 패널 내부 좌우 패딩
  panelPadY:           14,    // 패널 내부 상하 패딩

  // ── Laser bar (하단 고정) ─────────────────────────────────────────────────────
  laserBarHeight:      100,   // 레이저 바 전체 높이 (768 여유분 반영)
  laserBtnWidth:       420,   // 레이저 버튼 너비
  laserBtnHeight:      64,    // 레이저 버튼 높이
  laserBtnRadius:      14,    // 레이저 버튼 모서리

  // ── Param column ──────────────────────────────────────────────────────────────
  paramAdjBtnSize:     36,    // +/- 버튼 크기
  paramValueSize:      32,    // 수치 폰트 크기

  // ── Mode / Shape 버튼 ─────────────────────────────────────────────────────────
  modeBtnHeight:       88,    // 모드 버튼 높이
  shapeBtnHeight:      76,    // 쉐이프 버튼 높이

  // ── 오버레이 팝업 ──────────────────────────────────────────────────────────────
  overlayWidth:        520,   // 팝업 너비
  overlayRadius:       20,    // 팝업 모서리
};

// ── shared adj helper ─────────────────────────────────────────────────────────
function adjVal(
  cur: number,
  delta: number,
  min: number,
  max: number,
  step: number,
): number {
  return Math.max(
    min,
    Math.min(
      max,
      parseFloat(
        (Math.round((cur + delta) / step) * step).toFixed(10),
      ),
    ),
  );
}

// ── Param value column ────────────────────────────────────────────────────────
function HParamCol({
  label,
  value,
  unit,
  onDec,
  onInc,
  locked,
  emphasized = false,
}: {
  label: string;
  value: string | number;
  unit: string;
  onDec: () => void;
  onInc: () => void;
  locked: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: emphasized ? 180 : 110,
        gap: 0,
      }}
    >
      <button
        onClick={onInc}
        disabled={locked}
        style={{
          width: "100%",
          height: emphasized ? 60 : 36,
          padding: emphasized ? "10px 0" : 0,
          boxSizing: "border-box",
          borderRadius: "10px 10px 0 0",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.05)",
          color: locked ? "#1e3050" : "#8ab0d8",
          fontSize: emphasized ? 30 : 22,
          cursor: locked ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.1s",
        }}
      >
        +
      </button>
      <div
        style={{
          width: "100%",
          padding: emphasized ? "16px 0" : "12px 0",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: emphasized ? 48 : 32,
              fontWeight: 400,
              color: locked ? "#253448" : H.text,
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {value}
          </span>
          <span
            style={{
              fontSize: 14,
              color: H.textSub,
              marginBottom: 2,
            }}
          >
            {unit}
          </span>
        </div>
      </div>
      <button
        onClick={onDec}
        disabled={locked}
        style={{
          width: "100%",
          height: emphasized ? 60 : 36,
          padding: emphasized ? "10px 0" : 0,
          boxSizing: "border-box",
          borderRadius: "0 0 10px 10px",
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.05)",
          color: locked ? "#1e3050" : "#8ab0d8",
          fontSize: emphasized ? 30 : 22,
          cursor: locked ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.1s",
        }}
      >
        −
      </button>
      <div
        style={{
          marginTop: 12,
          fontSize: 14,
          color: H.textSub,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── Mode selector pill ────────────────────────────────────────────────────────
function HPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 9,
        border: `1px solid ${active ? color : "rgba(255,255,255,0.07)"}`,
        background: active ? `${color}22` : "transparent",
        color: active ? color : H.textSub,
        fontSize: 16,
        fontWeight: active ? 700 : 400,
        cursor: "pointer",
        transition: "all 0.12s",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </button>
  );
}

// ── Bottom laser action bar ───────────────────────────────────────────────────
export function HLaserBar({
  state,
  onPress,
}: {
  state: LaserState2;
  onPress: () => void;
}) {
  const cfg: {
    [k in LaserState2]: {
      label: string;
      sub: string;
      bg: string;
      border: string;
      color: string;
    };
  } = {
    standby: {
      label: "STANDBY",
      sub: "대기 중 · 레이저 비활성",
      bg: "rgba(34,197,94,0.10)",
      border: "#22c55e",
      color: "#4ade80",
    },
    ready: {
      label: "READY",
      sub: "발사 준비 완료 · 풋스위치 대기",
      bg: "rgba(249,115,22,0.18)",
      border: "#f97316",
      color: "#fdba74",
    },
    lasering: {
      label: "LASER EMISSION",
      sub: "레이저 조사 중",
      bg: "rgba(234,179,8,0.18)",
      border: "#eab308",
      color: "#fde047",
    },
    paused: {
      label: "PAUSED",
      sub: "일시 정지 · 탭하여 재개",
      bg: "rgba(34,197,94,0.10)",
      border: "#4ade80",
      color: "#86efac",
    },
  };
  const c = cfg[state];
  return (
    <div
      style={{
        height: 90,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: `1px solid ${H.border}`,
        background: H.panel,
      }}
    >
      <button
        onClick={onPress}
        style={{
          width: 380,
          height: 58,
          borderRadius: 14,
          border: `2px solid ${c.border}`,
          background: c.bg,
          color: c.color,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          transition: "all 0.18s",
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "0.16em",
            fontFamily: "'Inter',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {state === "lasering" && (
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
            >
              ⬤
            </motion.span>
          )}
          {c.label}
        </span>
        <span
          style={{
            fontSize: 14,
            opacity: 0.6,
            letterSpacing: "0.05em",
          }}
        >
          {c.sub}
        </span>
      </button>
    </div>
  );
}

// ── Top status bar ────────────────────────────────────────────────────────────
export function HTopBar({
  mode,
  onBack,
  soundOn,
  aimingLevel,
  onMenu,
  activeMenu = null,
  cameraActive = false,
  onCamera,
  onSound,
  onAiming,
}: {
  mode: "cos" | "frx" | null;
  onBack?: () => void;
  soundOn: boolean;
  aimingLevel: 0 | 1 | 2 | 3 | 4 | 5;
  onMenu?: (k: "memo" | "call" | "save") => void;
  activeMenu?: "memo" | "call" | "save" | null;
  cameraActive?: boolean;
  onCamera?: () => void;
  onSound: () => void;
  onAiming: (l: 0 | 1 | 2 | 3 | 4 | 5) => void;
}) {
  const [aimOpen, setAimOpen] = useState(false);
  const [soundHover, setSoundHover] = useState(false);
  const [aimHover, setAimHover] = useState(false);
  const [cameraHover, setCameraHover] = useState(false);
  const aimLevels: [0 | 1 | 2 | 3 | 4 | 5, string][] = [
    [0, "OFF"],
    [1, "Level 1"],
    [2, "Level 2"],
    [3, "Level 3"],
    [4, "Level 4"],
    [5, "Level 5"],
  ];
  const aimActive = aimingLevel > 0;
  const aimLabel = aimingLevel === 0 ? "OFF" : `${aimingLevel}`;
  return (
    <div
      style={{
        height: LAYOUT.topbarHeight,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: LAYOUT.topbarGap,
        paddingLeft: LAYOUT.topbarPadX,
        paddingRight: LAYOUT.topbarPadX,
        background: H.panel,
        borderBottom: `1px solid ${H.border}`,
        position: "relative",
        zIndex: 50,
        fontFamily: "'Inter','Noto Sans KR',system-ui,sans-serif",
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: LAYOUT.topBtnHeight,
            padding: `0 ${LAYOUT.topBtnPadX}px`,
            borderRadius: LAYOUT.topBtnRadius,
            border: `1px solid ${H.border}`,
            background: "rgba(255,255,255,0.04)",
            color: H.textSub,
            fontSize: 14,
            lineHeight: 1,
            cursor: "pointer",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}
      <div
        style={{
          display: "none",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: H.green,
            border: "1px solid rgba(134,239,172,0.65)",
          }}
        />
        <span
          style={{
            fontSize: 15,
            lineHeight: 1,
            fontWeight: 700,
            color: H.text,
            letterSpacing: "0.06em",
          }}
        >
          {mode === "cos"
            ? "COS  Continuous Laser"
            : mode === "frx"
              ? "FRX  Fractional CO₂"
              : "LUMIX  CO₂ Laser System"}
        </span>
        {mode && (
          <span
            style={{
              fontSize: 14,
              lineHeight: 1,
              padding: "3px 10px",
              borderRadius: 6,
              background:
                mode === "cos" ? H.cyanDim : H.blueDim,
              border: `1px solid ${mode === "cos" ? H.cyan : H.blue}40`,
              color: mode === "cos" ? H.cyan : H.blue,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {mode.toUpperCase()}
          </span>
        )}
      </div>
      <div style={{ flex: 1 }} />
      {mode && onMenu && (["memo", "call", "save"] as const).map((item) => (
        <button
          key={item}
          onClick={() => onMenu(item)}
          style={{
            height: LAYOUT.topBtnHeight,
            padding: `0 ${LAYOUT.topBtnPadX}px`,
            borderRadius: LAYOUT.topBtnRadius,
            border: `1px solid ${activeMenu === item ? "rgba(0,202,228,0.45)" : H.border}`,
            background: activeMenu === item ? "rgba(0,202,228,0.08)" : "rgba(255,255,255,0.03)",
            color: activeMenu === item ? H.cyan : H.textSub,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.14s",
          }}
        >
          {item.toUpperCase()}
        </button>
      ))}
      {/* Sound button */}
      <button
        onClick={onSound}
        onMouseEnter={() => setSoundHover(true)}
        onMouseLeave={() => setSoundHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          height: LAYOUT.topBtnHeight,
          padding: `0 ${LAYOUT.topBtnPadX}px`,
          borderRadius: LAYOUT.topBtnRadius,
          border: `1px solid ${soundOn ? "rgba(0,202,228,0.45)" : H.border}`,
          background: soundOn
            ? soundHover ? "rgba(0,202,228,0.14)" : "rgba(0,202,228,0.08)"
            : soundHover ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
          color: soundOn || soundHover ? H.cyan : H.textDim,
          fontSize: 14,
          lineHeight: 1,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.04em",
          flexShrink: 0,
          transition: "all 0.14s",
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          {soundOn ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
        </svg>
        Sound
      </button>
      {/* Aiming button — dropdown anchored to topbar right edge */}
      <div style={{ position: "static", flexShrink: 0 }}>
        <button
          onClick={() => setAimOpen((v) => !v)}
          onMouseEnter={() => setAimHover(true)}
          onMouseLeave={() => setAimHover(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            height: LAYOUT.topBtnHeight,
            padding: `0 ${LAYOUT.topBtnPadX}px`,
            borderRadius: LAYOUT.topBtnRadius,
            border: `1px solid ${aimActive ? "rgba(0,202,228,0.45)" : H.border}`,
            background: aimActive
              ? aimHover ? "rgba(0,202,228,0.14)" : "rgba(0,202,228,0.08)"
              : aimHover ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
            color: aimActive || aimHover ? H.cyan : H.textDim,
            fontSize: 14,
            lineHeight: 1,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "all 0.14s",
          }}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
          </svg>
          <span style={{ lineHeight: 1 }}>Aiming</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 14,
              lineHeight: 1,
              fontWeight: 700,
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {aimLabel}
          </span>
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ opacity: 0.5 }}
          >
            <polyline
              points={
                aimOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"
              }
            />
          </svg>
        </button>
      </div>
      <button
        onClick={onCamera}
        aria-label="Camera"
        title="Camera"
        onMouseEnter={() => setCameraHover(true)}
        onMouseLeave={() => setCameraHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: LAYOUT.topBtnHeight,
          width: LAYOUT.topBtnHeight,
          padding: 0,
          borderRadius: LAYOUT.topBtnRadius,
          border: `1px solid ${cameraActive ? "rgba(0,202,228,0.65)" : "rgba(0,202,228,0.45)"}`,
          background: cameraActive
            ? cameraHover ? "rgba(0,202,228,0.20)" : "rgba(0,202,228,0.14)"
            : cameraHover ? "rgba(0,202,228,0.14)" : "rgba(0,202,228,0.08)",
          color: H.cyan,
          fontSize: 14,
          lineHeight: 1,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.04em",
          flexShrink: 0,
          transition: "all 0.14s",
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      </button>
      {/* Dropdown — positioned from topbar right, always within 1024px */}
      <AnimatePresence>
        {aimOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            style={{
              position: "absolute",
              top: LAYOUT.aimDropTop,
              right: LAYOUT.aimDropRight,
              zIndex: 100,
              width: LAYOUT.aimDropWidth,
              borderRadius: LAYOUT.aimDropRadius,
              background: "#0f1928",
              border: `1px solid ${H.borderB}`,
              overflow: "hidden",
            }}
          >
            {aimLevels.map(([lvl, label]) => {
              const isSel = aimingLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    onAiming(lvl);
                    setAimOpen(false);
                  }}
                  style={{
                    width: "100%",
                    height: LAYOUT.aimDropItemHeight,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0 14px",
                    border: "none",
                    background: isSel
                      ? "rgba(0,202,228,0.10)"
                      : "none",
                    color: isSel ? H.cyan : H.textSub,
                    fontSize: 14,
                    fontWeight: isSel ? 700 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: `1px solid ${H.border}`,
                    transition: "background 0.1s",
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      border: `1.5px solid ${isSel ? H.cyan : "rgba(255,255,255,0.2)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSel && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          background: H.cyan,
                        }}
                      />
                    )}
                  </span>
                  {label}
                  {lvl > 0 && (
                    <span
                      style={{
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 14,
                        fontWeight: 700,
                        marginLeft: "auto",
                        opacity: isSel ? 1 : 0.4,
                      }}
                    >
                      {lvl}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Splash screen ─────────────────────────────────────────────────────────────
// Q-TECH logo — blue paths → H.blue (#1e7ef5), green paths → H.cyan (#00cae4)
function HQTechLogo({ width = 260 }: { width?: number }) {
  const vw = 541.617,
    vh = 458.438;
  const h = width * (vh / vw);
  const blue = H.blue; // Q circle, Q-tail, "Q" letter, dash
  const green = H.cyan; // arrow, swoop, T E C H
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Q circle */}
      <path
        fill={blue}
        d="M146.682 150.49C160.549 74.6912 217.863 17.158 274.696 21.986C331.531 26.814 366.363 92.1739 352.496 167.972C347.114 197.396 335.166 224.042 319.258 245.38C340.65 229.595 362.046 210.259 382.196 186.535L363.727 178.463L415.643 156.02C424.408 73.4072 366.891 4.87942 282.026 0.247429C192.837 -4.62056 107.221 62.9313 90.7996 151.128C77.4383 222.883 113.996 286.193 176.118 309.929C189.218 307.164 205.458 302.912 223.641 296.377C167.309 290.972 132.885 225.91 146.682 150.49Z"
      />
      {/* Arrow (green) */}
      <path
        fill={green}
        d="M389.998 181.103L409.449 189.604C382.831 220.942 354.151 245.024 326.003 263.548C331.706 268.039 337.444 273.14 343.18 278.927C403.803 247.671 441.908 212.016 441.908 212.016L458.136 225.154L493.688 136.279L389.998 181.103Z"
      />
      {/* Swoop green */}
      <path
        fill={green}
        d="M280.943 289.111C212.618 322.136 156.938 324.849 156.938 324.849C206.029 326.523 252.014 316.344 292.132 301.501C291.318 300.548 290.517 299.572 289.728 298.573C289.728 298.573 286.626 294.749 280.943 289.111Z"
      />
      {/* Q-tail swoosh (blue) */}
      <path
        fill={blue}
        d="M331.46 281.569C259.589 208.152 186.943 242.929 186.943 242.929C230.523 244.627 265.397 273.679 280.943 289.109C286.626 294.747 289.728 298.572 289.728 298.572C290.517 299.571 291.318 300.547 292.131 301.5C342.982 361.071 441.975 330.257 441.975 330.257C370.875 335.667 331.46 281.569 331.46 281.569Z"
      />
      {/* "Q" letter in text (blue) */}
      <path
        fill={blue}
        d="M76.7916 432.426L68.3477 425.661H47.361L57.4837 435.817C54.421 435.924 51.8277 435.985 50.5917 435.985H28.8104C26.8771 435.985 25.4464 435.612 24.6731 434.902C24.1718 434.445 23.8878 433.905 24.1384 432.766L31.3397 399.838C31.5797 398.74 32.2504 397.902 33.4517 397.197C34.8557 396.373 36.6051 395.954 38.6531 395.954H79.9103C81.733 395.954 83.057 396.29 83.7396 396.925C84.1716 397.326 84.4143 397.794 84.1996 398.777L76.9303 432.004C76.8996 432.15 76.841 432.286 76.7916 432.426ZM100.634 433.56L108.206 398.948C109.562 392.748 107.908 387.493 103.421 383.754C99.1809 380.222 93.0369 378.433 85.1636 378.433H38.4224C31.2157 378.433 24.6744 380.128 18.9798 383.47C13.0491 386.954 9.3678 391.804 8.03713 397.888L0.46649 432.498C-0.952173 438.98 0.878488 444.484 5.77314 448.421C10.0305 451.796 15.8558 453.508 23.0864 453.508H56.9903C57.769 453.598 61.033 453.942 65.2357 453.942C68.1557 453.942 71.5276 453.762 74.8383 453.23L80.0303 458.438H109.256L93.4969 445.81C97.1369 442.673 99.5382 438.572 100.634 433.56Z"
      />
      {/* Dash (blue) */}
      <path
        fill={blue}
        d="M119.35 428.142H163.45L166.742 413.092H122.642L119.35 428.142Z"
      />
      {/* T (green) */}
      <path
        fill={green}
        d="M167.727 378.433L163.894 395.956H193.257L180.733 453.209H204.933L217.457 395.956H251.821L255.654 378.433H167.727Z"
      />
      {/* E (green) */}
      <path
        fill={green}
        d="M274.083 383.202C267.538 386.541 263.458 391.717 261.957 398.58L254.906 430.816C252.927 439.857 256.733 444.992 260.271 447.702C265.098 451.408 272.385 453.209 282.55 453.209H331.796L335.631 435.686H289.371C284.703 435.686 281.35 435.416 279.407 434.885C278.72 434.696 278.527 434.496 278.519 434.496C278.514 434.481 278.49 434.35 278.555 434.053L280.679 424.337H338.426L342.26 406.813H284.514L286.016 399.937C286.292 398.677 286.916 397.78 287.984 397.113C289.227 396.334 290.522 395.954 291.939 395.954H344.791L348.623 378.433H300.642C289.224 378.433 280.29 380.037 274.083 383.202Z"
      />
      {/* C (green) */}
      <path
        fill={green}
        d="M383.971 399.64C384.191 398.633 384.775 395.954 391.395 395.954H440.303L444.133 378.433H392.106C384.174 378.433 377.143 380.193 371.211 383.668C365.046 387.28 361.242 392.199 359.91 398.284L352.383 432.696C351.058 438.75 353.066 444.026 358.183 447.948C362.718 451.441 368.623 453.209 375.739 453.209H427.465L431.299 435.686H381.62C379.694 435.686 378.248 435.317 377.322 434.586C376.536 433.969 376.556 433.532 376.659 433.064L383.971 399.64Z"
      />
      {/* H (green) */}
      <path
        fill={green}
        d="M517.104 378.433L510.811 407.209H475.465L481.76 378.433H457.247L440.891 453.209H465.404L471.632 424.732H506.977L500.748 453.209H525.261L541.617 378.433H517.104Z"
      />
    </svg>
  );
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  [DGUS FRAME 00]  SPLASH / 부팅 화면                                         │
// │  Page ID : 0x00                                                              │
// │  States  : 1 (단일 BMP — 애니메이션 없음, 로딩 바는 DGUS VP로 구현)              │
// │  Export  : Screen_00_Splash.bmp                                              │
// └─────────────────────────────────────────────────────────────────────────────┘
export function HMI2Splash({
  onDone,
  forcedProgress,
}: {
  onDone: () => void;
  forcedProgress?: 0 | 50 | 100;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: H.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(30,126,245,0.06) 0%,transparent 68%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <HQTechLogo width={290} />
        </motion.div>
        {/* Product info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              fontSize: 14,
              color: H.textSub,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: 9,
              fontWeight: 500,
            }}
          >
            CO₂ Laser System
          </div>

        </motion.div>
        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 300,
              height: 8,
              borderRadius: 999,
              background: H.textDim,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: forcedProgress === undefined ? "0%" : `${forcedProgress}%` }}
              animate={{ width: forcedProgress === undefined ? "100%" : `${forcedProgress}%` }}
              transition={forcedProgress === undefined ? { duration: 2.6, ease: "easeInOut" } : { duration: 0 }}
              style={{
                height: "100%",
                borderRadius: 999,
                background: "rgba(20,154,245,0.96)",
              }}
            />
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{
              fontSize: 14,
              color: H.textSub,
              letterSpacing: "0.1em",
            }}
          >
            Initializing…
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  [DGUS FRAME 01]  HOME / 모드 선택                                            │
// │  Page ID : 0x01                                                              │
// │  States  : 1 (단일 BMP)                                                      │
// │  Buttons : COS 카드(2-state), FRX 카드(2-state)                               │
// │  Export  : Screen_01_Home.bmp                                                │
// └─────────────────────────────────────────────────────────────────────────────┘
export function HMI2Home({
  onCOS,
  onFRX,
  forcedActive = null,
}: {
  onCOS: () => void;
  onFRX: () => void;
  forcedActive?: "cos" | "frx" | null;
}) {
  const [hov, setHov] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const cards = [
    {
      id: "cos",
      label: "COS",
      sub: "Continuous Laser",
      detail: "CW / Pulse Mode",
      color: H.cyan,
      onClick: onCOS,
      icon: (
        <svg
          width={38}
          height={38}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="4"
            fill={H.cyan}
            opacity={0.9}
          />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1={12 + 6 * Math.cos((a * Math.PI) / 180)}
              y1={12 + 6 * Math.sin((a * Math.PI) / 180)}
              x2={12 + 11 * Math.cos((a * Math.PI) / 180)}
              y2={12 + 11 * Math.sin((a * Math.PI) / 180)}
              stroke={H.cyan}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.7}
            />
          ))}
        </svg>
      ),
    },
    {
      id: "frx",
      label: "FRX",
      sub: "Fractional CO₂",
      detail: "Shape / Scan / Density",
      color: H.blue,
      onClick: onFRX,
      icon: (
        <svg
          width={38}
          height={38}
          viewBox="0 0 24 24"
          fill="none"
        >
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => (
              <circle
                key={`${r}${c}`}
                cx={3 + c * 6}
                cy={3 + r * 6}
                r={1.6}
                fill={H.blue}
                opacity={0.85}
              />
            )),
          )}
        </svg>
      ),
    },
  ];
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: H.bg,
        backgroundImage: `linear-gradient(rgba(9,16,31,0.42), rgba(9,16,31,0.58)), url(${modeSelectBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 0,
          display: "none",
          alignItems: "center",
          paddingLeft: 24,
          paddingRight: 24,
          gap: 10,
          borderBottom: `1px solid ${H.border}`,
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke={H.textSub}
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span style={{ fontSize: 14, color: H.textSub }}>
          42F · DOB: 1983.11.14 · Session #3 · Dr. Kim
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              background: H.green,
              border: "1px solid rgba(134,239,172,0.65)",
            }}
          />
          <span
            style={{
              fontSize: 14,
              color: H.green,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            SYSTEM READY
          </span>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "32px 72px",
        }}
      >
        {cards.map(
          ({
            id,
            label,
            sub,
            detail,
            color,
            onClick,
            icon,
          }) => {
            const isHov = hov === id;
            const isPressed = forcedActive === id || pressed === id;
            return (
              <div
                key={id}
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setPressed(id);
                    onClick();
                  }
                }}
                onKeyUp={() => setPressed(null)}
                onPointerDown={() => setPressed(id)}
                onPointerUp={() => setPressed(null)}
                onMouseEnter={() => setHov(id)}
                onMouseLeave={() => {
                  setHov(null);
                  setPressed(null);
                }}
                style={{
                  flex: 1,
                  height: "100%",
                  maxHeight: 490,
                  appearance: "none",
                  WebkitAppearance: "none",
                  boxSizing: "border-box",
                  borderRadius: 18,
                  border: `${isPressed ? 2 : 1}px solid ${
                    isPressed ? color + "b8" : isHov ? color + "80" : H.border
                  }`,
                  backgroundColor: isPressed
                    ? `${color}20`
                    : isHov
                      ? "rgba(20,35,63,0.98)"
                      : "rgba(16,27,48,0.96)",
                  backgroundImage: "none",
                  backgroundClip: "padding-box",
                  outline: "none",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  padding: "34px 34px 30px",
                  transition: "all 0.18s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    backgroundColor: "transparent",
                    backgroundImage: "none",
                    border: "none",
                  }}
                >
                  <div
                    style={{
                      width: 74,
                      height: 74,
                      borderRadius: 15,
                      background: `${color}18`,
                      border: `1px solid ${color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 28,
                    }}
                  >
                    {icon}
                  </div>
                  <div
                    style={{
                      fontSize: 64,
                      fontWeight: 800,
                      color: color,
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                      marginBottom: 14,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      color: H.text,
                      fontWeight: 600,
                      lineHeight: 1.25,
                      marginBottom: 8,
                    }}
                  >
                    {sub}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: 1.35,
                      color: H.textSub,
                    }}
                  >
                    {detail}
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function HSectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        fontSize: 16,
        color: H.textSub,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        lineHeight: 1.3,
        fontWeight: 700,
        padding: `${LAYOUT.sectionHeaderPadY}px 0`,
        marginBottom: LAYOUT.sectionContentGap,
        display: "flex",
        alignItems: "center",
        gap: LAYOUT.sectionAccentGap,
      }}
    >
      <div
        style={{
          width: 2,
          height: LAYOUT.sectionAccentHeight,
          borderRadius: 1,
          background: H.textDim,
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  );
}

// ── PARAMETERS section header ─────────────────────────────────────────────────
function HParamsHeader({
  label = "PARAMETERS",
  accentColor = H.blue,
}: {
  label?: string;
  accentColor?: string;
}) {
  return (
    <div
      style={{
        padding: `${14 + LAYOUT.sectionHeaderPadY}px 28px ${12 + LAYOUT.sectionHeaderPadY}px`,
        borderBottom: `1px solid ${H.border}`,
        display: "flex",
        alignItems: "center",
        gap: LAYOUT.sectionAccentGap,
      }}
    >
      <div
        style={{
          width: 4,
          height: LAYOUT.sectionAccentHeight,
          borderRadius: 2,
          background: accentColor,
        }}
      />
      <span
        style={{
          fontSize: 18,
          color: H.text,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── MEMO/CALL/SAVE toggle button ──────────────────────────────────────────────
function HMemBtn({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 40,
        borderRadius: 9,
        border: `1px solid ${on ? "rgba(34,197,94,0.5)" : H.border}`,
        background: on
          ? "rgba(34,197,94,0.1)"
          : "rgba(255,255,255,0.03)",
        color: on ? H.green : H.textSub,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.08em",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all 0.14s",
      }}
    >
      {label}
    </button>
  );
}

// ── Icon+label mode button ────────────────────────────────────────────────────
function HModeBtn({
  label,
  icon,
  active,
  onClick,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 80,
        borderRadius: 12,
        border: `1px solid ${active ? color : H.border}`,
        background: active
          ? `${color}1c`
          : "rgba(255,255,255,0.03)",
        color: active ? color : H.textSub,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all 0.14s",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
          opacity: active ? 1 : 0.45,
          transform: active ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.14s",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          letterSpacing: "0.08em",
          lineHeight: 1.2,
          textAlign: "center",
          height: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  [DGUS FRAME 02]  COS — Continuous Laser 파라미터 화면                         │
// │  Page ID : 0x02                                                              │
// │  States  : 1 배경 BMP + 버튼별 State BMP                                      │
// │  Buttons :                                                                   │
// │    - LASER MODE  CW(2-state) / Pulse(2-state)                                │
// │    - PULSE MODE  Single/Repeat/Stream/Series (각 2-state)                     │
// │    - MEMO / CALL / SAVE  (각 2-state: Normal / Active)                        │
// │    - LASER BAR  Standby/Ready/Emission/Paused (각 1-state BMP)                │
// │    - Param +/- 버튼  (2-state: Normal / Pressed)                              │
// │  VP Map : Power=0x1000, Duration=0x1002, Interval=0x1004                     │
// │  Export  : Screen_02_COS.bmp                                                 │
// └─────────────────────────────────────────────────────────────────────────────┘
export function HMI2COS({
  s,
  upd,
  onMenu,
  forcedParam,
}: {
  s: HMIState2;
  upd: (p: Partial<HMIState2>) => void;
  onMenu: (k: "memo" | "call" | "save") => void;
  forcedParam?: "power" | "duration" | "interval";
}) {
  const locked = s.laserState === "lasering";
  const [activeCosParam, setActiveCosParam] = useState<
    "power" | "duration" | "interval"
  >("power");
  const cosParams = {
    power: {
      label: "Power",
      value: s.co2Power,
      unit: "W",
      onDec: () => upd({ co2Power: adjVal(s.co2Power, -1, 1, 60, 1) }),
      onInc: () => upd({ co2Power: adjVal(s.co2Power, 1, 1, 60, 1) }),
    },
    duration: {
      label: "Duration",
      value: s.co2Duration.toFixed(1),
      unit: "ms",
      onDec: () => upd({ co2Duration: adjVal(s.co2Duration, -0.1, 0.1, 10, 0.1) }),
      onInc: () => upd({ co2Duration: adjVal(s.co2Duration, 0.1, 0.1, 10, 0.1) }),
    },
    interval: {
      label: "Interval",
      value: s.co2Interval,
      unit: "ms",
      onDec: () => upd({ co2Interval: adjVal(s.co2Interval, -1, 1, 100, 1) }),
      onInc: () => upd({ co2Interval: adjVal(s.co2Interval, 1, 1, 100, 1) }),
    },
  };
  const selectedCosParamKey = forcedParam ?? activeCosParam;
  const selectedCosParam = cosParams[selectedCosParamKey];

  const laserModeIcons: {
    CW: React.ReactNode;
    Pulse: React.ReactNode;
  } = {
    CW: (
      <svg
        width={48}
        height={18}
        viewBox="0 0 72 18"
        fill="none"
      >
        <path
          d="M0 9 Q9 0 18 9 Q27 18 36 9 Q45 0 54 9 Q63 18 72 9"
          stroke="currentColor"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
    Pulse: (
      <svg
        width={48}
        height={18}
        viewBox="0 0 72 18"
        fill="none"
      >
        <polyline
          points="0,9 12,9 12,2 24,2 24,9 42,9 42,2 54,2 54,9 72,9"
          stroke="currentColor"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const pulseModeIcons: {
    Single: React.ReactNode;
    Repeat: React.ReactNode;
    Stream: React.ReactNode;
    Series: React.ReactNode;
  } = {
    Single: (
      <svg
        width={48}
        height={18}
        viewBox="0 0 56 18"
        fill="none"
      >
        <polyline
          points="0,9 16,9 16,2 28,2 28,9 56,9"
          stroke="currentColor"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Repeat: (
      <svg
        width={48}
        height={18}
        viewBox="0 0 56 18"
        fill="none"
      >
        <polyline
          points="0,9 8,9 8,2 16,2 16,9 24,9 24,2 32,2 32,9 40,9"
          stroke="currentColor"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 5 L50 9 L44 13"
          stroke="currentColor"
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Stream: (
      <svg
        width={48}
        height={14}
        viewBox="0 0 56 14"
        fill="none"
      >
        {[0, 11, 22, 33, 44].map((x) => (
          <rect
            key={x}
            x={x}
            y={3}
            width={7}
            height={8}
            rx={2}
            fill="currentColor"
            opacity={0.85}
          />
        ))}
      </svg>
    ),
    Series: (
      <svg
        width={48}
        height={18}
        viewBox="0 0 56 18"
        fill="none"
      >
        <polyline
          points="0,9 5,9 5,2 10,2 10,9 15,9"
          stroke="currentColor"
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="22,9 27,9 27,2 32,2 32,9 37,9"
          stroke="currentColor"
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="44,9 49,9 49,2 54,2 54,9"
          stroke="currentColor"
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        background: H.bg,
      }}
    >
      {/* LEFT panel */}
      <div
        style={{
          width: "44%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${H.border}`,
        }}
      >
        {/* LASER MODE */}
        <div
          style={{
            padding: "16px",
            borderBottom: `1px solid ${H.border}`,
          }}
        >
          <HSectionLabel>LASER MODE</HSectionLabel>
          <div style={{ display: "flex", gap: 10 }}>
            {(["CW", "Pulse"] as const).map((m) => (
              <HModeBtn
                key={m}
                label={m}
                icon={laserModeIcons[m]}
                active={s.co2LaserMode === m}
                onClick={() => upd({ co2LaserMode: m })}
                color={H.cyan}
              />
            ))}
          </div>
        </div>
        {/* PULSE MODE */}
        <div style={{ padding: "16px", flex: 1 }}>
          <HSectionLabel>PULSE MODE</HSectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {(
              ["Single", "Repeat", "Stream", "Series"] as const
            ).map((m) => (
              <HModeBtn
                key={m}
                label={m}
                icon={pulseModeIcons[m]}
                active={s.co2PulseMode === m}
                onClick={() => upd({ co2PulseMode: m })}
                color={H.cyan}
              />
            ))}
          </div>
        </div>
      </div>
      {/* RIGHT: parameters */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HParamsHeader accentColor={H.cyan} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "18px 22px 20px",
            gap: 18,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {(Object.keys(cosParams) as Array<keyof typeof cosParams>).map((key) => {
              const active = selectedCosParamKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCosParam(key)}
                  style={{
                    height: 46,
                    borderRadius: 10,
                    border: `1px solid ${active ? H.cyan : H.border}`,
                    background: active ? H.cyanDim : "rgba(255,255,255,0.03)",
                    color: active ? H.cyan : H.textSub,
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.14s",
                  }}
                >
                  {cosParams[key].label}
                </button>
              );
            })}
          </div>
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: `1px solid ${H.border}`,
              background: "rgba(0,0,0,0.12)",
            }}
          >
            <HParamCol
              label={selectedCosParam.label}
              value={selectedCosParam.value}
              unit={selectedCosParam.unit}
              locked={locked}
              onDec={selectedCosParam.onDec}
              onInc={selectedCosParam.onInc}
              emphasized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  [DGUS FRAME 03]  FRX — Fractional CO₂ 파라미터 화면                          │
// │  Page ID : 0x03                                                              │
// │  States  : 1 배경 BMP + 버튼별 State BMP                                      │
// │  Buttons :                                                                   │
// │    - SHAPE  Line/Triangle/Square/Oval/Rim (각 2-state)                        │
// │    - SCAN MODE  Lining/Random (각 2-state)                                    │
// │    - MEMO / CALL / SAVE  (각 2-state: Normal / Active)                        │
// │    - LASER BAR  Standby/Ready/Emission/Paused (각 1-state BMP)                │
// │    - Param +/- 버튼  (2-state: Normal / Pressed)                              │
// │    - WIDTH / LENGTH +/- 버튼  (2-state)                                       │
// │  VP Map : Power=0x1010, Duration=0x1012, Degree=0x1014,                      │
// │           Density=0x1016, PauseTime=0x1018                                   │
// │  Export  : Screen_03_FRX.bmp                                                 │
// └─────────────────────────────────────────────────────────────────────────────┘
export function HMI2FRX({
  s,
  upd,
  onMenu,
  forcedParam,
}: {
  s: HMIState2;
  upd: (p: Partial<HMIState2>) => void;
  onMenu: (k: "memo" | "call" | "save") => void;
  forcedParam?: "power" | "degree" | "density" | "pause";
}) {
  const locked = s.laserState === "lasering";
  const [sizeLocked, setSizeLocked] = useState(false);
  const [activeParam, setActiveParam] = useState<
    "power" | "degree" | "density" | "pause"
  >("power");
  const frxParams = {
    power: {
      label: "Power",
      value: s.frxPower,
      unit: "W",
      onDec: () => upd({ frxPower: adjVal(s.frxPower, -1, 1, 60, 1) }),
      onInc: () => upd({ frxPower: adjVal(s.frxPower, 1, 1, 60, 1) }),
    },
    degree: {
      label: "Degree",
      value: s.frxDegree,
      unit: "",
      onDec: () => upd({ frxDegree: adjVal(s.frxDegree, -1, 1, 10, 1) }),
      onInc: () => upd({ frxDegree: adjVal(s.frxDegree, 1, 1, 10, 1) }),
    },
    density: {
      label: "Density",
      value: s.frxDensity.toFixed(1),
      unit: "mm",
      onDec: () => upd({ frxDensity: adjVal(s.frxDensity, -0.1, 0.1, 5, 0.1) }),
      onInc: () => upd({ frxDensity: adjVal(s.frxDensity, 0.1, 0.1, 5, 0.1) }),
    },
    pause: {
      label: "Pause",
      value: s.frxPauseTime.toFixed(1),
      unit: "sec",
      onDec: () => upd({ frxPauseTime: adjVal(s.frxPauseTime, -0.1, 0.1, 5, 0.1) }),
      onInc: () => upd({ frxPauseTime: adjVal(s.frxPauseTime, 0.1, 0.1, 5, 0.1) }),
    },
  };
  const selectedParamKey = forcedParam ?? activeParam;
  const selectedParam = frxParams[selectedParamKey];

  const shapes: [string, React.ReactNode][] = [
    [
      "Line",
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />,
    ],
    [
      "Triangle",
      <polygon
        points="12,3 21,21 3,21"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />,
    ],
    [
      "Square",
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />,
    ],
    [
      "Oval",
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />,
    ],
    [
      "Rim",
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth={2}
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth={1.4}
          fill="none"
        />
      </>,
    ],
  ];

  const scanIcons: {
    Lining: React.ReactNode;
    Random: React.ReactNode;
  } = {
    Lining: (
      <svg
        width={28}
        height={18}
        viewBox="0 0 28 18"
        fill="none"
      >
        {[1, 5, 9, 13, 17].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={28}
            y2={y}
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
    Random: (
      <svg
        width={28}
        height={18}
        viewBox="0 0 28 18"
        fill="none"
      >
        {[
          [4, 3],
          [14, 6],
          [23, 2],
          [8, 13],
          [20, 14],
          [2, 10],
          [26, 10],
          [11, 9],
          [18, 7],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={2.2}
            fill="currentColor"
            opacity={0.9}
          />
        ))}
      </svg>
    ),
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        background: H.bg,
      }}
    >
      {/* LEFT panel */}
      <div
        style={{
          width: "44%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${H.border}`,
        }}
      >
        {/* SHAPE */}
        <div
          style={{
            padding: "16px",
            borderBottom: `1px solid ${H.border}`,
          }}
        >
          <HSectionLabel>SHAPE</HSectionLabel>
          <div style={{ display: "flex", gap: 6 }}>
            {shapes.map(([v, svg]) => {
              const active =
                s.frxShape === (v as typeof s.frxShape);
              return (
                <button
                  key={v}
                  onClick={() =>
                    upd({ frxShape: v as typeof s.frxShape })
                  }
                  style={{
                    flex: 1,
                    height: 68,
                    borderRadius: 12,
                    border: `1px solid ${active ? H.blue : H.border}`,
                    background: active
                      ? H.blueDim
                      : "rgba(255,255,255,0.03)",
                    color: active ? H.blue : H.textSub,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.12s",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 0,
                    }}
                  >
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                    >
                      {svg}
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      letterSpacing: "0.05em",
                      fontWeight: active ? 700 : 400,
                      lineHeight: 1.2,
                      textAlign: "center",
                      height: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {v}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* SCAN MODE */}
        <div
          style={{
            padding: "16px",
            borderBottom: `1px solid ${H.border}`,
          }}
        >
          <HSectionLabel>SCAN MODE</HSectionLabel>
          <div style={{ display: "flex", gap: 10 }}>
            {(["Lining", "Random"] as const).map((m) => (
              <HModeBtn
                key={m}
                label={m}
                icon={scanIcons[m]}
                active={s.frxScanMode === m}
                onClick={() => upd({ frxScanMode: m })}
                color={H.blue}
              />
            ))}
          </div>
        </div>
        {/* WIDTH / LENGTH */}
        <div
          style={{
            padding: "14px 16px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
          {(
            [
              ["frxWidth", "WIDTH", "mm", 5, 40, 1],
              ["frxLength", "LENGTH", "mm", 5, 40, 1],
            ] as const
          ).map(([key, lbl, unit, mn, mx, st]) => (
            <div
              key={key}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: H.textSub,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                {lbl}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: 132,
                  gap: 0,
                }}
              >
                <button
                  disabled={sizeLocked || locked}
                  onClick={() =>
                    upd({
                      [key]: adjVal(
                        s[key] as number,
                        st,
                        mn,
                        mx,
                        st,
                      ),
                    })
                  }
                  style={{
                    width: "100%",
                    height: 46,
                    borderRadius: "10px 10px 0 0",
                    border: "none",
                    borderBottom: `1px solid ${H.border}`,
                    background: sizeLocked || locked
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.04)",
                    color: sizeLocked || locked ? H.textDim : "#7a9bbf",
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1,
                    padding: 0,
                    cursor: sizeLocked || locked ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
                <div
                  style={{
                    width: "100%",
                    minHeight: 62,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 2,
                    textAlign: "center",
                    background: "rgba(0,0,0,0.3)",
                    padding: "14px 0",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 32,
                      fontWeight: 500,
                      color: H.text,
                      lineHeight: 1,
                    }}
                  >
                    {s[key] as number}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: H.textSub,
                      lineHeight: 1,
                    }}
                  >
                    {unit}
                  </span>
                </div>
                <button
                  disabled={sizeLocked || locked}
                  onClick={() =>
                    upd({
                      [key]: adjVal(
                        s[key] as number,
                        -st,
                        mn,
                        mx,
                        st,
                      ),
                    })
                  }
                  style={{
                    width: "100%",
                    height: 46,
                    borderRadius: "0 0 10px 10px",
                    border: "none",
                    borderTop: `1px solid ${H.border}`,
                    background: sizeLocked || locked
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.04)",
                    color: sizeLocked || locked ? H.textDim : "#7a9bbf",
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1,
                    padding: 0,
                    cursor: sizeLocked || locked ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>
              </div>
            </div>
          ))}
          </div>
          <button
            onClick={() => setSizeLocked((value) => !value)}
            aria-pressed={sizeLocked}
            style={{
              width: 129,
              height: 38,
              borderRadius: 9,
              border: `1px solid ${sizeLocked ? H.blue : H.border}`,
              background: sizeLocked ? H.blueDim : "rgba(255,255,255,0.03)",
              color: sizeLocked ? H.blue : H.textSub,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              alignSelf: "flex-end",
              marginTop: 11,
              marginRight: 36,
              transition: "all 0.14s",
            }}
          >
            <span>LOCK</span>
            <span
              style={{
                minWidth: 32,
                color: sizeLocked ? H.blue : H.textDim,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {sizeLocked ? "ON" : "OFF"}
            </span>
          </button>
        </div>
      </div>
      {/* RIGHT: parameters */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HParamsHeader />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "18px 22px 20px",
            gap: 18,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {(Object.keys(frxParams) as Array<keyof typeof frxParams>).map((key) => {
              const active = selectedParamKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveParam(key)}
                  style={{
                    height: 46,
                    borderRadius: 10,
                    border: `1px solid ${active ? H.blue : H.border}`,
                    background: active ? H.blueDim : "rgba(255,255,255,0.03)",
                    color: active ? H.blue : H.textSub,
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.14s",
                  }}
                >
                  {frxParams[key].label}
                </button>
              );
            })}
          </div>
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: `1px solid ${H.border}`,
              background: "rgba(0,0,0,0.12)",
            }}
          >
            <HParamCol
              label={selectedParam.label}
              value={selectedParam.value}
              unit={selectedParam.unit}
              locked={locked}
              onDec={selectedParam.onDec}
              onInc={selectedParam.onInc}
              emphasized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Overlay modal shell ───────────────────────────────────────────────────────
export function HModal({
  title,
  badge,
  onClose,
  children,
}: {
  title: string;
  badge?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5,10,20,0.75)",
        backdropFilter: "blur(6px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18 }}
        style={{
          width: 500,
          maxHeight: 480,
          borderRadius: 20,
          background: "#0f1928",
          border: `1px solid ${H.borderB}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "18px 22px",
            borderBottom: `1px solid ${H.border}`,
            flexShrink: 0,
          }}
        >
          {badge && (
            <span
              style={{
                fontSize: 14,
                padding: "2px 8px",
                borderRadius: 5,
                background: H.blueDim,
                border: `1px solid ${H.blue}40`,
                color: H.blue,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {badge}
            </span>
          )}
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: H.text,
              letterSpacing: "0.04em",
              flex: 1,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1px solid ${H.border}`,
              background: "rgba(255,255,255,0.05)",
              color: H.textSub,
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 22px",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  [DGUS POPUP 10]  MEMO — 메모 관리 팝업                                        │
// │  Page ID : 0x10  (팝업 레이어, 배경 dim 위에 오버레이)                            │
// │  States  : 1 BMP (팝업 배경) + 닫기 버튼 2-state                               │
// │  Export  : Popup_10_Memo.bmp                                                 │
// └─────────────────────────────────────────────────────────────────────────────┘
export function HMemoModal({ onClose }: { onClose: () => void }) {
  const [memos, setMemos] = useState([
    {
      id: 1,
      date: "2026.07.13  14:22",
      text: "환자 민감성 높음. 저출력 권장.",
    },
    {
      id: 2,
      date: "2026.07.11  10:05",
      text: "세션 2 완료. 경미한 홍반 관찰.",
    },
    {
      id: 3,
      date: "2026.07.08  09:40",
      text: "Protocol A 적용. 이상 없음.",
    },
  ]);
  const [draft, setDraft] = useState("");
  return (
    <HModal title="메모 관리" badge="MEMO" onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {memos.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${H.border}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  color: H.textSub,
                  marginBottom: 4,
                  letterSpacing: "0.06em",
                }}
              >
                {m.date}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: H.text,
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            </div>
            <button
              onClick={() =>
                setMemos((p) => p.filter((x) => x.id !== m.id))
              }
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: `1px solid ${H.border}`,
                background: "none",
                color: H.textSub,
                fontSize: 14,
                cursor: "pointer",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="새 메모 입력…"
          style={{
            flex: 1,
            height: 38,
            borderRadius: 9,
            border: `1px solid ${H.border}`,
            background: "rgba(255,255,255,0.04)",
            color: H.text,
            fontSize: 14,
            padding: "0 12px",
            outline: "none",
            fontFamily: "'Noto Sans KR',sans-serif",
          }}
        />
        <button
          onClick={() => {
            if (draft.trim()) {
              setMemos((p) => [
                {
                  id: Date.now(),
                  date: new Date().toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  text: draft.trim(),
                },
                ...p,
              ]);
              setDraft("");
            }
          }}
          style={{
            height: 38,
            padding: "0 16px",
            borderRadius: 9,
            border: "none",
            background: H.blue,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          추가
        </button>
      </div>
    </HModal>
  );
}

// ── CALL overlay — preset select & apply ──────────────────────────────────────
export const HPRESETS = [
  {
    id: 1,
    name: "Protocol A",
    desc: "저출력 / 단기 치료",
    power: 20,
    duration: 0.3,
    interval: 6,
    frxPower: 15,
    frxDuration: 0.3,
  },
  {
    id: 2,
    name: "Protocol B",
    desc: "표준 치료",
    power: 30,
    duration: 0.7,
    interval: 9,
    frxPower: 20,
    frxDuration: 0.5,
  },
  {
    id: 3,
    name: "Protocol C",
    desc: "고출력 / 심층 치료",
    power: 45,
    duration: 1.0,
    interval: 12,
    frxPower: 35,
    frxDuration: 0.8,
  },
  {
    id: 4,
    name: "Light Tx",
    desc: "민감성 피부 적합",
    power: 15,
    duration: 0.2,
    interval: 5,
    frxPower: 10,
    frxDuration: 0.2,
  },
  {
    id: 5,
    name: "Deep Resurfacing",
    desc: "흉터 / 깊은 병변",
    power: 50,
    duration: 1.2,
    interval: 15,
    frxPower: 40,
    frxDuration: 1.0,
  },
];
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  [DGUS POPUP 11]  CALL — 프리셋 선택 팝업                                       │
// │  Page ID : 0x11                                                              │
// │  States  : 1 BMP + 리스트 아이템 2-state(선택/비선택) + 적용 버튼 2-state         │
// │  Export  : Popup_11_Call.bmp                                                 │
// └─────────────────────────────────────────────────────────────────────────────┘
export function HCallModal({
  s,
  upd,
  onClose,
}: {
  s: HMIState2;
  upd: (p: Partial<HMIState2>) => void;
  onClose: () => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const isCOS = s.screen === "cos";
  return (
    <HModal title="프리셋 선택" badge="CALL" onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 16,
        }}
      >
        {HPRESETS.map((p) => {
          const isS = sel === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSel(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 58,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${isS ? H.blue : H.border}`,
                background: isS
                  ? H.blueDim
                  : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.12s",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: isS
                    ? "rgba(30,126,245,0.25)"
                    : "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isS ? H.blue : H.textSub,
                  }}
                >
                  {p.id}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isS ? H.text : "#8ab0d8",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: H.textSub,
                    marginTop: 2,
                  }}
                >
                  {p.desc}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono',monospace",
                  color: H.textSub,
                  textAlign: "right",
                  lineHeight: 1.8,
                }}
              >
                <div>{isCOS ? p.power : p.frxPower} W</div>
                <div>
                  {isCOS ? p.duration : p.frxDuration} ms
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => {
          if (!sel) return;
          const p = HPRESETS.find((x) => x.id === sel)!;
          if (isCOS)
            upd({
              co2Power: p.power,
              co2Duration: p.duration,
              co2Interval: p.interval,
            });
          else
            upd({
              frxPower: p.frxPower,
              frxDuration: p.frxDuration,
            });
          onClose();
        }}
        disabled={!sel}
        style={{
          width: "100%",
          height: 42,
          borderRadius: 11,
          border: "none",
          background: sel ? H.blue : "rgba(255,255,255,0.06)",
          color: sel ? "#fff" : H.textSub,
          fontSize: 14,
          fontWeight: 600,
          cursor: sel ? "pointer" : "default",
          transition: "all 0.14s",
        }}
      >
        프리셋 적용
      </button>
    </HModal>
  );
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  [DGUS POPUP 12]  SAVE — 설정 저장 팝업                                        │
// │  Page ID : 0x12                                                              │
// │  States  : 1 BMP + 저장 버튼 2-state + 완료 상태 1 BMP                          │
// │  Export  : Popup_12_Save.bmp  /  Popup_12_Save_Done.bmp                      │
// └─────────────────────────────────────────────────────────────────────────────┘
export function HSaveModal({
  s,
  onClose,
}: {
  s: HMIState2;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const isCOS = s.screen === "cos";
  const params = isCOS
    ? [
        ["Power", `${s.co2Power} W`],
        ["Duration", `${s.co2Duration.toFixed(1)} ms`],
        ["Interval", `${s.co2Interval} ms`],
      ]
    : [
        ["Power", `${s.frxPower} W`],
        ["Duration", `${s.frxDuration.toFixed(1)} ms`],
        ["Degree", `${s.frxDegree}`],
        ["Density", `${s.frxDensity.toFixed(1)} mm`],
      ];
  return (
    <HModal
      title="현재 설정 저장"
      badge="SAVE"
      onClose={onClose}
    >
      {saved ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "24px 0",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              background: "rgba(34,197,94,0.15)",
              border: `1px solid rgba(34,197,94,0.4)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke={H.green}
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: H.text,
                marginBottom: 4,
              }}
            >
              저장 완료
            </div>
            <div style={{ fontSize: 14, color: H.textSub }}>
              "{name}" 프리셋으로 저장되었습니다.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              height: 38,
              padding: "0 24px",
              borderRadius: 10,
              border: `1px solid ${H.border}`,
              background: "rgba(255,255,255,0.05)",
              color: H.textSub,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            닫기
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 14,
                color: H.textSub,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              프리셋 이름
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 나의 프로토콜 A"
              style={{
                width: "100%",
                height: 40,
                borderRadius: 9,
                border: `1px solid ${H.border}`,
                background: "rgba(255,255,255,0.04)",
                color: H.text,
                fontSize: 14,
                padding: "0 14px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'Noto Sans KR',sans-serif",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 14,
                color: H.textSub,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              저장될 파라미터
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {params.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${H.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      color: H.textSub,
                      marginBottom: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontFamily: "'JetBrains Mono',monospace",
                      color: H.text,
                      fontWeight: 500,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              if (name.trim()) setSaved(true);
            }}
            disabled={!name.trim()}
            style={{
              width: "100%",
              height: 42,
              borderRadius: 11,
              border: "none",
              background: name.trim()
                ? H.blue
                : "rgba(255,255,255,0.06)",
              color: name.trim() ? "#fff" : H.textSub,
              fontSize: 14,
              fontWeight: 600,
              cursor: name.trim() ? "pointer" : "default",
              transition: "all 0.14s",
            }}
          >
            저장
          </button>
        </>
      )}
    </HModal>
  );
}

// ── HMI Root ──────────────────────────────────────────────────────────────────
export function HMIRoot2({ onStateChange }: { onStateChange?: (s: HMIState2) => void } = {}) {
  const [s, setS] = useState<HMIState2>(HMI2_DEFAULT);
  const upd = (patch: Partial<HMIState2>) =>
    setS((prev) => {
      const next = { ...prev, ...patch };
      onStateChange?.(next);
      return next;
    });
  const [overlay, setOverlay] = useState<
    null | "memo" | "call" | "save" | "camera"
  >(null);
  const toggleLaser = () => {
    const nx: { [k in LaserState2]: LaserState2 } = {
      standby: "ready",
      ready: "lasering",
      lasering: "paused",
      paused: "lasering",
    };
    upd({ laserState: nx[s.laserState] });
  };
  const isTreatment = s.screen === "cos" || s.screen === "frx";
  return (
    // ── [DGUS FRAME: ROOT] 1024×768 캔버스 ──────────────────────────────────────
    // DWIN DGUS II  ·  해상도: 1024×768  ·  컬러: 16-bit RGB565
    // BMP Export 시 이 div 기준으로 각 Screen을 캡처합니다
    <div
      style={{
        width: LAYOUT.canvasW,
        height: LAYOUT.canvasH,
        display: "flex",
        flexDirection: "column",
        background: H.bg,
        position: "relative",
        fontFamily:
          "'Inter','Noto Sans KR',system-ui,sans-serif",
      }}
    >
      {isTreatment && (
        <HTopBar
          mode={
            s.screen === "home"
              ? null
              : (s.screen as "cos" | "frx")
          }
          onBack={
            s.screen !== "home"
              ? () => {
                  upd({
                    screen: "home",
                    laserState: "standby",
                  });
                  setOverlay(null);
                }
              : undefined
          }
          soundOn={s.soundOn}
          aimingLevel={s.aimingLevel}
          onMenu={isTreatment ? setOverlay : undefined}
          activeMenu={overlay === "memo" || overlay === "call" || overlay === "save" ? overlay : null}
          cameraActive={overlay === "camera"}
          onCamera={() => setOverlay("camera")}
          onSound={() => upd({ soundOn: !s.soundOn })}
          onAiming={(l) => upd({ aimingLevel: l })}
        />
      )}
      {/* content area clips overflow for screen transitions */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          minHeight: 0,
        }}
      >
        <AnimatePresence mode="wait">
          {s.screen === "splash" && (
            <motion.div
              key="splash"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HMI2Splash
                onDone={() => upd({ screen: "home" })}
              />
            </motion.div>
          )}
          {s.screen === "home" && (
            <motion.div
              key="home"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <HMI2Home
                onCOS={() =>
                  upd({ screen: "cos", laserState: "standby" })
                }
                onFRX={() =>
                  upd({ screen: "frx", laserState: "standby" })
                }
              />
            </motion.div>
          )}
          {s.screen === "cos" && (
            <motion.div
              key="cos"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.2 }}
            >
              <HMI2COS s={s} upd={upd} onMenu={setOverlay} />
            </motion.div>
          )}
          {s.screen === "frx" && (
            <motion.div
              key="frx"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.2 }}
            >
              <HMI2FRX s={s} upd={upd} onMenu={setOverlay} />
            </motion.div>
          )}
        </AnimatePresence>
        {isTreatment && (
          <HLaserBar
            state={s.laserState}
            onPress={toggleLaser}
          />
        )}
        {/* Overlays */}
        <AnimatePresence>
          {overlay === "memo" && (
            <HMemoModal onClose={() => setOverlay(null)} />
          )}
          {overlay === "call" && (
            <HCallModal
              s={s}
              upd={upd}
              onClose={() => setOverlay(null)}
            />
          )}
          {overlay === "save" && (
            <HSaveModal
              s={s}
              onClose={() => setOverlay(null)}
            />
          )}
          {overlay === "camera" && (
            <HModal
              title="Camera Preview"
              badge="CAMERA"
              onClose={() => setOverlay(null)}
            >
              <div
                style={{
                  height: 300,
                  borderRadius: 14,
                  border: `1px solid ${H.borderB}`,
                  background: "rgba(0,0,0,0.42)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  color: H.textSub,
                }}
              >
                <svg width={42} height={42} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Camera Preview</span>
              </div>
            </HModal>
          )}
        </AnimatePresence>
      </div>
      {/* end content area */}
    </div>
  );
}

// ── (legacy HMI kept below for DOC_SCREENS references, not rendered) ─────────
