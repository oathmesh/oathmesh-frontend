// @file components/ui/card.tsx
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
}

export function Card({ children, className, hover = false, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'card-surface',
        hover && 'card-surface-hover cursor-pointer',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('border-b border-white/6 p-5', className)}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
