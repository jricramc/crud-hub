"use client"

import React, { useEffect, useState, useRef } from 'react';
import $ from "jquery"
import { shallow } from 'zustand/shallow';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { theme } from '@/src-isoflow/styles/theme';
import {
  SceneInput,
  IconInput,
  NodeInput,
  ConnectorInput,
  RectangleInput,
  Scene,
  ConnectorStyleEnum,
  InitialData
} from '@/src-isoflow/types';
import { sceneToSceneInput } from '@/src-isoflow/utils';
import { useSceneStore, SceneProvider } from '@/src-isoflow/stores/sceneStore';
import { Renderer } from '@/src-isoflow/components/Renderer/Renderer';
import { LabelContainer } from '@/src-isoflow/components/Nodes/Node/LabelContainer';
import { useWindowUtils } from '@/src-isoflow/hooks/useWindowUtils';
import { sceneInput as sceneValidationSchema } from '@/src-isoflow/validation/scene';
import { EMPTY_SCENE } from '@/src-isoflow/config';
import { UiOverlay } from '@/src-isoflow/components/UiOverlay/UiOverlay';
import { UiStateProvider, useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { useScroll } from './hooks/useScroll';

interface Props {
  initialData?: InitialData;
  disableInteractions?: boolean;
  onSceneUpdated?: (scene: SceneInput) => void;
  width?: number | string;
  height?: number | string;
  debugMode?: boolean;
}

const App = ({
  initialData,
  width,
  height = '100%',
  disableInteractions: disableInteractionsProp,
  onSceneUpdated,
  debugMode = false
}: Props) => {
  const previnitialData = useRef<SceneInput>(EMPTY_SCENE);
  const [isReady, setIsReady] = useState(false);

  const [selectedElement, setSelectedElement] = useState<null | object>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useWindowUtils();
  const scene = useSceneStore(({ nodes, connectors, rectangles, icons }) => {
    return { nodes, connectors, rectangles, icons };
  }, shallow);
  const { actions: sceneActions, connectors: sceneConnectors, rectangles: sceneRectangles } = useSceneStore((state) => {
    return state;
  });
  const uiActions = useUiStateStore((state) => {
    return state.actions;
  });

  const uiItemControls = useUiStateStore((state) => {
    return state.itemControls;
  });

  const { scrollToTile } = useScroll();


  useEffect(() => {
    console.log('uiItemControls: ', uiItemControls)
    setSelectedElement(uiItemControls)

    // @ts-ignore
    if (uiItemControls?.node?.position) {
      // @ts-ignore
      scrollToTile(uiItemControls?.node?.position)
    }

    if (uiItemControls === null) {
      setScrollTop(0)
    } else if (scrollTop < 40){

      setScrollTop(50);
    }

    const updateStates = ({ ids = { connectors: [], rectangles: [] }, newState = null }) => {
      // turn connectors purple
      const connectorsIdToState = {};
      sceneConnectors.map(({ id, state }) => {
        // @ts-ignore
        connectorsIdToState[id] = state
      })
      // @ts-ignore
      const updateConnectors = sceneConnectors.some(({ id, state }) => ids.connectors.includes(id) && !(state > newState))

      if (updateConnectors) {
        // update the state of all 
        console.log(`update connectors states to ${newState}`)
        ids.connectors.map((id: string) => {
          // @ts-ignore
          if (!(connectorsIdToState[id] > newState)) {
            sceneActions.updateConnector(id, { state: newState });
          }
        })
      }

      // turn rectangles purple
      const rectanglesIdToState = {};
      sceneRectangles.map(({ id, state }) => {
        // @ts-ignore
        rectanglesIdToState[id] = state
      });
      // @ts-ignore
      const updateRectangles = sceneRectangles.some(({ id, state }) => ids.rectangles.includes(id) && !(state > newState))

      if (updateRectangles) {
        // update the state of all 
        console.log(`update rectangles states to ${newState}`)
        ids.rectangles.map((id) => {
          // @ts-ignore
          if (!(rectanglesIdToState[id] > newState)) {
            sceneActions.updateRectangle(id, { state: newState });
          }
        })
      }
    };


    // @ts-ignore
    if (uiItemControls?.id === 'my-api') {

      const ids = {
        connectors: ['14', '15', '16', '17', '18', '19'],
        rectangles: ['core-api-group', 'stripe-payment-highlight', 'google-oauth-highlight', 'clients-highlight', 'database-highlight', 'lambda-highlight', 'websocket-highlight', 'api-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 0 });

      // @ts-ignore
    } else if (uiItemControls?.id === 'aws-s3-bucket') {

      const ids = {
        connectors: ['8'],
        rectangles: ['s3-bucket-block-highlight', 'database-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 1 });

      // @ts-ignore
    } else if (uiItemControls?.id === 'stripe-api-payment') {

      const ids = {
        connectors: ['12'],
        rectangles: ['stripe-payment-highlight', 'stripe-payment-block-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 1 });

      // @ts-ignore
    } else if (uiItemControls?.id === 'google-oauthentication') {

      const ids = {
        connectors: ['13'],
        rectangles: ['google-oauth-highlight', 'google-oauth-block-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 1 });

      // @ts-ignore
    } else if (uiItemControls?.id === 'lambda-1') {

      const ids = {
        connectors: ['5'],
        rectangles: ['lambda-highlight', 'lambda-1-block-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 1 });

      // @ts-ignore
    } else if (uiItemControls?.id === 'lambda-2') {

      const ids = {
        connectors: ['6'],
        rectangles: ['lambda-highlight', 'lambda-2-block-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 1 });

      // @ts-ignore
    } else if (uiItemControls?.id === 'lambda-3') {

      const ids = {
        connectors: ['7'],
        rectangles: ['lambda-highlight', 'lambda-3-block-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 1 });

      // @ts-ignore
    } else if (uiItemControls?.id === 'websocket-block') {

      const ids = {
        connectors: ['4'],
        rectangles: ['websocket-highlight', 'websocket-block-highlight']
      }

      // @ts-ignore
      updateStates({ ids, newState: 1 });

    }

  }, [uiItemControls])

  useEffect(() => {
    uiActions.setZoom(initialData?.zoom ?? 1);
    uiActions.setDisableInteractions(Boolean(disableInteractionsProp));
  }, [initialData?.zoom, disableInteractionsProp, sceneActions, uiActions]);

  useEffect(() => {
    if (!initialData || previnitialData.current === initialData) return;

    previnitialData.current = initialData;
    sceneActions.setScene(initialData);
    setIsReady(true);
  }, [initialData, sceneActions]);

  useEffect(() => {
    if (!isReady || !onSceneUpdated) return;

    const sceneInput = sceneToSceneInput(scene);
    onSceneUpdated(sceneInput);
  }, [scene, onSceneUpdated, isReady]);

  useEffect(() => {
    uiActions.setDebugMode(debugMode);
  }, [debugMode, uiActions]);

  // useEffect(() => {
  //   console.log('scrollTop: ', scrollTop)
  // }, [scrollTop])

  useEffect(() => {
  //   $('#content-container').mousewheel(function(event, delta) {
  //     event.preventDefault();
  //     console.log('delta: ', delta)
  //  });

   $('#content-container').bind('mousewheel', function(e){
      console.log('window: ', window.innerHeight);
      // @ts-ignore
      const dy = e?.originalEvent?.wheelDelta || 0
      if(dy / 120 > 0) {
        console.log('scrolling up: ', dy);
        const vh = dy / window.innerHeight;
        setScrollTop((prevState) => (prevState - vh) < 40 ? 40 : prevState - vh)
      }
      else{
        console.log('scrolling down: ', dy);
        const vh = dy / window.innerHeight;
        setScrollTop((prevState) => (prevState - vh) > 100 ? 100 : prevState - vh)
      }
    });

  });

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflowY: 'hidden' }}>
      <Box
        sx={{
          width: width ?? '100%',
          height,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Renderer />
        <UiOverlay />
      </Box>
      {/* <div id="content-container" style={{ transition: 'all 0.5s', position: 'absolute', top: `calc(100vh - ${scrollTop}vh)`, left: 0, width: '100%', minHeight: '100%', backgroundColor: 'white' }}>
        <img src="assets/bg-img-6.png" width="100%" />
      </div> */}
    </div>
  );
};

export const Isoflow = (props: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <SceneProvider>
        <UiStateProvider>
          <App {...props} />
        </UiStateProvider>
      </SceneProvider>
    </ThemeProvider>
  );
};

const useIsoflow = () => {
  const updateNode = useSceneStore((state) => {
    return state.actions.updateNode;
  });

  return {
    updateNode
  };
};

export default Isoflow;

export {
  // @ts-ignore
  InitialData,
  // @ts-ignore
  Scene,
  // @ts-ignore
  SceneInput,
  // @ts-ignore
  IconInput,
  // @ts-ignore
  NodeInput,
  // @ts-ignore
  RectangleInput,
  // @ts-ignore
  ConnectorInput,
  useIsoflow,
  LabelContainer,
  sceneValidationSchema,
  ConnectorStyleEnum
};
