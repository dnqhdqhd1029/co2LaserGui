import React from "react";

const D = {
  bg: "#f4f7fb", card: "#ffffff", border: "#dce5f0", text: "#10213a",
  sub: "#526984", faint: "#8193aa", navy: "#0d2e5a", blue: "#1e7ef5", cyan: "#00cae4",
};

function Page({number, title, subtitle, children}: {number: string; title: string; subtitle: string; children: React.ReactNode}) {
  return <div style={{height:"100%", overflowY:"auto", background:D.bg, color:D.text}}>
    <div style={{maxWidth:1120, margin:"0 auto", padding:"52px 48px 80px"}}>
      <div style={{fontSize:11, fontWeight:800, letterSpacing:".16em", color:D.blue}}>SECTION {number}</div>
      <h1 style={{fontSize:38, lineHeight:1.15, margin:"10px 0 8px", color:D.navy}}>{title}</h1>
      <p style={{fontSize:15, lineHeight:1.7, color:D.sub, margin:"0 0 34px"}}>{subtitle}</p>
      {children}
    </div>
  </div>;
}

function Grid({children, cols=2}: {children: React.ReactNode; cols?: number}) {
  return <div style={{display:"grid", gridTemplateColumns:`repeat(${cols}, minmax(0, 1fr))`, gap:16, marginBottom:24}}>{children}</div>;
}

function Card({title, tag, children}: {title: string; tag?: string; children: React.ReactNode}) {
  return <section style={{background:D.card, border:`1px solid ${D.border}`, borderRadius:14, padding:"22px 24px"}}>
    {tag && <div style={{fontSize:10, fontWeight:800, color:D.blue, letterSpacing:".12em", marginBottom:7}}>{tag}</div>}
    <h2 style={{fontSize:18, margin:"0 0 12px", color:D.navy}}>{title}</h2>
    <div style={{fontSize:13, lineHeight:1.75, color:D.sub}}>{children}</div>
  </section>;
}

function List({items}: {items: string[]}) {
  return <ul style={{paddingLeft:18, margin:0}}>{items.map(item => <li key={item} style={{marginBottom:6}}>{item}</li>)}</ul>;
}

function Table({rows}: {rows: Array<[string,string,string?]>}) {
  return <div style={{border:`1px solid ${D.border}`, borderRadius:12, overflow:"hidden", background:D.card}}>
    {rows.map(([a,b,c],i)=><div key={`${a}-${i}`} style={{display:"grid", gridTemplateColumns:c?"180px 1fr 1fr":"180px 1fr", borderTop:i?`1px solid ${D.border}`:"none"}}>
      <div style={{padding:"12px 16px", fontSize:12, fontWeight:700, color:D.navy, background:"#f8fafd"}}>{a}</div>
      <div style={{padding:"12px 16px", fontSize:12, color:D.sub}}>{b}</div>
      {c && <div style={{padding:"12px 16px", fontSize:12, color:D.sub, borderLeft:`1px solid ${D.border}`}}>{c}</div>}
    </div>)}
  </div>;
}

export function CurrentCoverPage() {
  return <div style={{height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"radial-gradient(circle at 50% 42%,#12345b 0%,#091624 43%,#060d18 100%)", color:"#d8e8ff", position:"relative", overflow:"hidden"}}>
    <div style={{position:"absolute", inset:32, border:"1px solid rgba(0,202,228,.18)", borderRadius:22}}/>
    <div style={{textAlign:"center", zIndex:1}}>
      <div style={{fontSize:13, letterSpacing:".28em", color:D.cyan, fontWeight:800}}>MEDICAL DEVICE HMI</div>
      <h1 style={{fontSize:52, margin:"18px 0 8px", letterSpacing:"-.03em"}}>FRACTIO CO₂ LASER</h1>
      <div style={{fontSize:24, color:"#86a9ca", fontWeight:500}}>Interface Design & Developer Handoff</div>
      <div style={{width:72, height:3, background:D.cyan, margin:"34px auto", borderRadius:3}}/>
      <div style={{fontSize:14, lineHeight:1.8, color:"#6483a5"}}>COS / FRX Treatment Interface<br/>1024 × 768 · Dark HMI · DGUS II Export</div>
      <div style={{fontSize:11, marginTop:50, color:"#476481", letterSpacing:".12em"}}>DOCUMENT UPDATED · 2026.09.02</div>
    </div>
  </div>;
}

