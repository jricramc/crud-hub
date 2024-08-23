import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { useProjectedTileSize } from '@/src-isoflow/hooks/useProjectedTileSize';
import { useResizeObserver } from '@/src-isoflow/hooks/useResizeObserver';
import { IconInput } from '@/src-isoflow/types';

import "@/styles/isoflow/g.css"
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';

interface Props {
  icon: IconInput;
  onImageLoaded?: () => void;
}

export const NodeIcon = ({ icon, onImageLoaded }: Props) => {
  const ref = useRef();
  const projectedTileSize = useProjectedTileSize();
  const { size, observe, disconnect } = useResizeObserver();

  useEffect(() => {
    if (!ref.current) return;

    observe(ref.current);

    return disconnect;
  }, [observe, disconnect]);

  return (
    <Box
      ref={ref}
      component="img"
      onLoad={onImageLoaded}
      src={icon.url}
      sx={{
        position: 'absolute',
        // width: projectedTileSize.width * 0.9,
        width: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(icon.id) ? 400 : projectedTileSize.width * 0.9,
        pointerEvents: 'none',
        top: -size.height,
        left: -size.width / 2
      }}
    />
  );
};
