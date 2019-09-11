import {calCircle} from '../circleUtils';
describe('circleUtils',()=>{
    it('calCircle using empty value',()=>{
        const result=calCircle(true)({point:{x:0,y:0},rect:{width:0,height:0,top:0,left:0}});
        expect(result).toEqual({point:{x:0,y:0},radius:1})
    })
    it('calCircle using stand value and center',()=>{
        const result=calCircle(true)({point:{x:50,y:60},rect:{width:200,height:400,top:0,left:0}});
        expect(result.point).toEqual({x:100,y:200})
    })
    it('calCircle using stand value',()=>{
        const result=calCircle(false)({point:{x:50,y:60},rect:{width:200,height:400,top:0,left:0}});
        expect(result.point).toEqual({x:50,y:60})
    })
})