import { Task } from 'fp-ts/lib/Task'
import { io, IO } from 'fp-ts/lib/IO'
import { Lazy } from 'fp-ts/lib/function'
export type TimeOut=NodeJS.Timeout
export const delay = (n: number) => <A>(a: IO<A>): Task<A> => () => new Promise<A>(resolve => {
  setTimeout(() => resolve(a()), n)
})

export const delayTimer = (n: number) => <A>(a: IO<A>): TimeOut =>
  setTimeout(() => a(), n)

export const delayFunction = (n: number) => <A>(a: Lazy<A>): Task<A> => delay(n)(io.of(a()))
export const delayTimerFunction = (n: number) => <A>(a: Lazy<A>): TimeOut => delayTimer(n)(io.of(a()))
