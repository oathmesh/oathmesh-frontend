import { DocsSidebar } from '@/components/layout/docs-sidebar';
import { Github } from 'lucide-react';
// @file app/docs/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Documentation', template: '%s | OathMesh Docs' },
  description:
    'Complete technical documentation for the OathMesh zero-trust machine identity protocol.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pt-32">
      <div className="mx-auto flex max-w-7xl gap-0 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-white/6 lg:block">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <DocsSidebar />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
