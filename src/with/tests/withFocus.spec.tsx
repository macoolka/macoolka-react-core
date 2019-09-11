import React from 'react';
import {  useFakeTimers,SinonFakeTimers } from 'sinon';

import withFocus from '../withFocus';
import {shallow as _shallow,mount } from 'enzyme'
import {styled,cssComponentModule} from '../..'
import keycode from 'keycode'
const ButtonBase=withFocus(styled(cssComponentModule));
/* export const ButtonBase=withFocus(styled<'button'>({
  displayName:'B',
  defaultProps:{},
  tag:'button'
}
  )
  ); */

describe('mounted tab press listener', () => {
    let wrapper;
    let instance;
    let button;
    let clock:SinonFakeTimers;

    beforeEach(() => {
        clock = useFakeTimers();
        wrapper = mount(
          <ButtonBase id="test-button" tabIndex={0} as="button">
            Hello
          </ButtonBase>,
        );
        instance = wrapper.instance();
        button = wrapper.find('button').getDOMNode();
        if (!button) {
          throw new Error('missing button');
        }
        expect(wrapper.state().focusVisible).toEqual(false);
        wrapper.simulate('focus', {});
        expect(wrapper.state().focusVisible).toEqual(false);
        button.focus();
        expect(wrapper.state().focusVisible).toEqual(false);
        const event:any = new Event('keyup');
        event.which = keycode('tab');
        window.dispatchEvent(event);
    });

    afterEach(() => {
      clock.restore();
    });

    it('should detect the keyboard', async() => {
        expect(wrapper.state().focusVisible).toEqual(false);
      await clock.tick(instance.focusVisibleCheckTime * instance.focusVisibleMaxCheckTimes);
      expect(wrapper.state().focusVisible).toEqual(true);

    });

    it('should ignore the keyboard after 1s', () => {
      clock.tick(instance.focusVisibleCheckTime * instance.focusVisibleMaxCheckTimes);
      expect(wrapper.state().focusVisible).toEqual(true);
      wrapper.simulate('blur', {});
      expect(wrapper.state().focusVisible).toEqual(false);
      wrapper.simulate('focus', {});
      clock.tick(instance.focusVisibleCheckTime * instance.focusVisibleMaxCheckTimes);
      expect(wrapper.state().focusVisible).toEqual(true);
      clock.tick(1e3);
      wrapper.simulate('blur', {});
      expect(wrapper.state().focusVisible).toEqual(false);
      wrapper.simulate('focus', {});
      clock.tick(instance.focusVisibleCheckTime * instance.focusVisibleMaxCheckTimes);
      expect(wrapper.state().focusVisible).toEqual(false);
    }); 
    it('should reset the focused state', () => {
        // We simulate a focusVisible button that is getting disabled.
        wrapper.setState({
          focusVisible: true,
        });
        expect(wrapper.state().focusVisible).toEqual(true);
        wrapper.setProps({
          disabled: true,
        });
        expect(wrapper.state().focusVisible).toEqual(false);
      });
  });

  describe('handleFocus()', () => {
    let clock;

    beforeEach(() => {
      clock = useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });
    it('when enabled should persist event', () => {
        const wrapper = mount(
          <ButtonBase id="test-button" tabIndex={0} >
          Hello
        </ButtonBase>,
        );
        const mockF=jest.fn();
        const instance = wrapper.instance() as any;
        const eventMock = { persist: mockF };
        instance.handleFocus(eventMock);
        expect(mockF).toBeCalledTimes(1)
     });
    it('when disabled should not persist event', () => {
      const wrapper = mount(
        <ButtonBase id="test-button" tabIndex={0} disabled>
        Hello
      </ButtonBase>,
      );
      const mockF=jest.fn();
      const instance = wrapper.instance() as any;
      const eventMock = { persist: mockF };
      instance.handleFocus(eventMock);
      expect(mockF).toBeCalledTimes(0)
   });

   it('onFocusVisibleHandler() should propogate call to onFocusVisible prop', () => {
      const eventMock = 'woofButtonBase';
      const onFocusVisibleSpy = jest.fn();
      const wrapper = mount(
        <ButtonBase
        tabIndex={0}
          onFocusVisible={onFocusVisibleSpy}
        >
          Hello
        </ButtonBase>,
      );
      const instance = wrapper.instance() as any;
      instance.onFocusVisibleHandler(eventMock);
      expect(onFocusVisibleSpy).toBeCalledTimes(1);
      expect(onFocusVisibleSpy).toHaveBeenCalledWith(eventMock)
    });

  });