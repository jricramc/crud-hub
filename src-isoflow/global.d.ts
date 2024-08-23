import { Size, Coords, SceneInput } from '@/src-isoflow/types';

declare global {
  let PACKAGE_VERSION: string;
  let REPOSITORY_URL: string;

  interface Window {
    Isoflow: {
      getUnprojectedBounds: () => Size & Coords;
      fitProjectToScreen: () => void;
      setScene: (scene: SceneInput) => void;
    };
  }
}
