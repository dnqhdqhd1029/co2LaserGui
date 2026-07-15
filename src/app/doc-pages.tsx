import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScreensExportPage } from "./screens-export";
import { HMIState2, HMI2_DEFAULT } from "./hmi2";
import {
  C,
  MODE_META,
  ILaser,
  IPatient,
  ISettings,
  IHistory,
  IStar,
  IWifi,
  ICheck,
  IPlay,
  IPause,
  IStop,
  IShield,
  IAlert,
  ISound,
  IBeam,
} from "./hmi-legacy";
import type { TreatmentMode, LaserState } from "./hmi-legacy";

export type SectionId =
  | "proto"
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10";

export const SECTIONS: {
  id: SectionId;
  num?: string;
  label: string;
  labelKr?: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "proto",
    label: "Live Prototype",
    icon: (
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
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    id: "01",
    num: "01",
    label: "Cover",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "02",
    num: "02",
    label: "Project Info",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "03",
    num: "03",
    label: "Design System",
    labelKr: "디자인 시스템",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: "04",
    num: "04",
    label: "Components",
    labelKr: "컴포넌트",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "05",
    num: "05",
    label: "Icons",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "06",
    num: "06",
    label: "User Flow",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="6" height="5" rx="1" />
        <rect x="16" y="3" width="6" height="5" rx="1" />
        <rect x="9" y="15" width="6" height="5" rx="1" />
        <path d="M5 8v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
        <line x1="12" y1="12" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    id: "07",
    num: "07",
    label: "Screens",
    labelKr: "화면",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "08",
    num: "08",
    label: "Assets",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    id: "09",
    num: "09",
    label: "Developer Guide",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "10",
    num: "10",
    label: "Revision History",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.5L1 10" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION CONTENT PAGES  (01–10)
// ═══════════════════════════════════════════════════════════════════════════════

const DT = {
  bg: "#f5f7fa",
  card: "#ffffff",
  border: "#dde4ef",
  borderL: "#eef2f8",
  text: "#0d1a2e",
  textSub: "#243850",
  textMuted: "#4a6080",
  textFaint: "#8a9db8",
  accent: "#0d2e5a",
  blue: "#1d5fcc",
  blueLight: "rgba(29,95,204,0.08)",
};

function SCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${DT.border}`,
        background: DT.card,
        padding: "20px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: DT.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}
function SectionH({
  n,
  t,
  sub,
}: {
  n: string;
  t: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: DT.accent,
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
            color: "#fff",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {n}
        </span>
      </div>
      <div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: DT.text,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {t}
        </h2>
        {sub && (
          <div
            style={{
              fontSize: 12,
              color: DT.textMuted,
              marginTop: 2,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
function KVRow({
  k,
  v,
  mono,
}: {
  k: string;
  v: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 0",
        borderBottom: `1px solid ${DT.borderL}`,
      }}
    >
      <span style={{ fontSize: 12, color: DT.textMuted }}>
        {k}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: DT.textSub,
          fontFamily: mono
            ? "'JetBrains Mono',monospace"
            : undefined,
        }}
      >
        {v}
      </span>
    </div>
  );
}

// 01 Cover
export function CoverPage() {
  return (
    <div
      style={{
        height: "100%",
        background: `linear-gradient(150deg,#060d1a 0%,#0a1828 50%,#0d2240 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {[500, 380, 280, 180].map((s, i) => (
        <div
          key={s}
          style={{
            position: "absolute",
            width: s,
            height: s,
            borderRadius: "50%",
            border: `1px solid rgba(29,95,204,${0.04 + i * 0.025})`,
          }}
        />
      ))}
      <div
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 28,
            background: "rgba(29,95,204,0.18)",
            border: "1px solid rgba(29,95,204,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            boxShadow: "0 0 60px rgba(29,95,204,0.2)",
          }}
        >
          <ILaser size={40} color="#4d8fff" strokeWidth={1.4} />
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#2a4060",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          HMI Design Specification
        </div>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#d8e6f5",
            letterSpacing: "0.05em",
            margin: "0 0 10px",
            lineHeight: 1,
          }}
        >
          FRACTIO CO₂
        </h1>
        <div
          style={{
            fontSize: 16,
            color: "#3a5c7a",
            marginBottom: 40,
            letterSpacing: "0.05em",
          }}
        >
          CO₂ Fractional Laser · 1024 × 768 · Embedded HMI
        </div>
        <div
          style={{
            display: "flex",
            gap: 0,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {[
            ["Product", "Fractio CO₂ Pro"],
            ["Display", "10″ Touch LCD"],
            ["Resolution", "1024 × 768"],
            ["Platform", "Linux / ARM"],
            ["Version", "v3.2.1"],
            ["Date", "2026-07-13"],
          ].map(([k, v], i) => (
            <div
              key={k}
              style={{
                padding: "16px 24px",
                borderLeft:
                  i > 0
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#2a4060",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 13,
                  color: "#6a9abf",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          display: "flex",
          gap: 24,
          fontSize: 10,
          color: "#1a3050",
          letterSpacing: "0.1em",
        }}
      >
        <span>IEC 60825-1 Class IV</span>
        <span style={{ color: "#0f2035" }}>·</span>
        <span>CE FDA ISO 13485</span>
        <span style={{ color: "#0f2035" }}>·</span>
        <span>© 2026 Fractio Medical Inc.</span>
      </div>
    </div>
  );
}

// 02 Project Info
export function ProjectInfoPage() {
  return (
    <div
      style={{
        padding: "32px 36px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="02"
        t="Project Information"
        sub="Product overview, design goals, and document metadata"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <SCard>
          <SLabel>Hardware</SLabel>
          {[
            ["Product", "Fractio CO₂ Pro"],
            ["Category", "CO₂ Fractional Laser"],
            ["Target Market", "Dermatology Clinic"],
            ["Operator", "Doctor / Nurse"],
            ["Display", "10-inch Touch LCD"],
            ["Resolution", "1024 × 768 px"],
            ["Platform", "Embedded Linux / ARM"],
            ["Touch", "Capacitive Multi-touch"],
          ].map(([k, v]) => (
            <KVRow key={k} k={k} v={v} mono />
          ))}
        </SCard>
        <SCard>
          <SLabel>Document</SLabel>
          {[
            ["Version", "v3.2.1"],
            ["Status", "Draft for Review"],
            ["Author", "UX / HMI Design Team"],
            ["Date", "2026-07-13"],
            ["Screens", "12 unique screens"],
            ["Components", "15 component types"],
            ["Icons", "18 custom SVG icons"],
            ["Font", "Inter + Noto Sans KR"],
          ].map(([k, v]) => (
            <KVRow key={k} k={k} v={v} mono />
          ))}
        </SCard>
      </div>
      <SCard>
        <SLabel>Design Goals</SLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {[
            [
              "Glove-Friendly",
              "Min 44px touch targets. Large ±  controls. Operates with nitrile gloves.",
              "#1d5fcc",
            ],
            [
              "Safety First",
              "E-STOP always visible. Laser state color-coded. No accidental fire.",
              "#ef4444",
            ],
            [
              "Clinical Readability",
              "High contrast dark theme. JetBrains Mono for numerics. 100 lux clinic.",
              "#22c55e",
            ],
            [
              "Premium HMI",
              "Medical-grade dark UI. Industrial. Apple-level layout discipline.",
              "#a78bfa",
            ],
            [
              "Workflow Preserved",
              "Existing clinical workflow kept. Visual redesign only. No logic changes.",
              "#f59e0b",
            ],
            [
              "Developer Ready",
              "Complete handoff: screen IDs, GPIO, state machine, asset manifest.",
              "#00cae4",
            ],
          ].map(([t, d, c]) => (
            <div
              key={t as string}
              style={{
                padding: "16px",
                borderRadius: 12,
                background: `${c}0a`,
                border: `1px solid ${c}25`,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: c as string,
                  marginBottom: 8,
                }}
              >
                {t}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: DT.textMuted,
                  lineHeight: 1.65,
                }}
              >
                {d}
              </div>
            </div>
          ))}
        </div>
      </SCard>
    </div>
  );
}

// 03 Design System — tabbed
export function DesignSystemPage() {
  const [tab, setTab] = useState<
    | "colors"
    | "typography"
    | "spacing"
    | "grid"
    | "radius"
    | "shadow"
    | "variables"
    | "elevation"
  >("colors");
  const TABS = [
    "colors",
    "typography",
    "spacing",
    "grid",
    "radius",
    "shadow",
    "variables",
    "elevation",
  ] as const;
  const TAB_LABELS: { [k: string]: string } = {
    colors: "Colors",
    typography: "Typography",
    spacing: "Spacing",
    grid: "Grid",
    radius: "Radius",
    shadow: "Shadow",
    variables: "Variables",
    elevation: "Elevation",
  };
  const colors = [
    {
      name: "Background",
      token: "C.bg",
      hex: "#0c1220",
      use: "Page ground",
    },
    {
      name: "Surface",
      token: "C.surface",
      hex: "#131b2e",
      use: "Card base",
    },
    {
      name: "Card",
      token: "C.card",
      hex: "#18243c",
      use: "Elevated card",
    },
    {
      name: "Blue",
      token: "C.blue",
      hex: "#2e82ff",
      use: "Primary / Ready",
    },
    {
      name: "Cyan",
      token: "C.cyan",
      hex: "#00cae4",
      use: "Accent / CW mode",
    },
    {
      name: "Green",
      token: "C.green",
      hex: "#22c55e",
      use: "Success / System OK",
    },
    {
      name: "Amber",
      token: "C.amber",
      hex: "#f59e0b",
      use: "Warning / Paused",
    },
    {
      name: "Red",
      token: "C.red",
      hex: "#ef4444",
      use: "Critical / Laser ON",
    },
    {
      name: "Text",
      token: "C.text",
      hex: "#dfe8f5",
      use: "Primary text",
    },
    {
      name: "Text Sub",
      token: "C.textSub",
      hex: "#7a9bbf",
      use: "Secondary text",
    },
    {
      name: "Text Muted",
      token: "C.textMuted",
      hex: "#3f5570",
      use: "Labels / captions",
    },
    {
      name: "Border",
      token: "C.border",
      hex: "rgba(255,255,255,0.06)",
      use: "Hairline dividers",
    },
  ];
  const typeScale = [
    {
      name: "Parameter Value",
      size: "30px",
      weight: "600",
      font: "JetBrains Mono",
      use: "Treatment param numbers",
    },
    {
      name: "Display / Mode",
      size: "26px",
      weight: "700",
      font: "Inter",
      use: "Mode name, splash title",
    },
    {
      name: "Section Title",
      size: "20px",
      weight: "700",
      font: "Inter",
      use: "Screen titles",
    },
    {
      name: "Laser Button",
      size: "19px",
      weight: "700",
      font: "Inter",
      use: "Laser state label",
    },
    {
      name: "Card Title",
      size: "13px",
      weight: "600",
      font: "Inter",
      use: "Card headers",
    },
    {
      name: "Body",
      size: "12px",
      weight: "400",
      font: "Inter",
      use: "Descriptions",
    },
    {
      name: "Label",
      size: "11px",
      weight: "500",
      font: "Noto Sans KR",
      use: "Korean labels",
    },
    {
      name: "Caption",
      size: "10px",
      weight: "400",
      font: "Inter",
      use: "System status, timestamps",
    },
    {
      name: "Micro",
      size: "9px",
      weight: "400",
      font: "Inter",
      use: "Section dividers, hints",
    },
  ];
  const spacings = [
    4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96,
  ];
  const radii = [
    { r: "6px", n: "XS", use: "Tags" },
    { r: "8px", n: "SM", use: "Buttons" },
    { r: "10px", n: "MD", use: "Param row" },
    { r: "12px", n: "LG", use: "Cards" },
    { r: "14px", n: "XL", use: "Panels" },
    { r: "16px", n: "2XL", use: "Large cards" },
    { r: "20px", n: "3XL", use: "Modals" },
    { r: "50%", n: "Full", use: "Status dots" },
  ];
  const shadows = [
    {
      n: "Inset",
      css: "inset 0 1px 2px rgba(0,0,0,0.2)",
      use: "Pressed states",
    },
    {
      n: "XS",
      css: "0 1px 3px rgba(0,0,0,0.2)",
      use: "Tag elevation",
    },
    {
      n: "SM",
      css: "0 2px 8px rgba(0,0,0,0.3)",
      use: "Card hover",
    },
    {
      n: "MD",
      css: "0 8px 24px rgba(0,0,0,0.4)",
      use: "Floating panels",
    },
    {
      n: "LG",
      css: "0 16px 48px rgba(0,0,0,0.5)",
      use: "Dialogs",
    },
    {
      n: "Glow-Red",
      css: "0 0 40px rgba(239,68,68,0.38)",
      use: "Laser ON state",
    },
    {
      n: "Glow-Blue",
      css: "0 0 32px rgba(46,130,255,0.3)",
      use: "Ready state",
    },
    {
      n: "Keypad",
      css: "0 32px 80px rgba(0,0,0,0.7)",
      use: "Numeric keypad",
    },
  ];
  const variables = [
    { name: "--hmi-width", value: "1024px", type: "Layout" },
    { name: "--hmi-height", value: "600px", type: "Layout" },
    { name: "--status-bar-h", value: "44px", type: "Layout" },
    { name: "--laser-btn-h", value: "96px", type: "Component" },
    { name: "--param-row-h", value: "52px", type: "Component" },
    {
      name: "--touch-min",
      value: "44px",
      type: "Accessibility",
    },
    { name: "--timer-tick", value: "1000ms", type: "Timing" },
    { name: "--finish-shots", value: "500", type: "Business" },
    { name: "--alarm-temp", value: "40.0°C", type: "Safety" },
    {
      name: "--lockout-max",
      value: "5 attempts",
      type: "Security",
    },
  ];
  const elevations = [
    {
      bg: "#0c1220",
      b: "none",
      s: "none",
      lbl: "0 – Ground",
      use: "Page bg",
    },
    {
      bg: "#131b2e",
      b: "rgba(255,255,255,0.06)",
      s: "none",
      lbl: "1 – Surface",
      use: "Card base",
    },
    {
      bg: "#18243c",
      b: "rgba(255,255,255,0.08)",
      s: "0 2px 8px rgba(0,0,0,0.3)",
      lbl: "2 – Raised",
      use: "Buttons, rows",
    },
    {
      bg: "#1e2d48",
      b: "rgba(255,255,255,0.10)",
      s: "0 8px 24px rgba(0,0,0,0.4)",
      lbl: "3 – Overlay",
      use: "Status cards",
    },
    {
      bg: "#18243c",
      b: "rgba(255,255,255,0.12)",
      s: "0 32px 80px rgba(0,0,0,0.7)",
      lbl: "4 – Modal",
      use: "Keypad, dialogs",
    },
  ];
  return (
    <div
      style={{
        padding: "28px 32px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="03"
        t="Design System"
        sub="Colors · Typography · Spacing · Grid · Radius · Shadow · Variables · Elevation"
      />
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: `1px solid ${tab === t ? DT.blue : DT.border}`,
              background:
                tab === t ? DT.blueLight : "transparent",
              color: tab === t ? DT.blue : DT.textMuted,
              fontSize: 12,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.12s",
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
      {tab === "colors" && (
        <SCard>
          <SLabel>Color Tokens · HMI Dark Theme</SLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
            }}
          >
            {colors.map(({ name, token, hex, use }) => (
              <div
                key={name}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${DT.border}`,
                  overflow: "hidden",
                }}
              >
                <div style={{ height: 52, background: hex }} />
                <div style={{ padding: "10px 12px" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: DT.text,
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10,
                      color: DT.blue,
                      marginTop: 3,
                    }}
                  >
                    {token}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 9,
                      color: DT.textFaint,
                    }}
                  >
                    {hex}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: DT.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {use}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SCard>
      )}
      {tab === "typography" && (
        <SCard>
          <SLabel>
            Typography Scale · Inter + JetBrains Mono
          </SLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {typeScale.map(
              ({ name, size, weight, font, use }) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "10px 14px",
                    borderRadius: 9,
                    background: DT.bg,
                    border: `1px solid ${DT.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 200,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        fontSize: size,
                        fontWeight: weight,
                        fontFamily:
                          font === "JetBrains Mono"
                            ? "'JetBrains Mono',monospace"
                            : "'Inter','Noto Sans KR',sans-serif",
                        color: DT.text,
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 11,
                        color: DT.blue,
                        minWidth: 36,
                      }}
                    >
                      {size}
                    </span>
                    <span
                      style={{
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 11,
                        color: DT.textMuted,
                        minWidth: 28,
                      }}
                    >
                      {weight}
                    </span>
                    <span
                      style={{
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 11,
                        color: DT.textMuted,
                      }}
                    >
                      {font}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: DT.textFaint,
                        marginLeft: "auto",
                      }}
                    >
                      {use}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </SCard>
      )}
      {tab === "spacing" && (
        <SCard>
          <SLabel>Spacing Scale · 4px base grid</SLabel>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {spacings.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: Math.min(s * 1.2, 80),
                    height: Math.max(8, s * 0.5),
                    background: `rgba(29,95,204,${0.12 + s / 300})`,
                    border: `1px solid rgba(29,95,204,0.3)`,
                    borderRadius: 3,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 10,
                    color: DT.textMuted,
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              background: DT.blueLight,
              border: `1px solid rgba(29,95,204,0.2)`,
              fontSize: 12,
              color: DT.textMuted,
            }}
          >
            4px base unit · Main tokens: 8, 12, 16, 20, 24, 32px
            · Card padding: 20–24px · Layout gutters: 24–36px
          </div>
        </SCard>
      )}
      {tab === "grid" && (
        <SCard>
          <SLabel>HMI Grid System · 1024 × 768</SLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              {
                l: "Display Size",
                v: "1024 × 768 px  ·  1024 × 768 landscape",
              },
              {
                l: "Status Bar",
                v: "Height 44px  ·  Full width  ·  fixed top",
              },
              {
                l: "Main Area",
                v: "1024 × 556px  ·  below status bar",
              },
              {
                l: "Left Panel",
                v: "Width 200px  ·  Mode tabs + pattern",
              },
              {
                l: "Center Panel",
                v: "Flex 1  ·  2-column param grid",
              },
              {
                l: "Right Panel",
                v: "Width 186px  ·  Controls + vitals",
              },
              {
                l: "Bottom Bar",
                v: "Height 96px  ·  Laser button row",
              },
              {
                l: "Touch Targets",
                v: "Min 44px  ·  Param ± 48px  ·  Laser 96px",
              },
            ].map(({ l, v }) => (
              <div
                key={l}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: DT.bg,
                  border: `1px solid ${DT.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: DT.textSub,
                    marginBottom: 4,
                  }}
                >
                  {l}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: DT.textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              borderRadius: 10,
              border: `1px solid ${DT.border}`,
              background: "#0c1220",
              padding: "20px",
              display: "flex",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 80,
                height: 56,
                borderRadius: 6,
                background: "rgba(46,130,255,0.15)",
                border: "1px dashed rgba(46,130,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 9, color: "#2e82ff" }}>
                200
              </span>
            </div>
            <div
              style={{
                flex: 1,
                height: 56,
                borderRadius: 6,
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 9, color: "#3f5570" }}>
                flex center
              </span>
            </div>
            <div
              style={{
                width: 74,
                height: 56,
                borderRadius: 6,
                background: "rgba(46,130,255,0.15)",
                border: "1px dashed rgba(46,130,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 9, color: "#2e82ff" }}>
                186
              </span>
            </div>
          </div>
        </SCard>
      )}
      {tab === "radius" && (
        <SCard>
          <SLabel>Border Radius Tokens</SLabel>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {radii.map(({ r, n, use }) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: r,
                    background: DT.blueLight,
                    border: `2px solid rgba(29,95,204,0.4)`,
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: DT.blue,
                    }}
                  >
                    {r}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: DT.textFaint,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: DT.textMuted,
                    }}
                  >
                    {use}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SCard>
      )}
      {tab === "shadow" && (
        <SCard>
          <SLabel>Shadow Tokens</SLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {shadows.map(({ n, css, use }) => (
              <div
                key={n}
                style={{
                  padding: "14px",
                  borderRadius: 10,
                  background: DT.bg,
                  border: `1px solid ${DT.border}`,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 32,
                    borderRadius: 8,
                    background: "#fff",
                    boxShadow: css,
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: DT.textSub,
                    marginBottom: 4,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 9,
                    color: DT.textFaint,
                    marginBottom: 4,
                    lineHeight: 1.4,
                    wordBreak: "break-all",
                  }}
                >
                  {css}
                </div>
                <div
                  style={{ fontSize: 11, color: DT.textMuted }}
                >
                  {use}
                </div>
              </div>
            ))}
          </div>
        </SCard>
      )}
      {tab === "variables" && (
        <SCard>
          <SLabel>Design Variables</SLabel>
          <div
            style={{
              borderRadius: 8,
              border: `1px solid ${DT.border}`,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f0f4fb" }}>
                  {["Variable", "Value", "Type"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 14px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        color: DT.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        borderBottom: `1px solid ${DT.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {variables.map(({ name, value, type }, i) => (
                  <tr
                    key={name}
                    style={{
                      background: i % 2 ? "#f8fafd" : "#fff",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px 14px",
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 11,
                        color: DT.blue,
                        borderBottom:
                          i < variables.length - 1
                            ? `1px solid ${DT.border}`
                            : "none",
                      }}
                    >
                      {name}
                    </td>
                    <td
                      style={{
                        padding: "8px 14px",
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 11,
                        color: DT.textSub,
                        borderBottom:
                          i < variables.length - 1
                            ? `1px solid ${DT.border}`
                            : "none",
                      }}
                    >
                      {value}
                    </td>
                    <td
                      style={{
                        padding: "8px 14px",
                        fontSize: 11,
                        color: DT.textMuted,
                        borderBottom:
                          i < variables.length - 1
                            ? `1px solid ${DT.border}`
                            : "none",
                      }}
                    >
                      {type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SCard>
      )}
      {tab === "elevation" && (
        <SCard>
          <SLabel>Elevation System · 5 levels</SLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {elevations.map(({ bg, b, s, lbl, use }) => (
              <div
                key={lbl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 10,
                  background: bg,
                  border: `1px solid ${b}`,
                  boxShadow: s,
                }}
              >
                <div
                  style={{
                    width: 90,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {lbl}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {use}
                </div>
              </div>
            ))}
          </div>
        </SCard>
      )}
    </div>
  );
}

// 04 Components
export function ComponentsPage() {
  const [cTab, setCTab] = useState("buttons");
  const CTABS = [
    "top-nav",
    "bottom-status",
    "buttons",
    "cards",
    "param-row",
    "popup",
    "dialog",
    "toast",
    "status-badge",
    "tab",
    "segment",
    "keypad",
    "toggle",
    "slider",
    "navigation",
  ];
  const CNAMES: { [k: string]: string } = {
    "top-nav": "Top Navigation",
    "bottom-status": "Bottom Status",
    buttons: "Buttons",
    cards: "Cards",
    "param-row": "Parameter Row",
    popup: "Popup",
    dialog: "Dialog",
    toast: "Toast",
    "status-badge": "Status Badge",
    tab: "Tab",
    segment: "Segment Control",
    keypad: "Numeric Keypad",
    toggle: "Toggle",
    slider: "Slider",
    navigation: "Navigation",
  };
  const btnStates = [
    {
      l: "Primary",
      bg: "#2e82ff",
      border: "#2e82ff",
      c: "#fff",
    },
    {
      l: "Secondary",
      bg: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      c: "#7a9bbf",
    },
    {
      l: "Danger",
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.35)",
      c: "#ef4444",
    },
    {
      l: "Warning",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.3)",
      c: "#f59e0b",
    },
    {
      l: "Success",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.3)",
      c: "#22c55e",
    },
    {
      l: "Disabled",
      bg: "rgba(255,255,255,0.02)",
      border: "rgba(255,255,255,0.04)",
      c: "#253448",
    },
  ];
  return (
    <div
      style={{
        padding: "28px 32px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="04"
        t="Components"
        sub="15 component types  ·  Component + Variant + Auto Layout + Variables"
      />
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {CTABS.map((t) => (
          <button
            key={t}
            onClick={() => setCTab(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              border: `1px solid ${cTab === t ? DT.blue : DT.border}`,
              background:
                cTab === t ? DT.blueLight : "transparent",
              color: cTab === t ? DT.blue : DT.textMuted,
              fontSize: 11,
              fontWeight: cTab === t ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.1s",
            }}
          >
            {CNAMES[t]}
          </button>
        ))}
      </div>
      {cTab === "top-nav" && (
        <SCard
          style={{
            background: "#0c1220",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>Top Navigation Bar · height 44px</SLabel>
          <div
            style={{
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              background: "rgba(10,16,30,0.92)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  background: "#22c55e",
                  boxShadow: "0 0 7px #22c55e",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#dfe8f5",
                  letterSpacing: "0.1em",
                }}
              >
                FRACTIO CO₂
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: "rgba(46,130,255,0.15)",
                  border: "1px solid rgba(46,130,255,0.35)",
                  color: "#2e82ff",
                  fontWeight: 600,
                }}
              >
                FRX MODE
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#4a6080" }}>
              Dr. Kim · Lee, Ji-Young (42F)
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <IWifi size={13} color="#22c55e" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  color: "#7a9bbf",
                }}
              >
                14:32
              </span>
            </div>
          </div>
        </SCard>
      )}
      {cTab === "bottom-status" && (
        <SCard
          style={{
            background: "#0c1220",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>Bottom Status Bar · height 96px</SLabel>
          <div
            style={{
              height: 96,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 20px",
              background: "rgba(10,16,28,0.8)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 180,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {[
                ["○ System Ready", "#22c55e"],
                ["24.3°C · 0.8 bar", "#3f5570"],
                ["042 / 500 shots", "#3f5570"],
              ].map(([t, c]) => (
                <span
                  key={t}
                  style={{ fontSize: 11, color: c }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              style={{
                flex: 1,
                height: 68,
                borderRadius: 14,
                background: "rgba(255,255,255,0.04)",
                border: "2px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#3f5570",
                  letterSpacing: "0.16em",
                }}
              >
                STANDBY
              </span>
            </div>
          </div>
        </SCard>
      )}
      {cTab === "buttons" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <SCard
            style={{
              background: "#131b2e",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <SLabel>Button Variants · height 44px</SLabel>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {btnStates.map(({ l, bg, border, c }) => (
                <div
                  key={l}
                  style={{
                    height: 44,
                    padding: "0 22px",
                    borderRadius: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: bg,
                    border: `1px solid ${border}`,
                    fontSize: 13,
                    fontWeight: 500,
                    color: c,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <SLabel>
              Laser Button · height 96px · 4 states
            </SLabel>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                {
                  l: "STANDBY",
                  bg: "rgba(255,255,255,0.04)",
                  b: "rgba(255,255,255,0.06)",
                  c: "#3f5570",
                },
                {
                  l: "READY",
                  bg: "rgba(46,130,255,0.15)",
                  b: "rgba(46,130,255,0.35)",
                  c: "#2e82ff",
                },
                {
                  l: "LASER ON",
                  bg: "rgba(239,68,68,0.12)",
                  b: "rgba(239,68,68,0.35)",
                  c: "#ef4444",
                },
                {
                  l: "PAUSED",
                  bg: "rgba(245,158,11,0.12)",
                  b: "rgba(245,158,11,0.3)",
                  c: "#f59e0b",
                },
              ].map(({ l, bg, b, c }) => (
                <div
                  key={l}
                  style={{
                    flex: 1,
                    height: 96,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: bg,
                    border: `2px solid ${b}`,
                    fontSize: 15,
                    fontWeight: 700,
                    color: c,
                    letterSpacing: "0.12em",
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
          </SCard>
        </div>
      )}
      {cTab === "cards" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>Card Variants</SLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
            }}
          >
            {[
              {
                t: "Mode Card – FRX",
                bg: "rgba(46,130,255,0.15)",
                b: "rgba(46,130,255,0.35)",
                c: "#2e82ff",
                val: "FRX",
              },
              {
                t: "System Ready",
                bg: "rgba(34,197,94,0.12)",
                b: "rgba(34,197,94,0.3)",
                c: "#22c55e",
                val: "OK",
              },
              {
                t: "Alarm Warning",
                bg: "rgba(245,158,11,0.12)",
                b: "rgba(245,158,11,0.3)",
                c: "#f59e0b",
                val: "42.5°C",
              },
              {
                t: "Emergency",
                bg: "rgba(239,68,68,0.12)",
                b: "rgba(239,68,68,0.35)",
                c: "#ef4444",
                val: "E-STOP",
              },
              {
                t: "Patient Card",
                bg: "rgba(255,255,255,0.018)",
                b: "rgba(255,255,255,0.06)",
                c: "#7a9bbf",
                val: "Lee Ji-Young",
              },
              {
                t: "Session Card",
                bg: "rgba(255,255,255,0.018)",
                b: "rgba(255,255,255,0.06)",
                c: "#3f5570",
                val: "042 shots",
              },
            ].map(({ t, bg, b, c, val }) => (
              <div
                key={t}
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  background: bg,
                  border: `1px solid ${b}`,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: c,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 8,
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#dfe8f5",
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </SCard>
      )}
      {cTab === "param-row" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>
            Parameter Row · height 52px · Auto Layout
          </SLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
              { l: "Energy", v: "35", u: "mJ", pct: 18 },
              { l: "Frequency", v: "2", u: "Hz", pct: 25 },
              { l: "Density", v: "15", u: "%", pct: 40 },
              { l: "Spot Size", v: "1.0", u: "mm", pct: 30 },
            ].map(({ l, v, u, pct }) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  height: 52,
                  padding: "0 12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ width: 72, flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#3f5570",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 4,
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{
                      height: 2,
                      borderRadius: 1,
                      background: "#1e3050",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "#2e82ff",
                        borderRadius: 1,
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: "#5d7a99",
                  }}
                >
                  −
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 26,
                      fontWeight: 500,
                      color: "#dfe8f5",
                      lineHeight: 1,
                    }}
                  >
                    {v}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "#3f5570" }}
                  >
                    {u}
                  </span>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(46,130,255,0.12)",
                    border: "1px solid rgba(46,130,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: "#2e82ff",
                  }}
                >
                  +
                </div>
              </div>
            ))}
          </div>
        </SCard>
      )}
      {cTab === "status-badge" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>Status Badge Variants</SLabel>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {[
              { l: "Ready", c: "#22c55e" },
              { l: "LASER ON", c: "#ef4444" },
              { l: "Paused", c: "#f59e0b" },
              { l: "Standby", c: "#3f5570" },
              { l: "CW Mode", c: "#00cae4" },
              { l: "Warning", c: "#f59e0b" },
              { l: "Error", c: "#ef4444" },
              { l: "FRX", c: "#2e82ff" },
              { l: "Normal", c: "#22c55e" },
              { l: "Pulse", c: "#a78bfa" },
            ].map(({ l, c }) => (
              <div
                key={l}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  background: `${c}18`,
                  border: `1px solid ${c}40`,
                  fontSize: 11,
                  fontWeight: 600,
                  color: c,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                    background: c,
                  }}
                />
                {l}
              </div>
            ))}
          </div>
        </SCard>
      )}
      {cTab === "tab" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>
            Mode Tab · height 40px · vertical list
          </SLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              width: 200,
            }}
          >
            {[
              { m: "CO₂", c: "#00cae4", sel: true },
              { m: "FRX", c: "#2e82ff", sel: false },
            ].map(({ m, c, sel }) => (
              <div
                key={m}
                style={{
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: sel
                    ? `${c}18`
                    : "rgba(255,255,255,0.018)",
                  border: `1px solid ${sel ? `${c}40` : C.border}`,
                  color: sel ? c : C.textSub,
                  fontSize: 13,
                  fontWeight: sel ? 600 : 400,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: sel ? c : C.textDim,
                  }}
                />
                {m}
              </div>
            ))}
          </div>
        </SCard>
      )}
      {cTab === "segment" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>Segment Control</SLabel>
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              padding: 3,
              gap: 2,
            }}
          >
            {["CO₂", "FRX"].map((l, i) => (
              <div
                key={l}
                style={{
                  padding: "7px 24px",
                  borderRadius: 8,
                  background:
                    i === 0
                      ? "rgba(255,255,255,0.12)"
                      : "transparent",
                  color: i === 0 ? "#dfe8f5" : "#3f5570",
                  fontSize: 12,
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </SCard>
      )}
      {cTab === "keypad" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>
            Numeric Keypad · modal · 3×4 grid · key 52px
          </SLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
              width: 230,
            }}
          >
            {[
              "7",
              "8",
              "9",
              "4",
              "5",
              "6",
              "1",
              "2",
              "3",
              ".",
              "0",
              "⌫",
            ].map((k) => (
              <div
                key={k}
                style={{
                  height: 52,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.04)",
                  color: k === "⌫" ? "#7a9bbf" : "#dfe8f5",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 20,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {k}
              </div>
            ))}
          </div>
        </SCard>
      )}
      {cTab === "toggle" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>Toggle Variants · height 44px</SLabel>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              { l: "Sound On", on: true, c: "#22c55e" },
              { l: "Aiming Off", on: false, c: "#00cae4" },
              { l: "Auto-Save", on: true, c: "#2e82ff" },
            ].map(({ l, on, c }) => (
              <div
                key={l}
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: on
                    ? `${c}18`
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${on ? `${c}50` : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    background: on
                      ? c
                      : "rgba(255,255,255,0.1)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: on ? 16 : 2,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: on ? c : "#3f5570",
                    fontWeight: 500,
                  }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </SCard>
      )}
      {cTab === "slider" && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>Slider · Settings screen</SLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[
              { l: "Brightness", v: 80 },
              { l: "Volume", v: 60 },
            ].map(({ l, v }) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#7a9bbf",
                    width: 90,
                    flexShrink: 0,
                  }}
                >
                  {l}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: "#1e3050",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${v}%`,
                      background: "#2e82ff",
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -8,
                      left: `${v}%`,
                      transform: "translateX(-50%)",
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: "#2e82ff",
                      border: "2px solid #0c1220",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 12,
                    color: "#dfe8f5",
                    width: 36,
                    textAlign: "right",
                  }}
                >
                  {v}%
                </span>
              </div>
            ))}
          </div>
        </SCard>
      )}
      {(cTab === "popup" ||
        cTab === "dialog" ||
        cTab === "toast" ||
        cTab === "navigation") && (
        <SCard
          style={{
            background: "#131b2e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SLabel>{CNAMES[cTab]} · Component Spec</SLabel>
          {cTab === "toast" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[
                {
                  l: "Success",
                  c: "#22c55e",
                  msg: "Session saved successfully",
                },
                {
                  l: "Warning",
                  c: "#f59e0b",
                  msg: "Temperature approaching limit",
                },
                {
                  l: "Error",
                  c: "#ef4444",
                  msg: "USB device not detected",
                },
              ].map(({ l, c, msg }) => (
                <div
                  key={l}
                  style={{
                    height: 44,
                    padding: "0 16px",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${c}30`,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      background: c,
                    }}
                  />
                  <span
                    style={{ fontSize: 12, color: "#dfe8f5" }}
                  >
                    {msg}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 10,
                      color: "#3f5570",
                    }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          )}
          {cTab !== "toast" && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                fontSize: 12,
                color: "#4a6080",
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: "#7a9bbf" }}>
                {CNAMES[cTab]}
              </strong>
              : Uses C.card background, 20px border-radius,
              rgba(6,10,20,0.9) overlay, motion.div
              scale(0.92→1) entry animation. Width: 320–480px.
              See per-screen doc for specific instances.
            </div>
          )}
        </SCard>
      )}
    </div>
  );
}

