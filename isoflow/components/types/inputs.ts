import z from 'zod';
import {
  iconInput,
  nodeInput,
  connectorAnchorInput,
  connectorInput,
  rectangleInput
} from '@/src-isoflow/validation/sceneItems';
import { sceneInput } from '@/src-isoflow/validation/scene';

export { ConnectorStyleEnum } from '@/src-isoflow/validation/sceneItems';
export type IconInput = z.infer<typeof iconInput>;
export type NodeInput = z.infer<typeof nodeInput>;
export type ConnectorAnchorInput = z.infer<typeof connectorAnchorInput>;
export type ConnectorInput = z.infer<typeof connectorInput>;
export type RectangleInput = z.infer<typeof rectangleInput>;
export type SceneInput = z.infer<typeof sceneInput>;
