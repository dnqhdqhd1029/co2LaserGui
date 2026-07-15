import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "motion/react";

export type HMIScreen =
  | "splash"
  | "password"
  | "home"
  | "treatment"
  | "finish"
  | "history"
  | "favorites"
  | "settings"
  | "emergency";
export type TreatmentMode = "FRX" | "CW" | "Pulse" | "Normal";
export type LaserState =
  | "standby"
  | "ready"
  | "lasering"
  | "paused";
export type DocPage =
  | "SCR_001"
  | "SCR_002"
  | "SCR_003"
  | "SCR_004"
  | "SCR_005"
  | "SCR_006"
  | "SCR_007"
  | "SCR_008"
  | "SCR_009"
  | "SCR_010"
  | "SCR_011"
  | "SCR_012";

export interface TreatmentParams {
  energy: number;
  frequency: number;
  density: number;
  spotSize: number;
  scanSize: number;
  depth: number;
}
export interface ParamDef {
  key: keyof TreatmentParams;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const C = {
  bg: "#0c1220",
  surface: "#131b2e",
  card: "#18243c",
  cardHover: "#1e2d48",
  border: "rgba(255,255,255,0.06)",
  borderMd: "rgba(255,255,255,0.10)",
  blue: "#2e82ff",
  blueDim: "rgba(46,130,255,0.15)",
  blueRing: "rgba(46,130,255,0.35)",
  cyan: "#00cae4",
  cyanDim: "rgba(0,202,228,0.12)",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.12)",
  greenRing: "rgba(34,197,94,0.3)",
  amber: "#f59e0b",
  amberDim: "rgba(245,158,11,0.12)",
  amberRing: "rgba(245,158,11,0.3)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.12)",
  redRing: "rgba(239,68,68,0.35)",
  text: "#dfe8f5",
  textSub: "#7a9bbf",
  textMuted: "#3f5570",
  textDim: "#1e3050",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PARAMETER DEFINITIONS  (1024×768 target)
// ═══════════════════════════════════════════════════════════════════════════════

export const PARAM_DEFS: Record<TreatmentMode, ParamDef[]> = {
  FRX: [
    {
      key: "energy",
      label: "Energy",
      unit: "mJ",
      min: 5,
      max: 200,
      step: 5,
    },
    {
      key: "frequency",
      label: "Frequency",
      unit: "Hz",
      min: 1,
      max: 5,
      step: 1,
    },
    {
      key: "density",
      label: "Density",
      unit: "%",
      min: 5,
      max: 30,
      step: 1,
    },
    {
      key: "spotSize",
      label: "Spot Size",
      unit: "mm",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "scanSize",
      label: "Scan Size",
      unit: "mm",
      min: 5,
      max: 25,
      step: 1,
    },
    {
      key: "depth",
      label: "Depth",
      unit: "μm",
      min: 20,
      max: 500,
      step: 10,
    },
  ],
  CW: [
    {
      key: "energy",
      label: "Power",
      unit: "W",
      min: 1,
      max: 30,
      step: 1,
    },
    {
      key: "frequency",
      label: "Duration",
      unit: "ms",
      min: 100,
      max: 5000,
      step: 100,
    },
    {
      key: "spotSize",
      label: "Spot Size",
      unit: "mm",
      min: 0.5,
      max: 5.0,
      step: 0.5,
    },
    {
      key: "scanSize",
      label: "Scan Size",
      unit: "mm",
      min: 5,
      max: 30,
      step: 1,
    },
    {
      key: "density",
      label: "Density",
      unit: "%",
      min: 10,
      max: 100,
      step: 5,
    },
    {
      key: "depth",
      label: "Depth",
      unit: "μm",
      min: 50,
      max: 800,
      step: 25,
    },
  ],
  Pulse: [
    {
      key: "energy",
      label: "Energy",
      unit: "mJ",
      min: 10,
      max: 500,
      step: 10,
    },
    {
      key: "frequency",
      label: "Frequency",
      unit: "Hz",
      min: 1,
      max: 10,
      step: 1,
    },
    {
      key: "spotSize",
      label: "Spot Size",
      unit: "mm",
      min: 0.5,
      max: 5.0,
      step: 0.5,
    },
    {
      key: "density",
      label: "Density",
      unit: "%",
      min: 5,
      max: 100,
      step: 5,
    },
    {
      key: "scanSize",
      label: "Scan Size",
      unit: "mm",
      min: 5,
      max: 25,
      step: 1,
    },
    {
      key: "depth",
      label: "Depth",
      unit: "μm",
      min: 30,
      max: 600,
      step: 20,
    },
  ],
  Normal: [
    {
      key: "energy",
      label: "Power",
      unit: "W",
      min: 1,
      max: 60,
      step: 1,
    },
    {
      key: "frequency",
      label: "Duration",
      unit: "ms",
      min: 50,
      max: 3000,
      step: 50,
    },
    {
      key: "spotSize",
      label: "Spot Size",
      unit: "mm",
      min: 1.0,
      max: 8.0,
      step: 0.5,
    },
    {
      key: "density",
      label: "Density",
      unit: "%",
      min: 10,
      max: 100,
      step: 10,
    },
    {
      key: "scanSize",
      label: "Scan Size",
      unit: "mm",
      min: 5,
      max: 40,
      step: 1,
    },
    {
      key: "depth",
      label: "Depth",
      unit: "μm",
      min: 50,
      max: 1000,
      step: 50,
    },
  ],
};

export const MODE_DEFAULTS: Record<
  TreatmentMode,
  TreatmentParams
> = {
  FRX: {
    energy: 35,
    frequency: 2,
    density: 15,
    spotSize: 1.0,
    scanSize: 10,
    depth: 80,
  },
  CW: {
    energy: 12,
    frequency: 800,
    density: 80,
    spotSize: 2.0,
    scanSize: 15,
    depth: 200,
  },
  Pulse: {
    energy: 120,
    frequency: 3,
    density: 20,
    spotSize: 2.0,
    scanSize: 12,
    depth: 150,
  },
  Normal: {
    energy: 8,
    frequency: 500,
    density: 60,
    spotSize: 3.0,
    scanSize: 20,
    depth: 300,
  },
};

export const MODE_META: Record<
  TreatmentMode,
  { color: string; dim: string; ring: string; desc: string }
> = {
  FRX: {
    color: C.blue,
    dim: C.blueDim,
    ring: C.blueRing,
    desc: "Fractional Resurfacing",
  },
  CW: {
    color: C.cyan,
    dim: C.cyanDim,
    ring: "rgba(0,202,228,0.3)",
    desc: "Continuous Wave",
  },
  Pulse: {
    color: "#a78bfa",
    dim: "rgba(167,139,250,0.12)",
    ring: "rgba(167,139,250,0.3)",
    desc: "Single Pulse",
  },
  Normal: {
    color: C.green,
    dim: C.greenDim,
    ring: C.greenRing,
    desc: "Standard Treatment",
  },
};

export const FRX_PATTERNS: boolean[][] = [
  [true, true, true, true, true, true, true, true, true],
  [true, false, true, false, true, false, true, false, true],
  [false, true, false, true, true, true, false, true, false],
  [true, false, false, false, true, false, false, false, true],
  [false, false, true, false, true, false, true, false, false],
  [true, true, false, true, false, false, false, false, false],
];
export const PATTERN_LABELS = [
  "Full",
  "Check",
  "Diamond",
  "Corner",
  "Diag",
  "Cluster",
];

export const HISTORY_DATA = [
  {
    id: 1,
    date: "2026.07.08",
    time: "10:24",
    patient: "Lee, Ji-Young",
    age: "42F",
    mode: "FRX" as TreatmentMode,
    shots: 480,
    duration: "12:24",
    energy: 35,
  },
  {
    id: 2,
    date: "2026.07.08",
    time: "14:05",
    patient: "Park, Min-Jun",
    age: "38M",
    mode: "CW" as TreatmentMode,
    shots: 210,
    duration: "08:10",
    energy: 12,
  },
  {
    id: 3,
    date: "2026.07.07",
    time: "09:45",
    patient: "Kim, Soo-Yeon",
    age: "51F",
    mode: "FRX" as TreatmentMode,
    shots: 620,
    duration: "16:05",
    energy: 40,
  },
  {
    id: 4,
    date: "2026.07.07",
    time: "15:30",
    patient: "Choi, Do-Hyun",
    age: "35M",
    mode: "Pulse" as TreatmentMode,
    shots: 300,
    duration: "09:45",
    energy: 100,
  },
  {
    id: 5,
    date: "2026.07.05",
    time: "11:15",
    patient: "Yoon, Hae-Rin",
    age: "29F",
    mode: "FRX" as TreatmentMode,
    shots: 540,
    duration: "14:20",
    energy: 35,
  },
];

export const FAVORITES_DATA = [
  {
    id: 1,
    name: "FRX Resurfacing",
    mode: "FRX" as TreatmentMode,
    params: {
      energy: 35,
      frequency: 2,
      density: 15,
      spotSize: 1.0,
      scanSize: 10,
      depth: 80,
    },
  },
  {
    id: 2,
    name: "CW Ablation",
    mode: "CW" as TreatmentMode,
    params: {
      energy: 15,
      frequency: 600,
      density: 70,
      spotSize: 1.5,
      scanSize: 12,
      depth: 150,
    },
  },
  {
    id: 3,
    name: "Acne Scar Protocol",
    mode: "FRX" as TreatmentMode,
    params: {
      energy: 50,
      frequency: 2,
      density: 20,
      spotSize: 1.2,
      scanSize: 10,
      depth: 120,
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENTATION DATA
// ═══════════════════════════════════════════════════════════════════════════════

export interface DocInteraction {
  element: string;
  type: string;
  action: string;
  result: string;
}
export interface DocComponent {
  name: string;
  type: string;
  props: string;
}
export interface DocParam {
  name: string;
  unit: string;
  min: string;
  max: string;
  step: string;
  default: string;
  validation: string;
}
export interface DocState {
  name: string;
  color: string;
  description: string;
  trigger: string;
}
export interface DocScreen {
  id: DocPage;
  scrid: string;
  name: string;
  hmiScreen: HMIScreen;
  mode?: TreatmentMode;
  laserState?: LaserState;
  description: string;
  purpose: string;
  prevScreen: string;
  nextScreen: string;
  trigger: string;
  interactions: DocInteraction[];
  components: DocComponent[];
  params: DocParam[];
  states: DocState[];
  devNotes: string[];
  tokenRefs: string[];
  assetNames: string[];
  exportNames: string[];
  navStates?: { label: string; laserState: LaserState }[];
}

export const DOC_SCREENS: DocScreen[] = [
  {
    id: "SCR_001",
    scrid: "SCR_001",
    name: "Splash",
    hmiScreen: "splash",
    description:
      "Initial boot screen displayed during device power-on and system initialization. Shows the FRACTIO CO₂ brand mark, firmware version, and a progress indicator.",
    purpose:
      "Communicates system startup, initializes hardware, establishes brand identity, and provides visual feedback during the boot sequence.",
    prevScreen: "— (Entry point)",
    nextScreen: "SCR_002 Password",
    trigger:
      "Auto-advance after 3,000 ms when initialization completes.",
    interactions: [
      {
        element: "Progress Bar",
        type: "Passive",
        action: "Animated",
        result:
          "Fills from 0→100% in 2,600 ms. Visual feedback of boot progress.",
      },
      {
        element: "Screen",
        type: "Auto-navigate",
        action: "Timer",
        result:
          "Navigates to Password screen after 3,000 ms regardless of state.",
      },
    ],
    components: [
      {
        name: "SplashLogo",
        type: "SVG Icon",
        props:
          "size:88px, color:C.blue, animated rotating rings",
      },
      {
        name: "ProgressBar",
        type: "Animated div",
        props:
          "width:200px, height:2px, gradient: C.blue→C.cyan",
      },
      {
        name: "LoadingText",
        type: "Text",
        props:
          "Pulsing opacity animation, fontSize:10px, color:C.textMuted",
      },
      {
        name: "CertFooter",
        type: "Text row",
        props:
          "IEC/CE/FDA/ISO labels, fontSize:10px, color:C.textDim",
      },
    ],
    params: [],
    states: [
      {
        name: "Default / Loading",
        color: "#22c55e",
        description:
          "System initializing. Progress bar animating. No user input required.",
        trigger: "Power on",
      },
      {
        name: "Complete",
        color: "#2e82ff",
        description:
          "Boot complete. Auto-navigates to password screen.",
        trigger: "3,000 ms elapsed",
      },
    ],
    devNotes: [
      "Timer: setTimeout(navigate, 3000) — must fire even if animation incomplete.",
      "Logo ring animation: CSS transform:rotate, 4s and 6s infinite cycles.",
      "Progress bar: motion.div width 0%→100%, duration 2.6s easeInOut.",
      "If hardware init fails, navigate to SCR_012_Error instead of SCR_002.",
    ],
    tokenRefs: [
      "C.bg",
      "C.blue",
      "C.cyan",
      "C.textMuted",
      "C.textDim",
    ],
    assetNames: [
      "ic_laser_ring.svg",
      "font_dmsans_700.ttf",
      "font_dmmono_500.ttf",
    ],
    exportNames: [
      "SCR_001_Splash_Default.png",
      "SCR_001_Splash_Default@2x.png",
      "SCR_001_Splash_Default.bmp",
    ],
  },
  {
    id: "SCR_002",
    scrid: "SCR_002",
    name: "Password",
    hmiScreen: "password",
    description:
      "4-digit PIN entry screen. Protects device from unauthorized operation. Default PIN is 1234. Shows masked dots and animates on error.",
    purpose:
      "Device security and access control. Prevents unauthorized laser operation in clinical environments.",
    prevScreen: "SCR_001 Splash (auto)",
    nextScreen: "SCR_003 Home",
    trigger: "Correct 4-digit PIN entered.",
    interactions: [
      {
        element: "Number Keys 0–9",
        type: "Touch button",
        action: "Tap",
        result: "Appends digit to PIN buffer. Dot fills in.",
      },
      {
        element: "⌫ Backspace",
        type: "Touch button",
        action: "Tap",
        result:
          "Removes last digit from PIN buffer. Dot clears.",
      },
      {
        element: "PIN Buffer (4 dots)",
        type: "Indicator",
        action: "Passive",
        result:
          "Fills as digits entered. Shows progress toward 4 digits.",
      },
      {
        element: "Wrong PIN",
        type: "Error state",
        action: "Auto",
        result:
          "Dots flash red. Screen shake animation. Buffer clears after 300 ms.",
      },
      {
        element: "Correct PIN",
        type: "Navigate",
        action: "Auto",
        result:
          "Brief success state then navigates to Home after 280 ms.",
      },
    ],
    components: [
      {
        name: "ShieldIcon",
        type: "SVG",
        props: "size:28px, color:C.textMuted",
      },
      {
        name: "PinDots",
        type: "Indicator row",
        props: "4× circle 14px, fills on input",
      },
      {
        name: "NumericGrid",
        type: "3×4 button grid",
        props: "68×56px keys, DM Mono font",
      },
    ],
    params: [
      {
        name: "PIN",
        unit: "digits",
        min: "4",
        max: "4",
        step: "1",
        default: "1234",
        validation: "Exact 4-digit match required",
      },
    ],
    states: [
      {
        name: "Default",
        color: "#3f5570",
        description: "Empty dots. Ready for input.",
        trigger: "Screen load",
      },
      {
        name: "Entering",
        color: "#2e82ff",
        description: "1–3 dots filled. Still accepting input.",
        trigger: "Key press",
      },
      {
        name: "Error",
        color: "#ef4444",
        description: "Red dots, shake animation. Wrong PIN.",
        trigger: "4th digit, incorrect",
      },
      {
        name: "Success",
        color: "#22c55e",
        description: "Brief green flash, then navigate.",
        trigger: "4th digit, correct",
      },
    ],
    devNotes: [
      "PIN stored in firmware secure storage. Default: 1234.",
      "Shake animation: translateX keyframes [0,10,-10,8,-8,0] over 400ms.",
      "Max 5 failed attempts → 30-second lockout screen (SCR_012_Error_Locked).",
      "Backlight dims to 40% after 60s idle on this screen.",
    ],
    tokenRefs: [
      "C.bg",
      "C.card",
      "C.text",
      "C.textMuted",
      "C.red",
      "C.green",
      "C.blue",
    ],
    assetNames: ["ic_shield.svg", "font_dmmono_500.ttf"],
    exportNames: [
      "SCR_002_Password_Default.png",
      "SCR_002_Password_Error.png",
      "SCR_002_Password_Default@2x.png",
      "SCR_002_Password_Default.bmp",
    ],
  },
  {
    id: "SCR_003",
    scrid: "SCR_003",
    name: "Home / Mode Select",
    hmiScreen: "home",
    description:
      "Primary navigation hub. Displays 4 treatment mode cards, patient info, system status, and quick access to History, Favorites, and Settings.",
    purpose:
      "Mode selection entry point. Operator selects treatment protocol before beginning therapy. Shows system health at a glance.",
    prevScreen: "SCR_002 Password",
    nextScreen: "SCR_004–007 Treatment (by mode)",
    trigger: "Tap any treatment mode card.",
    interactions: [
      {
        element: "FRX Mode Card",
        type: "Touch button",
        action: "Tap",
        result:
          "Load FRX defaults → navigate to SCR_004_FRX_Standby",
      },
      {
        element: "CW Mode Card",
        type: "Touch button",
        action: "Tap",
        result:
          "Load CW defaults → navigate to SCR_005_CW_Standby",
      },
      {
        element: "Pulse Mode Card",
        type: "Touch button",
        action: "Tap",
        result:
          "Load Pulse defaults → navigate to SCR_006_Pulse_Standby",
      },
      {
        element: "Normal Mode Card",
        type: "Touch button",
        action: "Tap",
        result:
          "Load Normal defaults → navigate to SCR_007_Normal_Standby",
      },
      {
        element: "History Button",
        type: "Touch button",
        action: "Tap",
        result: "Navigate to SCR_009_History",
      },
      {
        element: "Favorites Button",
        type: "Touch button",
        action: "Tap",
        result: "Navigate to SCR_010_Favorites",
      },
      {
        element: "Settings Button",
        type: "Touch button",
        action: "Tap",
        result: "Navigate to SCR_011_Settings",
      },
    ],
    components: [
      {
        name: "StatusBar",
        type: "Top bar 44px",
        props:
          "Device name, patient info, WiFi, battery, clock",
      },
      {
        name: "PatientHeader",
        type: "Info card",
        props: "Name, age, DOB, session number, doctor",
      },
      {
        name: "ModeCard×4",
        type: "Grid card 2×2",
        props: "Mode label, description, color-coded per mode",
      },
      {
        name: "QuickAction×3",
        type: "Secondary button",
        props: "History / Favorites / Settings",
      },
      {
        name: "SystemStatus",
        type: "Status strip",
        props: "5× status dot with label and value",
      },
    ],
    params: [],
    states: [
      {
        name: "System Ready",
        color: "#22c55e",
        description:
          "All subsystems nominal. Laser tube OK. All mode cards active.",
        trigger: "Normal boot",
      },
      {
        name: "System Warning",
        color: "#f59e0b",
        description:
          "One subsystem degraded. Mode cards still active. Warning indicator shown.",
        trigger: "Temp/pressure threshold",
      },
      {
        name: "System Error",
        color: "#ef4444",
        description:
          "Critical fault. Mode cards disabled. Navigate to SCR_012_Error.",
        trigger: "Hardware fault",
      },
    ],
    devNotes: [
      "Patient data loaded from session memory at screen entry.",
      "System status poll: every 5,000 ms. Red dot if any sensor OOL.",
      "Mode card colors: FRX=C.blue, CW=C.cyan, Pulse=#a78bfa, Normal=C.green.",
      "Loading mode defaults: copy MODE_DEFAULTS[mode] into working params.",
    ],
    tokenRefs: [
      "C.blue",
      "C.cyan",
      "C.green",
      "#a78bfa",
      "C.surface",
      "C.text",
      "C.textSub",
    ],
    assetNames: [
      "ic_laser.svg",
      "ic_patient.svg",
      "ic_history.svg",
      "ic_star.svg",
      "ic_settings.svg",
    ],
    exportNames: [
      "SCR_003_Home_Default.png",
      "SCR_003_Home_Warning.png",
      "SCR_003_Home_Default@2x.png",
      "SCR_003_Home_Default.bmp",
    ],
  },
  {
    id: "SCR_004",
    scrid: "SCR_004",
    name: "FRX Treatment",
    hmiScreen: "treatment",
    mode: "FRX",
    laserState: "standby",
    description:
      "Main treatment screen for Fractional (FRX) mode. Contains 6 editable parameters, dot-pattern selector, mode tabs, session counter, laser state controls, and peripheral toggles.",
    purpose:
      "Primary clinical workspace. Operator adjusts all treatment parameters and controls laser emission. Must be operable with surgical gloves.",
    prevScreen: "SCR_003 Home",
    nextScreen:
      "SCR_008 Finish (auto at 500 shots) or SCR_012 Emergency",
    trigger:
      "Laser button transitions: STANDBY→READY→LASER ON→PAUSED.",
    interactions: [
      {
        element: "Mode Tabs (FRX/CW/Pulse/Normal)",
        type: "Touch tab",
        action: "Tap",
        result:
          "Switch mode, reload defaults. Disabled during LASER ON.",
      },
      {
        element: "Pattern Selector (6 patterns)",
        type: "Touch grid",
        action: "Tap",
        result:
          "Select fractional dot pattern. Disabled during LASER ON.",
      },
      {
        element: "Parameter −/+ buttons",
        type: "Touch button",
        action: "Tap",
        result:
          "Decrement/increment by step. Clamped to min/max. Disabled during LASER ON.",
      },
      {
        element: "Parameter value",
        type: "Touch button",
        action: "Tap",
        result:
          "Open numeric keypad modal. Direct value entry. Disabled during LASER ON.",
      },
      {
        element: "Laser Button (STANDBY)",
        type: "Primary action",
        action: "Tap",
        result:
          "State→READY. Button turns blue. Confirmation tone if sound on.",
      },
      {
        element: "Laser Button (READY)",
        type: "Primary action",
        action: "Tap",
        result:
          "State→LASERING. Button turns red. Timer starts. Shot counter starts.",
      },
      {
        element: "Laser Button (LASER ON)",
        type: "Primary action",
        action: "Tap",
        result:
          "State→PAUSED. Timer pauses. Shot counter pauses.",
      },
      {
        element: "Laser Button (PAUSED)",
        type: "Primary action",
        action: "Tap",
        result: "State→LASERING. Timer resumes.",
      },
      {
        element: "Sound Toggle",
        type: "Toggle",
        action: "Tap",
        result: "Toggles audio beep on shot fired.",
      },
      {
        element: "Aiming Beam Toggle",
        type: "Toggle",
        action: "Tap",
        result: "Toggles red aiming beam on/off.",
      },
      {
        element: "E-STOP Button",
        type: "Emergency",
        action: "Tap",
        result:
          "Immediate laser halt. Navigate to SCR_012_Emergency.",
      },
      {
        element: "Back Button",
        type: "Navigation",
        action: "Tap",
        result:
          "Return to SCR_003 Home. Laser state reset to STANDBY.",
      },
    ],
    components: [
      {
        name: "StatusBar",
        type: "Top bar 44px",
        props:
          "Mode badge, patient info, clock, LASER ON indicator (pulsing red)",
      },
      {
        name: "ModeTab×4",
        type: "Vertical tab",
        props:
          "38px height, active=mode color, inactive=surface",
      },
      {
        name: "PatternTile×6",
        type: "Grid 2×3",
        props: "3×3 dot grid, 40px height, active=blue",
      },
      {
        name: "SessionCard",
        type: "Info card",
        props:
          "Shot counter (DM Mono 24px), timer (DM Mono 16px)",
      },
      {
        name: "ParameterRow×6",
        type: "Data row 52px",
        props: "Label, progress bar, −44px, value 28px, +44px",
      },
      {
        name: "LaserStateCard",
        type: "Status card",
        props: "Laser icon, state label, color-coded",
      },
      {
        name: "ToggleButton×2",
        type: "Toggle",
        props: "44px height, Sound/Aiming, green/cyan when on",
      },
      {
        name: "FootswitchStatus",
        type: "Status row",
        props: "7px dot, label",
      },
      {
        name: "VitalsCard",
        type: "Info card",
        props: "Temp / Tube% / Tube Life",
      },
      {
        name: "EStopButton",
        type: "Emergency button",
        props: "52px height, red, Stop icon",
      },
      {
        name: "LaserButton",
        type: "Primary CTA",
        props: "80px height, 4 state variants",
      },
    ],
    params: [
      {
        name: "Energy",
        unit: "mJ",
        min: "5",
        max: "200",
        step: "5",
        default: "35",
        validation:
          "Must be multiple of 5. Max limited by spot size and density combination.",
      },
      {
        name: "Frequency",
        unit: "Hz",
        min: "1",
        max: "5",
        step: "1",
        default: "2",
        validation:
          "Integer only. Higher frequency requires sufficient cooldown between pulses.",
      },
      {
        name: "Density",
        unit: "%",
        min: "5",
        max: "30",
        step: "1",
        default: "15",
        validation:
          "Percentage of treatment area. Combined with spot size affects total energy density.",
      },
      {
        name: "Spot Size",
        unit: "mm",
        min: "0.1",
        max: "3.0",
        step: "0.1",
        default: "1.0",
        validation:
          "One decimal place. Determines ablation diameter per microbeam.",
      },
      {
        name: "Scan Size",
        unit: "mm",
        min: "5",
        max: "25",
        step: "1",
        default: "10",
        validation: "Total treatment scan area side length.",
      },
      {
        name: "Depth",
        unit: "μm",
        min: "20",
        max: "500",
        step: "10",
        default: "80",
        validation:
          "Ablation depth. Must not exceed safe tissue depth for patient.",
      },
    ],
    states: [
      {
        name: "Standby",
        color: "#3f5570",
        description:
          "All params editable. Laser button gray/inactive. System armed but not ready.",
        trigger:
          "Screen entry / E-STOP reset / Back from Ready",
      },
      {
        name: "Ready",
        color: "#2e82ff",
        description:
          "Params locked. Laser button blue. System primed, awaiting fire command.",
        trigger: "Tap STANDBY button",
      },
      {
        name: "Lasering",
        color: "#ef4444",
        description:
          "Params locked. Laser button red pulsing. Timer running. Shot counter incrementing.",
        trigger: "Tap READY button",
      },
      {
        name: "Paused",
        color: "#f59e0b",
        description:
          "Params locked. Laser button amber. Timer paused. Shot count frozen.",
        trigger: "Tap during LASER ON",
      },
      {
        name: "Alarm",
        color: "#f59e0b",
        description:
          "Alarm overlay appears. Laser paused automatically. Acknowledge or Snooze.",
        trigger: "Temperature/pressure threshold exceeded",
      },
      {
        name: "Finish",
        color: "#22c55e",
        description:
          "Auto-navigate to SCR_008 Finish when shot count reaches goal (500).",
        trigger: "shots === target",
      },
    ],
    devNotes: [
      "Laser interlock: READY→LASERING requires footswitch signal HIGH (GPIO_FOOT == 1).",
      "Shot counter increments every 1,000 ms during LASERING state.",
      "Alarm auto-trigger: elapsed === 8s during LASERING (demo). Production: temp > 40°C.",
      "E-STOP: GPIO_LASER_EN = 0 immediately, then navigate to SCR_012_Emergency.",
      "Back button: setState(standby) before navigating. Do not navigate while LASERING.",
      "Parameter change during READY: resets to STANDBY state.",
    ],
    tokenRefs: [
      "C.blue",
      "C.red",
      "C.amber",
      "C.green",
      "C.surface",
      "C.card",
      "C.text",
      "C.textMuted",
    ],
    assetNames: [
      "ic_laser.svg",
      "ic_play.svg",
      "ic_pause.svg",
      "ic_stop.svg",
      "ic_shield.svg",
      "ic_sound_on.svg",
      "ic_sound_off.svg",
      "ic_beam_on.svg",
      "ic_beam_off.svg",
    ],
    exportNames: [
      "SCR_004_FRX_Standby.png",
      "SCR_004_FRX_Ready.png",
      "SCR_004_FRX_Lasering.png",
      "SCR_004_FRX_Paused.png",
      "SCR_004_FRX_Standby@2x.png",
      "SCR_004_FRX_Standby.bmp",
    ],
    navStates: [
      { label: "Standby", laserState: "standby" },
      { label: "Ready", laserState: "ready" },
      { label: "Laser ON", laserState: "lasering" },
      { label: "Paused", laserState: "paused" },
    ],
  },
  {
    id: "SCR_005",
    scrid: "SCR_005",
    name: "CW Treatment",
    hmiScreen: "treatment",
    mode: "CW",
    laserState: "standby",
    description:
      "Treatment screen for Continuous Wave (CW) mode. Same layout as FRX but with Power/Duration parameters instead of Energy/Frequency. No pattern selector.",
    purpose:
      "CW laser ablation for soft tissue removal, vaporization, and precise cutting. Parameters optimized for continuous delivery.",
    prevScreen: "SCR_003 Home",
    nextScreen: "SCR_008 Finish / SCR_012 Emergency",
    trigger: "Same as SCR_004 FRX.",
    interactions: [
      {
        element: "All parameter controls",
        type: "Touch",
        action: "Tap",
        result:
          "Same behavior as SCR_004. Parameters specific to CW mode.",
      },
      {
        element: "Laser Button",
        type: "Primary CTA",
        action: "Tap",
        result: "Same 4-state machine as SCR_004.",
      },
    ],
    components: [
      {
        name: "TreatmentScreen",
        type: "Screen component",
        props: "mode=CW — no PatternSelector, CW parameter set",
      },
    ],
    params: [
      {
        name: "Power",
        unit: "W",
        min: "1",
        max: "30",
        step: "1",
        default: "12",
        validation: "Watt integer. Max depends on spot size.",
      },
      {
        name: "Duration",
        unit: "ms",
        min: "100",
        max: "5,000",
        step: "100",
        default: "800",
        validation: "Pulse duration in ms. Multiple of 100.",
      },
      {
        name: "Spot Size",
        unit: "mm",
        min: "0.5",
        max: "5.0",
        step: "0.5",
        default: "2.0",
        validation: "Half-mm increments.",
      },
      {
        name: "Scan Size",
        unit: "mm",
        min: "5",
        max: "30",
        step: "1",
        default: "15",
        validation: "Integer mm.",
      },
      {
        name: "Density",
        unit: "%",
        min: "10",
        max: "100",
        step: "5",
        default: "80",
        validation: "Multiples of 5.",
      },
      {
        name: "Depth",
        unit: "μm",
        min: "50",
        max: "800",
        step: "25",
        default: "200",
        validation: "Multiples of 25.",
      },
    ],
    states: [
      {
        name: "Standby",
        color: "#00cae4",
        description:
          "CW mode selected. Power/Duration params visible.",
        trigger: "Screen entry",
      },
      {
        name: "Ready",
        color: "#2e82ff",
        description: "Cyan mode accent, system primed.",
        trigger: "Tap STANDBY",
      },
      {
        name: "Lasering",
        color: "#ef4444",
        description: "Continuous beam active. Red state.",
        trigger: "Tap READY",
      },
      {
        name: "Paused",
        color: "#f59e0b",
        description: "Beam interrupted. Safe state.",
        trigger: "Tap during Lasering",
      },
    ],
    devNotes: [
      "CW mode: no fractional pattern selector shown.",
      "Power output: analog voltage DAC → PWM driver. Range 1–30W.",
      "Duration controls shutter open time per firing cycle.",
    ],
    tokenRefs: [
      "C.cyan",
      "C.cyanDim",
      "C.blue",
      "C.red",
      "C.amber",
    ],
    assetNames: [
      "ic_laser.svg",
      "ic_play.svg",
      "ic_pause.svg",
      "ic_stop.svg",
    ],
    exportNames: [
      "SCR_005_CW_Standby.png",
      "SCR_005_CW_Ready.png",
      "SCR_005_CW_Lasering.png",
      "SCR_005_CW_Standby.bmp",
    ],
    navStates: [
      { label: "Standby", laserState: "standby" },
      { label: "Ready", laserState: "ready" },
      { label: "Laser ON", laserState: "lasering" },
      { label: "Paused", laserState: "paused" },
    ],
  },
  {
    id: "SCR_006",
    scrid: "SCR_006",
    name: "Pulse Treatment",
    hmiScreen: "treatment",
    mode: "Pulse",
    laserState: "standby",
    description:
      "Treatment screen for Pulse mode. Single-pulse or burst delivery. High energy per shot, low frequency. Pattern selector hidden.",
    purpose:
      "Lesion removal, skin tags, precise targeted ablation. High peak power, low average power.",
    prevScreen: "SCR_003 Home",
    nextScreen: "SCR_008 Finish / SCR_012 Emergency",
    trigger: "Same as SCR_004.",
    interactions: [
      {
        element: "All controls",
        type: "Touch",
        action: "Tap",
        result: "Same as SCR_004 with Pulse parameter set.",
      },
    ],
    components: [
      {
        name: "TreatmentScreen",
        type: "Screen component",
        props:
          "mode=Pulse — no PatternSelector, Pulse parameter set",
      },
    ],
    params: [
      {
        name: "Energy",
        unit: "mJ",
        min: "10",
        max: "500",
        step: "10",
        default: "120",
        validation: "Multiples of 10.",
      },
      {
        name: "Frequency",
        unit: "Hz",
        min: "1",
        max: "10",
        step: "1",
        default: "3",
        validation: "Low frequency, integer.",
      },
      {
        name: "Spot Size",
        unit: "mm",
        min: "0.5",
        max: "5.0",
        step: "0.5",
        default: "2.0",
        validation: "",
      },
      {
        name: "Density",
        unit: "%",
        min: "5",
        max: "100",
        step: "5",
        default: "20",
        validation: "",
      },
      {
        name: "Scan Size",
        unit: "mm",
        min: "5",
        max: "25",
        step: "1",
        default: "12",
        validation: "",
      },
      {
        name: "Depth",
        unit: "μm",
        min: "30",
        max: "600",
        step: "20",
        default: "150",
        validation: "",
      },
    ],
    states: [
      {
        name: "Standby",
        color: "#a78bfa",
        description: "Pulse mode, purple accent.",
        trigger: "Screen entry",
      },
      {
        name: "Ready",
        color: "#2e82ff",
        description: "System primed for pulse delivery.",
        trigger: "Tap STANDBY",
      },
      {
        name: "Lasering",
        color: "#ef4444",
        description: "Pulse train active.",
        trigger: "Tap READY",
      },
      {
        name: "Paused",
        color: "#f59e0b",
        description: "Pulse train paused.",
        trigger: "Tap during Lasering",
      },
    ],
    devNotes: [
      "Pulse mode: Q-switched pulse train.",
      "Timing-critical: pulse width controlled by hardware FPGA, not software timer.",
    ],
    tokenRefs: ["#a78bfa", "C.blue", "C.red", "C.amber"],
    assetNames: [
      "ic_laser.svg",
      "ic_play.svg",
      "ic_pause.svg",
      "ic_stop.svg",
    ],
    exportNames: [
      "SCR_006_Pulse_Standby.png",
      "SCR_006_Pulse_Ready.png",
      "SCR_006_Pulse_Lasering.png",
      "SCR_006_Pulse_Standby.bmp",
    ],
    navStates: [
      { label: "Standby", laserState: "standby" },
      { label: "Ready", laserState: "ready" },
      { label: "Laser ON", laserState: "lasering" },
      { label: "Paused", laserState: "paused" },
    ],
  },
  {
    id: "SCR_007",
    scrid: "SCR_007",
    name: "Normal Treatment",
    hmiScreen: "treatment",
    mode: "Normal",
    laserState: "standby",
    description:
      "Standard treatment mode. Broad-area power delivery. Suitable for general dermatology applications.",
    purpose:
      "General-purpose CO₂ laser treatment. Higher power range, larger spot sizes.",
    prevScreen: "SCR_003 Home",
    nextScreen: "SCR_008 Finish / SCR_012 Emergency",
    trigger: "Same as SCR_004.",
    interactions: [
      {
        element: "All controls",
        type: "Touch",
        action: "Tap",
        result: "Same as SCR_004 with Normal parameter set.",
      },
    ],
    components: [
      {
        name: "TreatmentScreen",
        type: "Screen component",
        props:
          "mode=Normal — no PatternSelector, Normal parameter set",
      },
    ],
    params: [
      {
        name: "Power",
        unit: "W",
        min: "1",
        max: "60",
        step: "1",
        default: "8",
        validation:
          "High power. Verify spot size before firing.",
      },
      {
        name: "Duration",
        unit: "ms",
        min: "50",
        max: "3,000",
        step: "50",
        default: "500",
        validation: "",
      },
      {
        name: "Spot Size",
        unit: "mm",
        min: "1.0",
        max: "8.0",
        step: "0.5",
        default: "3.0",
        validation: "Larger spots only.",
      },
      {
        name: "Density",
        unit: "%",
        min: "10",
        max: "100",
        step: "10",
        default: "60",
        validation: "",
      },
      {
        name: "Scan Size",
        unit: "mm",
        min: "5",
        max: "40",
        step: "1",
        default: "20",
        validation: "",
      },
      {
        name: "Depth",
        unit: "μm",
        min: "50",
        max: "1,000",
        step: "50",
        default: "300",
        validation: "",
      },
    ],
    states: [
      {
        name: "Standby",
        color: "#22c55e",
        description: "Normal mode, green accent.",
        trigger: "Screen entry",
      },
      {
        name: "Ready",
        color: "#2e82ff",
        description: "System primed.",
        trigger: "Tap STANDBY",
      },
      {
        name: "Lasering",
        color: "#ef4444",
        description: "Beam active.",
        trigger: "Tap READY",
      },
      {
        name: "Paused",
        color: "#f59e0b",
        description: "Beam paused.",
        trigger: "Tap during Lasering",
      },
    ],
    devNotes: [
      "Normal mode: no duty-cycle restriction.",
      "Power up to 60W — verify thermal management before enable.",
    ],
    tokenRefs: [
      "C.green",
      "C.greenDim",
      "C.blue",
      "C.red",
      "C.amber",
    ],
    assetNames: [
      "ic_laser.svg",
      "ic_play.svg",
      "ic_pause.svg",
      "ic_stop.svg",
    ],
    exportNames: [
      "SCR_007_Normal_Standby.png",
      "SCR_007_Normal_Ready.png",
      "SCR_007_Normal_Lasering.png",
      "SCR_007_Normal_Standby.bmp",
    ],
    navStates: [
      { label: "Standby", laserState: "standby" },
      { label: "Ready", laserState: "ready" },
      { label: "Laser ON", laserState: "lasering" },
      { label: "Paused", laserState: "paused" },
    ],
  },
  {
    id: "SCR_008",
    scrid: "SCR_008",
    name: "Finish / Summary",
    hmiScreen: "finish",
    description:
      "Post-treatment summary screen. Shows shot count, elapsed time, mode used, and last 4 parameters. Operator can return to Home or start a New Session.",
    purpose:
      "Treatment completion confirmation. Documents session outcome. Entry point for next session or logout.",
    prevScreen: "SCR_004–007 Treatment (auto at shot goal)",
    nextScreen: "SCR_003 Home or SCR_004–007 New Session",
    trigger:
      "Shot count reaches target (500). Navigated by timer callback.",
    interactions: [
      {
        element: "Home Button",
        type: "Secondary button",
        action: "Tap",
        result:
          "Navigate to SCR_003 Home. Reset shot counter and timer.",
      },
      {
        element: "New Session Button",
        type: "Primary button",
        action: "Tap",
        result:
          "Reset counter, keep mode/params, navigate to SCR_004–007 Standby.",
      },
    ],
    components: [
      {
        name: "SuccessIcon",
        type: "SVG + Card",
        props: "CheckIcon 28px, green card 64px",
      },
      {
        name: "SummaryGrid 3-col",
        type: "Stat cards",
        props: "Shots / Duration / Mode",
      },
      {
        name: "ParamPreview",
        type: "Flex row",
        props: "4× param pill, fontSize:12px",
      },
      {
        name: "ActionButtons",
        type: "Button row",
        props: "Home (secondary) + New Session (primary)",
      },
    ],
    params: [],
    states: [
      {
        name: "Default",
        color: "#22c55e",
        description:
          "Success state. All info displayed. Two action buttons.",
        trigger: "Shot goal reached",
      },
    ],
    devNotes: [
      "Session data should be written to non-volatile log before screen renders.",
      "Log format: datetime, patient_id, mode, params, shots, duration.",
      "New Session: preserve params from finished session as starting defaults.",
    ],
    tokenRefs: [
      "C.green",
      "C.greenDim",
      "C.blue",
      "C.surface",
      "C.text",
    ],
    assetNames: ["ic_check.svg"],
    exportNames: [
      "SCR_008_Finish_Default.png",
      "SCR_008_Finish_Default@2x.png",
      "SCR_008_Finish_Default.bmp",
    ],
  },
  {
    id: "SCR_009",
    scrid: "SCR_009",
    name: "History",
    hmiScreen: "history",
    description:
      "Treatment history log. Scrollable list of past sessions with date, patient, mode, shots, duration, and energy. Export options available.",
    purpose:
      "Clinical record review. Audit trail for treatment protocols. Required for patient chart documentation.",
    prevScreen: "SCR_003 Home",
    nextScreen: "SCR_003 Home (Back)",
    trigger: "Back button tap.",
    interactions: [
      {
        element: "History Row",
        type: "Touch list item",
        action: "Tap",
        result:
          "Toggle row selection (highlight). Future: expand detail view.",
      },
      {
        element: "Export PDF",
        type: "Button",
        action: "Tap",
        result:
          "Generate PDF report of selected/all sessions. Print via network.",
      },
      {
        element: "USB Export",
        type: "Button",
        action: "Tap",
        result:
          "Copy CSV log to USB drive. Confirm if USB not present.",
      },
      {
        element: "Print Report",
        type: "Button",
        action: "Tap",
        result: "Send to connected network printer.",
      },
      {
        element: "Back Button",
        type: "Navigation",
        action: "Tap",
        result: "Navigate to SCR_003 Home.",
      },
    ],
    components: [
      {
        name: "HistoryRow",
        type: "List item 56px",
        props:
          "Mode badge, patient name/age, date/time, shots, energy",
      },
      {
        name: "ExportButtons×3",
        type: "Secondary button row",
        props: "40px height, bottom dock",
      },
    ],
    params: [],
    states: [
      {
        name: "Default",
        color: "#3f5570",
        description: "List populated from log. No selection.",
        trigger: "Screen load",
      },
      {
        name: "Selected",
        color: "#2e82ff",
        description:
          "One row highlighted with mode accent color.",
        trigger: "Row tap",
      },
    ],
    devNotes: [
      "Data source: /data/sessions.log (CSV). Max 1,000 records displayed.",
      "Export PDF: templated HTML→PDF via embedded renderer. Filename: history_YYYYMMDD.pdf.",
      "USB export: mount /dev/sda1, copy sessions.csv.",
    ],
    tokenRefs: [
      "C.surface",
      "C.border",
      "C.text",
      "C.textSub",
      "C.textMuted",
    ],
    assetNames: [
      "ic_history.svg",
      "ic_usb.svg",
      "ic_print.svg",
    ],
    exportNames: [
      "SCR_009_History_Default.png",
      "SCR_009_History_Selected.png",
      "SCR_009_History_Default.bmp",
    ],
  },
  {
    id: "SCR_010",
    scrid: "SCR_010",
    name: "Favorites",
    hmiScreen: "favorites",
    description:
      "Saved treatment protocols. Operator can load any saved protocol directly into the treatment screen with all parameters pre-filled.",
    purpose:
      "Workflow efficiency. Frequently used protocols saved as named presets. Reduces setup time per patient.",
    prevScreen: "SCR_003 Home",
    nextScreen:
      "SCR_004–007 Treatment (Load) or SCR_003 Home (Back)",
    trigger:
      "Tap Load → navigate to treatment screen with loaded params.",
    interactions: [
      {
        element: "Load Button",
        type: "Primary button",
        action: "Tap",
        result:
          "Apply saved params to working set. Navigate to correct treatment screen in Standby.",
      },
      {
        element: "Back Button",
        type: "Navigation",
        action: "Tap",
        result: "Navigate to SCR_003 Home.",
      },
    ],
    components: [
      {
        name: "FavoriteCard",
        type: "Card",
        props:
          "Name, mode badge, Load button, 4× param preview pills",
      },
    ],
    params: [
      {
        name: "All TreatmentParams",
        unit: "Varies",
        min: "Varies",
        max: "Varies",
        step: "Varies",
        default: "Saved values",
        validation:
          "Pre-validated on save. No re-validation needed on load.",
      },
    ],
    states: [
      {
        name: "Default",
        color: "#3f5570",
        description: "List of saved protocols.",
        trigger: "Screen load",
      },
    ],
    devNotes: [
      "Favorites stored in /data/favorites.json. Max 20 entries.",
      "Load action: copy fav.params → working params, set mode, navigate to treatment.",
    ],
    tokenRefs: ["C.card", "C.surface", "C.border", "C.text"],
    assetNames: ["ic_star.svg"],
    exportNames: [
      "SCR_010_Favorites_Default.png",
      "SCR_010_Favorites_Default.bmp",
    ],
  },
  {
    id: "SCR_011",
    scrid: "SCR_011",
    name: "Settings",
    hmiScreen: "settings",
    description:
      "System configuration screen. Display brightness, audio volume, device information, and maintenance access. PIN-protected advanced settings.",
    purpose:
      "Device configuration and maintenance access. Clinical and technical parameters.",
    prevScreen: "SCR_003 Home",
    nextScreen: "SCR_003 Home (Back)",
    trigger: "Back button.",
    interactions: [
      {
        element: "Brightness Slider",
        type: "Range input",
        action: "Drag",
        result: "Adjusts LCD backlight 0–100%.",
      },
      {
        element: "Volume Slider",
        type: "Range input",
        action: "Drag",
        result: "Adjusts speaker volume 0–100%.",
      },
      {
        element: "Calibration",
        type: "Button",
        action: "Tap",
        result:
          "Navigate to SCR_013_Calibration (PIN protected).",
      },
      {
        element: "Maintenance",
        type: "Button",
        action: "Tap",
        result:
          "Navigate to SCR_014_Maintenance (PIN protected).",
      },
      {
        element: "Change PIN",
        type: "Button",
        action: "Tap",
        result: "PIN change flow.",
      },
      {
        element: "Shutdown",
        type: "Danger button",
        action: "Tap",
        result: "Confirmation dialog → safe shutdown.",
      },
    ],
    components: [
      {
        name: "SliderRow×2",
        type: "Range input",
        props: "Brightness / Volume, 0–100%",
      },
      {
        name: "DeviceInfoTable",
        type: "Key-value list",
        props:
          "6 rows: Model, Serial, FW, Service, Shots, Life",
      },
      {
        name: "ActionButtons×4",
        type: "Button column",
        props: "Calibration, Maintenance, Change PIN, Shutdown",
      },
    ],
    params: [
      {
        name: "Brightness",
        unit: "%",
        min: "10",
        max: "100",
        step: "1",
        default: "80",
        validation:
          "Min 10% to maintain readability in clinic.",
      },
      {
        name: "Volume",
        unit: "%",
        min: "0",
        max: "100",
        step: "1",
        default: "60",
        validation:
          "0% silences all tones including alarm. Warning shown.",
      },
    ],
    states: [
      {
        name: "Default",
        color: "#3f5570",
        description: "Settings available.",
        trigger: "Screen load",
      },
    ],
    devNotes: [
      "Brightness: write /sys/class/backlight/pwm-bl/brightness. Range 26–255 (10%–100%).",
      "Volume: ALSA mixer control. amixer set Master {val}%.",
      "Shutdown button: sync filesystem, then reboot -h now.",
    ],
    tokenRefs: [
      "C.surface",
      "C.card",
      "C.border",
      "C.red",
      "C.redDim",
    ],
    assetNames: ["ic_settings.svg", "ic_power.svg"],
    exportNames: [
      "SCR_011_Settings_Default.png",
      "SCR_011_Settings_Default.bmp",
    ],
  },
  {
    id: "SCR_012",
    scrid: "SCR_012",
    name: "Emergency Stop",
    hmiScreen: "emergency",
    description:
      "Full-screen critical alert. Triggered by E-STOP button or hardware interlock. All laser outputs halted immediately. Red background. Pulsing animation.",
    purpose:
      "Maximum visibility safety screen. Operator must acknowledge and manually verify the treatment area is clear before resetting.",
    prevScreen: "Any treatment screen (E-STOP)",
    nextScreen: "SCR_003 Home (after Reset)",
    trigger: "Tap RESET SYSTEM → SCR_003 Home.",
    interactions: [
      {
        element: "RESET SYSTEM button",
        type: "Recovery action",
        action: "Tap",
        result:
          "Reset all laser enables, GPIO_LASER_EN=0, navigate to SCR_003 Home.",
      },
    ],
    components: [
      {
        name: "PulsingRings",
        type: "Animated div×3",
        props: "Red concentric, scale+opacity pulsing",
      },
      {
        name: "StopIcon",
        type: "SVG in circle",
        props: "Red circle 64px, IStop 28px white",
      },
      {
        name: "AlertText",
        type: "Pulsing label",
        props: "EMERGENCY STOP 26px 800 weight, opacity blink",
      },
      {
        name: "ResetButton",
        type: "Recovery button",
        props:
          "220×54px, red border, requires deliberate press",
      },
    ],
    params: [],
    states: [
      {
        name: "Active Emergency",
        color: "#ef4444",
        description:
          "All laser outputs disabled. Cannot interact with any other screen element.",
        trigger: "E-STOP press / hardware interlock",
      },
    ],
    devNotes: [
      "HARDWARE: GPIO_LASER_EN = 0 must fire BEFORE navigating to this screen.",
      "HARDWARE: DAC output must return to 0V on E-STOP.",
      "RESET: re-enable GPIO_LASER_EN only after operator confirms clear.",
      "Log: write EMERGENCY_STOP event with timestamp to /data/events.log.",
      "DO NOT allow automatic reset. Operator must manually tap RESET.",
    ],
    tokenRefs: ["C.red", "C.redDim", "C.redRing"],
    assetNames: ["ic_stop.svg"],
    exportNames: [
      "SCR_012_Emergency_Default.png",
      "SCR_012_Emergency_Default@2x.png",
      "SCR_012_Emergency_Default.bmp",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

export const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, v));
export const snap = (v: number, step: number) =>
  Math.round(v / step) * step;
export const fmt = (v: number, step: number) =>
  step < 1 ? v.toFixed(1) : String(Math.round(v));
export const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

type IP = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};
export const ILaser = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.7,
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </svg>
);
export const IPatient = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.7,
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </svg>
);
export const ISettings = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.7,
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
export const IHistory = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.7,
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
);
export const IStar = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.7,
  filled = false,
}: IP & { filled?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
export const IWifi = ({
  size = 16,
  color = "currentColor",
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill={color} stroke="none" />
  </svg>
);
export const ICheck = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 2,
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
export const IPlay = ({
  size = 20,
  color = "currentColor",
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
export const IPause = ({
  size = 20,
  color = "currentColor",
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
  >
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
export const IStop = ({
  size = 20,
  color = "currentColor",
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);
export const IShield = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.8,
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
export const IAlert = ({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.8,
}: IP) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
export const ISound = ({
  size = 18,
  color = "currentColor",
  on = true,
}: IP & { on?: boolean }) =>
  on ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
export const IBeam = ({
  size = 18,
  color = "currentColor",
  on = true,
}: IP & { on?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r={on ? 3.5 : 2}
      fill={on ? color : "none"}
    />
    {on && (
      <>
        <line
          x1="12"
          y1="2"
          x2="12"
          y2="5.5"
          strokeWidth={1.5}
        />
        <line
          x1="12"
          y1="18.5"
          x2="12"
          y2="22"
          strokeWidth={1.5}
        />
        <line
          x1="2"
          y1="12"
          x2="5.5"
          y2="12"
          strokeWidth={1.5}
        />
        <line
          x1="18.5"
          y1="12"
          x2="22"
          y2="12"
          strokeWidth={1.5}
        />
      </>
    )}
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// NUMERIC KEYPAD
// ═══════════════════════════════════════════════════════════════════════════════

export function NumericKeypad({
  label,
  unit,
  value,
  min,
  max,
  step,
  onConfirm,
  onCancel,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onConfirm: (v: number) => void;
  onCancel: () => void;
}) {
  const [raw, setRaw] = useState(fmt(value, step));
  const press = (k: string) => {
    if (k === "⌫") {
      setRaw((p) => (p.length > 1 ? p.slice(0, -1) : "0"));
      return;
    }
    if (k === "." && raw.includes(".")) return;
    if (k === ".") {
      setRaw((p) => p + ".");
      return;
    }
    setRaw((p) => (p === "0" ? k : p.length >= 6 ? p : p + k));
  };
  const confirm = () =>
    onConfirm(
      clamp(snap(parseFloat(raw) || 0, step), min, max),
    );
  const pct =
    (clamp(snap(parseFloat(raw) || 0, step), min, max) - min) /
    (max - min);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(6,10,20,0.9)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 8 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 296,
          borderRadius: 20,
          overflow: "hidden",
          background: C.card,
          border: `1px solid ${C.borderMd}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 8,
            }}
          >
            {label}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 40,
                fontWeight: 500,
                color: C.text,
                lineHeight: 1,
                letterSpacing: "-1px",
              }}
            >
              {raw}
            </span>
            <span style={{ fontSize: 14, color: C.textMuted }}>
              {unit}
            </span>
          </div>
          <div
            style={{
              marginTop: 12,
              height: 3,
              borderRadius: 2,
              background: C.textDim,
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 0.15 }}
              style={{
                height: "100%",
                background: C.blue,
                borderRadius: 2,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
              fontSize: 10,
              color: C.textMuted,
            }}
          >
            <span>{fmt(min, step)}</span>
            <span>
              {fmt(max, step)} {unit}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 8,
            padding: "16px 16px 8px",
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
            <button
              key={k}
              onClick={() => press(k)}
              style={{
                height: 52,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: k === "⌫" ? C.textSub : C.text,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 20,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {k}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "8px 16px 16px",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.textSub,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            style={{
              flex: 2,
              height: 48,
              borderRadius: 12,
              border: "none",
              background: C.blue,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LUMIX CO₂ HMI  (1024 × 768)
// Splash → Home → COS / FRX
// ═══════════════════════════════════════════════════════════════════════════════

type HMIScreen2 = "splash" | "home" | "cos" | "frx";
type LaserState2 = "standby" | "ready" | "lasering" | "paused";

interface HMIState2 {
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

const HMI2_DEFAULT: HMIState2 = {
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
const H = {
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
const LAYOUT = {
  // ── 캔버스 (DGUS 해상도) ──────────────────────────────────────────────────────
  canvasW: 1024, // DGUS 화면 가로 (px)
  canvasH: 768, // DGUS 화면 세로 (px) ← 600→768

  // ── TopBar ────────────────────────────────────────────────────────────────────
  topbarHeight: 58, // 상단 바 높이
  topbarPadX: 18, // 상단 바 좌우 패딩
  topbarGap: 12, // 상단 바 아이템 간격

  // ── TopBar 버튼 (Sound / Aiming) ──────────────────────────────────────────────
  topBtnHeight: 38, // 버튼 높이
  topBtnPadX: 14, // 버튼 좌우 패딩
  topBtnRadius: 9, // 버튼 모서리

  // ── Aiming 드롭다운 ───────────────────────────────────────────────────────────
  aimDropTop: 58, // topbar 기준 top 위치
  aimDropRight: 63, // 우측 여백
  aimDropWidth: 145, // 드롭다운 너비
  aimDropItemHeight: 42, // 항목 높이
  aimDropRadius: 12, // 모서리

  // ── Left panel (COS / FRX) ────────────────────────────────────────────────────
  cosPanelWidth: 350, // COS 좌측 패널 너비
  frxPanelWidth: 370, // FRX 좌측 패널 너비
  panelPadX: 16, // 패널 내부 좌우 패딩
  panelPadY: 14, // 패널 내부 상하 패딩

  // ── Laser bar (하단 고정) ─────────────────────────────────────────────────────
  laserBarHeight: 100, // 레이저 바 전체 높이 (768 여유분 반영)
  laserBtnWidth: 420, // 레이저 버튼 너비
  laserBtnHeight: 64, // 레이저 버튼 높이
  laserBtnRadius: 14, // 레이저 버튼 모서리

  // ── Param column ──────────────────────────────────────────────────────────────
  paramAdjBtnSize: 36, // +/- 버튼 크기
  paramValueSize: 26, // 수치 폰트 크기

  // ── Mode / Shape 버튼 ─────────────────────────────────────────────────────────
  modeBtnHeight: 88, // 모드 버튼 높이
  shapeBtnHeight: 76, // 쉐이프 버튼 높이

  // ── 오버레이 팝업 ──────────────────────────────────────────────────────────────
  overlayWidth: 520, // 팝업 너비
  overlayRadius: 20, // 팝업 모서리
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
}: {
  label: string;
  value: string | number;
  unit: string;
  onDec: () => void;
  onInc: () => void;
  locked: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 110,
        gap: 0,
      }}
    >
      <button
        onClick={onInc}
        disabled={locked}
        style={{
          width: "100%",
          height: 36,
          borderRadius: "10px 10px 0 0",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.05)",
          color: locked ? "#1e3050" : "#8ab0d8",
          fontSize: 22,
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
          padding: "12px 0",
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
              fontSize: 30,
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
              fontSize: 12,
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
          height: 36,
          borderRadius: "0 0 10px 10px",
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.05)",
          color: locked ? "#1e3050" : "#8ab0d8",
          fontSize: 22,
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
        fontSize: 12,
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
function HLaserBar({
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
      glow: string;
    };
  } = {
    standby: {
      label: "STANDBY",
      sub: "대기 중 · 레이저 비활성",
      bg: "rgba(34,197,94,0.10)",
      border: "#22c55e",
      color: "#4ade80",
      glow: "none",
    },
    ready: {
      label: "READY",
      sub: "발사 준비 완료 · 풋스위치 대기",
      bg: "rgba(249,115,22,0.18)",
      border: "#f97316",
      color: "#fdba74",
      glow: "0 0 28px rgba(249,115,22,0.45)",
    },
    lasering: {
      label: "LASER EMISSION",
      sub: "레이저 조사 중",
      bg: "rgba(234,179,8,0.18)",
      border: "#eab308",
      color: "#fde047",
      glow: "0 0 36px rgba(234,179,8,0.55)",
    },
    paused: {
      label: "PAUSED",
      sub: "일시 정지 · 탭하여 재개",
      bg: "rgba(34,197,94,0.10)",
      border: "#4ade80",
      color: "#86efac",
      glow: "none",
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
          boxShadow: c.glow,
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
            fontSize: 10,
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
function HTopBar({
  mode,
  onBack,
  soundOn,
  aimingLevel,
  onSound,
  onAiming,
}: {
  mode: "cos" | "frx" | null;
  onBack?: () => void;
  soundOn: boolean;
  aimingLevel: 0 | 1 | 2 | 3 | 4 | 5;
  onSound: () => void;
  onAiming: (l: 0 | 1 | 2 | 3 | 4 | 5) => void;
}) {
  const [clock, setClock] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      );
    }, 30000);
    return () => clearInterval(t);
  }, []);
  const [aimOpen, setAimOpen] = useState(false);
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
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            height: LAYOUT.topBtnHeight,
            padding: "0 16px",
            borderRadius: LAYOUT.topBtnRadius,
            border: `1px solid ${H.border}`,
            background: "rgba(255,255,255,0.04)",
            color: H.textSub,
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Home
        </button>
      )}
      <div
        style={{
          display: "flex",
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
            boxShadow: `0 0 8px ${H.green}`,
          }}
        />
        <span
          style={{
            fontSize: 15,
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
              fontSize: 11,
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
      {/* Sound button */}
      <button
        onClick={onSound}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: LAYOUT.topBtnHeight,
          padding: `0 ${LAYOUT.topBtnPadX}px`,
          borderRadius: LAYOUT.topBtnRadius,
          border: `1px solid ${soundOn ? H.border : "rgba(255,255,255,0.04)"}`,
          background: soundOn
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.02)",
          color: soundOn ? H.textSub : H.textDim,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.04em",
          flexShrink: 0,
          transition: "all 0.14s",
        }}
      >
        <svg
          width={15}
          height={15}
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: LAYOUT.topBtnHeight,
            padding: `0 ${LAYOUT.topBtnPadX}px`,
            borderRadius: LAYOUT.topBtnRadius,
            border: `1px solid ${aimActive ? "rgba(0,202,228,0.45)" : H.border}`,
            background: aimActive
              ? "rgba(0,202,228,0.08)"
              : "rgba(255,255,255,0.02)",
            color: aimActive ? H.cyan : H.textDim,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "all 0.14s",
          }}
        >
          <svg
            width={15}
            height={15}
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
          <span>Aiming</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
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
      <span
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 13,
          color: H.textSub,
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        {clock}
      </span>
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
              boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
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
                    fontSize: 12,
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
                        fontSize: 11,
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
function HMI2Splash({ onDone }: { onDone: () => void }) {
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
          width: 500,
          height: 500,
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
          gap: 32,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <HQTechLogo width={230} />
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
              fontSize: 11,
              color: H.textSub,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            CO₂ Laser System
          </div>
          <div
            style={{
              fontSize: 9,
              color: H.textDim,
              letterSpacing: "0.08em",
            }}
          >
            v3.3.0 &nbsp;·&nbsp; SN: LMX-2026-0847
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
            gap: 8,
          }}
        >
          <div
            style={{
              width: 220,
              height: 2,
              borderRadius: 2,
              background: H.textDim,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.6, ease: "easeInOut" }}
              style={{
                height: "100%",
                borderRadius: 2,
                background: `linear-gradient(90deg,${H.blue},${H.cyan})`,
              }}
            />
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{
              fontSize: 10,
              color: H.textSub,
              letterSpacing: "0.1em",
            }}
          >
            Initializing…
          </motion.div>
        </motion.div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          display: "flex",
          gap: 16,
          fontSize: 9,
          color: H.textDim,
          letterSpacing: "0.06em",
        }}
      >
        <span>IEC 60825-1 Class IV</span>
        <span>·</span>
        <span>CE FDA ISO 13485</span>
        <span>·</span>
        <span>© 2026 Q-TECH Medical</span>
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
function HMI2Home({
  onCOS,
  onFRX,
}: {
  onCOS: () => void;
  onFRX: () => void;
}) {
  const [hov, setHov] = useState<string | null>(null);
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
          width={24}
          height={24}
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
          width={24}
          height={24}
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
        background: H.bg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 46,
          display: "flex",
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
        <span style={{ fontSize: 13, color: H.textSub }}>
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
              boxShadow: `0 0 8px ${H.green}`,
            }}
          />
          <span
            style={{
              fontSize: 12,
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
          gap: 80,
          padding: "0 160px",
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
            return (
              <button
                key={id}
                onClick={onClick}
                onMouseEnter={() => setHov(id)}
                onMouseLeave={() => setHov(null)}
                style={{
                  flex: 1,
                  height: 340,
                  borderRadius: 18,
                  border: `1px solid ${isHov ? color + "55" : H.border}`,
                  background: isHov
                    ? `linear-gradient(145deg,#132040 0%,#0e1a32 100%)`
                    : `linear-gradient(145deg,${H.card} 0%,#0e1828 100%)`,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "30px 30px 26px",
                  transition: "all 0.18s",
                  boxShadow: isHov
                    ? `0 0 0 1px ${color}22,0 20px 56px rgba(0,0,0,0.55)`
                    : "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 13,
                      background: `${color}18`,
                      border: `1px solid ${color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 22,
                    }}
                  >
                    {icon}
                  </div>
                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 800,
                      color: color,
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                      marginBottom: 10,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: H.text,
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {sub}
                  </div>
                  <div
                    style={{ fontSize: 11, color: H.textSub }}
                  >
                    {detail}
                  </div>
                </div>
              </button>
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
        fontSize: 11,
        color: H.textSub,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        fontWeight: 700,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 2,
          height: 12,
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
}: {
  label?: string;
}) {
  return (
    <div
      style={{
        padding: "14px 28px 12px",
        borderBottom: `1px solid ${H.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 4,
          height: 18,
          borderRadius: 2,
          background: H.blue,
        }}
      />
      <span
        style={{
          fontSize: 14,
          color: H.text,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 700,
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
        fontSize: 11,
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
        gap: 8,
        transition: "all 0.14s",
        boxShadow: active ? `0 0 16px ${color}22` : "none",
      }}
    >
      <div
        style={{
          opacity: active ? 1 : 0.45,
          transform: active ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.14s",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: active ? 700 : 500,
          letterSpacing: "0.08em",
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
function HMI2COS({
  s,
  upd,
  onMenu,
}: {
  s: HMIState2;
  upd: (p: Partial<HMIState2>) => void;
  onMenu: (k: "memo" | "call" | "save") => void;
}) {
  const locked = s.laserState === "lasering";

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
          width: 350,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${H.border}`,
        }}
      >
        {/* MEMO / CALL / SAVE */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "14px 16px",
            borderBottom: `1px solid ${H.border}`,
          }}
        >
          <HMemBtn
            label="MEMO"
            on={false}
            onClick={() => onMenu("memo")}
          />
          <HMemBtn
            label="CALL"
            on={false}
            onClick={() => onMenu("call")}
          />
          <HMemBtn
            label="SAVE"
            on={false}
            onClick={() => onMenu("save")}
          />
        </div>
        {/* LASER MODE */}
        <div
          style={{
            padding: "18px 16px",
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
        <div style={{ padding: "18px 16px", flex: 1 }}>
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
                color={H.blue}
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
        <HParamsHeader />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "16px 24px",
            gap: 16,
          }}
        >
          <HParamCol
            label="Power"
            value={s.co2Power}
            unit="W"
            locked={locked}
            onDec={() =>
              upd({
                co2Power: adjVal(s.co2Power, -1, 1, 60, 1),
              })
            }
            onInc={() =>
              upd({ co2Power: adjVal(s.co2Power, 1, 1, 60, 1) })
            }
          />
          <HParamCol
            label="Duration"
            value={s.co2Duration.toFixed(1)}
            unit="ms"
            locked={locked}
            onDec={() =>
              upd({
                co2Duration: adjVal(
                  s.co2Duration,
                  -0.1,
                  0.1,
                  10,
                  0.1,
                ),
              })
            }
            onInc={() =>
              upd({
                co2Duration: adjVal(
                  s.co2Duration,
                  0.1,
                  0.1,
                  10,
                  0.1,
                ),
              })
            }
          />
          <HParamCol
            label="Interval"
            value={s.co2Interval}
            unit="ms"
            locked={locked}
            onDec={() =>
              upd({
                co2Interval: adjVal(
                  s.co2Interval,
                  -1,
                  1,
                  100,
                  1,
                ),
              })
            }
            onInc={() =>
              upd({
                co2Interval: adjVal(
                  s.co2Interval,
                  1,
                  1,
                  100,
                  1,
                ),
              })
            }
          />
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
function HMI2FRX({
  s,
  upd,
  onMenu,
}: {
  s: HMIState2;
  upd: (p: Partial<HMIState2>) => void;
  onMenu: (k: "memo" | "call" | "save") => void;
}) {
  const locked = s.laserState === "lasering";

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
          width: 370,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${H.border}`,
        }}
      >
        {/* MEMO / CALL / SAVE */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "14px 16px",
            borderBottom: `1px solid ${H.border}`,
          }}
        >
          <HMemBtn
            label="MEMO"
            on={false}
            onClick={() => onMenu("memo")}
          />
          <HMemBtn
            label="CALL"
            on={false}
            onClick={() => onMenu("call")}
          />
          <HMemBtn
            label="SAVE"
            on={false}
            onClick={() => onMenu("save")}
          />
        </div>
        {/* SHAPE */}
        <div
          style={{
            padding: "16px 16px 14px",
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
                    boxShadow: active
                      ? `0 0 14px ${H.blue}22`
                      : "none",
                  }}
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  >
                    {svg}
                  </svg>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.05em",
                      fontWeight: active ? 700 : 400,
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
            padding: "16px 16px",
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
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: H.textSub,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                }}
              >
                {lbl}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <button
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
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: `1px solid ${H.border}`,
                    background: "rgba(255,255,255,0.04)",
                    color: "#7a9bbf",
                    fontSize: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>
                <div
                  style={{ textAlign: "center", minWidth: 52 }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 24,
                      fontWeight: 500,
                      color: H.text,
                    }}
                  >
                    {s[key] as number}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: H.textSub,
                      marginLeft: 3,
                    }}
                  >
                    {unit}
                  </span>
                </div>
                <button
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
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: `1px solid ${H.border}`,
                    background: "rgba(255,255,255,0.04)",
                    color: "#7a9bbf",
                    fontSize: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
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
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "12px 16px",
            gap: 10,
          }}
        >
          <HParamCol
            label="Power"
            value={s.frxPower}
            unit="W"
            locked={locked}
            onDec={() =>
              upd({
                frxPower: adjVal(s.frxPower, -1, 1, 60, 1),
              })
            }
            onInc={() =>
              upd({ frxPower: adjVal(s.frxPower, 1, 1, 60, 1) })
            }
          />
          <HParamCol
            label="Duration"
            value={s.frxDuration.toFixed(1)}
            unit="ms"
            locked={locked}
            onDec={() =>
              upd({
                frxDuration: adjVal(
                  s.frxDuration,
                  -0.1,
                  0.1,
                  5,
                  0.1,
                ),
              })
            }
            onInc={() =>
              upd({
                frxDuration: adjVal(
                  s.frxDuration,
                  0.1,
                  0.1,
                  5,
                  0.1,
                ),
              })
            }
          />
          <HParamCol
            label="Degree"
            value={s.frxDegree}
            unit=""
            locked={locked}
            onDec={() =>
              upd({
                frxDegree: adjVal(s.frxDegree, -1, 1, 10, 1),
              })
            }
            onInc={() =>
              upd({
                frxDegree: adjVal(s.frxDegree, 1, 1, 10, 1),
              })
            }
          />
          <HParamCol
            label="Density"
            value={s.frxDensity.toFixed(1)}
            unit="mm"
            locked={locked}
            onDec={() =>
              upd({
                frxDensity: adjVal(
                  s.frxDensity,
                  -0.1,
                  0.1,
                  5,
                  0.1,
                ),
              })
            }
            onInc={() =>
              upd({
                frxDensity: adjVal(
                  s.frxDensity,
                  0.1,
                  0.1,
                  5,
                  0.1,
                ),
              })
            }
          />
          <HParamCol
            label="Pause"
            value={s.frxPauseTime.toFixed(1)}
            unit="sec"
            locked={locked}
            onDec={() =>
              upd({
                frxPauseTime: adjVal(
                  s.frxPauseTime,
                  -0.1,
                  0.1,
                  5,
                  0.1,
                ),
              })
            }
            onInc={() =>
              upd({
                frxPauseTime: adjVal(
                  s.frxPauseTime,
                  0.1,
                  0.1,
                  5,
                  0.1,
                ),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

// ── Overlay modal shell ───────────────────────────────────────────────────────
function HModal({
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
          boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
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
                fontSize: 10,
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
function HMemoModal({ onClose }: { onClose: () => void }) {
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
                  fontSize: 9,
                  color: H.textSub,
                  marginBottom: 4,
                  letterSpacing: "0.06em",
                }}
              >
                {m.date}
              </div>
              <div
                style={{
                  fontSize: 12,
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
                fontSize: 12,
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
            fontSize: 12,
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
            fontSize: 12,
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
const HPRESETS = [
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
function HCallModal({
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
                    fontSize: 11,
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
                    fontSize: 13,
                    fontWeight: 600,
                    color: isS ? H.text : "#8ab0d8",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: H.textSub,
                    marginTop: 2,
                  }}
                >
                  {p.desc}
                </div>
              </div>
              <div
                style={{
                  fontSize: 10,
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
          fontSize: 13,
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
function HSaveModal({
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
            <div style={{ fontSize: 12, color: H.textSub }}>
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
              fontSize: 12,
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
                fontSize: 10,
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
                fontSize: 13,
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
                fontSize: 10,
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
                      fontSize: 9,
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
              fontSize: 13,
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
function HMIRoot2() {
  const [s, setS] = useState<HMIState2>(HMI2_DEFAULT);
  const upd = (patch: Partial<HMIState2>) =>
    setS((prev) => ({ ...prev, ...patch }));
  const [overlay, setOverlay] = useState<
    null | "memo" | "call" | "save"
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
      {s.screen !== "splash" && (
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
        </AnimatePresence>
      </div>
      {/* end content area */}
    </div>
  );
}

// ── (legacy HMI kept below for DOC_SCREENS references, not rendered) ─────────

export function HMIStatusBar({
  mode,
  screen,
  clock,
  laserState,
  onBack,
}: {
  mode: TreatmentMode | null;
  screen: HMIScreen;
  clock: string;
  laserState?: LaserState;
  onBack?: () => void;
}) {
  const showBack = [
    "treatment",
    "history",
    "favorites",
    "settings",
    "finish",
  ].includes(screen);
  const firing = laserState === "lasering";
  return (
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        flexShrink: 0,
        background: "rgba(10,16,30,0.92)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 180,
        }}
      >
        {showBack ? (
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 28,
              padding: "0 12px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.textSub,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 9 }}>◀</span> Home
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                background: C.green,
                boxShadow: `0 0 7px ${C.green}`,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                letterSpacing: "0.1em",
              }}
            >
              FRACTIO CO₂
            </span>
          </div>
        )}
        {mode && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "2px 8px",
              borderRadius: 6,
              background: MODE_META[mode].dim,
              border: `1px solid ${MODE_META[mode].ring}`,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                background: MODE_META[mode].color,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: MODE_META[mode].color,
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              {mode} MODE
            </span>
          </div>
        )}
        {firing && (
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            style={{
              fontSize: 10,
              color: C.red,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            ● LASER ON
          </motion.div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: C.textMuted,
        }}
      >
        <IPatient size={12} color={C.textMuted} />
        <span style={{ fontSize: 11 }}>
          Dr. Kim · Lee, Ji-Young (42F) · Session #3
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 180,
          justifyContent: "flex-end",
        }}
      >
        <IWifi size={13} color={C.green} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div
            style={{
              width: 22,
              height: 11,
              borderRadius: 2,
              border: `1px solid ${C.textDim}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 2,
                top: 2,
                bottom: 2,
                width: "72%",
                background: C.green,
                borderRadius: 1,
              }}
            />
          </div>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11,
            color: C.textSub,
          }}
        >
          {clock}
        </span>
      </div>
    </div>
  );
}

export function HMIParamRow({
  def,
  value,
  accent = C.blue,
  disabled,
  onDec,
  onInc,
  onTap,
}: {
  def: ParamDef;
  value: number;
  accent?: string;
  disabled?: boolean;
  onDec: () => void;
  onInc: () => void;
  onTap: () => void;
}) {
  const atMin = value <= def.min,
    atMax = value >= def.max,
    pct = (value - def.min) / (def.max - def.min);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 52,
        padding: "0 12px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.border}`,
        opacity: disabled ? 0.38 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <div style={{ width: 80, flexShrink: 0 }}>
        <div
          style={{
            fontSize: 10,
            color: C.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          {def.label}
        </div>
        <div
          style={{
            height: 2,
            borderRadius: 1,
            background: C.textDim,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct * 100}%`,
              background: accent,
              borderRadius: 1,
              transition: "width 0.15s",
            }}
          />
        </div>
      </div>
      <button
        onClick={onDec}
        disabled={disabled || atMin}
        style={{
          width: 48,
          height: 40,
          borderRadius: 10,
          flexShrink: 0,
          border: `1px solid ${C.border}`,
          background: C.surface,
          color: atMin || disabled ? C.textDim : C.textSub,
          fontSize: 24,
          cursor: disabled || atMin ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        −
      </button>
      <button
        onClick={onTap}
        disabled={disabled}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 5,
          cursor: disabled ? "default" : "pointer",
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 30,
            fontWeight: 600,
            color: C.text,
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          {fmt(value, def.step)}
        </span>
        <span
          style={{
            fontSize: 12,
            color: C.textMuted,
            marginBottom: 2,
          }}
        >
          {def.unit}
        </span>
      </button>
      <button
        onClick={onInc}
        disabled={disabled || atMax}
        style={{
          width: 48,
          height: 40,
          borderRadius: 10,
          flexShrink: 0,
          border: `1px solid ${atMax || disabled ? C.border : C.blueRing}`,
          background: atMax || disabled ? C.surface : C.blueDim,
          color: atMax || disabled ? C.textDim : accent,
          fontSize: 24,
          cursor: disabled || atMax ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>
    </div>
  );
}

export function HMILaserButton({
  state,
  onPress,
}: {
  state: LaserState;
  onPress: () => void;
}) {
  const cfg = {
    standby: {
      bg: "rgba(255,255,255,0.04)",
      border: C.border,
      color: C.textSub,
      glow: "none",
      icon: <IShield size={24} color={C.textSub} />,
      label: "STANDBY",
      sub: "Tap to prepare system",
    },
    ready: {
      bg: C.blueDim,
      border: C.blueRing,
      color: C.blue,
      glow: `0 0 32px rgba(46,130,255,0.3)`,
      icon: <IPlay size={22} color={C.blue} />,
      label: "READY",
      sub: "Tap to begin laser emission",
    },
    lasering: {
      bg: C.redDim,
      border: C.redRing,
      color: C.red,
      glow: `0 0 40px rgba(239,68,68,0.38), 0 0 90px rgba(239,68,68,0.12)`,
      icon: <IPause size={22} color={C.red} />,
      label: "LASER ON",
      sub: "Tap to pause  ·  Hold 2s to stop",
    },
    paused: {
      bg: C.amberDim,
      border: C.amberRing,
      color: C.amber,
      glow: `0 0 28px rgba(245,158,11,0.22)`,
      icon: <IPlay size={22} color={C.amber} />,
      label: "PAUSED",
      sub: "Tap to resume emission",
    },
  }[state];
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      style={{
        flex: 1,
        height: 84,
        borderRadius: 16,
        background: cfg.bg,
        border: `2px solid ${cfg.border}`,
        boxShadow: cfg.glow,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        transition:
          "background 0.25s,border 0.25s,box-shadow 0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {state === "lasering" && (
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.65 }}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: C.red,
            }}
          />
        )}
        {cfg.icon}
        <span
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: cfg.color,
            letterSpacing: "0.16em",
          }}
        >
          {cfg.label}
        </span>
        {state === "lasering" && (
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{
              repeat: Infinity,
              duration: 0.65,
              delay: 0.33,
            }}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: C.red,
            }}
          />
        )}
      </div>
      <span
        style={{ fontSize: 11, color: cfg.color, opacity: 0.6 }}
      >
        {cfg.sub}
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HMI SCREENS  (1024×768)
// ═══════════════════════════════════════════════════════════════════════════════

export function HMISplash() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: C.bg,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 90,
            height: 90,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              background: C.blueDim,
              border: `1px solid ${C.blueRing}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ILaser
              size={38}
              color={C.blue}
              strokeWidth={1.5}
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: "1.5px solid transparent",
              borderTopColor: C.blue,
              borderRightColor: `rgba(46,130,255,0.25)`,
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              inset: -20,
              borderRadius: "50%",
              border: "1px solid transparent",
              borderTopColor: `rgba(46,130,255,0.2)`,
              borderLeftColor: `rgba(0,202,228,0.2)`,
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.14em",
              marginBottom: 6,
            }}
          >
            FRACTIO
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.textMuted,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            CO₂ Fractional Laser System
          </div>
          <div
            style={{
              fontSize: 10,
              color: C.textDim,
              marginTop: 6,
            }}
          >
            v3.2.1 · SN: FRX-2026-0847
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 220,
              height: 2,
              borderRadius: 2,
              background: C.textDim,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.6, ease: "easeInOut" }}
              style={{
                height: "100%",
                borderRadius: 2,
                background: `linear-gradient(90deg,${C.blue},${C.cyan})`,
              }}
            />
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ fontSize: 10, color: C.textMuted }}
          >
            Initializing system…
          </motion.div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 22,
          display: "flex",
          gap: 20,
          fontSize: 10,
          color: C.textDim,
        }}
      >
        <span>IEC 60825-1 Class IV</span>
        <span>·</span>
        <span>CE FDA ISO 13485</span>
        <span>·</span>
        <span>© 2026 Fractio Medical</span>
      </div>
    </div>
  );
}

export function HMIPassword({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const press = (k: string) => {
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      if (next === "1234") {
        setTimeout(onUnlock, 280);
      } else {
        setTimeout(() => {
          setPin("");
          setError(true);
          setTimeout(() => setError(false), 1200);
        }, 300);
      }
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: C.bg,
        gap: 32,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <IShield size={28} color={C.textMuted} />
        <div
          style={{
            fontSize: 13,
            color: C.textSub,
            marginTop: 10,
            fontWeight: 500,
          }}
        >
          Enter PIN to unlock
        </div>
        <div
          style={{
            fontSize: 10,
            color: C.textMuted,
            marginTop: 2,
          }}
        >
          Default: 1234
        </div>
      </div>
      <motion.div
        animate={error ? { x: [0, 10, -10, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", gap: 16 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: pin.length > i ? 1.1 : 1 }}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background:
                pin.length > i
                  ? error
                    ? C.red
                    : C.blue
                  : "transparent",
              border: `2px solid ${pin.length > i ? (error ? C.red : C.blue) : C.textDim}`,
              transition: "background 0.15s,border 0.15s",
            }}
          />
        ))}
      </motion.div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        {[
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "",
          "0",
          "⌫",
        ].map((k, i) => (
          <button
            key={i}
            onClick={() =>
              k === "⌫"
                ? setPin((p) => p.slice(0, -1))
                : k
                  ? press(k)
                  : undefined
            }
            style={{
              width: 72,
              height: 58,
              borderRadius: 14,
              border: k ? `1px solid ${C.borderMd}` : "none",
              background: k ? C.card : "transparent",
              color: k === "⌫" ? C.textSub : C.text,
              fontSize: k === "⌫" ? 18 : 22,
              fontWeight: 500,
              cursor: k ? "pointer" : "default",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HMIHome({
  onMode,
  onHistory,
  onFavorites,
  onSettings,
}: {
  onMode: (m: TreatmentMode) => void;
  onHistory: () => void;
  onFavorites: () => void;
  onSettings: () => void;
}) {
  return (
    <div
      style={{
        padding: "24px 36px 20px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Patient header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          paddingBottom: 18,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(46,130,255,0.1)",
              border: `1px solid ${C.blueRing}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IPatient size={22} color={C.blue} />
          </div>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: C.text,
                letterSpacing: "-0.02em",
              }}
            >
              Lee, Ji-Young
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.textSub,
                marginTop: 3,
              }}
            >
              42F · DOB: 1983.11.14 · Session #3 · Dr. Kim
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 10,
              background: C.greenDim,
              border: `1px solid ${C.greenRing}`,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                background: C.green,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: C.green,
                fontWeight: 600,
              }}
            >
              SYSTEM READY
            </span>
          </div>
        </div>
      </div>
      {/* 4 mode cards in a row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 14,
          flex: 1,
          maxHeight: 280,
        }}
      >
        {(
          ["FRX", "CW", "Pulse", "Normal"] as TreatmentMode[]
        ).map((m) => {
          const meta = MODE_META[m];
          return (
            <motion.button
              key={m}
              whileTap={{ scale: 0.97 }}
              onClick={() => onMode(m)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px 22px",
                borderRadius: 18,
                textAlign: "left",
                background: meta.dim,
                border: `1px solid ${meta.ring}`,
                cursor: "pointer",
              }}
            >
              <div>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: `${meta.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <ILaser size={20} color={meta.color} />
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: meta.color,
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  {m}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textSub,
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {meta.desc}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: `${meta.color}70`,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: 12,
                }}
              >
                Tap to select →
              </div>
            </motion.button>
          );
        })}
      </div>
      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          {[
            {
              label: "History",
              icon: <IHistory size={15} color={C.textSub} />,
              action: onHistory,
            },
            {
              label: "Favorites",
              icon: <IStar size={15} color={C.textSub} />,
              action: onFavorites,
            },
            {
              label: "Settings",
              icon: <ISettings size={15} color={C.textSub} />,
              action: onSettings,
            },
          ].map(({ label, icon, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                height: 48,
                padding: "0 22px",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: C.textSub,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            ["Laser Tube", "OK", true],
            ["Temp", "24.3°C", true],
            ["Pressure", "0.8 bar", true],
            ["Tube Life", "41%", true],
          ].map(([k, v, ok]) => (
            <div
              key={k as string}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: ok ? C.green : C.red,
                }}
              />
              <span
                style={{ fontSize: 11, color: C.textMuted }}
              >
                {k}:{" "}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: ok ? C.textSub : C.red,
                }}
              >
                {v as string}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HMITreatment({
  mode,
  params,
  laserState,
  shots,
  elapsed,
  soundOn,
  beamOn,
  patternIdx,
  onChange,
  onEdit,
  onMode,
  onLaser,
  onSound,
  onBeam,
  onPattern,
  onEmergency,
}: {
  mode: TreatmentMode;
  params: TreatmentParams;
  laserState: LaserState;
  shots: number;
  elapsed: number;
  soundOn: boolean;
  beamOn: boolean;
  patternIdx: number;
  onChange: (k: keyof TreatmentParams, v: number) => void;
  onEdit: (d: ParamDef, v: number) => void;
  onMode: (m: TreatmentMode) => void;
  onLaser: () => void;
  onSound: () => void;
  onBeam: () => void;
  onPattern: (i: number) => void;
  onEmergency: () => void;
}) {
  const defs = PARAM_DEFS[mode],
    meta = MODE_META[mode],
    firing = laserState === "lasering";
  const modes: TreatmentMode[] = [
    "FRX",
    "CW",
    "Pulse",
    "Normal",
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* LEFT: Mode + Pattern */}
        <div
          style={{
            width: 200,
            flexShrink: 0,
            padding: "14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            borderRight: `1px solid ${C.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 10,
              }}
            >
              Mode
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {modes.map((m) => {
                const mm = MODE_META[m],
                  sel = m === mode;
                return (
                  <button
                    key={m}
                    onClick={() => !firing && onMode(m)}
                    disabled={firing}
                    style={{
                      height: 40,
                      borderRadius: 11,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "0 12px",
                      background: sel
                        ? mm.dim
                        : "rgba(255,255,255,0.018)",
                      border: `1px solid ${sel ? mm.ring : C.border}`,
                      color: sel ? mm.color : C.textSub,
                      fontSize: 13,
                      fontWeight: sel ? 600 : 400,
                      cursor: firing
                        ? "not-allowed"
                        : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        background: sel ? mm.color : C.textDim,
                        flexShrink: 0,
                      }}
                    />
                    {m}
                    {sel && (
                      <span
                        style={{
                          fontSize: 10,
                          marginLeft: "auto",
                          color: `${mm.color}80`,
                        }}
                      >
                        {mm.desc.split(" ")[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {mode === "FRX" && (
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 10,
                }}
              >
                Pattern
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 5,
                }}
              >
                {FRX_PATTERNS.map((pat, i) => {
                  const sel = i === patternIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => !firing && onPattern(i)}
                      disabled={firing}
                      style={{
                        height: 46,
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        background: sel ? C.blueDim : C.surface,
                        border: `1px solid ${sel ? C.blueRing : C.border}`,
                        cursor: firing
                          ? "not-allowed"
                          : "pointer",
                        padding: "5px 4px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3,1fr)",
                          gap: 2.5,
                        }}
                      >
                        {pat.map((on, j) => (
                          <div
                            key={j}
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 1,
                              background: on
                                ? sel
                                  ? C.blue
                                  : C.textMuted
                                : "transparent",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          fontSize: 7,
                          color: sel ? C.blue : C.textMuted,
                          lineHeight: 1,
                        }}
                      >
                        {PATTERN_LABELS[i]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div
            style={{
              marginTop: "auto",
              padding: "14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.018)",
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Session
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 30,
                fontWeight: 500,
                color: C.text,
                lineHeight: 1,
              }}
            >
              {String(shots).padStart(3, "0")}
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.textMuted,
                marginBottom: 10,
              }}
            >
              shots
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 20,
                color: firing ? C.red : C.textSub,
              }}
            >
              {fmtTime(elapsed)}
            </div>
            <div style={{ fontSize: 10, color: C.textMuted }}>
              elapsed
            </div>
          </div>
        </div>
        {/* CENTER: 2-col params */}
        <div
          style={{
            flex: 1,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 2,
            }}
          >
            Parameters — {mode}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              flex: 1,
            }}
          >
            {defs.map((def) => (
              <HMIParamRow
                key={def.key}
                def={def}
                value={params[def.key]}
                accent={meta.color}
                disabled={firing}
                onDec={() =>
                  onChange(
                    def.key,
                    clamp(
                      snap(
                        params[def.key] - def.step,
                        def.step,
                      ),
                      def.min,
                      def.max,
                    ),
                  )
                }
                onInc={() =>
                  onChange(
                    def.key,
                    clamp(
                      snap(
                        params[def.key] + def.step,
                        def.step,
                      ),
                      def.min,
                      def.max,
                    ),
                  )
                }
                onTap={() =>
                  !firing && onEdit(def, params[def.key])
                }
              />
            ))}
          </div>
        </div>
        {/* RIGHT: controls */}
        <div
          style={{
            width: 186,
            flexShrink: 0,
            padding: "14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            borderLeft: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              minHeight: 80,
              background: firing
                ? C.redDim
                : "rgba(255,255,255,0.018)",
              border: `1px solid ${firing ? C.redRing : C.border}`,
              transition: "all 0.3s",
            }}
          >
            {firing ? (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                <ILaser size={24} color={C.red} />
              </motion.div>
            ) : (
              <ILaser size={24} color={C.textDim} />
            )}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: firing ? C.red : C.textMuted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {laserState}
            </div>
          </div>
          {[
            {
              icon: (
                <ISound
                  size={15}
                  color={soundOn ? C.green : C.textMuted}
                  on={soundOn}
                />
              ),
              label: `Sound ${soundOn ? "On" : "Off"}`,
              active: soundOn,
              c: C.green,
              dim: C.greenDim,
              ring: C.greenRing,
              action: onSound,
            },
            {
              icon: (
                <IBeam
                  size={15}
                  color={beamOn ? C.cyan : C.textMuted}
                  on={beamOn}
                />
              ),
              label: `Aiming ${beamOn ? "On" : "Off"}`,
              active: beamOn,
              c: C.cyan,
              dim: C.cyanDim,
              ring: "rgba(0,202,228,0.3)",
              action: onBeam,
            },
          ].map(
            ({ icon, label, active, c, dim, ring, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  height: 44,
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 12px",
                  background: active ? dim : C.surface,
                  border: `1px solid ${active ? ring : C.border}`,
                  color: active ? c : C.textMuted,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 500,
                  transition: "all 0.15s",
                }}
              >
                {icon}
                {label}
              </button>
            ),
          )}
          <div
            style={{
              height: 44,
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 12px",
              background: "rgba(255,255,255,0.018)",
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                background: C.green,
              }}
            />
            <span style={{ fontSize: 11, color: C.textSub }}>
              Foot OK
            </span>
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 11,
              background: "rgba(255,255,255,0.018)",
              border: `1px solid ${C.border}`,
              flex: 1,
            }}
          >
            {[
              ["Temp", "24.3 °C"],
              ["Tube", "97%"],
              ["Life", "1,240 h"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 7,
                }}
              >
                <span
                  style={{ fontSize: 11, color: C.textMuted }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: C.textSub,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={onEmergency}
            style={{
              height: 54,
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              background: C.redDim,
              border: `2px solid ${C.redRing}`,
              color: C.red,
              cursor: "pointer",
            }}
          >
            <IStop size={18} color={C.red} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              E-STOP
            </span>
          </button>
        </div>
      </div>
      {/* BOTTOM: laser button */}
      <div
        style={{
          height: 96,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 20px",
          borderTop: `1px solid ${C.border}`,
          background: `rgba(10,16,28,0.8)`,
        }}
      >
        <div
          style={{
            width: 180,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {[
            [
              firing ? "● Laser Emitting" : "○ System Ready",
              firing ? C.red : C.green,
            ],
            ["24.3°C · 0.8 bar", C.textMuted],
            [`${shots} / 500 shots`, C.textMuted],
          ].map(([t, c], i) => (
            <span
              key={i}
              style={{ fontSize: 11, color: c as string }}
            >
              {t as string}
            </span>
          ))}
        </div>
        <HMILaserButton state={laserState} onPress={onLaser} />
      </div>
    </div>
  );
}

export function HMIFinish({
  mode,
  shots,
  elapsed,
  params,
  onHome,
  onNewSession,
}: {
  mode: TreatmentMode;
  shots: number;
  elapsed: number;
  params: TreatmentParams;
  onHome: () => void;
  onNewSession: () => void;
}) {
  const defs = PARAM_DEFS[mode],
    meta = MODE_META[mode];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "24px 40px",
        gap: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
        }}
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: C.greenDim,
          border: `1px solid ${C.greenRing}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ICheck size={28} color={C.green} strokeWidth={2.5} />
      </motion.div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            color: C.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            marginBottom: 6,
          }}
        >
          Treatment Complete
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: C.text,
          }}
        >
          {mode} Session Summary
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.textSub,
            marginTop: 4,
          }}
        >
          Lee, Ji-Young ·{" "}
          {new Date().toLocaleDateString("en-GB")}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
        }}
      >
        {[
          {
            label: "Total Shots",
            value: String(shots),
            unit: "shots",
          },
          {
            label: "Duration",
            value: fmtTime(elapsed),
            unit: "mm:ss",
          },
          { label: "Mode", value: mode, unit: "protocol" },
        ].map(({ label, value, unit }) => (
          <div
            key={label}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: C.surface,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 22,
                fontWeight: 600,
                color: meta.color,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 10, color: C.textMuted }}>
              {unit}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {defs.slice(0, 4).map((d) => (
          <div
            key={d.key}
            style={{
              flex: "1 1 auto",
              padding: "8px 12px",
              borderRadius: 10,
              background: C.surface,
              border: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: 9, color: C.textMuted }}>
              {d.label}:{" "}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 12,
                color: C.textSub,
              }}
            >
              {fmt(params[d.key], d.step)} {d.unit}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          width: "100%",
          marginTop: 4,
        }}
      >
        <button
          onClick={onHome}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 13,
            border: `1px solid ${C.border}`,
            background: C.surface,
            color: C.textSub,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Home
        </button>
        <button
          onClick={onNewSession}
          style={{
            flex: 2,
            height: 50,
            borderRadius: 13,
            border: "none",
            background: C.blue,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          New Session
        </button>
      </div>
    </div>
  );
}

export function HMIHistory() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px 20px 14px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 12,
        }}
      >
        Treatment History
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: 1,
          overflowY: "auto",
        }}
      >
        {HISTORY_DATA.map((r) => {
          const meta = MODE_META[r.mode],
            isSel = sel === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSel(isSel ? null : r.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 58,
                padding: "0 16px",
                borderRadius: 13,
                border: `1px solid ${isSel ? meta.ring : C.border}`,
                background: isSel
                  ? meta.dim
                  : "rgba(255,255,255,0.018)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${meta.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: meta.color,
                  }}
                >
                  {r.mode}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.text,
                  }}
                >
                  {r.patient}{" "}
                  <span
                    style={{
                      color: C.textMuted,
                      fontWeight: 400,
                    }}
                  >
                    ({r.age})
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textSub,
                    marginTop: 1,
                  }}
                >
                  {r.date} {r.time} · {r.shots} shots ·{" "}
                  {r.duration}
                </div>
              </div>
              <div
                style={{ textAlign: "right", flexShrink: 0 }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 15,
                    fontWeight: 600,
                    color: meta.color,
                  }}
                >
                  {r.energy}
                </div>
                <div
                  style={{ fontSize: 10, color: C.textMuted }}
                >
                  mJ/W
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {["Export PDF", "USB Export", "Print Report"].map(
          (label) => (
            <button
              key={label}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 11,
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: C.textSub,
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export function HMIFavorites({
  onLoad,
}: {
  onLoad: (m: TreatmentMode, p: TreatmentParams) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px 20px 14px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 12,
        }}
      >
        Saved Protocols
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        {FAVORITES_DATA.map((fav) => {
          const meta = MODE_META[fav.mode],
            defs = PARAM_DEFS[fav.mode];
          return (
            <div
              key={fav.id}
              style={{
                borderRadius: 14,
                border: `1px solid ${C.border}`,
                background: C.surface,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
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
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: meta.dim,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IStar
                      size={16}
                      color={meta.color}
                      filled
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.text,
                      }}
                    >
                      {fav.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.textSub,
                        marginTop: 1,
                      }}
                    >
                      {fav.mode} · {meta.desc}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onLoad(fav.mode, fav.params)}
                  style={{
                    height: 36,
                    padding: "0 16px",
                    borderRadius: 9,
                    border: "none",
                    background: meta.dim,
                    color: meta.color,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Load
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  padding: "0 16px 12px",
                }}
              >
                {defs.slice(0, 4).map((d) => (
                  <div
                    key={d.key}
                    style={{
                      flex: "1 1 auto",
                      padding: "5px 8px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: C.textMuted,
                        textTransform: "uppercase",
                      }}
                    >
                      {d.label}
                    </div>
                    <div
                      style={{
                        fontFamily:
                          "'JetBrains Mono',monospace",
                        fontSize: 12,
                        color: C.textSub,
                      }}
                    >
                      {fmt(fav.params[d.key], d.step)}
                      {d.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HMISettings() {
  const [br, setBr] = useState(80),
    [vol, setVol] = useState(60);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px 20px 14px",
        boxSizing: "border-box",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        System Settings
      </div>
      <div
        style={{
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          background: C.surface,
          padding: "14px 18px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: C.textSub,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Display & Audio
        </div>
        {[
          { label: "Brightness", val: br, set: setBr },
          { label: "Volume", val: vol, set: setVol },
        ].map(({ label, val, set }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: C.textMuted,
                width: 80,
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={val}
              onChange={(e) => set(Number(e.target.value))}
              style={{ flex: 1, accentColor: C.blue }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
                color: C.text,
                width: 34,
                textAlign: "right",
              }}
            >
              {val}%
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        <div
          style={{
            flex: 1,
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            background: C.surface,
            padding: "14px 18px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: C.textSub,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Device Information
          </div>
          {[
            ["Model", "Fractio CO₂ Pro"],
            ["Serial", "FRX-2026-0847"],
            ["Firmware", "v3.2.1"],
            ["Service", "2026-06-28"],
            ["Total Shots", "148,240"],
            ["Tube Life", "1,240 / 3,000 h"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{ fontSize: 11, color: C.textMuted }}
              >
                {k}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  color: C.textSub,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            width: 130,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {[
            { l: "Calibration", d: false },
            { l: "Maintenance", d: false },
            { l: "Change PIN", d: false },
            { l: "Shutdown", d: true },
          ].map(({ l, d }) => (
            <button
              key={l}
              style={{
                flex: 1,
                borderRadius: 12,
                border: `1px solid ${d ? C.redRing : C.border}`,
                background: d ? C.redDim : C.surface,
                color: d ? C.red : C.textSub,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HMIEmergency({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "#0a0404",
        gap: 28,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {[120, 96, 72].map((s, i) => (
          <motion.div
            key={s}
            animate={{
              scale: [1, 1 + (i + 1) * 0.06, 1],
              opacity: [
                0.15 + i * 0.1,
                0.35 + i * 0.1,
                0.15 + i * 0.1,
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: s,
              height: s,
              borderRadius: "50%",
              background: C.red,
            }}
          />
        ))}
        <div
          style={{
            position: "relative",
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IStop size={30} color="#fff" />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: C.red,
            letterSpacing: "0.18em",
          }}
        >
          EMERGENCY STOP
        </motion.div>
        <div
          style={{
            fontSize: 13,
            color: "#7a3535",
            marginTop: 8,
          }}
        >
          All laser outputs halted immediately
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#4a2525",
            marginTop: 4,
          }}
        >
          System is safe · Verify handpiece is clear
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#4a2525",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Clear treatment area before resetting
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          style={{
            width: 230,
            height: 56,
            borderRadius: 16,
            background: C.redDim,
            border: `2px solid ${C.redRing}`,
            color: C.red,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          RESET SYSTEM
        </motion.button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HMI ROOT  (manages internal state, renders 1024×768)
// ═══════════════════════════════════════════════════════════════════════════════

export interface HMIState {
  screen: HMIScreen;
  mode: TreatmentMode;
  params: TreatmentParams;
  laserState: LaserState;
  shots: number;
  elapsed: number;
  soundOn: boolean;
  beamOn: boolean;
  patternIdx: number;
  alarm: boolean;
}

export function HMIRoot({
  state,
  setState,
}: {
  state: HMIState;
  setState: (s: HMIState) => void;
}) {
  const {
    screen,
    mode,
    params,
    laserState,
    shots,
    elapsed,
    soundOn,
    beamOn,
    patternIdx,
    alarm,
  } = state;
  const [keypad, setKeypad] = useState<{
    def: ParamDef;
    val: number;
  } | null>(null);
  const [clock, setClock] = useState("14:32");
  const timerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      );
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (laserState === "lasering") {
      timerRef.current = setInterval(() => {
        setState({
          ...state,
          elapsed: elapsed + 1,
          shots: shots + 1 >= 500 ? shots : shots + 1,
          laserState: shots + 1 >= 500 ? "standby" : laserState,
          screen: shots + 1 >= 500 ? "finish" : screen,
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [laserState, shots, elapsed]);

  useEffect(() => {
    if (elapsed === 8 && laserState === "lasering")
      setState({ ...state, alarm: true });
  }, [elapsed]);

  const upd = (patch: Partial<HMIState>) =>
    setState({ ...state, ...patch });
  const goHome = () =>
    upd({ screen: "home", laserState: "standby" });
  const changeMode = (m: TreatmentMode) =>
    upd({
      mode: m,
      params: MODE_DEFAULTS[m],
      laserState: "standby",
      shots: 0,
      elapsed: 0,
    });
  const toggleLaser = () => {
    const next: LaserState =
      laserState === "standby"
        ? "ready"
        : laserState === "ready"
          ? "lasering"
          : laserState === "lasering"
            ? "paused"
            : "lasering";
    upd({ laserState: next });
  };

  return (
    <div
      style={{
        width: 1024,
        height: 600,
        display: "flex",
        flexDirection: "column",
        background: C.bg,
        overflow: "hidden",
        position: "relative",
        fontFamily:
          "'Inter','Noto Sans KR',system-ui,sans-serif",
      }}
    >
      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <motion.div
            key="sp"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HMISplash />
          </motion.div>
        )}
        {screen === "password" && (
          <motion.div
            key="pw"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <HMIPassword
              onUnlock={() => upd({ screen: "home" })}
            />
          </motion.div>
        )}
        {!["splash", "password", "emergency"].includes(
          screen,
        ) && (
          <motion.div
            key="shell"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HMIStatusBar
              mode={
                ["treatment", "finish"].includes(screen)
                  ? mode
                  : null
              }
              screen={screen}
              clock={clock}
              laserState={laserState}
              onBack={goHome}
            />
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <AnimatePresence mode="wait">
                {screen === "home" && (
                  <motion.div
                    key="hm"
                    style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HMIHome
                      onMode={(m) => {
                        changeMode(m);
                        upd({
                          screen: "treatment",
                          mode: m,
                          params: MODE_DEFAULTS[m],
                        });
                      }}
                      onHistory={() =>
                        upd({ screen: "history" })
                      }
                      onFavorites={() =>
                        upd({ screen: "favorites" })
                      }
                      onSettings={() =>
                        upd({ screen: "settings" })
                      }
                    />
                  </motion.div>
                )}
                {screen === "treatment" && (
                  <motion.div
                    key="tr"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HMITreatment
                      mode={mode}
                      params={params}
                      laserState={laserState}
                      shots={shots}
                      elapsed={elapsed}
                      soundOn={soundOn}
                      beamOn={beamOn}
                      patternIdx={patternIdx}
                      onChange={(k, v) =>
                        upd({ params: { ...params, [k]: v } })
                      }
                      onEdit={(def, val) =>
                        setKeypad({ def, val })
                      }
                      onMode={changeMode}
                      onLaser={toggleLaser}
                      onSound={() => upd({ soundOn: !soundOn })}
                      onBeam={() => upd({ beamOn: !beamOn })}
                      onPattern={(i) => upd({ patternIdx: i })}
                      onEmergency={() =>
                        upd({
                          screen: "emergency",
                          laserState: "standby",
                        })
                      }
                    />
                  </motion.div>
                )}
                {screen === "finish" && (
                  <motion.div
                    key="fn"
                    style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <HMIFinish
                      mode={mode}
                      shots={shots}
                      elapsed={elapsed}
                      params={params}
                      onHome={goHome}
                      onNewSession={() =>
                        upd({
                          shots: 0,
                          elapsed: 0,
                          laserState: "standby",
                          screen: "treatment",
                        })
                      }
                    />
                  </motion.div>
                )}
                {screen === "history" && (
                  <motion.div
                    key="hy"
                    style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HMIHistory />
                  </motion.div>
                )}
                {screen === "favorites" && (
                  <motion.div
                    key="fv"
                    style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HMIFavorites
                      onLoad={(m, p) =>
                        upd({
                          mode: m,
                          params: p,
                          laserState: "standby",
                          shots: 0,
                          elapsed: 0,
                          screen: "treatment",
                        })
                      }
                    />
                  </motion.div>
                )}
                {screen === "settings" && (
                  <motion.div
                    key="st"
                    style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HMISettings />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        {screen === "emergency" && (
          <motion.div
            key="em"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <HMIEmergency
              onReset={() => upd({ screen: "home" })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alarm overlay */}
      <AnimatePresence>
        {alarm && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(6,10,20,0.82)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                width: 340,
                borderRadius: 20,
                background: C.card,
                border: `1px solid ${C.amberRing}`,
                boxShadow: `0 0 40px ${C.amberDim},0 24px 60px rgba(0,0,0,0.6)`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  background: C.amberDim,
                  borderBottom: `1px solid ${C.amberRing}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <IAlert size={20} color={C.amber} />
                </motion.div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.amber,
                    letterSpacing: "0.06em",
                  }}
                >
                  SYSTEM ALARM
                </span>
              </div>
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    fontSize: 13,
                    color: C.text,
                    fontWeight: 500,
                    marginBottom: 8,
                  }}
                >
                  Temperature Warning
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textSub,
                    marginBottom: 4,
                  }}
                >
                  Laser tube temperature exceeded safe operating
                  range.
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    marginBottom: 16,
                  }}
                >
                  Current: 42.5 °C · Limit: 40.0 °C · Code:
                  TEMP-001
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => upd({ alarm: false })}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                      background: C.surface,
                      color: C.textSub,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Snooze 5 min
                  </button>
                  <button
                    onClick={() => upd({ alarm: false })}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 12,
                      border: "none",
                      background: C.amber,
                      color: "#000",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Numeric keypad */}
      <AnimatePresence>
        {keypad && (
          <NumericKeypad
            key="kp"
            label={keypad.def.label}
            unit={keypad.def.unit}
            value={keypad.val}
            min={keypad.def.min}
            max={keypad.def.max}
            step={keypad.def.step}
            onConfirm={(v) => {
              upd({
                params: { ...params, [keypad.def.key]: v },
              });
              setKeypad(null);
            }}
            onCancel={() => setKeypad(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENTATION PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function DocSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid #e8edf5",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "#1a3a6e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {n}
          </span>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#0f1e38",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function DocTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: 8,
        border: "1px solid #dde4ef",
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
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: "7px 12px",
                  textAlign: "left",
                  color: "#3a5270",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontSize: 10,
                  borderBottom: "1px solid #dde4ef",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#fff" : "#f8fafd",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "7px 12px",
                    color: "#2a3f5f",
                    borderBottom:
                      i < rows.length - 1
                        ? "1px solid #eef2f8"
                        : "none",
                    fontFamily:
                      j > 0
                        ? "'JetBrains Mono',monospace"
                        : undefined,
                    fontSize: j > 0 ? 11 : 12,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocChip({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 6,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        fontSize: 10,
        fontWeight: 600,
        color,
        marginRight: 5,
        marginBottom: 5,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: color,
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}

function DocPanel({ doc }: { doc: DocScreen }) {
  const stateColors: Record<string, string> = {
    standby: "#3f5570",
    ready: "#2e82ff",
    lasering: "#ef4444",
    paused: "#f59e0b",
    default: "#3f5570",
    error: "#ef4444",
    alarm: "#f59e0b",
    success: "#22c55e",
    loading: "#2e82ff",
  };
  return (
    <div
      style={{
        padding: "24px 28px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        fontFamily:
          "'Inter','Noto Sans KR',system-ui,sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "2px solid #1a3a6e",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              background: "#1a3a6e",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.06em",
            }}
          >
            {doc.scrid}
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0f1e38",
              margin: 0,
            }}
          >
            {doc.name}
          </h1>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#4a6080",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {doc.description}
        </p>
      </div>

      {/* 1. Screen Overview */}
      <DocSection n={1} title="Screen Overview">
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "#f5f8ff",
            border: "1px solid #d8e3f0",
            fontSize: 12,
            color: "#2a3f5f",
            lineHeight: 1.7,
          }}
        >
          <strong>Purpose:</strong> {doc.purpose}
        </div>
      </DocSection>

      {/* 2. Screen Information */}
      <DocSection n={2} title="Screen Information">
        <DocTable
          headers={["Field", "Value"]}
          rows={[
            ["Screen ID", doc.scrid],
            ["Screen Name", doc.name],
            ["Purpose", doc.purpose.slice(0, 80) + "…"],
            ["Previous Screen", doc.prevScreen],
            ["Next Screen", doc.nextScreen],
            ["Trigger / Condition", doc.trigger],
          ]}
        />
      </DocSection>

      {/* 3. User Interactions */}
      <DocSection n={3} title="User Interactions">
        {doc.interactions.length > 0 ? (
          <DocTable
            headers={["Element", "Type", "Action", "Result"]}
            rows={doc.interactions.map((i) => [
              i.element,
              i.type,
              i.action,
              i.result,
            ])}
          />
        ) : (
          <p
            style={{
              fontSize: 11,
              color: "#7a9bbf",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            No direct user interaction on this screen.
          </p>
        )}
      </DocSection>

      {/* 4. Components */}
      <DocSection n={4} title="Components">
        <DocTable
          headers={["Component", "Type", "Properties"]}
          rows={doc.components.map((c) => [
            c.name,
            c.type,
            c.props,
          ])}
        />
      </DocSection>

      {/* 5. Parameters */}
      <DocSection n={5} title="Parameters">
        {doc.params.length > 0 ? (
          <DocTable
            headers={[
              "Parameter",
              "Unit",
              "Min",
              "Max",
              "Step",
              "Default",
              "Validation",
            ]}
            rows={doc.params.map((p) => [
              p.name,
              p.unit,
              p.min,
              p.max,
              p.step,
              p.default,
              p.validation,
            ])}
          />
        ) : (
          <p
            style={{
              fontSize: 11,
              color: "#7a9bbf",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            No editable parameters on this screen.
          </p>
        )}
      </DocSection>

      {/* 6. States */}
      <DocSection n={6} title="Screen States">
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {doc.states.map((s) => (
            <DocChip
              key={s.name}
              label={s.name}
              color={s.color}
            />
          ))}
        </div>
        <DocTable
          headers={["State", "Color", "Description", "Trigger"]}
          rows={doc.states.map((s) => [
            s.name,
            s.color,
            s.description,
            s.trigger,
          ])}
        />
      </DocSection>

      {/* 7. Developer Notes */}
      <DocSection n={7} title="Developer Notes">
        <div
          style={{
            borderRadius: 8,
            background: "#0f1e38",
            padding: "14px 16px",
            marginBottom: 12,
          }}
        >
          {doc.devNotes.map((n, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
                color: "#7ab8e8",
                lineHeight: 1.8,
                marginBottom:
                  i < doc.devNotes.length - 1 ? 4 : 0,
              }}
            >
              // {n}
            </div>
          ))}
        </div>
        <div
          style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <div style={{ flex: "1 1 auto" }}>
            <div
              style={{
                fontSize: 10,
                color: "#3a5270",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              Color Tokens
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {doc.tokenRefs.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "2px 8px",
                    borderRadius: 5,
                    background: "#eef2f8",
                    border: "1px solid #d0daea",
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: "#2a4f7a",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 auto", marginTop: 12 }}>
            <div
              style={{
                fontSize: 10,
                color: "#3a5270",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              Asset Names
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {doc.assetNames.map((a) => (
                <span
                  key={a}
                  style={{
                    padding: "2px 8px",
                    borderRadius: 5,
                    background: "#eef2f8",
                    border: "1px solid #d0daea",
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: "#2a4f7a",
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DocSection>

      {/* 8. Navigation Flow */}
      <DocSection n={8} title="Navigation Flow">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 8,
            background: "#f5f8ff",
            border: "1px solid #d8e3f0",
          }}
        >
          <div style={{ textAlign: "center", minWidth: 100 }}>
            <div
              style={{
                fontSize: 9,
                color: "#7a9bbf",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              FROM
            </div>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 7,
                background: "#e8edf5",
                border: "1px solid #c8d4e8",
                fontSize: 11,
                color: "#2a3f5f",
                fontWeight: 500,
              }}
            >
              {doc.prevScreen}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                height: 1,
                flex: 1,
                background: "#c8d4e8",
              }}
            />
            <div
              style={{
                fontSize: 10,
                color: "#7a9bbf",
                padding: "4px 10px",
                borderRadius: 6,
                background: "#eef2f8",
                border: "1px solid #d0daea",
                whiteSpace: "nowrap",
              }}
            >
              {doc.trigger.slice(0, 40)}
            </div>
            <div
              style={{
                height: 1,
                flex: 1,
                background: "#c8d4e8",
              }}
            />
          </div>
          <div style={{ textAlign: "center", minWidth: 100 }}>
            <div
              style={{
                fontSize: 9,
                color: "#2e82ff",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              TO
            </div>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 7,
                background: "#dae9ff",
                border: "1px solid #9ecaff",
                fontSize: 11,
                color: "#1a4f9a",
                fontWeight: 600,
              }}
            >
              {doc.nextScreen}
            </div>
          </div>
        </div>
      </DocSection>

      {/* 9. Export Information */}
      <DocSection n={9} title="Export Information">
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {[
            ["Resolution", "1024 × 768 px"],
            ["Color Depth", "32-bit RGBA"],
            ["BMP Target", "16-bit RGB565"],
            ["Version", "v3.3.0"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                flex: "1 1 auto",
                padding: "8px 12px",
                borderRadius: 8,
                background: "#f5f8ff",
                border: "1px solid #d8e3f0",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#7a9bbf",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 2,
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12,
                  color: "#2a3f5f",
                  fontWeight: 600,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            borderRadius: 8,
            background: "#0f1e38",
            padding: "12px 16px",
          }}
        >
          {doc.exportNames.map((n, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom:
                  i < doc.exportNames.length - 1 ? 6 : 0,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#3a6ea0",
                  width: 16,
                  textAlign: "right",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  color: "#7ab8e8",
                }}
              >
                {n}
              </span>
            </div>
          ))}
        </div>
      </DocSection>

      <div style={{ height: 40 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION NAVIGATION DATA
// ═══════════════════════════════════════════════════════════════════════════════