import { useCallback } from 'react';
import { CoordsUtils } from '@/src-isoflow/utils';
import { Coords, TileOriginEnum } from '@/src-isoflow/types';
import { useGetTilePosition } from '@/src-isoflow/hooks/useGetTilePosition';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';

export const useScroll = () => {
  const { getTilePosition } = useGetTilePosition();
  const scroll = useUiStateStore((state) => {
    return state.scroll;
  });
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const rendererSize = useUiStateStore((state) => {
    return state.rendererSize;
  });

  const scrollToTile = useCallback(
    (tile: Coords, origin?: TileOriginEnum) => {
      const tilePosition = getTilePosition({ tile, origin });
      const scrollTo: Coords = {
        x: scroll.position.x - tilePosition.x + rendererSize.width / 2,
        y: scroll.position.y - tilePosition.y + rendererSize.height / 2
      };

      uiStateActions.setScroll({
        offset: CoordsUtils.zero(),
        position: scrollTo
      });
    },
    [getTilePosition, scroll.position, uiStateActions, rendererSize]
  );

  return {
    scroll,
    scrollToTile
  };
};
