import {isTouchEvent} from '../utils';
describe('utils', () => {
    it('isTouchEvent', () => {
        expect(isTouchEvent({clientX:0} as any)).toEqual(false);
        expect(isTouchEvent({} as any)).toEqual(false);
        expect(isTouchEvent({touches:[]} as any)).toEqual(true)
    })
})