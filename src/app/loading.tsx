// @file app/loading.tsx
import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 h-16 w-16 -ml-8 -mt-8 rounded-full border border-white/10 border-t-white/80 animate-[spin_1.5s_linear_infinite]" />

          {/* Inner pulse ring */}
          <div className="absolute inset-0 h-10 w-10 -ml-5 -mt-5 rounded-full border border-white/20 animate-pulse" />

          {/* Center dot */}
          <div className="absolute h-2 w-2 -ml-1 -mt-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-[15px] font-medium tracking-wide text-white animate-pulse">
            Establishing secure connection...
          </p>
          <p className="text-[13px] text-white/40 font-mono">Verifying zero-trust identity</p>
        </div>
      </div>
    </div>
  );
}
