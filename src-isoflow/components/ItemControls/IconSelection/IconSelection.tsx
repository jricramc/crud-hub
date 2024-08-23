import React, { useCallback } from 'react';
import { useSceneStore } from '@/src-isoflow/stores/sceneStore';
import { ControlsContainer } from '@/src-isoflow/components/ItemControls/components/ControlsContainer';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { Icon } from '@/src-isoflow/types';
import { Icons } from './Icons';

export const IconSelection = () => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const mode = useUiStateStore((state) => {
    return state.mode;
  });
  const icons = useSceneStore((state) => {
    return state.icons;
  });

  const onMouseDown = useCallback(
    (icon: Icon) => {
      if (mode.type !== 'PLACE_ELEMENT') return;

      uiStateActions.setMode({
        type: 'PLACE_ELEMENT',
        showCursor: true,
        icon
      });
    },
    [mode, uiStateActions]
  );

  return (
    <ControlsContainer>
      <Icons icons={icons} onMouseDown={onMouseDown} />
    </ControlsContainer>
  );
};
