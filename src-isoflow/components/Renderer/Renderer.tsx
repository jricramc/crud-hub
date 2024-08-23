import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { useInteractionManager } from '@/src-isoflow/interaction/useInteractionManager';
import { Grid } from '@/src-isoflow/components/Grid/Grid';
import { Cursor } from '@/src-isoflow/components/Cursor/Cursor';
import { Nodes } from '@/src-isoflow/components/Nodes/Nodes';
import { Rectangles } from '@/src-isoflow/components/Rectangles/Rectangles';
import { Connectors } from '@/src-isoflow/components/Connectors/Connectors';
import { DebugUtils } from '@/src-isoflow/components/DebugUtils/DebugUtils';
import { useResizeObserver } from '@/src-isoflow/hooks/useResizeObserver';
import { SceneLayer } from '@/src-isoflow/components/SceneLayer/SceneLayer';

export const Renderer = () => {
  const containerRef = useRef<HTMLDivElement>();
  const debugMode = useUiStateStore((state) => {
    return state.debugMode;
  });
  const mode = useUiStateStore((state) => {
    return state.mode;
  });
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const { setElement: setInteractionsElement } = useInteractionManager();
  const { observe, disconnect, size: rendererSize } = useResizeObserver();

  useEffect(() => {
    if (!containerRef.current) return;

    observe(containerRef.current);
    setInteractionsElement(containerRef.current);

    return () => {
      disconnect();
    };
  }, [setInteractionsElement, observe, disconnect]);

  useEffect(() => {
    uiStateActions.setRendererSize(rendererSize);
  }, [rendererSize, uiStateActions]);

  return (
    <Box
      sx={{
        position: 'absolute',
        background: '#040D19',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <SceneLayer>
        <Rectangles key="rectangles" />
      </SceneLayer>
      <SceneLayer>
        <Grid />
      </SceneLayer>
      {mode.showCursor && (
        <SceneLayer>
          <Cursor />
        </SceneLayer>
      )}
      <SceneLayer>
        <Connectors key="connectors" />
      </SceneLayer>
      <SceneLayer>
        <Nodes key="nodes" />
      </SceneLayer>
      {debugMode && (
        <SceneLayer>
          <DebugUtils />
        </SceneLayer>
      )}
      {/* Interaction layer */}
      <SceneLayer ref={containerRef} />
    </Box>
  );
};
