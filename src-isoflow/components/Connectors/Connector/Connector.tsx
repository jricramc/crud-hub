import React, { useMemo, useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import { Connector as ConnectorI, Loading } from '@/src-isoflow/types';
import { UNPROJECTED_TILE_SIZE } from '@/src-isoflow/config';
import {
  getAnchorPosition,
  getRectangleFromSize,
  CoordsUtils,
  getColorVariant
} from '@/src-isoflow/utils';
import { IsoTileArea } from '@/src-isoflow/components/IsoTileArea/IsoTileArea';
import { Circle } from '@/src-isoflow/components/Circle/Circle';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { useSceneStore } from '@/src-isoflow/stores/sceneStore';

interface Props {
  id?: string;
  connector: ConnectorI;
  loading?: Loading | object;
}

export const Connector = ({ id, connector, loading }: Props) => {
  const theme = useTheme();

  // @ts-ignore
  const [connectorPathTilesIndex, setConnectorPathTilesIndex] = useState<number | undefined>(loading?.delay !== undefined
    ? undefined
    : (connector.path.tiles.length || 0)
  );

  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });
  const nodes = useSceneStore((state) => {
    return state.nodes;
  });

  const itemControls = useUiStateStore((state) => {
    return state.itemControls;
  });

  const unprojectedTileSize = useMemo(() => {
    return UNPROJECTED_TILE_SIZE * zoom;
  }, [zoom]);

  const drawOffset = useMemo(() => {
    return {
      x: unprojectedTileSize / 2,
      y: unprojectedTileSize / 2
    };
  }, [unprojectedTileSize]);

  const pathString = useMemo(() => {
    return connector.path.tiles.slice(0, connectorPathTilesIndex || 0).reduce((acc, tile) => {
      return `${acc} ${tile.x * unprojectedTileSize + drawOffset.x},${
        tile.y * unprojectedTileSize + drawOffset.y
      }`;
    }, '');
  }, [unprojectedTileSize, connector.path.tiles, connectorPathTilesIndex, drawOffset]);


  const anchorPositions = useMemo(() => {
    return connector.anchors.map((anchor) => {
      const position = getAnchorPosition({ anchor, nodes });

      return {
        x: (connector.path.origin.x - position.x) * unprojectedTileSize,
        y: (connector.path.origin.y - position.y) * unprojectedTileSize
      };
    });
  }, [connector.path.origin, connector.anchors, nodes, unprojectedTileSize]);

  const connectorWidthPx = useMemo(() => {
    return (unprojectedTileSize / 100) * connector.width;
  }, [connector.width, unprojectedTileSize]);


  // @ts-ignore
  const [load, setLoad] = useState(loading?.delay === undefined)

  const [state, setState] = useState(connector.state)

  const strokeDashArray = useMemo(() => {
    switch (connector.style) {
      case 'DASHED':
        return `${connectorWidthPx * 2}, ${connectorWidthPx * 2}`;
      case 'DOTTED':
        return `0, ${connectorWidthPx * 1.8}`;
      case 'SOLID':
      default:
        return 'none';
    }
  }, [connector.style, connectorWidthPx]);

  useEffect(() => {
    if (load) {
      if (connectorPathTilesIndex === undefined && connector.path.tiles.length > 0) {
        setConnectorPathTilesIndex(0);
      }
    }
    
  }, [load]);

  useEffect(() => {
    // @ts-ignore
    if (!load && loading?.delay !== undefined) {
      setTimeout(() => {
        setLoad(true)
      },
      // @ts-ignore
      loading?.delay
      )
    }
  }, []);

  useEffect(() => {
    if (connectorPathTilesIndex !== undefined) {
      if (connectorPathTilesIndex < connector.path.tiles.length) {
        setTimeout(() => {
          setConnectorPathTilesIndex((prevState) => ((prevState || 0) + 1));
        }, 100)
      } else {
        // setTimeout(() => {
        //   setConnectorPathTilesIndex(0);
        // }, 100)
      }
    }
  });

  useEffect(() => {

    if (itemControls?.type === 'CONNECTOR' && itemControls?.id === id) {
      console.log('this connector needs to be animated')
      setConnectorPathTilesIndex(0);
    }
  }, [itemControls])

  useEffect(() => {
    if (connector.state !== state) {
      setState(connector.state)
    }
  }, [connector])

  useEffect(() => {
    if (state !== null && state !== undefined) {
      setConnectorPathTilesIndex(0);
    }
  }, [state])

  // @ts-ignore
  const connectorColor = (state === null || state === undefined) || !connector?.states[state]?.color ? connector.color : connector.states[state].color

  return (
    <IsoTileArea
    outline={''}
    pulse={false}
    label={''}
    loading={{}}
    {...getRectangleFromSize(connector.path.origin, connector.path.areaSize)}
    origin={connector.path.origin}
    zoom={zoom}
    fill="none"    >
      {/* <polyline
        points={pathString}
        stroke={theme.palette.common.white}
        strokeWidth={connectorWidthPx * 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.7}
        strokeDasharray={strokeDashArray}
        fill="none"
      /> */}
      <polyline
        points={pathString}
        stroke={getColorVariant(connectorColor , 'dark', { grade: 0.8 })}
        strokeWidth={connectorWidthPx}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDashArray}
        fill="none"
      />

      {anchorPositions.map((anchor) => {
        // @ts-ignore
        return (connectorPathTilesIndex >= 0 &&
          <>
            <Circle
              position={CoordsUtils.add(anchor, drawOffset)}
              radius={18 * zoom}
              fill={theme.palette.common.white}
              fillOpacity={0.7}
            />
            <Circle
              position={CoordsUtils.add(anchor, drawOffset)}
              radius={12 * zoom}
              stroke={theme.palette.common.black}
              fill={theme.palette.common.white}
              strokeWidth={6 * zoom}
            />
          </>
        );
      })}
    </IsoTileArea>
  );
};
