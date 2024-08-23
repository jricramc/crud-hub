import { SceneInput } from '@/src-isoflow/types';

export const scene: SceneInput = {
  icons: [
    {
      id: 'icon1',
      name: 'Icon1',
      url: 'https://isoflow.io/static/assets/icons/networking/server.svg'
    },
    {
      id: 'icon2',
      name: 'Icon2',
      url: 'https://isoflow.io/static/assets/icons/networking/block.svg'
    }
  ],
  nodes: [
    // @ts-ignore
    {
      id: 'node1',
      label: 'Node1',
      iconId: 'icon1',
      position: {
        x: 0,
        y: 0
      }
    },
    // @ts-ignore
    {
      id: 'node2',
      label: 'Node2',
      iconId: 'icon2',
      position: {
        x: 1,
        y: 1
      }
    },
    // @ts-ignore
    {
      id: 'node3',
      label: 'Node3',
      iconId: 'icon1',
      position: {
        x: 2,
        y: 2
      }
    }
  ],
  connectors: [
    // @ts-ignore
    {
      id: 'connector1',
      anchors: [{ nodeId: 'node1' }, { nodeId: 'node2' }]
    },
    // @ts-ignore
    {
      id: 'connector2',
      anchors: [{ nodeId: 'node2' }, { nodeId: 'node3' }]
    }
  ],
  // @ts-ignore
  rectangles: [{ id: 'rectangle1', from: { x: 0, y: 0 }, to: { x: 2, y: 2 } }]
};
