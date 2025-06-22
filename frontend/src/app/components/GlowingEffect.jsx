'use client';

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const GlowingEffect = memo(({
  blur = 0,
  inactiveZone = 0.3,
  proximity = 40,
  spread = 15,
  variant = "default",
  glow = false,
  disabled = false,
  movementDuration = 0.3, // Much faster animation
  borderWidth = 2,
  sx = {},
  ...props
}) => {
  const containerRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(0);
  const isAnimating = useRef(false);

  const handleMove = useCallback((e) => {
    if (!containerRef.current || disabled || isAnimating.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const element = containerRef.current;
      if (!element) return;

      const { left, top, width, height } = element.getBoundingClientRect();
      const mouseX = e?.clientX ?? e?.x ?? lastPosition.current.x;
      const mouseY = e?.clientY ?? e?.y ?? lastPosition.current.y;

      if (e) {
        lastPosition.current = { x: mouseX, y: mouseY };
      }

      const center = [left + width * 0.5, top + height * 0.5];
      const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);
      const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

      if (distanceFromCenter < inactiveRadius) {
        element.style.setProperty("--active", "0");
        return;
      }

      const isActive =
        mouseX > left - proximity &&
        mouseX < left + width + proximity &&
        mouseY > top - proximity &&
        mouseY < top + height + proximity;

      element.style.setProperty("--active", isActive ? "1" : "0");

      if (!isActive) return;

      const currentAngle = parseFloat(element.style.getPropertyValue("--start")) || 0;
      let targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;

      const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;

      // Much faster, simpler animation
      isAnimating.current = true;
      const startTime = performance.now();
      
      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / (movementDuration * 1000), 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Fast ease-out
        
        const interpolatedAngle = currentAngle + angleDiff * easeProgress;
        element.style.setProperty("--start", String(interpolatedAngle));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimating.current = false;
        }
      };
      
      requestAnimationFrame(animate);
    });
  }, [inactiveZone, proximity, movementDuration, disabled]);

  useEffect(() => {
    if (disabled) return;

    const handlePointerMove = (e) => handleMove(e);

    document.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handleMove, disabled]);

  const gradientStyles = variant === "white"
    ? `conic-gradient(from calc(var(--start) * 1deg), #ffffff, #ffffff80, #ffffff40, #ffffff80, #ffffff)`
    : `conic-gradient(from calc(var(--start) * 1deg), #667eea, #764ba2, #f093fb, #4facfe, #667eea)`;

  return (
    <>
      {/* Only border glow effect - no background interference */}
      <Box
        ref={containerRef}
        sx={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: `-${borderWidth}px`,
          borderRadius: 'inherit',
          opacity: disabled ? 0 : 1,
          zIndex: 0, // Behind content but above background
          ...sx
        }}
        style={{
          "--start": "0",
          "--active": "0",
          "--border-width": `${borderWidth}px`,
          "--gradient": gradientStyles,
        }}
        {...props}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            position: 'relative',
            background: 'var(--gradient)',
            opacity: 'var(--active)',
            transition: 'opacity 200ms ease',
            mask: `radial-gradient(farthest-side at 50% 50%, transparent calc(100% - var(--border-width)), white calc(100% - var(--border-width)))`,
            WebkitMask: `radial-gradient(farthest-side at 50% 50%, transparent calc(100% - var(--border-width)), white calc(100% - var(--border-width)))`,
          }}
        />
      </Box>
    </>
  );
});

GlowingEffect.displayName = 'GlowingEffect';

export default GlowingEffect; 