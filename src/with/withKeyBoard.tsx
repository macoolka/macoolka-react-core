
import * as React from 'react';
const ReactDOM = require('react-dom');
import keycode from 'keycode';
import { ownerWindow } from '../utils';
import { getWrapDisplayName } from '../reactHelper';
import {has,get} from 'macoolka-object'

export interface Actions {
    tab?: (e: Event) => void;
    enter?: (e: Event) => void;
    space?: (e: Event) => void;
    esc?: (e: Event) => void;
    up?: (e: Event) => void;
    down?: (e: Event) => void;
    left?: (e: Event) => void;
    right?: (e: Event) => void;
}
export type Props = {
    actions: Actions;
};

const withKeyBoard = <P extends {}>(C: React.ComponentType<P>) => {
    return class KeyBoardElement extends React.Component<Props & P> {
        static displayName = getWrapDisplayName('withKeyBoard')(C);
        parentWidow?: Window;
        handleDocumentKeyDown = (event: Event) => {

            const key = keycode(event);
            if (has(this.props.actions,key)) {
                get(this.props.actions,key)(event)
               // this.props.actions[key](event);
            }
        };
        componentDidMount() {
            const inner = ReactDOM.findDOMNode(this);
            this.parentWidow = ownerWindow(inner);
            this.parentWidow.addEventListener('keyup', this.handleDocumentKeyDown)
        }


        componentWillUnmount() {
            if (this.parentWidow) {
                this.parentWidow.removeEventListener('keyup', this.handleDocumentKeyDown)
            }

        }

        render() {
            const { actions, ...others } = this.props as any
            return (
                <C {...others} />
            );
        }
    }

}
export default withKeyBoard;