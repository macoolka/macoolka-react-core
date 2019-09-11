import * as React from 'react';

import PureTouchRipple,{startAction,stopAction,DELAY_RIPPLE}  from '../PureTouchRipple';
import Ripple  from '../Ripple';
import { shallow,mount} from 'enzyme';
import {useFakeTimers,SinonFakeTimers} from 'sinon';

export const mountS=<O extends {}>(S:React.ReactElement<any>)=>{
  const root=mount<O>(S);
  const instance =root.instance() as any as O;
  return {
    wrapper:root,
    instance,
  }
}

describe('<TouchRipple />', () => {
  it('should render a <ReactTransitionGroup> component', () => {
    const wrapper = shallow<PureTouchRipple>(<PureTouchRipple />,{disableLifecycleMethods: true});
    const instance=wrapper.instance();
    expect(wrapper.name()).toEqual('TransitionGroup');
    expect(instance.props.center).toEqual(false);
  });

  describe('prop: center', () => {
    it('should compute the right ripple dimensions', () => {
      const wrapper = shallow<PureTouchRipple>(<PureTouchRipple center />,{disableLifecycleMethods: true});
      const instance = wrapper.instance();
      instance.dispatch(startAction.reverseGet({
        x:0,y:0,eventName:'',pulsate:false
      }))
      wrapper.update();
      const ripple=wrapper.childAt(0)
      expect(ripple.props().circle.radius).toEqual(1);
    });
  });
 
  it('should create individual ripples', () => {
    const wrapper = mount<PureTouchRipple>(
        <PureTouchRipple/>
    );
    const instance = wrapper.instance() as PureTouchRipple;

    expect(wrapper.state().ripples.length).toEqual(0);
    instance.dispatch(startAction.reverseGet({
      x:0,y:0,eventName:'',pulsate:false
    }))
    expect(wrapper.state().ripples.length).toEqual(1);

    instance.dispatch(startAction.reverseGet({
      x:0,y:0,eventName:'',pulsate:false
    }))
    expect(wrapper.state().ripples.length).toEqual(2);

    instance.dispatch(startAction.reverseGet({
      x:0,y:0,eventName:'',pulsate:false
    }))
    expect(wrapper.state().ripples.length).toEqual(3);
    instance.dispatch(stopAction.reverseGet({
      eventName:'mouseup',persist:()=>void 0
    }))
    expect(wrapper.state().ripples.length).toEqual(2);
    instance.dispatch(stopAction.reverseGet({
      eventName:'mouseup',persist:()=>void 0
    }))
    expect(wrapper.state().ripples.length).toEqual(1);
    instance.dispatch(stopAction.reverseGet({
      eventName:'mouseup',persist:()=>void 0
    }))
    expect(wrapper.state().ripples.length).toEqual(0);
  });
  it('should create a ripple', () => {
    const instance =  shallow<PureTouchRipple>(<PureTouchRipple />,{disableLifecycleMethods: true}).instance();
    instance.dispatch(startAction.reverseGet({
      x:0,y:0,eventName:'',pulsate:true
    }))
    expect(instance.state.ripples.length).toEqual(1);
  });
  it('should ignore a mousedown event', () => {
    const instance = shallow<PureTouchRipple>(<PureTouchRipple />,{disableLifecycleMethods: true}).instance();
    instance.ignoringMouseDown = true;
    instance.dispatch(startAction.reverseGet({
      x:0,y:0,eventName:'mousedown',pulsate:true
    }))
    expect(instance.state.ripples.length).toEqual(0);
  });
  it('should set ignoringMouseDown to true', () => {
    const instance = shallow<PureTouchRipple>(<PureTouchRipple />,{disableLifecycleMethods: true}).instance();
    expect(instance.ignoringMouseDown).toEqual(false);
    instance.dispatch(startAction.reverseGet({
      x:0,y:0,eventName:'touchstart',pulsate:true
    }))
    expect(instance.ignoringMouseDown).toEqual(true);
    expect(instance.state.ripples.length).toEqual(0);
  });
  it('should create a specific ripple', () => {
    const instance = shallow<PureTouchRipple>(<PureTouchRipple />,{disableLifecycleMethods: true}).instance();
    instance.dispatch(startAction.reverseGet({
      x:1,y:1,eventName:'',pulsate:false
    }))
    expect(instance.state.ripples.length).toEqual(1);
    const ripple=(instance.state.ripples[0] as Ripple);
    expect(ripple.props.circle.point.x).toEqual(1);
    expect(ripple.props.circle.point.y).toEqual(1);

  });
  it('should create a specific ripple with pulsate', () => {
    const instance = shallow<PureTouchRipple>(<PureTouchRipple />,{disableLifecycleMethods: true}).instance();
    instance.dispatch(startAction.reverseGet({
      x:1,y:1,eventName:'',pulsate:true
    }))
    expect(instance.state.ripples.length).toEqual(1);
    const ripple=(instance.state.ripples[0] as Ripple);
    expect(ripple.props.circle.point.x).toEqual(0);
    expect(ripple.props.circle.point.y).toEqual(0);

  });
 

  describe('mobile', () => {
    let clock:SinonFakeTimers;

    beforeEach(() => {
      clock = useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should delay the display of the ripples', () => {
      const wrapper = mount<PureTouchRipple>(
        <PureTouchRipple/>
    );
      const instance = wrapper.instance();
      expect(wrapper.state().ripples.length).toEqual(0);
      instance.dispatch(startAction.reverseGet({
        x:0,y:0,eventName:'touchstart',pulsate:false
      }))
      expect(wrapper.state().ripples.length).toEqual(0);

      clock.tick(DELAY_RIPPLE);
      expect(wrapper.state().ripples.length).toEqual(1);
      clock.tick(DELAY_RIPPLE);
      instance.dispatch(stopAction.reverseGet({
        eventName:'touchend',persist:()=>void 0
      }));
      expect(wrapper.state().ripples.length).toEqual(0);
    });

    it('should trigger the ripple for short touch interactions', async () => {
      const wrapper = mount<PureTouchRipple>(
        <PureTouchRipple/>
    );
      const instance = wrapper.instance();
      expect(wrapper.state().ripples.length).toEqual(0);
      instance.dispatch(startAction.reverseGet({
        x:0,y:0,eventName:'touchstart',pulsate:false
      }))
      expect(wrapper.state().ripples.length).toEqual(0);
      clock.tick(DELAY_RIPPLE / 2);
      expect(wrapper.state().ripples.length).toEqual(0);
      instance.dispatch(stopAction.reverseGet({
        eventName:'touchstop',persist:()=>void 0
      }));
      expect(wrapper.state().ripples.length).toEqual(1);
      clock.tick(1);
      expect(wrapper.state().ripples.length).toEqual(0);
    });

    it('should interupt the ripple schedule', () => {
      const wrapper = mount<PureTouchRipple>(
        <PureTouchRipple/>
    );
      const instance = wrapper.instance();

      expect(wrapper.state().ripples.length).toEqual(0);
      instance.dispatch(startAction.reverseGet({
        x:0,y:0,eventName:'touchstart',pulsate:false
      }))
      expect(wrapper.state().ripples.length).toEqual(0);

      expect(wrapper.state().ripples.length).toEqual(0);
      instance.dispatch(stopAction.reverseGet({
        eventName:'touchmove',persist:()=>void 0
      }));
      expect(wrapper.state().ripples.length).toEqual(0);

    }); 
  }); 
});
