import * as React from 'react'
import {RippleRoot,RippleChild} from '../BaseRipple'
import renderer from 'react-test-renderer'
import 'jest-styled-components'


describe('base ripple components',()=>{
    it('RippleBase',()=>{
        const tree = renderer.create(<RippleRoot />).toJSON()
        expect(tree).toMatchSnapshot()
    })
     it('RippleBase visible=true',()=>{
        const tree = renderer.create(<RippleRoot visible={true}/>).toJSON()
        expect(tree).toMatchSnapshot()
    })
    it('RippleBase pulsate={true}',()=>{
        const tree = renderer.create(<RippleRoot pulsate={true} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
    it('RippleBase pulsate={true} visible={true}',()=>{
        const tree = renderer.create(<RippleRoot pulsate={true} visible={true}/>).toJSON()
        expect(tree).toMatchSnapshot()
    })
    it('RippleChild',()=>{
        const tree = renderer.create(<RippleChild />).toJSON()
        expect(tree).toMatchSnapshot()
    })
    it('RippleChild pulsate={true}',()=>{
        const tree = renderer.create(<RippleChild pulsate={true}/>).toJSON()
        expect(tree).toMatchSnapshot()
    })
    it('RippleChild leaving={true}',()=>{
        const tree = renderer.create(<RippleChild visible={true}/>).toJSON()
        expect(tree).toMatchSnapshot()
    })
    it('RippleChild leaving={true} pulsate={true}/',()=>{
        const tree = renderer.create(<RippleChild visible={true} pulsate={true}/>).toJSON()
        expect(tree).toMatchSnapshot()
    }) 
})
