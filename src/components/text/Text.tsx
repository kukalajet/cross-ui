import React from 'react';
import { Text as DText, H1, H2, H3, H4, H5, H6 } from 'dripsy';
import type { SxProp } from 'dripsy';

type Props = {
  type: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
  value: string;
  sx: SxProp;
};

const Text = ({ type, sx, value }: Props) => {
  if (type === 'H1') return <H1 sx={sx}>{value}</H1>;
  if (type === 'H2') return <H2 sx={sx}>{value}</H2>;
  if (type === 'H3') return <H3 sx={sx}>{value}</H3>;
  if (type === 'H4') return <H4 sx={sx}>{value}</H4>;
  if (type === 'H5') return <H5 sx={sx}>{value}</H5>;
  if (type === 'H6') return <H6 sx={sx}>{value}</H6>;

  return <DText sx={sx}>{value}</DText>;
};

export default Text;
