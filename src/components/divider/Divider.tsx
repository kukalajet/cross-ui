import { colord } from 'colord';
import { styled, View } from 'dripsy';
import { theme } from '../../configs';

const onSurfaceColor = theme.colors.$onSurface;

const Divider = styled(View)(() => ({
  height: [0.75, 0.75, 1],
  width: '90%',
  backgroundColor: colord(onSurfaceColor).alpha(0.1).toHex(),
  alignSelf: 'center',
}));

export default Divider;
