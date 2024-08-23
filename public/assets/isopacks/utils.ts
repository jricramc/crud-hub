import type { IconInput } from '@/src-isoflow/types';

interface CreateIconArgs {
  id: string;
  name: string;
  url: React.FunctionComponent<React.SVGAttributes<SVGElement>> | string;
}

export const createCategoryIcon = (category: string) => {
  return ({ id, name, url }: CreateIconArgs) => {
    return {
      id,
      name,
      url: url.toString(),
      category
    };
  };
};

export const mergeIsopacks = (manifests: IconInput[][]) => {
  return manifests.reduce((acc, manifest) => {
    return [...acc, ...manifest];
  }, []);
};
