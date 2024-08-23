import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { Coords, TileOriginEnum, IconInput } from '@/src-isoflow/types';
import { useGetTilePosition } from '@/src-isoflow/hooks/useGetTilePosition';
import { NodeIcon } from '@/src-isoflow/components/Nodes/Node/NodeIcon';

interface Props {
  icon: IconInput;
  tile: Coords;
}

export const DragAndDrop = ({ icon, tile }: Props) => {
  const { getTilePosition } = useGetTilePosition();

  const tilePosition = useMemo(() => {
    return getTilePosition({ tile, origin: TileOriginEnum.BOTTOM });
  }, [tile, getTilePosition]);

  return (
    <Box
      sx={{
        transition: 'all 1s',
        position: 'absolute',
        left: tilePosition.x,
        top: tilePosition.y
      }}
    >
      <NodeIcon icon={icon} />
    </Box>
  );
};