export function CurrentProjectInfoPage() {
  return <Page number="02" title="Project Information" subtitle="현재 구현된 FRACTIO CO₂ 레이저 HMI의 범위와 개발 전달 기준입니다.">
    <Grid><Card title="Product Scope" tag="OVERVIEW"><List items={["COS: Continuous / Pulse 기반 레이저 치료 화면","FRX: Shape와 Scan Mode 기반 Fractional 치료 화면","1024 × 768 고정 해상도, 터치 중심 의료기기 인터페이스","Standby · Ready · Lasering · Paused 상태 지원"]}/></Card>
    <Card title="Delivery Scope" tag="HANDOFF"><List items={["Interactive React 프로토타입","상태별 07 Screens 카탈로그","PNG 및 24-bit BMP 개발 에셋","동적 숫자·단위를 제외한 EMVD용 화면 이미지"]}/></Card></Grid>
    <Table rows={[["Platform","DWIN DGUS II target / Web prototype"],["Canvas","1024 × 768 px, landscape"],["Modes","COS, FRX"],["Primary interaction","Glove-friendly touch controls"],["Export","PNG + uncompressed 24-bit BMP"],["Source of truth","src/app/hmi2.tsx and src/app/screens-export.tsx"]]}/>
  </Page>;
}

export function CurrentDesignSystemPage() {
  const colors=[["Background","#09101F"],["Panel","#0D1628"],["Card","#111E35"],["COS Cyan","#00CAE4"],["FRX Blue","#1E7EF5"],["Primary Text","#D8E8FF"],["Secondary Text","#4E6E9A"],["Success","#22C55E"]];
  return <Page number="03" title="Design System" subtitle="COS의 Cyan과 FRX의 Blue를 구분하되 동일한 다크 HMI 구조와 상태 규칙을 사용합니다.">
    <Grid cols={4}>{colors.map(([n,c])=><div key={n} style={{background:D.card,border:`1px solid ${D.border}`,borderRadius:12,overflow:"hidden"}}><div style={{height:72,background:c}}/><div style={{padding:12,fontSize:12,fontWeight:700}}>{n}<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:D.faint,marginTop:4}}>{c}</div></div></div>)}</Grid>
    <Grid><Card title="Selection Rules"><List items={["COS selected: Cyan border, tinted gradient, brighter value text","FRX selected: Blue border, tinted gradient, brighter value text","Inactive: low-contrast border and secondary text","Laser state: Green for Standby, state-specific emphasis for operation"]}/></Card><Card title="Spacing & Shape"><List items={["Control radius: 8–16 px","Selected border: 2 px","Parameter tab height: 88 px","Parameter value/name vertical gap: 5 px","Touch controls retain large hit areas"]}/></Card></Grid>
  </Page>;
}

export function CurrentComponentsPage() {
  return <Page number="04" title="Components" subtitle="현재 프로토타입에서 재사용되는 핵심 HMI 컴포넌트와 책임입니다.">
    <Grid cols={3}>
      <Card title="Top Bar"><List items={["Back navigation","MEMO / CALL / SAVE","Sound and Aiming controls","Camera entry"]}/></Card>
      <Card title="Mode Button"><List items={["Icon + label structure","Normal / selected states","COS Cyan or FRX Blue accent","Continuous pulse option included"]}/></Card>
      <Card title="Parameter Tab"><List items={["Value and unit on top","Parameter name below","20 px value / 14 px unit","Selected tab drives Primary Control"]}/></Card>
      <Card title="Primary Control"><List items={["Large selected value","Increment / decrement controls","Current parameter synchronization","Locked while lasering"]}/></Card>
      <Card title="Laser Bar"><List items={["Standby / Ready / Lasering / Paused","Full-width primary state action","State-specific color and label"]}/></Card>
      <Card title="Modal"><List items={["Memo, Call, Save, Camera","Actual GUI retains text","07 Screens removes modal text for EMVD","Surface and control geometry preserved"]}/></Card>
    </Grid>
  </Page>;
}

