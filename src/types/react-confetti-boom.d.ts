declare module 'react-confetti-boom' {
  import type { FC } from 'react';

  export interface ConfettiProps {
    mode?: 'boom' | 'fall';
    x?: number;
    y?: number;
    particleCount?: number;
    deg?: number;
    shapeSize?: number;
    spreadDeg?: number;
    effectInterval?: number;
    effectCount?: number;
    colors?: string[];
    launchSpeed?: number;
    fadeOutHeight?: number;
    opacityDeltaMultiplier?: number;
  }

  const Confetti: FC<ConfettiProps>;
  export default Confetti;
}
