// @file components/docs/tab-group.tsx
'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CopyButton } from './copy-button';

interface Tab {
  label: string;
  language: string;
  code: string;
}

interface TabGroupProps {
  tabs: Tab[];
  defaultTab?: number;
}

export function TabGroup({ tabs, defaultTab = 0 }: TabGroupProps) {
  const [active, setActive] = useState(defaultTab);
  const current = tabs[active]!;

  return (
    <div className="code-block my-5 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-white/6 px-2">
        <div className="flex" role="tablist" aria-label="Code examples">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              role="tab"
              aria-selected={i === active}
              aria-controls={`tabpanel-${i}`}
              id={`tab-${i}`}
              onClick={() => setActive(i)}
              className={cn(
                'border-b-2 px-4 py-2.5 text-sm transition-colors',
                i === active
                  ? 'border-brand text-white'
                  : 'border-transparent text-white/40 hover:text-white/70',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CopyButton text={current.code} />
      </div>

      {/* Panel */}
      <div
        id={`tabpanel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="bg-surface-0/40 p-5"
      >
        <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-white/75">
          <code>{current.code}</code>
        </pre>
      </div>
    </div>
  );
}
