import React, { useEffect, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  id?: string;
}

export function FadeIn({
  children,
  delayMs = 0,
  durationMs = 1000,
  className = '',
  id,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <div
      id={id}
      className={`transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: 'ease-out',
      }}
    >
      {children}
    </div>
  );
}
