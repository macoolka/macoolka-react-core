import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Helper component to allow attaching a ref to a
 * wrapped element to access the underlying DOM element.
 *
 * It's higly inspired by https://github.com/facebook/react/issues/11401#issuecomment-340543801.
 * For example:
 * ```jsx
 * import React from 'react';
 * import RootRef from '@material-ui/core/RootRef';
 *
 * class MyComponent extends React.Component {
 *   constructor(props) {
 *     super(props);
 *     this.domRef = React.createRef();
 *   }
 *
 *
 *   render() {
 *     return (
 *       <RootRef rootRef={this.domRef}>
 *         <SomeChildComponent />
 *       </RootRef>
 *     );
 *   }
 * }
 * ```
 */
export interface RootRefProps<T = any> {
  /**
 * Provide a way to access the DOM node of the wrapped element.
 * You can provide a callback ref or a `React.createRef()` ref.
 */
  rootRef?: (a:Element)=>void;
}
class RootRef extends React.Component<RootRefProps> {
  componentDidMount() {
    const rootRef: any = this.props.rootRef;
    const node = ReactDOM.findDOMNode(this);
    rootRef(node);
  }
  render() {
    return this.props.children;
  }
}

export default RootRef;
