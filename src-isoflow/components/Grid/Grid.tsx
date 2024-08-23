import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import gridTileSvg from 'src/assets/grid-tile-bg.svg';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { getProjectedTileSize } from '@/src-isoflow/utils';

export const Grid = () => {
  const scroll = useUiStateStore((state) => {
    return state.scroll;
  });
  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });
  const projectedTileSize = useMemo(() => {
    return getProjectedTileSize({ zoom });
  }, [zoom]);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <Box
        key="the-box"
        sx={{
          transition: 'all 1s',
          position: 'absolute',
          opacity: 0.5,
          width: '100%',
          height: '100%',
          // background: `repeat url("${gridTileSvg}")`,
          background: `repeat url("assets/grid-tile-bg.svg")`,
          backgroundSize: `${projectedTileSize.width}px`,
          backgroundPosition: `calc(50% + ${
            scroll.position.x % projectedTileSize.width
          }px) calc(50% + ${scroll.position.y % projectedTileSize.height}px)`
        }}
      />
    </Box>
  );
};
