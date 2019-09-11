import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Props as _Props, styled, extendStandModuleNoTheme } from '../index';
import { pipe } from 'fp-ts/lib/pipeable'
describe('styled', () => {
    it('SFC with empty properties', () => {
      
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
            styled
        );
         const wrapper = shallow<_Props>(
            <A mkColor='main' />
        );
        expect(wrapper.props().mkColor).toEqual('main')
    });
  
    const A = pipe(
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
        }),
        styled
    );
   
    type P = _Props & { disabled?: boolean, variant?: 'bordered' | 'raised' };

    it('SFC with rule properties', () => {
        const wrapper = shallow<P>(
            <A mkColor='main' disabled variant='bordered' />
        );
        expect(wrapper.props().mkColor).toEqual('main')
        expect(wrapper.props().disabled).toEqual(true)
        expect(wrapper.props().variant).toEqual('bordered')
    });

    it('ref ', () => {
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
        expect(wrapper.props().mkColor).toEqual('main');
        expect(wrapper.instance().ref!.tagName).toEqual('BUTTON');
    });

});
