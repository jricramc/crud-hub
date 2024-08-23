import React from 'react';
import {
  PanToolOutlined as PanToolIcon,
  ZoomInOutlined as ZoomInIcon,
  ZoomOutOutlined as ZoomOutIcon,
  NearMeOutlined as NearMeIcon,
  AddOutlined as AddIcon,
  EastOutlined as ConnectorIcon,
  CropSquareOutlined as CropSquareIcon
} from '@mui/icons-material';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { MAX_ZOOM, MIN_ZOOM } from '@/src-isoflow/config';
import { IconButton } from '@/src-isoflow/components/IconButton/IconButton';
import { UiElement } from '@/src-isoflow/components/UiElement/UiElement';
import { Input } from '@mui/material';

export const ToolMenu = () => {
  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });
  const mode = useUiStateStore((state) => {
    return state.mode;
  });
  const uiStateStoreActions = useUiStateStore((state) => {
    return state.actions;
  });

  return (
    <>
      <UiElement orientation="TOPLEFT">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 16 }}>
          <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 40, padding: '0px 10px' }}>
            <img src="webhub-logo-2.png" width="40px" />
          </span>
          <span style={{ fontWeight: 'bold', fontSize: 14 }}>WebHUB Playground</span>
          {/* <Input disableUnderline value="https://53zl8kiry2.execute-api.us-east-2.amazonaws.com/v3" style={{ fontSize: 12, width: 230 }} /> */}
        </div>
      </UiElement>
      <UiElement orientation="TOPLEFT" sx={{ left: 265 }}>
        <IconButton
          name="Select"
          Icon={<NearMeIcon />}
          onClick={() => {
            uiStateStoreActions.setMode({
              type: 'CURSOR',
              showCursor: true,
              mousedownItem: null
            });
          }}
          isActive={mode.type === 'CURSOR'}
        />
        <IconButton
          name="Pan"
          Icon={<PanToolIcon />}
          onClick={() => {
            uiStateStoreActions.setMode({
              type: 'PAN',
              showCursor: false
            });
          }}
          isActive={mode.type === 'PAN'}
        />
        <IconButton
          name="Zoom in"
          Icon={<ZoomInIcon />}
          onClick={uiStateStoreActions.incrementZoom}
          disabled={zoom === MAX_ZOOM}
        />
        <IconButton
          name="Zoom out"
          Icon={<ZoomOutIcon />}
          onClick={uiStateStoreActions.decrementZoom}
          disabled={zoom === MIN_ZOOM}
        />
      </UiElement>
    </>
    
  );
};
