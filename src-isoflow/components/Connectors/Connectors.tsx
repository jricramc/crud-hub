import React from 'react';
import { useSceneStore } from '@/src-isoflow/stores/sceneStore';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { Connector } from './Connector/Connector';

export const Connectors = () => {
  const connectors = useSceneStore((state) => {
    return state.connectors;
  });
  const mode = useUiStateStore((state) => {
    return state.mode;
  });

  return (
    <>
      {connectors.map((connector) => {
        return <Connector key={connector.id} id={connector.id} connector={connector} loading={connector.loading} />;
      })}
      {mode.type === 'CONNECTOR' && mode.connector && (
        <Connector connector={mode.connector} loading={{}} />
      )}
    </>
  );
};
