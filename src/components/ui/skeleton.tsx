import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'rounded' | 'circular' | 'text';
}

export function Skeleton({
  className = '',
  variant = 'rounded',
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'rectangular'
      ? 'rounded-none'
      : variant === 'text'
      ? 'rounded h-4 my-1'
      : 'rounded-lg';

  return (
    <div
      className={`skeleton-box ${variantClass} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={`h-3.5 ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`card-elevated p-6 border border-border bg-white rounded-xl ${className}`}
    >
      {children || (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <SkeletonText lines={2} />
        </div>
      )}
    </div>
  );
}
