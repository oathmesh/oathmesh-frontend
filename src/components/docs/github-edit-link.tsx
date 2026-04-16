import { Pencil } from 'lucide-react';
// @file components/docs/github-edit-link.tsx
import Link from 'next/link';

const GITHUB_BASE = 'https://github.com/oathmesh/oathmesh/edit/main/docs/site/';

interface GitHubEditLinkProps {
  path: string;
}

export function GitHubEditLink({ path }: GitHubEditLinkProps) {
  return (
    <div className="mb-6 flex justify-end">
      <Link
        href={`${GITHUB_BASE}${path}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/60"
        aria-label={`Edit this page on GitHub (${path})`}
      >
        <Pencil className="h-3 w-3" />
        Edit on GitHub
      </Link>
    </div>
  );
}
