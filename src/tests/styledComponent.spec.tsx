import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { pipe } from 'fp-ts/lib/pipeable'
import { Props as _Props, styledComponent, extendStandModuleNoTheme } from '../index';

 describe('<Basic SFC />', () => {
    const A = pipe(
        extendStandModuleNoTheme({

            displayName: 'A',
            tag: 'div',
            defaultProps: {},
            style: {
                mkFlex: 'row',
                mkFlexAlignV: 'center',
            },
        }),
        styledComponent('div')
    );
  
    const TestA = (a: _Props) => (
        <A {...a} />
    );
    it('basic Props', () => {
        const wrapper = shallow<_Props>(
            <TestA mkColor='main' />
        );
        expect(wrapper.props().mkColor).toEqual('main')
    });
}); 

describe('<wrapper components />', () => {
    const C: React.SFC<{ text: string, className?: string }> = ({ text, className }) => (
        <div className={className}>{text}</div>
    )
    const A = pipe(
        extendStandModuleNoTheme({

            displayName: 'A',
            tag: 'div',
            defaultProps: {},
            style: {
                mkFlex: 'row',
                mkFlexAlignV: 'center',
            },
        }),
        styledComponent(C)
    );
    it('basic Props', () => {
        const wrapper = shallow<_Props & { text: string, className?: string }>(
            <A mkColor='main' text='hello' />
        );
        expect(wrapper.props().mkColor).toEqual('main');
        expect(wrapper.props().text).toEqual('hello')
    });
});

describe('<ref components />', () => {
    class C extends React.Component<{ text: string, className?: string }>{
        ref: HTMLButtonElement | null = null;
        render() {
            return (
                <button ref={a => this.ref = a} className={this.props.className}>{this.props.text}</button>);
        }
    }
    const A = pipe(
        extendStandModuleNoTheme({
            displayName: 'A',
            tag: 'div',
            defaultProps: {},
            style: {
                mkFlex: 'row',
                mkFlexAlignV: 'center',
            },
        }),
        styledComponent(C)
    );
    
    it('ref Props', () => {
        const wrapper = mount<_Props & { text: string, className?: string, ref: any }>(
            <A mkColor='main' text='hello' />
        );
        expect(wrapper.props().mkColor).toEqual('main');
        expect(wrapper.props().text).toEqual('hello')
    });
});
describe('< refed components />', () => {
    class C extends React.Component<{ text: string, className?: string }>{
        ref: HTMLButtonElement | null = null;
        render() {
            return (
                <button ref={a => this.ref = a} className={this.props.className}>{this.props.text}</button>);
        }
    }
    const A = pipe(
        extendStandModuleNoTheme({
            displayName: 'A',
            tag: 'div',
            defaultProps: {},
            style: {
                mkFlex: 'row',
                mkFlexAlignV: 'center',
            },
        }),
        styledComponent(C)
    );
   
    class B extends React.Component<{ text: string, className?: string } & _Props>{
        ref?: any = undefined;

        render() {
            const { text,   ...others } = this.props;
            const _A: any = A;
            return (
                <_A ref={(a:any) => this.ref = a} text={text} {...others}></_A>);
        }
    }
    it('ref Props', () => {
        const wrapper = mount<B>(
            <B mkColor='main' text='hello' />
        );
        expect(wrapper.props().mkColor).toEqual('main');
        const i = wrapper.instance().ref;
        expect(i).toBeInstanceOf(C);
        expect((((wrapper.instance()).ref!).ref!).tagName).toEqual('BUTTON');
        expect(wrapper.props().text).toEqual('hello')
    });

}); 
