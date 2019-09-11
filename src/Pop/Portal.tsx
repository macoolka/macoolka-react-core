import React from 'react';
import ReactDOM from 'react-dom';
import {getOwnerDocumentBody} from '../utils';
export interface PortalProps{

    /**
   * A Element
   * The `container` will have the portal children appended to it.
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: Element
    /**
   * Callback fired once the children has been mounted into the `container`.
   */
  onRendered?: () => void;
}
/**
 * This component shares many concepts with
 * [react-overlays](https://react-bootstrap.github.io/react-overlays/#portals)
 * But has been forked in order to fix some bugs, reduce the number of dependencies
 * and take the control of our destiny.
 */
class Portal extends React.Component<PortalProps> {
  mountNode
  componentDidMount() {
    this.setContainer(this.props.container);
    this.forceUpdate(this.props.onRendered);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.container !== this.props.container) {
      this.setContainer(this.props.container);
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.mountNode = null;
  }

  setContainer=(container)=> {
    this.mountNode = container?container: getOwnerDocumentBody(this);
  }

  /**
   * @public
   */
  getMountNode = () => {
    return this.mountNode;
  };

  render() {
    const { children } = this.props;

    return this.mountNode ? ReactDOM.createPortal(children, this.mountNode) : null;
  }
}


export default Portal;
