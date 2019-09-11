import {TouchRipple} from '../TouchRipple'
import {parse} from '../../css'
it('parse',()=>{
    expect(parse(TouchRipple)({mkColor:'accent'})).toEqual(
`border-radius: inherit;
left: 0px;
top: 0px;
width: 100%;
height: 100%;
overflow-x: hidden;
overflow-y: hidden;
background-color: #f50057;
color: #fff;
display: block;
position: absolute;
pointer-events: none;
z-index: 0;
`
    )
})