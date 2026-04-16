// @file components/landing/interactive-demo.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Key, Play, Server, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const PIPELINE_STEPS = [
  { id: 1, label: 'Client Requests Token', icon: Server },
  { id: 2, label: 'Verify Policy Logic', icon: ShieldCheck },
  { id: 3, label: 'Sign Ed25519 Payload', icon: Key },
  { id: 4, label: 'Issue 300s TTL Token', icon: CheckCircle2 },
];

export function InteractiveDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startDemo = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveStep(1);

    PIPELINE_STEPS.forEach((step, index) => {
      setTimeout(
        () => {
          setActiveStep(step.id);
        },
        (index + 1) * 800,
      );
    });

    setTimeout(
      () => {
        setIsPlaying(false);
      },
      PIPELINE_STEPS.length * 800 + 800,
    );
  };

  return (
    <section id="interactive-demo" className="relative py-24 bg-transparent overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-white mb-4 tracking-[-0.02em]">
            Watch it in action
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Experience the 14-step zero-trust pipeline distilled into seconds. No static keys. Pure
            cryptographic assurance.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
          <div className="absolute inset-0 bg-white/[0.02] blur-xl rounded-2xl" />
          <div className="relative bg-[#050505] rounded-[15px] border border-white/5 p-8 shadow-2xl overflow-hidden">
            {/* Background elements inside the card */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 blur-[100px] rounded-full" />

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Pipeline Visualization */}
              <div className="flex flex-col gap-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-8 bottom-8 w-[2px] bg-white-[0.02] border-l border-white/5" />

                {PIPELINE_STEPS.map((step) => {
                  const isActive = activeStep >= step.id;
                  const isCurrent = activeStep === step.id;

                  return (
                    <div
                      key={step.id}
                      className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                        isCurrent
                          ? 'bg-white/[0.04] border border-white/10 shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]'
                          : 'border border-transparent'
                      }`}
                    >
                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                          isActive
                            ? 'border-white bg-white text-black'
                            : 'border-white/10 bg-transparent text-white/40'
                        }`}
                      >
                        <step.icon className="h-4 w-4" />
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-medium transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/40'}`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <p className="text-xs text-white/50 mt-1 animate-fadeIn">Processing...</p>
                        )}
                        {isActive && !isCurrent && (
                          <p className="text-xs text-emerald-400 mt-1 animate-fadeIn">Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Side: Action Console */}
              <div className="flex flex-col justify-center items-center h-full min-h-[300px] rounded-xl border border-white/5 bg-black/50 p-6">
                {activeStep === 0 && (
                  <button
                    onClick={startDemo}
                    className="group flex flex-col items-center gap-4 text-white/70 hover:text-white transition-colors"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-transform group-hover:scale-105 active:scale-95">
                      <Play className="h-6 w-6 ml-1" />
                    </div>
                    <span className="text-sm font-medium">Initialize Token Minting</span>
                  </button>
                )}

                {activeStep > 0 && activeStep < PIPELINE_STEPS.length && (
                  <div className="text-center animate-fadeIn">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <p className="mt-4 text-sm text-white/60 font-mono">
                      Executing step {activeStep}/{PIPELINE_STEPS.length}
                    </p>
                  </div>
                )}

                {activeStep === PIPELINE_STEPS.length && (
                  <div className="text-center animate-fadeInUp">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <p className="text-white font-medium mb-1">Token Generated</p>
                    <p className="text-xs font-mono text-white/40 break-all px-4 select-all">
                      om_eyJhbGciOiJFZERTQSIsInR5cCI6Im9tK2p3dCJ9...
                    </p>
                    <button
                      onClick={() => setActiveStep(0)}
                      className="mt-6 text-xs text-white/50 hover:text-white underline underline-offset-4"
                    >
                      Reset Demo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
