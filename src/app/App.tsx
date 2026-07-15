import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HMIRoot2, HMIState2, HMI2_DEFAULT } from "./hmi2";
import {
  SectionId,
  SECTIONS,
  CoverPage,
  ProjectInfoPage,
  DesignSystemPage,
  ComponentsPage,
  IconsPage,
  UserFlowPage,
  ScreensPage,
  AssetsPage,
  DevGuidePage,
  RevisionPage,
} from "./doc-pages";

function PrototypePage({ onStateChange }: { onStateChange: (s: HMIState2) => void }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#070c18",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#253448",
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          marginBottom: 16,
        }}
      >
        Live Prototype · 1024 × 768 · Interactive
      </div>
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06),0 32px 100px rgba(0,0,0,0.8)",
        }}
      >
        <HMIRoot2 onStateChange={onStateChange} />
      </div>
      <div
        style={{ fontSize: 9, color: "#1e2d48", marginTop: 14 }}
      >
        홈에서 COS 또는 FRX를 탭하여 시작하세요
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP  —  DOCUMENTATION BROWSER
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [section, setSection] = useState<SectionId>("proto");
  const [liveState, setLiveState] = useState<HMIState2>(HMI2_DEFAULT);
  const handleStateChange = useCallback((s: HMIState2) => setLiveState(s), []);

  const sectionContent = () => {
    if (section === "proto") return <PrototypePage onStateChange={handleStateChange} />;
    if (section === "01") return <CoverPage />;
    if (section === "02") return <ProjectInfoPage />;
    if (section === "03") return <DesignSystemPage />;
    if (section === "04") return <ComponentsPage />;
    if (section === "05") return <IconsPage />;
    if (section === "06") return <UserFlowPage />;
    if (section === "07") return <ScreensPage liveState={liveState} />;
    if (section === "08") return <AssetsPage />;
    if (section === "09") return <DevGuidePage />;
    if (section === "10") return <RevisionPage />;
    return null;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        background: "#0f1828",
        fontFamily:
          "'Inter','Noto Sans KR',system-ui,sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── SIDEBAR ── */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: "#111f35",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Brand header */}
        <div
          style={{
            padding: "18px 16px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(46,130,255,0.25)",
                border: "1px solid rgba(46,130,255,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2e82ff"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#dfe8f5",
                  letterSpacing: "0.04em",
                  lineHeight: 1.2,
                }}
              >
                FRACTIO CO₂
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#3f5570",
                  marginTop: 2,
                }}
              >
                Figma 핸드오프
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ padding: "8px 8px", flex: 1 }}>
          {SECTIONS.map(({ id, num, label, icon }) => {
            const isSel = id === section;
            return (
              <button
                key={id}
                data-section-id={id}
                onClick={() => setSection(id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  marginBottom: 2,
                  background: isSel ? "#2e82ff" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
              >
                <span
                  style={{
                    color: isSel ? "#fff" : "#4a6a8a",
                    flexShrink: 0,
                    display: "flex",
                  }}
                >
                  {icon}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isSel ? 600 : 400,
                    color: isSel ? "#fff" : "#7a9bbf",
                    letterSpacing: "0.01em",
                  }}
                >
                  {num && (
                    <span
                      style={{
                        marginRight: 6,
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 11,
                        opacity: 0.7,
                      }}
                    >
                      {num}
                    </span>
                  )}
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#253448",
              lineHeight: 1.8,
            }}
          >

          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            style={{ flex: 1, overflow: "hidden" }}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
          >
            {sectionContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
