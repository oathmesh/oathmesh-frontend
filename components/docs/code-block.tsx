// @file components/docs/code-block.tsx

// Client island for copy functionality
import { CopyButton } from './copy-button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'bash',
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div
      data-search-content
      className="code-block my-5 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="font-mono text-xs text-white/40">{filename}</span>
          )}
          {!filename && (
            <span className="text-xs font-medium uppercase tracking-wide text-white/30">
              {language}
            </span>
          )}
        </div>
        <CopyButton text={code} />
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[13px] leading-relaxed text-white/78">
          {showLineNumbers ? (
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-6 w-6 shrink-0 select-none text-right text-white/20">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </code>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