export function CurrentIconsPage() {
  const icons=[["Laser Mode","CW sine wave / Pulse waveform"],["Pulse Mode","Single / Continuous beam / Repeat"],["FRX Shape","Line / Triangle / Square / Oval / Rim"],["Scan Mode","Lining / Random dot pattern"],["Utility","Back / Memo / Call / Save / Sound / Aiming / Camera"],["Control","Plus / Minus / Lock"]];
  return <Page number="05" title="Iconography" subtitle="작은 화면과 의료 환경에서 의미가 즉시 구분되도록 단순한 선형·기하 아이콘을 사용합니다.">
    <Table rows={icons.map(([a,b])=>[a,b,"SVG · currentColor · rounded stroke"])}/>
    <div style={{marginTop:24}}><Grid><Card title="Implementation"><List items={["SVG viewBox 기반으로 해상도 독립 유지","선택 상태는 부모의 currentColor를 상속","기본 stroke 1.8–3 px, round cap/join","Continuous는 끊김 없는 라운드 빔으로 표현"]}/></Card><Card title="Export Note"><List items={["아이콘은 PNG/BMP 배경 에셋에 포함","동적 텍스트와 숫자만 EMVD 레이어로 분리","모달 내 SVG 아이콘은 텍스트 제거 후에도 유지"]}/></Card></Grid></div>
  </Page>;
}

