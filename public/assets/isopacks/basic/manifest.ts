import type { SceneInput } from '@/src-isoflow/types';
import { createCategoryIcon } from '../utils';
import Block from './icons/block.svg';
import Cube from './icons/cube.svg';
import Diamond from './icons/diamond.svg';
import Pyramid from './icons/pyramid.svg';
import Sphere from './icons/sphere.svg';

const createIcon = createCategoryIcon('Basic shapes');

export const basicIsopack: SceneInput['icons'] = [
  createIcon({
    id: 'block',
    name: 'Block',
    url: 'assets/isopacks/basic/icons/block.svg'
  }),
  createIcon({
    id: 'cube',
    name: 'Cube',
    url: 'assets/isopacks/basic/icons/cube.svg'
  }),
  createIcon({
    id: 'diamond',
    name: 'Diamond',
    url: 'assets/isopacks/basic/icons/diamond.svg'
  }),
  createIcon({
    id: 'pyramid',
    name: 'Pyramid',
    url: 'assets/isopacks/basic/icons/pyramid.svg'
  }),
  createIcon({
    id: 'sphere',
    name: 'Sphere',
    url: 'assets/isopacks/basic/icons/sphere.svg'
  })
];
