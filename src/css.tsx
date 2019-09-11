import * as styledComponents from 'styled-components';
import { ServerStyleSheet } from 'styled-components';
import {
    CssNode, typeThemeLens, animations as animationsValues, StandTheme, ComponentModule,
    parse, CssThemeNode, StandProps
} from 'macoolka-css-components';
export * from 'macoolka-css-components';
import { setDisplayName as _setDisplayName, getName } from './reactHelper';
import { mapValues, merge } from 'macoolka-object';
import { ThemedStyledComponentsModule, createGlobalStyle } from 'styled-components';
import * as R from 'fp-ts/lib/Reader'
import { pipe } from 'fp-ts/lib/pipeable'
export type Props = StandProps
const {
    default: _styled,
    css,
    keyframes,
    ThemeProvider,

} = styledComponents as ThemedStyledComponentsModule<StandTheme>;
export {
    css,
    keyframes,
    ThemeProvider,
    ServerStyleSheet,

    _styled,
    CssNode,
    typeThemeLens,

};


export const template = <
    Tag extends keyof JSX.IntrinsicElements,
    S extends object,
    E extends object,
    O extends object,
    T extends object,
    OT extends object>
    (cssmodule: ComponentModule<S, E, Tag, O, T, OT>) =>
    (value: CssThemeNode<S & E, OT & T>): string => {
        const result = parse(cssmodule)(value as any);
        return result;
    }
export const _styledComponent = (prefix: string) => {
    const name = getName(prefix);
    return pipe(
        _styled,
        R.map(a => {
            return <
                Tag extends keyof JSX.IntrinsicElements,
                S extends object,
                E extends object = {},
                O extends object = {},
                T extends object = {},
                OT extends object = {}>(
                    cssmodule: ComponentModule<S, E, Tag, O, T, OT>
                ) => {
                cssmodule = mapTheme(cssmodule)
                const { rule } = cssmodule
                const cssFunction = template(cssmodule)

                const NC = a(cssFunction)
                NC.defaultProps = rule.defaultProps;
                NC.displayName = name(rule.displayName);
                //NC.
                return NC

            }
        })
    )
}
export const styledComponentMoule = (prefix: string) => {
      return <
        Tag extends keyof JSX.IntrinsicElements,
        S extends object,
        E extends object = {},
        O extends object = {},
        T extends object = {},
        OT extends object = {}>(
            cssmodule: ComponentModule<S, E, Tag, O, T, OT>
        ) => {
            return  _styledComponent(prefix)(cssmodule.rule.tag)(cssmodule)
     }
   
}
const mapTheme = <
    Tag extends keyof JSX.IntrinsicElements,
    S extends object,
    E extends object,
    O extends object,
    T extends object,
    OT extends object>(a: ComponentModule<S, E, Tag, O, T, OT>): ComponentModule<S, E, Tag, O, T, OT> => ({
        ...a,
        theme: merge({}, a.theme, { effect: { animations } })
    })
const animations = mapValues(animationsValues, (_, name) => ('mocoolka' + name))

const keyframesCss = (name: string, value: string) => `
@keyframes ${name} {
   ${value}
}
`
export const stylesAnimations = Object.entries(animationsValues).map(([key, value]) =>
    keyframesCss('mocoolka' + key, value)
).join('\n')

export const GlobalAnimationsStyle = createGlobalStyle`
 ${stylesAnimations}
`


export const styledComponent = _styledComponent('MK');
export const styled = styledComponentMoule('MK');
export const name = _setDisplayName('MK')

