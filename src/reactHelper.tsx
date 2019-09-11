import React from 'react'
import {  upperCase } from 'macoolka-string'
import ReactDOM from 'react-dom';
import { Option, fromNullable } from 'fp-ts/lib/Option';
export type Overwrite<A extends object, B extends object> = Pick<A, Exclude<keyof A, keyof B>> & B;
const upperFirst=(a:string)=>
a.length>0?a.substring(0,1).toUpperCase()+a.substring(1)
:a
export const getDisplayName = (a: any) => a.displayName ? a.displayName : a.Name ? a.Name : 'Components';
export const getWrapDisplayName = (name: string) => (a: any) => `${name}(${getDisplayName(a)})`
export const setDisplayName = (prefix: string) => (name: string) => <P extends {}>
    (a: React.ComponentType<P>): React.ComponentType<P> => {
    a.displayName = `${upperCase(prefix)}${upperFirst(name)}`;
    return a;
}
export const getName = (prefix: string) => (name: string) => `${prefix}_${upperFirst(name)}`;

export const wrapDisplayName = (name: string) => (a: React.ComponentType<any>) => {
    if (process.env.NODE_ENV !== 'production') {
        a.displayName = `${name}(${getDisplayName(a)})`
    }
    return a;
}
export const getWrapedDefaultProps = <P extends {}>(WrapedComponent: React.ComponentType<P>) =>
    <P1 extends {}>(p: P1) => {
        const originDefaultProps: {} = WrapedComponent.defaultProps ? WrapedComponent.defaultProps : {};
        return Object.assign({}, p, originDefaultProps) as P1
    }
/* export const withDefaults = <A extends {}, K = keyof A >
    (C: React.ComponentType<A>, defaults: {[a in K]:A[K]}): React.SFC<Diff<A, K>> =>
    props => <C {...defaults} {...props} /> */

export const withValue = <D extends object>
    (C: React.ComponentType<D>, defaults: D): React.ComponentType<D> =>
    props => <C {...defaults} {...props} />
/* export const withProps = <P extends object>
    (C: React.ComponentType<P>, values: P):  React.ComponentType<P> =>
    props => <C {...props} {...values} /> */
export const propMap = <A extends {}, B extends {}>(f: (a: A) => B) =>
    (C: React.ComponentType<B>) => (props: A): React.ReactElement<B> =>
        <C {...f(props)} />


export const findDOMNode = (a: React.ReactInstance): Option<Element | Text> =>
    fromNullable(ReactDOM.findDOMNode(a))

