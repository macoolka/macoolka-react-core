
import { styledComponent, esn } from '..';
import PureTouchRipple from './PureTouchRipple';
export const TouchRipple = esn({
  displayName: 'PureTouchRipple',
  tag: 'span',
  defaultProps: {
  },
  style: {
    display: 'block',
    position: 'absolute',
    mkScrollBar: 'none',
    borderRadius: 'inherit',
    mkWidth: 'full',
    mkHeight: 'full',
    left: 0,
    top: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
})
export default styledComponent(PureTouchRipple)(TouchRipple);
