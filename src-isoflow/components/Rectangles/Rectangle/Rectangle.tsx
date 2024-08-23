import React, { useEffect, useState } from 'react';
import { Coords, Loading } from '@/src-isoflow/types';
import { IsoTileArea } from '@/src-isoflow/components/IsoTileArea/IsoTileArea';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { getColorVariant } from '@/src-isoflow/utils';

interface Props {
  id: string;
  from: Coords;
  to: Coords;
  color: string;
  label: string;
  loading?: Loading;
  state?: null | number;
  states?: []
}

// @ts-ignore
export const Rectangle = ({ id, from, to, color, label = "", loading = {}, state: st, states = [] }: Props) => {
  const tile = useUiStateStore((state) => {
    return state.mouse.position.tile;
  });

  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });

  const itemEmphasis = useUiStateStore((state) => {
    // @ts-ignore
    return state.itemEmphasis;
  });

  const [state, setState] = useState(st);

  const isCursorInRectangle = () => {
    const x1 = tile.x > from.x;
    const x2 = tile.x > to.x
    const y1 = tile.y > from.y;
    const y2 = tile.y > to.y;

    if (x1 !== x2 && y1 !== y2) {
      return true
    }

    const x3 = tile.x === from.x;
    const x4 = tile.x === to.x;
    const y3 = tile.y === from.y;
    const y4 = tile.y === to.y;

    return x3 && y1 !== y2 || x4 && y1 !== y2 || y3 && x1 !== x2 || y4 && x1 !== x2 || x3 && y3 || x4 && y4 || x3 && y4 || x4 && y3
  };

  useEffect(() => {
    if (state !== st) {
      setState(st)
    }
  }, [st])

  // @ts-ignore
  const clr = state == undefined || state === null || !states[state]?.color ? color : states[state]?.color

  return (
    <IsoTileArea
      key={id}
      from={from}
      to={to}
      fill={clr}
      zoom={zoom}
      cornerRadius={22 * zoom}
      stroke={{
        color: getColorVariant(clr, 'dark', { grade: 2 }),
        width: 1 * zoom
      }}
      outline={isCursorInRectangle() ? 'active' : 'none'}
      label={label}
      loading={loading}
      pulse={itemEmphasis.includes(id)}
    />
  );
};
