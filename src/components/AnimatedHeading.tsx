import React, { useEffect, useState } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  id?: string;
}

export function AnimatedHeading({ text, className = '', id }: AnimatedHeadingProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 200); // starts after 200ms initial delay
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\n');
  const charDelay = 30; // 30ms

  return (
    <h1
      id={id}
      className={`${className}`}
      style={{ letterSpacing: '-0.04em' }}
    >
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        const words = line.split(' ');
        let charCounter = 0;
        
        return (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => {
              const wordChars = Array.from(word);
              const isLastWord = wordIndex === words.length - 1;

              return (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                  {wordChars.map((char) => {
                    const charIndex = charCounter++;
                    const delay = (lineIndex * lineLength * charDelay) + (charIndex * charDelay);
                    
                    return (
                      <span
                        key={charIndex}
                        className="inline-block transition-all ease-out"
                        style={{
                          opacity: isAnimated ? 1 : 0,
                          transform: isAnimated ? 'translateX(0)' : 'translateX(-18px)',
                          transitionDuration: '500ms',
                          transitionDelay: `${delay}ms`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                  {!isLastWord && (
                    <span
                      key={`space-${wordIndex}`}
                      className="inline-block transition-all ease-out"
                      style={{
                        opacity: isAnimated ? 1 : 0,
                        transform: isAnimated ? 'translateX(0)' : 'translateX(-18px)',
                        transitionDuration: '500ms',
                        transitionDelay: `${(lineIndex * lineLength * charDelay) + (charCounter++ * charDelay)}ms`,
                      }}
                    >
                      {'\u00A0'}
                    </span>
                  )}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}

