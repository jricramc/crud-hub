import React from 'react';
import { SceneLayer } from '@/src-isoflow/components/SceneLayer/SceneLayer';
import { DragAndDrop } from '@/src-isoflow/components/DragAndDrop/DragAndDrop';
import { ItemControlsManager } from '@/src-isoflow/components/ItemControls/ItemControlsManager';
import { ToolMenu } from '@/src-isoflow/components/ToolMenu/ToolMenu';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { MainMenu } from '@/src-isoflow/components/MainMenu/MainMenu';

export const UiOverlay = () => {
  const disableInteractions = useUiStateStore((state) => {
    return state.disableInteractions;
  });
  const mode = useUiStateStore((state) => {
    return state.mode;
  });
  const mouse = useUiStateStore((state) => {
    return state.mouse;
  });

  if (disableInteractions) return null;

  return (
    <>
      <ToolMenu />
      {/* <ItemControlsManager /> */}
      {mode.type === 'PLACE_ELEMENT' && mode.icon && (
        <SceneLayer>
          <DragAndDrop icon={mode.icon} tile={mouse.position.tile} />
        </SceneLayer>
      )}
    </>
  );
};
