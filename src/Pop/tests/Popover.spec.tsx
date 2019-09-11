import * as React from 'react'
import Popover from '../Popover'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
describe('Popover',()=>{
    it('render',()=>{
        const tree = renderer.create(<Popover/>).toJSON()
        expect(tree).toMatchSnapshot()
    })
   
})