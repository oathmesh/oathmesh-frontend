// @file components/layout/docs-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Getting Started',
    children: [
      { label: 'Overview', href: '/docs' },
      { label: 'Quick Start', href: '/docs/quickstart' },
    ],
  },
  {
    label: 'Protocol',
    children: [
      { label: 'How It Works', href: '/docs/how-it-works' },
      { label: 'Token Format', href: '/docs/token-format' },
      { label: 'Verification', href: '/docs/verification' },
      { label: 'Policy Engine', href: '/docs/policy' },
      { label: 'Audit Logs', href: '/docs/audit' },
      { label: 'Gateway Mode', href: '/docs/gateway' },
    ],
  },
  {
    label: 'SDKs',
    children: [
      { label: 'Overview', href: '/docs/sdks' },
      { label: 'Go', href: '/docs/sdks/go' },
      { label: 'Node.js / TypeScript', href: '/docs/sdks/nodejs' },
      { label: 'Python', href: '/docs/sdks/python' },
    ],
  },
  {
    label: 'Security',
    children: [
      { label: 'Threat Model', href: '/docs/threat-model' },
      { label: 'FAQ', href: '/docs/faq' },
    ],
  },
];

function NavSection({ item }: { item: NavItem }) {
  const pathname = usePathname();

  // Determine if any child is active to auto-expand
  const hasActiveChild = item.children?.some((c) => c.href === pathname);
  const [open, setOpen] = useState(hasActiveChild ?? true);

  if (!item.children) {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href!}
        className={cn(
          'block rounded-md px-3 py-1.5 text-sm transition-colors',
          isActive
            ? 'bg-brand/12 font-medium text-brand-light'
            : 'text-white/50 hover:bg-white/5 hover:text-white/80',
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/30 hover:text-white/50 transition-colors"
        aria-expanded={open}
      >
        {item.label}
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>

      {open && (
        <div className="mt-1 space-y-0.5 pl-1">
          {item.children.map((child) => (
            <NavSection key={child.label} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

interface DocsSidebarProps {
  className?: string;
}

export function DocsSidebar({ className }: DocsSidebarProps) {
  return (
    <aside
      aria-label="Documentation navigation"
      className={cn(
        'flex flex-col gap-4 py-6',
        className,
      )}
    >
      {navItems.map((section) => (
        <NavSection key={section.label} item={section} />
      ))}
    </aside>
  );
}