export function CurrentUserFlowPage() {
  const Step=({n,t,d}:{n:string;t:string;d:string})=><div style={{display:"grid",gridTemplateColumns:"48px 1fr",gap:16,alignItems:"start"}}><div style={{width:42,height:42,borderRadius:12,background:D.navy,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{n}</div><div><div style={{fontSize:16,fontWeight:800,color:D.navy}}>{t}</div><div style={{fontSize:13,color:D.sub,lineHeight:1.6,marginTop:4}}>{d}</div></div></div>;
  return <Page number="06" title="User Flow" subtitle="모드 선택부터 파라미터 조절과 레이저 상태 전환까지의 기본 운용 흐름입니다.">
    <div style={{background:D.card,border:`1px solid ${D.border}`,borderRadius:16,padding:28,display:"flex",flexDirection:"column",gap:24}}>
      <Step n="1" t="Splash / Initialization" d="장치 부팅과 초기화 진행 상태를 표시합니다."/>
      <Step n="2" t="Mode Select" d="사용자가 COS 또는 FRX 치료 모드를 선택합니다."/>
      <Step n="3" t="Configure" d="COS는 Laser/Pulse Mode, FRX는 Shape/Scan Mode를 선택하고 PARAMETERS 탭에서 값을 확인합니다."/>
      <Step n="4" t="Adjust Parameter" d="탭을 선택하면 오른쪽 Primary Control이 해당 값과 단위로 동기화됩니다."/>
      <Step n="5" t="Standby → Ready → Lasering" d="치료 준비 후 레이저 동작 상태로 전환하며 Lasering 중 설정 조작은 잠깁니다."/>
      <Step n="6" t="Paused / Complete" d="필요 시 일시정지하고 상태를 확인한 뒤 치료를 종료하거나 재개합니다."/>
    </div>
  </Page>;
}

export function CurrentAssetsPage() {
  return <Page number="08" title="Assets & Export" subtitle="개발 전달용 이미지와 소스 에셋의 위치 및 생성 규칙입니다.">
    <Grid><Card title="PNG"><List items={["Path: exports/png","1024 × 768 px","07 Screens 순서 기반 파일명","UI 검수 및 일반 개발 참조용"]}/></Card><Card title="BMP"><List items={["Path: exports/bmp","1024 × 768 px","Uncompressed 24-bit RGB","DWIN DGUS II 적용용"]}/></Card></Grid>
    <Table rows={[["Screen background","Static UI, panels, borders, icons and parameter labels"],["Excluded values","Parameter numbers and units; supplied as EMVD dynamic text"],["Modal export","Modal geometry and controls remain; modal text is excluded"],["Source image","src/assets/mode-select-background.png"],["Backup","exports-backup contains previous delivery files"]]}/>
  </Page>;
}

export function CurrentDevGuidePage() {
  return <Page number="09" title="Developer Guide" subtitle="HMI 구현, 동적 값 연결, 폰트 적용과 이미지 전달 시 반드시 유지할 기준입니다.">
    <Grid>
      <Card title="UI & Label Font" tag="FONT 01">
        <div style={{fontFamily:"'Inter','Noto Sans KR',sans-serif",fontSize:28,fontWeight:700,color:D.navy,marginBottom:12}}>Inter / Noto Sans KR</div>
        <List items={["영문 UI 기본 서체: Inter","한글 UI 서체: Noto Sans KR","지원 굵기: 400 Regular / 500 Medium / 600 SemiBold / 700 Bold","Fallback: system-ui, sans-serif","용도: 화면 제목, 섹션 제목, 버튼명, 파라미터명, 상태 및 안내 문구"]}/>
      </Card>
      <Card title="Parameter Numeric Font" tag="FONT 02">
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:30,fontWeight:500,color:D.navy,marginBottom:12}}>30 W · 0.5 ms</div>
        <List items={["숫자 전용 서체: JetBrains Mono","지원 굵기: 400 / 500 / 600 / 700","Fallback: monospace","고정폭 숫자로 값 변경 시 너비와 정렬 흔들림 방지","용도: PARAMETERS 탭 숫자·단위와 오른쪽 Primary Control 수치"]}/>
      </Card>
    </Grid>

    <h2 style={{fontSize:20,color:D.navy,margin:"30px 0 14px"}}>Noto Sans KR / Inter UI Type Scale</h2>
    <Table rows={[
      ["Section title","Inter / Noto Sans KR","18 px · 700 · letter-spacing 0.01–0.06em"],
      ["COS parameter name","Inter / Noto Sans KR","18 px · active 700 / inactive 500 · line-height 1.25"],
      ["FRX parameter name","Inter / Noto Sans KR","22 px · active 700 / inactive 500 · line-height 1.25"],
      ["Primary parameter label","Inter / Noto Sans KR","14 px · 600 · uppercase · letter-spacing 0.12em"],
      ["Utility / helper text","Inter / Noto Sans KR","10–14 px · 400–600"],
      ["Fallback order","—","Inter → Noto Sans KR → system-ui → sans-serif"],
    ]}/>

    <h2 style={{fontSize:20,color:D.navy,margin:"30px 0 14px"}}>Parameter Tab Numeric Style</h2>
    <Table rows={[
      ["Value font","JetBrains Mono","20 px · 700 · line-height inherited"],
      ["Unit font","JetBrains Mono","14 px · 600 · baseline aligned"],
      ["Value ↔ unit gap","Flex gap","3 px"],
      ["Numeric row ↔ name gap","Vertical flex gap","5 px"],
      ["Alignment","—","Horizontal center · value/unit baseline"],
      ["Tab padding","—","8 px vertical / 6 px horizontal"],
      ["Inactive value color","—","#1E3050 · darker secondary"],
      ["COS active value","—","#00CAE4 · Cyan"],
      ["FRX active value","—","#1E7EF5 · Blue"],
      ["Export behavior","—","07 Screens에서는 숫자·단위를 숨기되 동일 공간을 유지"],
    ]}/>

    <h2 style={{fontSize:20,color:D.navy,margin:"30px 0 14px"}}>Primary Control Numeric Style</h2>
    <Table rows={[
      ["Large value","JetBrains Mono","47 px · 500 · line-height 1"],
      ["Large value color","—","#FFFFFF"],
      ["Unit","Inter / Noto Sans KR","14 px · line-height 1"],
      ["Value ↔ unit gap","Flex gap","2 px"],
      ["Alignment","—","Horizontal center · baseline"],
      ["Value area","—","min-height 62 px · padding 14 px 0"],
      ["Parameter label","Inter / Noto Sans KR","14 px · 600 · uppercase · letter-spacing 0.12em"],
    ]}/>

    <div style={{marginTop:24}}><Grid>
      <Card title="Data Binding"><List items={["각 parameter object는 label, value, unit, onDec, onInc를 보유","선택 key가 탭 강조와 Primary Control을 동시에 결정","On Time과 Off Time은 독립 상태값으로 관리","Lasering 상태에서는 값 변경을 차단"]}/></Card>
      <Card title="EMVD Handoff"><List items={["07 Screens의 숫자·단위 영역은 빈 공간으로 유지","파라미터명 위치는 실제 GUI와 동일하게 유지","모달 텍스트 역시 export 이미지에서 제외","개발자가 VP/텍스트 레이어로 동적 콘텐츠를 적용"]}/></Card>
    </Grid></div>
  </Page>;
}
