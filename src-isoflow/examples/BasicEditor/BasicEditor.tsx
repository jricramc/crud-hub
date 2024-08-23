import React from 'react';
import Isoflow from '@/src-isoflow/Isoflow';
import { initialData } from '../initialData';

export const BasicEditor = () => {
  return <Isoflow initialData={initialData} />;
};
