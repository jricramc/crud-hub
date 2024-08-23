import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Node as NodeI, IconInput, TileOriginEnum, Loading } from '@/src-isoflow/types';
import { useProjectedTileSize } from '@/src-isoflow/hooks/useProjectedTileSize';
import { useGetTilePosition } from '@/src-isoflow/hooks/useGetTilePosition';
import { LabelContainer } from './LabelContainer';
import { MarkdownLabel } from './LabelTypes/MarkdownLabel';
import { NodeIcon } from './NodeIcon';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';

interface Props {
  node: NodeI;
  icon?: IconInput;
  order: number;
  loading?: Loading;
}

// @ts-ignore
export const Node = ({ node, icon, order, loading = {} }: Props) => {
  const nodeRef = useRef<HTMLDivElement>();
  const projectedTileSize = useProjectedTileSize();
  const { getTilePosition } = useGetTilePosition();

  const itemEmphasis = useUiStateStore((state) => {
    // @ts-ignore
    return state.itemEmphasis;
  });

  const onImageLoaded = useCallback(() => {
    if (!nodeRef.current) return;

    nodeRef.current.style.opacity = '1';
  }, []);

  const position = useMemo(() => {
    return getTilePosition({
      tile: node.position,
      origin: TileOriginEnum.BOTTOM
    });
  }, [node.position, getTilePosition]);

  const label = useMemo(() => {
    if (node.label === undefined || node.label === '<p><br></p>') return null;

    return node.label;
  }, [node.label]);

  const [load, setLoad] = useState(loading?.delay === undefined)

  useEffect(() => {
    if (!load && loading?.delay !== undefined) {
      setTimeout(() => {
        setLoad(true)
      }, loading?.delay)
    }
  }, []);

  return (
    <Box
      sx={{
        transition: loading?.duration && `opacity ${loading?.duration}ms`,
        opacity: load ? 1 : 0,
        position: 'absolute',
        zIndex: order
      }}
    >
      <Box
        ref={nodeRef}
        className={itemEmphasis.includes(node.id) && 'vert-move'}
        sx={{
          transition: 'all 1s',
          position: 'absolute',
          opacity: 0,
          left: position.x,
          top: position.y
        }}
      >
        {label && (
          <Box
            sx={{
              position: 'absolute'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -projectedTileSize.height
              }}
            />
            <LabelContainer labelHeight={node.labelHeight} connectorDotSize={8}>
              <MarkdownLabel label={label} />
            </LabelContainer>
          </Box>
        )}
        {icon && (
          <Box
            sx={{
              position: 'absolute',
              width: 100,
              height: 100,
            }}
          >
            <NodeIcon icon={icon} onImageLoaded={onImageLoaded} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
