import { useMemo } from 'react';
import { useSceneStore } from '@/src-isoflow/stores/sceneStore';
import { getItemById } from '@/src-isoflow/utils';

export const useNode = (id: string) => {
  const nodes = useSceneStore((state) => {
    return state.nodes;
  });

  const node = useMemo(() => {
    return getItemById(nodes, id).item;
  }, [nodes, id]);

  return node;
};