// 05 Icons
export function IconsPage() {
  const iconList = [
    {
      name: "Laser",
      icon: <ILaser size={24} color="#2e82ff" />,
    },
    {
      name: "Patient",
      icon: <IPatient size={24} color="#2e82ff" />,
    },
    {
      name: "Settings",
      icon: <ISettings size={24} color="#2e82ff" />,
    },
    {
      name: "History",
      icon: <IHistory size={24} color="#2e82ff" />,
    },
    { name: "Star", icon: <IStar size={24} color="#2e82ff" /> },
    { name: "WiFi", icon: <IWifi size={24} color="#2e82ff" /> },
    {
      name: "Check",
      icon: <ICheck size={24} color="#2e82ff" />,
    },
    { name: "Play", icon: <IPlay size={24} color="#2e82ff" /> },
    {
      name: "Pause",
      icon: <IPause size={24} color="#2e82ff" />,
    },
    { name: "Stop", icon: <IStop size={24} color="#2e82ff" /> },
    {
      name: "Shield",
      icon: <IShield size={24} color="#2e82ff" />,
    },
    {
      name: "Alert",
      icon: <IAlert size={24} color="#2e82ff" />,
    },
    {
      name: "Sound On",
      icon: <ISound size={24} color="#2e82ff" on={true} />,
    },
    {
      name: "Sound Off",
      icon: <ISound size={24} color="#2e82ff" on={false} />,
    },
    {
      name: "Aiming On",
      icon: <IBeam size={24} color="#2e82ff" on={true} />,
    },
    {
      name: "Aiming Off",
      icon: <IBeam size={24} color="#2e82ff" on={false} />,
    },
    {
      name: "Power",
      icon: (
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2e82ff"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      name: "USB",
      icon: (
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2e82ff"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v8M7 6l5-4 5 4M4 14h16a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1z" />
        </svg>
      ),
    },
  ];
  return (
    <div
      style={{
        padding: "28px 32px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="05"
        t="Icons"
        sub="SVG  ·  Vector  ·  Editable  ·  16 / 20 / 24px  ·  3 variants"
      />
      <SCard
        style={{
          marginBottom: 14,
          background: "#131b2e",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <SLabel>Icon Library · 18 icons · SVG</SLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: 10,
          }}
        >
          {iconList.map(({ name, icon }) => (
            <div
              key={name}
              style={{
                padding: "16px 10px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              {icon}
              <span
                style={{
                  fontSize: 10,
                  color: "#4a6080",
                  textAlign: "center",
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </SCard>
      <SCard
        style={{
          marginBottom: 14,
          background: "#131b2e",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <SLabel>
          State Variants · Default / Selected / Disabled
        </SLabel>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "Default", color: "#2e82ff" },
            { label: "Selected", color: "#00cae4" },
            { label: "Disabled", color: "#253448" },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 14,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                {[
                  <ILaser size={22} color={color} />,
                  <IPatient size={22} color={color} />,
                  <IShield size={22} color={color} />,
                  <IStop size={22} color={color} />,
                ].map((ic, i) => (
                  <div key={i}>{ic}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SCard>
      <SCard>
        <SLabel>Naming Convention</SLabel>
        <div
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            color: DT.blue,
            padding: "10px 14px",
            borderRadius: 8,
            background: DT.blueLight,
            border: `1px solid rgba(29,95,204,0.2)`,
          }}
        >
          ic_[name]_[variant].svg
          <br />
          <span style={{ color: DT.textMuted }}>
            e.g. ic_laser_default.svg · ic_laser_selected.svg ·
            ic_laser_disabled.svg
          </span>
        </div>
      </SCard>
    </div>
  );
}

// 06 User Flow
export function UserFlowPage() {
  const flows = [
    {
      from: "Power On",
      to: "SCR_001 Splash",
      via: "Auto-start",
      cat: "boot",
    },
    {
      from: "SCR_001 Splash",
      to: "SCR_002 Password",
      via: "3,000 ms",
      cat: "boot",
    },
    {
      from: "SCR_002 Password",
      to: "SCR_003 Home",
      via: "PIN correct",
      cat: "boot",
    },
    {
      from: "SCR_003 Home",
      to: "SCR_004 FRX",
      via: "Tap FRX card",
      cat: "nav",
    },
    {
      from: "SCR_003 Home",
      to: "SCR_005 CW",
      via: "Tap CW card",
      cat: "nav",
    },
    {
      from: "SCR_003 Home",
      to: "SCR_006 Pulse",
      via: "Tap Pulse card",
      cat: "nav",
    },
    {
      from: "SCR_003 Home",
      to: "SCR_007 Normal",
      via: "Tap Normal card",
      cat: "nav",
    },
    {
      from: "SCR_004–007 Standby",
      to: "SCR_004–007 Ready",
      via: "Tap STANDBY",
      cat: "laser",
    },
    {
      from: "SCR_004–007 Ready",
      to: "SCR_004–007 Lasering",
      via: "Tap READY",
      cat: "laser",
    },
    {
      from: "SCR_004–007 Lasering",
      to: "SCR_004–007 Paused",
      via: "Tap during fire",
      cat: "laser",
    },
    {
      from: "SCR_004–007 Lasering",
      to: "SCR_008 Finish",
      via: "shots = 500 (auto)",
      cat: "laser",
    },
    {
      from: "Any Screen",
      to: "SCR_012 Emergency",
      via: "E-STOP pressed",
      cat: "safety",
    },
    {
      from: "SCR_012 Emergency",
      to: "SCR_003 Home",
      via: "RESET SYSTEM",
      cat: "safety",
    },
    {
      from: "SCR_003 Home",
      to: "SCR_009 History",
      via: "Tap History",
      cat: "nav",
    },
    {
      from: "SCR_003 Home",
      to: "SCR_010 Favorites",
      via: "Tap Favorites",
      cat: "nav",
    },
    {
      from: "SCR_010 Favorites",
      to: "SCR_004–007 Standby",
      via: "Tap Load",
      cat: "nav",
    },
  ];
  const catColor: { [k: string]: string } = {
    boot: "#22c55e",
    nav: "#2e82ff",
    laser: "#ef4444",
    safety: "#f59e0b",
  };
  return (
    <div
      style={{
        padding: "28px 32px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="06"
        t="User Flow"
        sub="실제 화면 이동 구조 다이어그램"
      />
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {[
          { k: "boot", l: "Boot Sequence" },
          { k: "nav", l: "Navigation" },
          { k: "laser", l: "Laser State" },
          { k: "safety", l: "Safety" },
        ].map(({ k, l }) => (
          <div
            key={k}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              background: `${catColor[k]}18`,
              border: `1px solid ${catColor[k]}40`,
              fontSize: 11,
              fontWeight: 600,
              color: catColor[k],
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                background: catColor[k],
              }}
            />
            {l}
          </div>
        ))}
      </div>
      <SCard>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {flows.map(({ from, to, via, cat }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: 8,
                background: i % 2 === 0 ? DT.bg : "#eef4ff",
                border: `1px solid ${DT.border}`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: catColor[cat],
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  flex: 1,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  color: DT.textSub,
                }}
              >
                {from}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: 180,
                  flexShrink: 0,
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: DT.border,
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: catColor[cat],
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: `${catColor[cat]}10`,
                    border: `1px solid ${catColor[cat]}30`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {via}
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: DT.border,
                  }}
                />
                <span
                  style={{ color: catColor[cat], fontSize: 12 }}
                >
                  →
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  color: DT.text,
                  fontWeight: 500,
                }}
              >
                {to}
              </div>
            </div>
          ))}
        </div>
      </SCard>
    </div>
  );
}

// 07 Screens — empty folder structure
export function ScreensPage({ liveState = HMI2_DEFAULT }: { liveState?: HMIState2 }) {
  return <ScreensExportPage liveState={liveState} />;
}

// 08 Assets
export function AssetsPage() {
  const assetGroups = [
    {
      cat: "Logo",
      color: "#2e82ff",
      files: [
        {
          file: "logo_fractio_full.svg",
          size: "240×60",
          format: "SVG",
          use: "Main product logo with wordmark",
        },
        {
          file: "logo_fractio_icon.svg",
          size: "60×60",
          format: "SVG",
          use: "Icon-only version",
        },
        {
          file: "logo_fractio_full.png",
          size: "480×120",
          format: "PNG @2x",
          use: "Raster fallback",
        },
      ],
    },
    {
      cat: "Background",
      color: "#a78bfa",
      files: [
        {
          file: "bg_dark_base.png",
          size: "1024×768",
          format: "PNG",
          use: "Base HMI dark background",
        },
        {
          file: "bg_splash_gradient.png",
          size: "1024×768",
          format: "PNG",
          use: "Splash screen background",
        },
        {
          file: "bg_emergency_dark.png",
          size: "1024×768",
          format: "PNG",
          use: "Emergency stop background",
        },
      ],
    },
    {
      cat: "Illustration",
      color: "#22c55e",
      files: [
        {
          file: "illus_device_render.png",
          size: "400×300",
          format: "PNG @2x",
          use: "Device overview illustration",
        },
        {
          file: "illus_laser_beam.svg",
          size: "200×200",
          format: "SVG",
          use: "Laser beam diagram",
        },
        {
          file: "illus_skin_layer.svg",
          size: "300×200",
          format: "SVG",
          use: "Skin penetration diagram",
        },
      ],
    },
    {
      cat: "Image",
      color: "#f59e0b",
      files: [
        {
          file: "img_clinic_bg.jpg",
          size: "1024×768",
          format: "JPEG",
          use: "Optional clinic background photo",
        },
        {
          file: "img_device_photo.jpg",
          size: "800×600",
          format: "JPEG",
          use: "Product photo for cover",
        },
      ],
    },
  ];
  return (
    <div
      style={{
        padding: "28px 32px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="08"
        t="Assets"
        sub="Logo  ·  Background  ·  Illustration  ·  Image"
      />
      {assetGroups.map(({ cat, color, files }) => (
        <SCard key={cat} style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: color,
              }}
            />
            <SLabel>{cat}</SLabel>
          </div>
          <div
            style={{
              borderRadius: 8,
              border: `1px solid ${DT.border}`,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              }}
            >
              <thead>
                <tr style={{ background: "#f0f4fb" }}>
                  {["File", "Size", "Format", "Usage"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "7px 12px",
                          textAlign: "left",
                          color: DT.textMuted,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          fontSize: 9,
                          borderBottom: `1px solid ${DT.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {files.map(({ file, size, format, use }, i) => (
                  <tr
                    key={file}
                    style={{
                      background:
                        i % 2 === 0 ? "#fff" : "#f8fafd",
                    }}
                  >
                    <td
                      style={{
                        padding: "7px 12px",
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 10,
                        color: color,
                        borderBottom:
                          i < files.length - 1
                            ? `1px solid ${DT.border}`
                            : "none",
                      }}
                    >
                      {file}
                    </td>
                    <td
                      style={{
                        padding: "7px 12px",
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 10,
                        color: DT.textMuted,
                        borderBottom:
                          i < files.length - 1
                            ? `1px solid ${DT.border}`
                            : "none",
                      }}
                    >
                      {size}
                    </td>
                    <td
                      style={{
                        padding: "7px 12px",
                        fontSize: 10,
                        color: DT.textMuted,
                        borderBottom:
                          i < files.length - 1
                            ? `1px solid ${DT.border}`
                            : "none",
                      }}
                    >
                      {format}
                    </td>
                    <td
                      style={{
                        padding: "7px 12px",
                        fontSize: 11,
                        color: DT.textSub,
                        borderBottom:
                          i < files.length - 1
                            ? `1px solid ${DT.border}`
                            : "none",
                      }}
                    >
                      {use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SCard>
      ))}
    </div>
  );
}

// 09 Developer Guide
export function DevGuidePage() {
  const namingRules = [
    {
      type: "Screen",
      rule: "SCR_###_Name_State",
      example: "SCR_004_FRX_Standby",
    },
    {
      type: "Component",
      rule: "CMP_Name_Variant",
      example: "CMP_Button_Primary",
    },
    {
      type: "Icon",
      rule: "ic_name_variant.svg",
      example: "ic_laser_selected.svg",
    },
    {
      type: "Color",
      rule: "c/[role]/[level]",
      example: "c/accent/blue-600",
    },
    {
      type: "Font",
      rule: "f/[family]/[weight]",
      example: "f/Inter/600",
    },
    { type: "Spacing", rule: "sp/[size]", example: "sp/16" },
    {
      type: "Image",
      rule: "img_description.ext",
      example: "img_device_photo.jpg",
    },
    {
      type: "Background",
      rule: "bg_description.ext",
      example: "bg_dark_base.png",
    },
  ];
  return (
    <div
      style={{
        padding: "28px 32px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="09"
        t="Developer Guide"
        sub="Naming Rule  ·  Component Guide  ·  Asset Guide  ·  Notes"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <SCard>
          <SLabel>Naming Rule</SLabel>
          <div
            style={{
              borderRadius: 8,
              border: `1px solid ${DT.border}`,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              }}
            >
              <thead>
                <tr style={{ background: "#f0f4fb" }}>
                  {["Type", "Pattern", "Example"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "6px 10px",
                        textAlign: "left",
                        color: DT.textMuted,
                        fontWeight: 600,
                        fontSize: 9,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: `1px solid ${DT.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {namingRules.map(
                  ({ type, rule, example }, i) => (
                    <tr
                      key={type}
                      style={{
                        background:
                          i % 2 === 0 ? "#fff" : "#f8fafd",
                      }}
                    >
                      <td
                        style={{
                          padding: "6px 10px",
                          fontSize: 11,
                          fontWeight: 500,
                          color: DT.textSub,
                          borderBottom:
                            i < namingRules.length - 1
                              ? `1px solid ${DT.border}`
                              : "none",
                        }}
                      >
                        {type}
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          fontFamily:
                            "'JetBrains Mono',monospace",
                          fontSize: 10,
                          color: DT.blue,
                          borderBottom:
                            i < namingRules.length - 1
                              ? `1px solid ${DT.border}`
                              : "none",
                        }}
                      >
                        {rule}
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          fontFamily:
                            "'JetBrains Mono',monospace",
                          fontSize: 10,
                          color: DT.textMuted,
                          borderBottom:
                            i < namingRules.length - 1
                              ? `1px solid ${DT.border}`
                              : "none",
                        }}
                      >
                        {example}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </SCard>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <SCard>
            <SLabel>Component Guide</SLabel>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {[
                [
                  "Auto Layout",
                  "모든 컴포넌트에 Auto Layout 적용",
                ],
                ["Constraints", "Left+Right / Top+Bottom 설정"],
                [
                  "Layer naming",
                  "BEM 방식: Block__Element--Modifier",
                ],
                ["Variants", "Property=Value 형식으로 정의"],
                [
                  "Variables",
                  "C.* 토큰 — 색상·간격·폰트 변수화",
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: DT.bg,
                    border: `1px solid ${DT.borderL}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: DT.blue,
                      minWidth: 100,
                      flexShrink: 0,
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{ fontSize: 11, color: DT.textSub }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </SCard>
          <SCard>
            <SLabel>Asset Guide</SLabel>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              {[
                ["Icon export", "SVG  ·  24×24  ·  1px stroke"],
                [
                  "Screen export",
                  "PNG 1× + PNG 2× + BMP (RGB565)",
                ],
                [
                  "Font",
                  "Inter + Noto Sans KR + JetBrains Mono",
                ],
                ["Resolution", "1024 × 768 px  ·  72 dpi"],
                ["Color space", "sRGB  ·  No embedded profile"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "5px 10px",
                    borderRadius: 6,
                    background: DT.bg,
                    border: `1px solid ${DT.borderL}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: DT.textMuted,
                      minWidth: 100,
                      flexShrink: 0,
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10,
                      color: DT.textSub,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </SCard>
        </div>
      </div>
      <SCard>
        <SLabel>Developer Notes</SLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {[
            {
              t: "State Machine",
              items: [
                "LaserState: standby → ready → lasering → paused",
                "E-STOP: GPIO_LASER_EN = 0 (hardware, immediate)",
                "Shot counter: +1 per 1,000 ms during lasering",
                "Auto-finish: shots_count === shots_target",
                "Alarm trigger: temp_sensor > 40.0°C",
              ],
            },
            {
              t: "GPIO Map",
              items: [
                "GPIO_LASER_EN  → Laser enable relay (active HIGH)",
                "GPIO_LASER_TRIG → Pulse trigger (hardware timer)",
                "GPIO_FOOT      → Footswitch input (active HIGH)",
                "GPIO_ESTOP     → Emergency interlock (active LOW)",
                "ADC_TEMP       → Thermocouple (°C, 12-bit)",
              ],
            },
            {
              t: "Touch Requirements  ·  IEC 62366",
              items: [
                "Standard Button: 44px (min)",
                "Laser Button: 96px (glove-safe primary)",
                "E-STOP: 52px (emergency zone)",
                "Parameter ± : 44px",
                "Numeric Keypad: 52px per key",
              ],
            },
            {
              t: "Data Files",
              items: [
                "Sessions: /data/sessions.log (CSV)",
                "Favorites: /data/favorites.json (max 20)",
                "Config: /data/config.json",
                "Tube hours: /data/tube_life.dat",
                "USB mount: /mnt/usb0/",
              ],
            },
          ].map(({ t, items }) => (
            <div
              key={t}
              style={{
                borderRadius: 8,
                background: "#0f1e38",
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#7a9bbf",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                {t}
              </div>
              {items.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 10,
                    color: "#7ab8e8",
                    lineHeight: 1.9,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>
      </SCard>
    </div>
  );
}

// 10 Revision History
export function RevisionPage() {
  const log = [
    {
      ver: "v3.3.0",
      date: "2026-07-13",
      designer: "HMI Team",
      type: "Major",
      desc: "완전 재구성: 1024×768 해상도, Inter+Noto Sans KR+JetBrains Mono 폰트, 10개 섹션 구조, Live Prototype 분리.",
    },
    {
      ver: "v3.2.1",
      date: "2026-07-10",
      designer: "HMI Team",
      type: "Feature",
      desc: "Developer documentation added to all 12 screens.",
    },
    {
      ver: "v3.2.0",
      date: "2026-07-08",
      designer: "HMI Team",
      type: "Feature",
      desc: "Complete visual redesign. Dark navy theme. DM Sans + DM Mono typography.",
    },
    {
      ver: "v3.1.5",
      date: "2026-06-20",
      designer: "FW Team",
      type: "Fix",
      desc: "E-STOP GPIO debounce increased to 50ms. Alarm auto-trigger threshold raised to 40°C.",
    },
    {
      ver: "v3.1.0",
      date: "2026-06-01",
      designer: "HMI Team",
      type: "Feature",
      desc: "Favorites screen added. Protocol save/load functionality.",
    },
    {
      ver: "v3.0.2",
      date: "2026-05-15",
      designer: "QA Team",
      type: "Fix",
      desc: "Password screen shake animation on wrong PIN. Lockout after 5 attempts.",
    },
    {
      ver: "v3.0.0",
      date: "2026-04-10",
      designer: "HMI Team",
      type: "Major",
      desc: "1024×768 해상도로 마이그레이션. 새 파라미터 행 레이아웃.",
    },
    {
      ver: "v2.8.0",
      date: "2026-02-20",
      designer: "HMI Team",
      type: "Feature",
      desc: "FRX pattern selector (6 patterns). Dot-grid visual selector added.",
    },
  ];
  const typeColor: Record<string, string> = {
    Feature: "#2e82ff",
    Fix: "#f59e0b",
    Major: "#ef4444",
    Patch: "#22c55e",
  };
  return (
    <div
      style={{
        padding: "28px 32px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        background: DT.bg,
      }}
    >
      <SectionH
        n="10"
        t="Revision History"
        sub="Version  ·  Date  ·  Description  ·  Designer"
      />
      <SCard>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "70px 90px 60px 1fr 80px",
              gap: 8,
              padding: "8px 14px",
              background: "#f0f4fb",
              borderRadius: 8,
              marginBottom: 4,
            }}
          >
            {[
              "Version",
              "Date",
              "Type",
              "Description",
              "Designer",
            ].map((h) => (
              <div
                key={h}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: DT.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {h}
              </div>
            ))}
          </div>
          {log.map(({ ver, date, designer, type, desc }, i) => (
            <div
              key={ver}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 90px 60px 1fr 80px",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                background: i === 0 ? "#f0f6ff" : DT.bg,
                border: `1px solid ${i === 0 ? "#bdd6f5" : DT.border}`,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: i === 0 ? DT.blue : DT.textSub,
                }}
              >
                {ver}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                  color: DT.textFaint,
                }}
              >
                {date}
              </div>
              <div>
                <span
                  style={{
                    padding: "2px 7px",
                    borderRadius: 5,
                    background: `${typeColor[type]}15`,
                    border: `1px solid ${typeColor[type]}40`,
                    fontSize: 9,
                    fontWeight: 700,
                    color: typeColor[type],
                    textTransform: "uppercase",
                  }}
                >
                  {type}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: DT.text,
                  lineHeight: 1.5,
                }}
              >
                {desc}
              </div>
              <div
                style={{ fontSize: 11, color: DT.textMuted }}
              >
                {designer}
              </div>
            </div>
          ))}
        </div>
      </SCard>
    </div>
  );
}

// Live Prototype
