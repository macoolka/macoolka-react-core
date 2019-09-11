import React from 'react';
import {  useFakeTimers } from 'sinon';
export {
  useFakeTimers
}
import withRipple from '../withRipple';
import {startAction,stopAction} from '../../Ripple'
import {shallow as _shallow,mount as _mount} from 'enzyme'
import {styled} from '../..'
import {standComponentModule} from '../../css'
import * as O from 'fp-ts/lib/Option'
import {pipe} from 'fp-ts/lib/pipeable'
// import renderer from 'react-test-renderer'
// import 'jest-styled-components'
const ButtonBase=withRipple(styled(standComponentModule) as any);
describe('<ButtonBase />', () => {
 // let mount;
  const shallow= (a)=>_shallow(a,{ disableLifecycleMethods: true });;

  describe('ripple', () => {
    let wrapper;

    beforeAll(() => {
      wrapper = shallow(<ButtonBase>Hello</ButtonBase>);
    });

    it('should be enabled by default', () => {
      const rippleInstance=(wrapper.instance());
      expect(rippleInstance).toBeTruthy();
    });

    it('should start the ripple when the mouse is pressed', () => {
      const rippleInstance=(wrapper.instance());
      const start=jest.fn();
      const stop=jest.fn();
      const f=(a)=>pipe(
        startAction.getOption(a),
        O.map(start),
        O.getOrElse(()=>pipe(
          stopAction.getOption(a),
          O.map(stop)
        )
      ))
      rippleInstance.execute=f;
      wrapper.simulate('mouseDown', {});
      expect(start).toBeCalledTimes(1)
      expect(stop).toBeCalledTimes(0)
    });
    it('should stop the ripple when the mouse is released', () => {
        const rippleInstance=(wrapper.instance());
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
      //  const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('mouseUp', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(1)
      });
      it('should stop the ripple when the mouse is released', () => {

      });
  
      it('should stop the ripple when the button blurs', () => {
        const rippleInstance=(wrapper.instance());
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
       // const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('blur', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(1)
      });
  
  
      it('should stop the ripple when the mouse leaves', () => {
        const rippleInstance=(wrapper.instance());
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
       // const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('mouseLeave', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(1)
      });
      it('should start the ripple when the touch start', () => {
        const rippleInstance=(wrapper.instance());
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
       // const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('touchstart', {touches:[{clientX:0,clientY:0}]});
        expect(start).toBeCalledTimes(1)
        expect(stop).toBeCalledTimes(0)
      });
      it('should stop the ripple when the touch end', () => {
        const rippleInstance=(wrapper.instance());
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
       // const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('touchEnd', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(1)
      });
      it('should stop the ripple when the touch move', () => {
        const rippleInstance=(wrapper.instance());
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
      //  const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('touchMove', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(1)
      });
      it('prop: disableTouchRipple should work', () => {
        const rippleInstance=(wrapper.instance());
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
       // const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('touchMove', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(1)
      });    
/*       it('should center the ripple', () => {
        const tree = renderer.create(<ButtonBase centerRipple>Hello</ButtonBase>).toJSON()
        expect(tree).toMatchSnapshot()
      });  */
  });
  describe('prop: disableTouchRipple', () => {
    it('should work', () => {
    const wrapper = shallow(<ButtonBase disableTouchRipple>Hello</ButtonBase>);
        const rippleInstance=(wrapper.instance()) as any;
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
       // const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('mouseDown', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(0)
        wrapper.simulate('mouseUp', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(0)
        wrapper.simulate('blur', {});
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(1)
    });
  });

  describe('prop: disableRipple', () => {
    it('should work', () => {
        const wrapper = shallow(<ButtonBase disableRipple={true}>Hello</ButtonBase>);
        const rippleInstance=(wrapper.instance()) as any;
        const start=jest.fn();
        const stop=jest.fn();
        const f=(a)=>pipe(
          startAction.getOption(a),
          O.map(start),
          O.getOrElse(()=>pipe(
            stopAction.getOption(a),
            O.map(stop)
          )
        ))
       // const f=(a)=>startAction.getOption(a).map(start).getOrElse(stopAction.getOption(a).map(stop));;
        rippleInstance.execute=f;
        wrapper.simulate('mouseDown', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(0)
        wrapper.simulate('mouseUp', {});
  
        expect(start).toBeCalledTimes(0)
        expect(stop).toBeCalledTimes(0)
     
    });
  });
});
