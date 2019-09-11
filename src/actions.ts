import { Prism } from 'monocle-ts'
import { some, none, Option } from 'fp-ts/lib/Option'
import { compact, head } from 'fp-ts/lib/Array'
export type Action<T> = { type: string, payload: T }
export const isAction = (a: any): a is Action<any> => a && a.type && a.payload
export type Actions = { [name: string]: Prism<Action<any>, any> }
export const createAction = <T>(type: string) => (
  new Prism<Action<T>, T>(
    s => (s.type === type ? some(s.payload) : none),
    payload => ({
      type: type,
      payload
    })
  )
)
export const getResult = (r: Array<Option<any>>) =>
  head(compact(r))
export type Selector<T, R> = (action: Action<any>) => (theme: T) => R | undefined
export const composeSelector = <T1, R1, T2, R2>(a: Selector<T1, R1>, b: Selector<T2, R2>): Selector<T1 & T2, R1 | R2> =>
  (action) => (theme) => {
    const r = a(action)(theme)
    return r ? r : b(action)(theme)
  }
