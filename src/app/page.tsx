import Link from 'next/link';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
      
      {/* ======================= MAIN CONTENT WRAPPER ======================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Bulletin Announcement Strip */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📢</span>
            <h2 className="text-lg font-black text-brutalBlack tracking-tight uppercase">Campus Triage Bulletin</h2>
          </div>
          <div className="bg-schoolYellow border-[3px] border-brutalBlack p-4 sm:p-5 shadow-brutal relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <span className="bg-brutalBlack text-white text-[11px] font-mono px-2 py-1 font-bold uppercase tracking-wider shrink-0 mt-0.5 sm:mt-0">
                ACTIVE AUDIT
              </span>
              <p className="text-brutalBlack font-bold text-sm sm:text-base leading-snug">
                Rotational Mechanics &amp; Friction Vector Ambiguity window is open. <span className="underline decoration-brutalBlack decoration-2 font-black">68% of JEE 2027 aspirants failed this trap option.</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <span className="font-mono text-xs font-black bg-white text-brutalBlack px-2.5 py-1 border-[2px] border-brutalBlack shadow-brutal-sm uppercase">
                Diagnostic Live
              </span>
            </div>
          </div>
        </section>

        {/* ======================= ASYMMETRIC HERO EDITORIAL ======================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT HERO COLUMN (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Monospace Meta Tag & Pill Sticker */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-retroTeal text-white font-mono font-bold text-xs px-2.5 py-1 border-[2px] border-brutalBlack shadow-brutal-sm uppercase">
                  JEE ADVANCED 2027 PROTOCOL
                </span>
                <span className="bg-white text-brutalBlack font-mono font-bold text-xs px-2.5 py-1 border-[2px] border-brutalBlack shadow-brutal-sm uppercase">
                  DIAGNOSTIC ENGINE v4.2
                </span>
                <span className="bg-red-100 text-red-700 font-mono font-black text-xs px-2 py-0.5 border-[2px] border-brutalBlack flex items-center gap-1 uppercase">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                  99.4% HIT RATE
                </span>
              </div>

              {/* Bold Offset Display Type */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brutalBlack tracking-tight leading-[1.05]">
                STOP GUESSING.<br/>
                <span className="bg-schoolYellow px-2 border-[3px] border-brutalBlack shadow-brutal inline-block mt-2 transform -rotate-1">
                  TARGET THE BLINDSPOT.
                </span>
              </h1>
              
              <p className="text-base sm:text-lg font-bold text-neutral-800 mt-6 leading-relaxed max-w-xl">
                AI-calibrated surgical diagnosis for JEE aspirants. We locate the exact intuition failure in your physics, chemistry, or mathematics in 12 minutes—and rebuild only what&apos;s broken.
              </p>

              {/* Physical Sticker Motifs */}
              <div className="flex flex-wrap items-center gap-2.5 mt-5">
                <span className="bg-paper-200 text-neutral-800 font-mono text-xs font-bold px-2 py-1 border-[1.5px] border-brutalBlack">
                  🚫 NO 50-VIDEO PLAYLISTS
                </span>
                <span className="bg-paper-200 text-neutral-800 font-mono text-xs font-bold px-2 py-1 border-[1.5px] border-brutalBlack">
                  ⚡ 12-MIN TRIAGE
                </span>
                <span className="bg-kraftBrown-soft text-kraftBrown-dark font-mono text-xs font-bold px-2 py-1 border-[1.5px] border-brutalBlack">
                  📝 HANDWRITTEN REPAIR NOTES
                </span>
              </div>
            </div>

            {/* High Contrast CTA Action Cluster */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/topics" className="bg-retroTeal hover:bg-retroTeal-dark text-white font-black text-base px-7 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal flex items-center justify-center gap-3 uppercase tracking-wider">
                <span>START 12-MIN DIAGNOSTIC</span>
                <span className="text-xl leading-none">➔</span>
              </Link>
              <Link href="/dashboard" className="bg-schoolYellow hover:bg-schoolYellow-deep text-brutalBlack font-black text-base px-6 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal flex items-center justify-center gap-2 uppercase tracking-wider">
                <span>DASHBOARD</span>
                <span className="font-mono text-sm bg-brutalBlack text-white px-1.5 py-0.5">HUB</span>
              </Link>
            </div>

            {/* Live Telemetry Ticker Strip */}
            <div className="bg-white border-[2.5px] border-brutalBlack p-3.5 shadow-brutal-sm flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-retroTeal border border-brutalBlack inline-block"></span>
                <span className="font-bold text-neutral-800 uppercase">LIVE BATCH TELEMETRY:</span>
              </div>
              <div className="font-bold text-neutral-600 truncate ml-2">
                1,420 aspirants diagnosed today • Average gap pinpoint: 9m 14s
              </div>
            </div>
          </div>

          {/* RIGHT HERO COLUMN: Tactile Exam Paper / Triage Terminal Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border-[3px] border-brutalBlack shadow-brutal-lg p-6 relative overflow-hidden flex flex-col justify-between h-full">
              {/* Manila paper top tape accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-200/90 border border-neutral-400 w-28 h-6 rotate-1 shadow-sm opacity-90"></div>
              
              {/* Exam Paper Header */}
              <div>
                <div className="flex items-center justify-between border-b-[2.5px] border-brutalBlack pb-3 mb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-extrabold text-neutral-500 tracking-wider block">EXAM PROTOCOL PAPER #2027-A</span>
                    <span className="font-black text-base text-brutalBlack">COGNITIVE STRESS AUDIT</span>
                  </div>
                  <div className="border-[2.5px] border-red-600 text-red-600 font-black text-xs px-2 py-1 rotate-6 tracking-widest uppercase bg-red-50">
                    CRITICAL GAP
                  </div>
                </div>

                {/* Graded Question Mockup */}
                <div className="bg-paper-100 border-[2px] border-brutalBlack p-4 mb-4 relative">
                  <span className="font-mono text-xs font-black text-retroTeal uppercase block mb-1">PROBE Q-04 // MECHANICS:</span>
                  <p className="font-mono text-xs font-bold text-brutalBlack leading-relaxed">
                    "A uniform solid sphere rolls without slipping on a rough horizontal surface and encounters an upward ramp..."
                  </p>
                  
                  {/* Graded Red Pen Markup */}
                  <div className="mt-3 pt-2 border-t border-neutral-300 flex items-center justify-between font-mono text-xs">
                    <span className="text-neutral-500 uppercase">Student Intuition:</span>
                    <span className="text-red-600 font-bold line-through">Torque about COM = 0</span>
                  </div>
                  <div className="text-[11px] font-mono text-red-600 font-bold mt-1 bg-red-50 p-1.5 border border-red-300">
                    ⚠️ MISCONCEPTION DETECTED: Ignored non-inertial pivot torque &amp; friction direction reversal.
                  </div>
                </div>

                {/* Subject Fault Telemetry Bars */}
                <div className="space-y-3 font-mono text-xs">
                  <span className="font-extrabold text-brutalBlack uppercase tracking-wide block">COHORT ERROR DISTRIBUTION:</span>
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Pure Rolling Incline</span>
                      <span className="text-red-700 font-black">68% Fault</span>
                    </div>
                    <div className="w-full bg-neutral-200 border-[2px] border-brutalBlack h-3.5 p-0.5">
                      <div className="bg-retroTeal h-full w-[68%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Ambidentate Coordination</span>
                      <span className="text-kraftBrown-dark font-black">81% Fault</span>
                    </div>
                    <div className="w-full bg-neutral-200 border-[2px] border-brutalBlack h-3.5 p-0.5">
                      <div className="bg-kraftBrown h-full w-[81%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Cauchy Residue Theorem</span>
                      <span className="text-brutalBlack font-black">43% Fault</span>
                    </div>
                    <div className="w-full bg-neutral-200 border-[2px] border-brutalBlack h-3.5 p-0.5">
                      <div className="bg-schoolYellow-deep h-full w-[43%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Card Stamp & Quick Link */}
              <div className="mt-6 pt-4 border-t-[2.5px] border-dashed border-neutral-300 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-neutral-600 uppercase">Avg Recovery: 18m 40s</span>
                <Link href="/topics" className="bg-brutalBlack text-white font-mono text-xs font-bold px-2 py-1 uppercase hover:bg-neutral-800 transition-colors">
                  REPAIR READY ➔
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= THE 3-STEP REPAIR LOOP ======================= */}
        <section className="space-y-6 pt-4" id="loop">
          <div className="border-l-[6px] border-brutalBlack pl-4 py-1">
            <div className="flex items-center gap-2">
              <span className="bg-schoolYellow text-brutalBlack font-mono font-black text-xs px-2 py-0.5 border border-brutalBlack uppercase">
                TRIAGE BLUEPRINT
              </span>
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase">03-STAGE CLINICAL SYSTEM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brutalBlack tracking-tight mt-1">
              The Three-Step Repair Loop
            </h2>
            <p className="text-neutral-700 font-bold text-sm sm:text-base max-w-2xl mt-1">
              Structured like physical reference files. Designed to isolate flawed intuition before it compounds into test-day negative marking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STEP 01 */}
            <div className="bg-white border-[3px] border-brutalBlack shadow-brutal flex flex-col justify-between relative group">
              <div className="bg-retroTeal text-white p-3.5 border-b-[2.5px] border-brutalBlack flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-white text-retroTeal-dark px-1.5 py-0.5 border border-brutalBlack font-black">01</span>
                  <span className="font-black text-sm tracking-wider uppercase">SELECT</span>
                </div>
                <span className="text-xl">🗂️</span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-black text-brutalBlack tracking-tight">Micro-Syllabus Pinpoint</h3>
                <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
                  Drill down past generic chapters. Target 280+ indexed sub-modules across Mechanics, Physical Chemistry, and Calculus down to individual theorems.
                </p>
                <div className="bg-paper-100 border-[2px] border-brutalBlack p-3 font-mono text-xs space-y-1">
                  <span className="font-bold text-neutral-500 uppercase block text-[10px]">Target Depth Sample:</span>
                  <div className="font-black text-retroTeal-dark truncate">
                    Mechanics › Rotational › Angular Momentum Shift
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 02 */}
            <div className="bg-white border-[3px] border-brutalBlack shadow-brutal flex flex-col justify-between relative group">
              <div className="bg-kraftBrown text-white p-3.5 border-b-[2.5px] border-brutalBlack flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-white text-kraftBrown-dark px-1.5 py-0.5 border border-brutalBlack font-black">02</span>
                  <span className="font-black text-sm tracking-wider uppercase">DIAGNOSE</span>
                </div>
                <span className="text-xl">🩺</span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-black text-brutalBlack tracking-tight">Cognitive Stress Probe</h3>
                <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
                  5 adaptive questions calibrated against 15 years of JEE Advanced trick questions to expose underlying misconception, not calculation slips.
                </p>
                <div className="bg-paper-100 border-[2px] border-brutalBlack p-3 font-mono text-xs space-y-1">
                  <span className="font-bold text-neutral-500 uppercase block text-[10px]">Diagnostic Engine:</span>
                  <div className="flex items-center gap-1.5 font-black text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="uppercase">Trap-Option Discrimination</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 03 */}
            <div className="bg-white border-[3px] border-brutalBlack shadow-brutal flex flex-col justify-between relative group">
              <div className="bg-schoolYellow text-brutalBlack p-3.5 border-b-[2.5px] border-brutalBlack flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-brutalBlack text-white px-1.5 py-0.5 border border-brutalBlack font-black">03</span>
                  <span className="font-black text-sm tracking-wider uppercase">FIX</span>
                </div>
                <span className="text-xl">🩹</span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-black text-brutalBlack tracking-tight">Surgical Recovery Stack</h3>
                <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
                  20-minute targeted recovery payload: 1 concept surgery note, 1 formula card, 1 vetted derivation. Built for rapid retention without fluff.
                </p>
                <div className="bg-paper-100 border-[2px] border-brutalBlack p-3 font-mono text-xs space-y-1">
                  <span className="font-bold text-neutral-500 uppercase block text-[10px]">Output Payload:</span>
                  <div className="font-black text-brutalBlack flex justify-between uppercase">
                    <span>3 Micro-Artifacts</span>
                    <span className="text-retroTeal font-black">≤ 20 Mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= MANIFESTO / SIDE-BY-SIDE BRUTALIST COMPARISON ======================= */}
        <section className="space-y-4 pt-4" id="compare">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <h3 className="font-black text-xl text-brutalBlack uppercase tracking-tight">Pedagogical Efficiency Contrast</h3>
            </div>
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase">WHY BRUTE FORCE MOCKS FAIL</span>
          </div>
          
          <div className="border-[3px] border-brutalBlack shadow-brutal bg-white overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y-[3px] md:divide-y-0 md:divide-x-[3px] divide-brutalBlack">
              
              {/* Column 1: Coaching Institute Grinder */}
              <div className="p-6 sm:p-8 bg-paper-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-neutral-500 uppercase">THE TRADITIONAL SYSTEM</span>
                    <span className="bg-neutral-300 text-neutral-700 font-mono text-xs font-black px-2 py-0.5 border border-brutalBlack uppercase">STATUS QUO</span>
                  </div>
                  <h4 className="text-2xl font-black text-neutral-600 line-through decoration-red-600 decoration-[3px]">
                    Coaching Institute Grinder
                  </h4>
                  <p className="text-sm font-medium text-neutral-600 mt-3 leading-relaxed">
                    Assigning 60 random practice questions when your bottleneck is a single misread sign convention in Lenz&apos;s Law. High cognitive fatigue, zero precision.
                  </p>
                  <ul className="mt-6 space-y-3 font-mono text-xs text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-black">✕</span>
                      <span className="line-through">3-hour generic recorded lectures for 2-minute doubts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-black">✕</span>
                      <span className="line-through">Mock test reports that only tell you "Physics: 44%"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-black">✕</span>
                      <span className="line-through">Blind repetition of already-mastered question types</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t-[2px] border-neutral-300 font-mono text-xs text-neutral-500 font-bold uppercase">
                  ESTIMATED TIME WASTED: ~14 HRS / WEEK
                </div>
              </div>

              {/* Column 2: GapZero Surgical Repair */}
              <div className="p-6 sm:p-8 bg-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 border-[2.5px] border-retroTeal text-retroTeal font-black font-mono text-xs px-2.5 py-1 rotate-3 uppercase bg-retroTeal-soft">
                  VERIFIED MASTERY
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black text-retroTeal-dark uppercase">THE CLINICAL ALTERNATIVE</span>
                  </div>
                  <h4 className="text-2xl font-black text-brutalBlack">
                    GapZero Surgical Repair
                  </h4>
                  <p className="text-sm font-bold text-neutral-800 mt-3 leading-relaxed">
                    Isolate the flawed intuition in under 12 minutes. Deliver a targeted 20-minute recovery stack with zero video bloat and vetted conceptual proofs.
                  </p>
                  <ul className="mt-6 space-y-3 font-mono text-xs text-neutral-900 font-bold">
                    <li className="flex items-start gap-2">
                      <span className="text-retroTeal font-black">✓</span>
                      <span>12-minute diagnostic probe isolates exact misconception</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-retroTeal font-black">✓</span>
                      <span>1 micro-concept repair note + 1 calibrated formula card</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-retroTeal font-black">✓</span>
                      <span>Direct cross-reference against JEE Advanced cohort trap logs</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t-[2px] border-brutalBlack flex items-center justify-between font-mono text-xs font-black">
                  <span className="text-retroTeal-dark uppercase">RECOVERY SPEED:</span>
                  <span className="bg-schoolYellow text-brutalBlack px-2 py-0.5 border border-brutalBlack uppercase">≤ 20 MINUTES TOTAL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= BOTTOM GUARANTEE CALLOUT ======================= */}
        <section className="bg-schoolYellow border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-white border-[2.5px] border-brutalBlack shadow-brutal flex items-center justify-center text-2xl shrink-0">
              🎯
            </div>
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-brutalBlack block">
                THE GAPZERO ZERO-WASTE CHARTER
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-brutalBlack">
                No video marathons. No generic mock tests. Pure conceptual repair.
              </h3>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link href="/topics" className="block w-full text-center md:w-auto bg-brutalBlack hover:bg-neutral-800 text-white font-black text-base px-8 py-4 border-[2.5px] border-brutalBlack shadow-brutal btn-brutal uppercase tracking-wider">
              BEGIN DIAGNOSIS NOW ➔
            </Link>
          </div>
        </section>

      </main>
      
      {/* ======================= BRUTALIST FOOTER ======================= */}
      <footer className="mt-16 bg-white border-t-[3px] border-brutalBlack py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-tight uppercase">GapZero Campus Voice</span>
            <span className="font-mono text-xs bg-schoolYellow px-2 py-0.5 border border-brutalBlack font-bold">2026/27</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs font-bold text-neutral-600 uppercase">
            <Link href="/topics" className="hover:text-brutalBlack hover:underline">DIAGNOSTIC MATRIX</Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-brutalBlack hover:underline">ANALYTICAL DASHBOARD</Link>
            <span>•</span>
            <Link href="/progress" className="hover:text-brutalBlack hover:underline">TELEMETRY ARCHIVE</Link>
          </div>
          <p className="font-mono text-xs text-neutral-600 text-center sm:text-right uppercase">
            High contrast academic diagnostic interface
          </p>
        </div>
      </footer>
    </>
  );
}
