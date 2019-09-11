import * as React from 'react';
/* import ReactDOM from 'react-dom';
import keycode from 'keycode'; */
import { shallow } from 'enzyme';
import withElement from '../withElement';
import renderer from 'react-test-renderer'
import 'jest-styled-components'
describe('<withElement />', () => {

    const _A: React.SFC<React.ButtonHTMLAttributes<{}>> = ({ children, ...others }) => (<button {...others}>{children}</button>)
    const A = withElement(_A);

    describe('root node', () => {
        it('should render a element with type="div" by default', () => {
            const wrapper = shallow(<A>Hello</A>);
            expect(wrapper.name()).toEqual('_A');
            expect((wrapper.dive() as any).props().children).toEqual('Hello');
            expect(wrapper.props().type).toBeUndefined();
            const tree = renderer.create(<A>Hello</A>).toJSON()
            expect(tree).toMatchSnapshot()
        });
        it('should change the  type', () => {
            const R = <A type="submit">Hello</A>
            const wrapper = shallow(R);
            expect(wrapper.props().type).toEqual('submit');
            const tree = renderer.create(R).toJSON()
            expect(tree).toMatchSnapshot()
        });

        it('should change the element component and add accessibility requirements', () => {
            const R = <A role="checkbox" aria-checked={false}>Hello</A>
            const wrapper = shallow(R);
            expect(wrapper.props().role).toEqual('checkbox');
            expect(wrapper.props().tabIndex).toEqual(0);
            const tree = renderer.create(R).toJSON()
            expect(tree).toMatchSnapshot()

        });
        it('should spread props on button', () => {
            const R = <A data-test="hello">Hello</A>
            const wrapper = shallow(R);
            expect(wrapper.prop('data-test')).toEqual('hello');
            const tree = renderer.create(R).toJSON()
            expect(tree).toMatchSnapshot()
        });
        it('should spread props on button', () => {
            const R = <A disabled tabIndex={100}>Hello</A>
            const wrapper = shallow(R);
            expect(wrapper.prop('tabIndex')).toEqual(-1);
            const tree = renderer.create(R).toJSON()
            expect(tree).toMatchSnapshot()
        });
    });


});
