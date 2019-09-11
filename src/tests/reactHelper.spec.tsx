import * as React from 'react';
import {   propMap,getDisplayName,wrapDisplayName,setDisplayName,findDOMNode } from '../reactHelper';
import { shallow,mount } from 'enzyme';
import { Props as _Props, styled, extendStandModuleNoTheme } from '../index';
import * as O from 'fp-ts/lib/Option'
describe('react helper />', () => {
    type Props = { a: number, b: string };
    const A = ({ a, b }: Props) => <div>{a}{b}</div>
    const TestA = (a: Props) => (
        <A {...a} />
    );

    //const DefaultA = withDefaults(A, { a: 2 });
    const map = ({ c, d }: { c: string, d: number }): Props => ({ a: d + 1, b: c + 'A' })
    const PropMap = propMap(map)(A);
    it('orgin', () => {
        const wrapper = shallow<{ a: number, b: string }>(
            <TestA a={1} b='2' />
        );
        expect(wrapper.props().a).toEqual(1)
        expect(wrapper.props().b).toEqual('2')
    });
/*     it('withDefaults', () => {
        const wrapper = shallow<{ a: number, b: string }>(
            <DefaultA b='2' />
        );
        expect(wrapper.props().a).toEqual(2)
        expect(wrapper.props().b).toEqual('2')
        const wrapper1 = shallow<{ a: number, b: string }>(
            <DefaultA b='2' a={4} />
        );
        expect(wrapper1.props().a).toEqual(4)
        expect(wrapper1.props().b).toEqual('2')
    }); */

    it('propMap', () => {
        const wrapper = shallow<{ a: number, b: string }>(
            <PropMap d={5} c='2' />
        );
        expect(wrapper.props().a).toEqual(6)
        expect(wrapper.props().b).toEqual('2A')
    });
    it('getDisplayName', () => {
        const TestA = (a: Props) => (
            <A {...a} />
        );
        const TestB:React.SFC<Props> = (a: Props) => (
            <A {...a} />
        );
        TestB.displayName='TestC'
        expect(getDisplayName(TestA)).toEqual('Components');
        expect(getDisplayName(TestB)).toEqual('TestC');
    });
    it('wrapDisplayName', () => {
        const TestB:React.SFC<Props> = (a: Props) => (
            <A {...a} />
        );
        TestB.displayName='TestC'
        expect(wrapDisplayName('withTest')(TestB).displayName).toEqual('withTest(TestC)');
    });
    it('wrapDisplayName', () => {
        const TestB:React.SFC<Props> = (a: Props) => (
            <A {...a} />
        );
        TestB.displayName='TestC'
        expect(setDisplayName('mk')('testB')(TestB).displayName).toEqual('MKTestB');
        expect(setDisplayName('mK')('TestB')(TestB).displayName).toEqual('MKTestB');
    });
    it('findDOMNode', () => {
        const A = styled(extendStandModuleNoTheme({
            displayName: 'A',
            tag: 'div',
            defaultProps: {},
            style: {
                mkFlex: 'row',
                mkFlexAlignV: 'center',
            },
        }));
        const wrapper = shallow<_Props>(
            <A mkColor='main' />
        );
        expect(wrapper.props().mkColor).toEqual('main')
    });

});
describe('styled', () => {
   
   
    const A = styled(
        extendStandModuleNoTheme<{ disabled?: boolean }, { variant?: 'bordered' | 'raised' },'button'>({
        displayName: 'A',
        tag: 'button',
        defaultProps: {},
        style: {
            mkFlex: 'row',
            mkFlexAlignV: 'center',
        },
        rule: {
            disabled: ({ value }) => value ? ({ mkTextColor: 'disabled' }) : undefined
        },
        ruleEnum: {
            variant: {
                bordered: {
                    mkBorder: 'bordered',
                    mkBorderColor: 'currentColor',
                },
                raised: {
                    mkColor: 'divide',

                }
            }
        }
    }));
    type P = _Props & { disabled?: boolean, variant?: 'bordered' | 'raised' };


    it('findDOMNode ', () => {
        class C extends React.Component<P>{
            ref: HTMLButtonElement | null = null;
            render() {
                return (
                    <A ref={(a:any) => { this.ref = a; }} {...this.props} >{this.props.children}</A>);
            }
        }
        const wrapper = mount<C>(
            <C mkColor='main' />
        );
        expect(O.isSome(findDOMNode(wrapper.instance()))).toEqual(true)
    });
});