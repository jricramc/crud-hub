import { produce } from 'immer';
import { ModeActions } from '@/src-isoflow/types';
import { getItemAtTile, hasMovedTile } from '@/src-isoflow/utils';

export const Cursor: ModeActions = {
  mousemove: ({ uiState }) => {
    if (uiState.mode.type !== 'CURSOR' || !hasMovedTile(uiState.mouse)) return;

    const { mousedownItem } = uiState.mode;

    if (mousedownItem) {
      // uiState.actions.setMode({
      //   type: 'DRAG_ITEMS',
      //   showCursor: true,
      //   items: [mousedownItem],
      //   isInitialMovement: true
      // });

      uiState.actions.setItemControls(null);
    } else {
      // console.log('uiState.mouse: ', uiState.mouse);
      // console.log('uiState: ', uiState);
    }
  },
  mousedown: ({ uiState, scene, isRendererInteraction }) => {
    if (uiState.mode.type !== 'CURSOR' || !isRendererInteraction) return;

    const itemAtTile = getItemAtTile({
      tile: uiState.mouse.position.tile,
      scene
    });

    uiState.actions.setMode(
      produce(uiState.mode, (draftState) => {
        if (itemAtTile) {
          draftState.mousedownItem = {
            type: itemAtTile.type,
            id: itemAtTile.id
          };
        } else {
          draftState.mousedownItem = null;
        }
      })
    );
  },
  mouseup: (opts) => {
    const { uiState, isRendererInteraction, scene } = opts
    if (uiState.mode.type !== 'CURSOR' || !isRendererInteraction) return;

    if (uiState.mode.mousedownItem) {

      const type = ['NODE', 'RECTANGLE', 'CONNECTOR'].includes(uiState.mode.mousedownItem.type)
        ? uiState.mode.mousedownItem.type
        : undefined;

      // if (uiState.mode.mousedownItem.type === 'NODE') {
      //   uiState.actions.setItemControls({
      //     type: 'NODE',
      //     id: uiState.mode.mousedownItem.id
      //   });
      // } else if (uiState.mode.mousedownItem.type === 'RECTANGLE') {
      //   uiState.actions.setItemControls({
      //     type: 'RECTANGLE',
      //     id: uiState.mode.mousedownItem.id
      //   });
      // } else if (uiState.mode.mousedownItem.type === 'CONNECTOR') {
      //   uiState.actions.setItemControls({
      //     type: 'CONNECTOR',
      //     id: uiState.mode.mousedownItem.id
      //   });
      // }

      if (type) {

        // @ts-ignore
        const node = scene.nodes.find(({ id }) => uiState?.mode?.mousedownItem?.id === id)

        console.log({
          type,
          node,
        })
        // uiState.mode.mousedownItem
        uiState.actions.setItemControls({
          type,
          id: uiState.mode.mousedownItem.id,
          node,
        });
      }

    } else {
      uiState.actions.setItemControls(null);
    }

    uiState.actions.setMode(
      produce(uiState.mode, (draftState) => {
        draftState.mousedownItem = null;
      })
    );
  }
};
