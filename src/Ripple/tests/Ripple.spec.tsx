import * as React from 'react';
// import TouchRipple from './TouchRipple';
import Ripple from '../Ripple';
import { shallow, ShallowWrapper,mount } from 'enzyme';
// import {delayTimerFunction} from 'mocoolka-fp/lib/Delay'
const getRootInstancer = (a: ShallowWrapper<any>) => a.childAt(0).dive().props() as { pulsate: boolean, visible: boolean }
const getChildInstance = (a: ShallowWrapper<any>) => a.childAt(0).dive().childAt(0).dive().props() as{  pulsate: boolean, visible: boolean }
describe('<Ripple />', () => {

  it('should render a Transition', () => {
    const wrapper = shallow<Ripple>(
      <Ripple timeout={{}} circle={{ point: { x: 0, y: 0 }, radius: 10 }} />,
    );
    expect(wrapper.name()).toEqual('Transition')
  });

  it('should start and stop the ripple ', () => {
    const wrapper = shallow<Ripple>(
      <Ripple
        timeout={{ exit: 0, enter: 0 }}
        in={false}
        circle={{ point: { x: 0, y: 0 }, radius: 11 }}
      />,
    );
    expect(wrapper.state().visible).toEqual(false);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getRootInstancer(wrapper).pulsate).toEqual(false);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getChildInstance(wrapper).pulsate).toEqual(false);
    wrapper.instance().setState({ visible: true });
    wrapper.update();
    expect(wrapper.state().visible).toEqual(true);
    expect(getRootInstancer(wrapper).visible).toEqual(true);
    expect(getChildInstance(wrapper).visible).toEqual(false);
    expect(getRootInstancer(wrapper).pulsate).toEqual(false);
    expect(getChildInstance(wrapper).pulsate).toEqual(false);
    wrapper.instance().setState({ visible: false });
    wrapper.update();
    expect(wrapper.state().visible).toEqual(false);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getChildInstance(wrapper).visible).toEqual(false);
    expect(getRootInstancer(wrapper).pulsate).toEqual(false);
    expect(getChildInstance(wrapper).pulsate).toEqual(false);
    wrapper.instance().setState({ leaving: true });
    wrapper.update();
    expect(wrapper.state().leaving).toEqual(true);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getChildInstance(wrapper).visible).toEqual(true);
    expect(getRootInstancer(wrapper).pulsate).toEqual(false);
    expect(getChildInstance(wrapper).pulsate).toEqual(false);
  })

  it('should start and stop the ripple with pulsate', () => {
    const wrapper = shallow<Ripple>(
      <Ripple
        timeout={{ exit: 0, enter: 0 }}
        in={false}
        pulsate={true}
        circle={{ point: { x: 0, y: 0 }, radius: 11 }}
      />,
    );
    expect(wrapper.state().visible).toEqual(false);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getRootInstancer(wrapper).pulsate).toEqual(true);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getChildInstance(wrapper).pulsate).toEqual(true);
    wrapper.instance().setState({ visible: true });
    wrapper.update();
    expect(wrapper.state().visible).toEqual(true);
    expect(getRootInstancer(wrapper).visible).toEqual(true);
    expect(getChildInstance(wrapper).visible).toEqual(false);
    expect(getRootInstancer(wrapper).pulsate).toEqual(true);
    expect(getChildInstance(wrapper).pulsate).toEqual(true);
    wrapper.instance().setState({ visible: false });
    wrapper.update();
    expect(wrapper.state().visible).toEqual(false);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getChildInstance(wrapper).visible).toEqual(false);
    expect(getRootInstancer(wrapper).pulsate).toEqual(true);
    expect(getChildInstance(wrapper).pulsate).toEqual(true);
    wrapper.instance().setState({ leaving: true });
    wrapper.update();
    expect(wrapper.state().leaving).toEqual(true);
    expect(getRootInstancer(wrapper).visible).toEqual(false);
    expect(getChildInstance(wrapper).visible).toEqual(true);
    expect(getRootInstancer(wrapper).pulsate).toEqual(true);
    expect(getChildInstance(wrapper).pulsate).toEqual(true);
  })
  it('should start and stop the ripple with mount', () => {
    const mockEnter = jest.fn(x => true);
    const mockExit = jest.fn(x => true);
    const wrapper = mount<Ripple>(
      <Ripple
        timeout={{ exit: 0, enter: 0 }}
        onEnter={mockEnter}
        onExit={mockExit}
        in={false}
        pulsate={true}
        circle={{ point: { x: 0, y: 0 }, radius: 11 }}
      />,
    );
    wrapper.setProps({ in: true });
    wrapper.update();
    expect(mockEnter).toBeCalledTimes(1)
    expect(wrapper.state().visible).toEqual(true);
    
    wrapper.setProps({ in: false });
    wrapper.update();
    expect(wrapper.state().visible).toEqual(true);
    expect(wrapper.state().leaving).toEqual(true);
    expect(mockExit).toBeCalledTimes(1)
  }); 
 });

