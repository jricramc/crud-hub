import {
  SceneInput,
  NodeInput,
  ConnectorInput,
  RectangleInput,
  SceneItemTypeEnum,
  Scene,
  Node,
  Connector,
  Rectangle,
  ConnectorAnchorInput,
  ConnectorAnchor,
  Coords,
  ConnectorStyleEnum
} from '@/src-isoflow/types';
import { NODE_DEFAULTS, DEFAULT_COLOR, CONNECTOR_DEFAULTS } from '@/src-isoflow/config';
import { getConnectorPath } from './renderer';

export const nodeInputToNode = (nodeInput: NodeInput): Node => {
  return {
    type: SceneItemTypeEnum.NODE,
    id: nodeInput.id,
    label: nodeInput.label ?? NODE_DEFAULTS.label,
    labelHeight: nodeInput.labelHeight ?? NODE_DEFAULTS.labelHeight,
    color: nodeInput.color ?? NODE_DEFAULTS.color,
    iconId: nodeInput.iconId,
    position: nodeInput.position,
    isSelected: false,
    loading: nodeInput.loading,
  };
};

export const rectangleInputToRectangle = (
  rectangleInput: RectangleInput
): Rectangle => {
  return {
    type: SceneItemTypeEnum.RECTANGLE,
    id: rectangleInput.id,
    from: rectangleInput.from,
    to: rectangleInput.to,
    color: rectangleInput.color ?? DEFAULT_COLOR,
    label: rectangleInput.label || '',
    loading: rectangleInput.loading || {},
    // @ts-ignore
    state: rectangleInput.state || null,
    // @ts-ignore
    states: rectangleInput.states || [],
  };
};

const connectorAnchorInputToConnectorAnchor = (
  anchor: ConnectorAnchorInput
): ConnectorAnchor => {
  if (anchor.nodeId) {
    return {
      type: 'NODE',
      id: anchor.nodeId
    };
  }

  return {
    type: 'TILE',
    coords: anchor.tile as Coords
  };
};

export const connectorInputToConnector = (
  connectorInput: ConnectorInput,
  nodes: Node[]
): Connector => {
  const anchors = connectorInput.anchors
    .map((anchor) => {
      return connectorAnchorInputToConnectorAnchor(anchor);
    })
    .filter((anchor) => {
      return anchor !== null;
    });

  return {
    type: SceneItemTypeEnum.CONNECTOR,
    id: connectorInput.id,
    color: connectorInput.color ?? DEFAULT_COLOR,
    width: connectorInput.width ?? CONNECTOR_DEFAULTS.width,
    style: connectorInput.style ?? CONNECTOR_DEFAULTS.style,
    anchors,
    path: getConnectorPath({ anchors, nodes }),
    loading: connectorInput.loading,
    // @ts-ignore
    state: connectorInput.state,
    // @ts-ignore
    states: connectorInput.states || [],
  };
};

export const sceneInputToScene = (sceneInput: SceneInput): Scene => {
  const nodes = sceneInput.nodes.map((nodeInput) => {
    return nodeInputToNode(nodeInput);
  });

  const rectangles = sceneInput.rectangles.map((rectangleInput) => {
    return rectangleInputToRectangle(rectangleInput);
  });

  const connectors = sceneInput.connectors.map((connectorInput) => {
    return connectorInputToConnector(connectorInput, nodes);
  });

  return {
    ...sceneInput,
    nodes,
    rectangles,
    connectors,
    icons: sceneInput.icons
  } as Scene;
};

export const nodeToNodeInput = (node: Node): NodeInput => {
  return {
    id: node.id,
    position: node.position,
    label: node.label,
    labelHeight: node.labelHeight,
    color: node.color,
    iconId: node.iconId,
    // @ts-ignore
    loading: node.loading,
  };
};

export const connectorAnchorToConnectorAnchorInput = (
  anchor: ConnectorAnchor
): ConnectorAnchorInput | null => {
  switch (anchor.type) {
    case 'NODE':
      return {
        nodeId: anchor.id
      };
    case 'TILE':
      return {
        tile: anchor.coords
      };
    default:
      return null;
  }
};

export const connectorToConnectorInput = (
  connector: Connector
): ConnectorInput => {
  const anchors = connector.anchors
    .map((anchor) => {
      return connectorAnchorToConnectorAnchorInput(anchor);
    })
    .filter((anchor): anchor is ConnectorAnchorInput => {
      return !!anchor;
    });

  return {
    id: connector.id,
    color: connector.color,
    anchors,
    // @ts-ignore
    loading: connector.loading,
  };
};

export const rectangleToRectangleInput = (
  rectangle: Rectangle
): RectangleInput => {
  return {
    id: rectangle.id,
    color: rectangle.color,
    from: rectangle.from,
    to: rectangle.to,
    label: rectangle.label,
    // @ts-ignore
    loading: rectangle.loading,
    state: rectangle.states,
    states: rectangle.states,
  };
};

export const sceneToSceneInput = (scene: Scene): SceneInput => {
  // @ts-ignore
  const nodes: NodeInput[] = scene.nodes.map(nodeInputToNode);
  const connectors: ConnectorInput[] = scene.connectors.map(
    connectorToConnectorInput,
    nodes
  );
  const rectangles: RectangleInput[] = scene.rectangles.map(
    rectangleToRectangleInput
  );

  return {
    nodes,
    connectors,
    rectangles,
    icons: scene.icons
  } as SceneInput;
};
