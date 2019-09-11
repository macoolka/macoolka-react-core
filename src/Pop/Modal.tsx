// @inheritedComponent Portal

import * as  React from 'react';

import keycode from 'keycode';
import { ownerDocument } from '../utils';
import RootRef from './RootRef';
import ModalManager from './ModalManager';
import Portal, { PortalProps } from './Portal'
import { Modal as Root, PopProps } from './Element'


interface ModalProp extends PopProps, PortalProps {

}
export interface ModalProps extends React.HtmlHTMLAttributes<HTMLDivElement>, ModalProp {
  /**
   * If `true`, the modal will not automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes.
   * This also works correctly with any modal children that have the `disableAutoFocus` prop.
   *
   * Generally this should never be set to `true` as it makes the modal less
   * accessible to assistive technologies, like screen readers.
   */
  disableAutoFocus?: boolean;
  /**
 * If `true`, the modal will not prevent focus from leaving the modal while open.
 *
 * Generally this should never be set to `true` as it makes the modal less
 * accessible to assistive technologies, like screen readers.
 */
  disableEnforceFocus?: boolean;
  /**
 * If `true`, hitting escape will not fire any callback.
 */
  disableEscapeKeyDown?: boolean;
  /**
 * If `true`, the modal will not restore focus to previously focused element once
 * modal is hidden.
 */
  disableRestoreFocus?: boolean;
  /**
 * If `true`, the backdrop is not rendered.
 */

  keepMounted?: boolean;
  /**
 * A modal manager used to track and manage the state of open
 * Modals. This enables customizing how modals interact within a container.
 */
  manager?: ModalManager;

  /**
 * Callback fired when the component requests to be closed.
 * The `reason` parameter can optionally be used to control the response to `onClose`.
 *
 * @param {object} event The event source of the callback
 * @param {string} reason Can be:`"escapeKeyDown"`, `"backdropClick"`
 */
  onClose?: React.ReactEventHandler<{}>;
  /**
 * Callback fired when the escape key is pressed,
 * `disableEscapeKeyDown` is false and the modal is in focus.
 */
  onEscapeKeyDown?: React.ReactEventHandler<{}>;

}
class Modal extends React.Component<ModalProps, { exited: boolean }> {
  static defaultProps = {
    disableAutoFocus: false,
    disableEnforceFocus: false,
    disableEscapeKeyDown: false,
    disableRestoreFocus: false,
    keepMounted: false,
    // Modals don't open on the server so this won't conflict with concurrent requests.
    manager: new ModalManager(),
  };
  dialogElement?: Element & { focus?: () => void };
  lastFocus: any 
  mounted: boolean = false;

  mountNode?: Element;

  constructor(props:ModalProps) {
    super(props);

    this.state = {
      exited: !this.props.opened,
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.opened) {
      this.handleOpen();
    }
  }

  componentDidUpdate(prevProps:ModalProps) {
    if (!prevProps.opened && this.props.opened) {
      this.checkForFocus();
    }

    if (prevProps.opened && !this.props.opened) {
      // Otherwise handleExited will call this.
      this.handleClose();
    } else if (!prevProps.opened && this.props.opened) {
      this.handleOpen();
    }
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.props.opened || (!this.state.exited)) {
      this.handleClose();
    }
  }

  static getDerivedStateFromProps(nextProps:ModalProps) {
    if (nextProps.opened) {
      return {
        exited: false,
      };
    }

    return null;
  }

  handleRendered = () => {
    this.autoFocus();

    if (this.props.onRendered) {
      this.props.onRendered();
    }
  };

  handleOpen = () => {
    const doc = ownerDocument(this.mountNode);
    const container = this.props.container ? this.props.container : doc.body;
    if (this.props.manager) {
      this.props.manager.add(this, container);
    }

    doc.addEventListener('keydown', this.handleDocumentKeyDown);
    doc.addEventListener('focus', this.enforceFocus, true);
  };

  handleClose = () => {
    if (this.props.manager) {
      this.props.manager.remove(this);
    }

    const doc = ownerDocument(this.mountNode);
    doc.removeEventListener('keydown', this.handleDocumentKeyDown);
    doc.removeEventListener('focus', this.enforceFocus, true);
    this.restoreLastFocus();
  };

  handleExited = () => {
    this.setState({ exited: true });
    this.handleClose();
  };


  handleDocumentKeyDown = (event:any) => {
    if (!this.isTopModal() || keycode(event) !== 'esc') {
      return;
    }

    if (this.props.onEscapeKeyDown) {
      this.props.onEscapeKeyDown(event);
    }

    if (!this.props.disableEscapeKeyDown && this.props.onClose) {
      this.props.onClose(event);
    }
  };
  handleBackdropClick = (event:any) => {
    if (event.target !== event.currentTarget) {
      return;
    }


    if (this.props.onClose) {
      this.props.onClose(event);
    }
  };
  checkForFocus = () => {
    this.lastFocus = ownerDocument(this.mountNode).activeElement;
  };

  enforceFocus = () => {
    if (this.props.disableEnforceFocus || !this.mounted || !this.isTopModal()) {
      return;
    }

    const currentActiveElement = ownerDocument(this.mountNode).activeElement;

    if (this.dialogElement && this.dialogElement.focus && !this.dialogElement.contains(currentActiveElement)) {
      this.dialogElement.focus();
    }
  };

  autoFocus() {
    if (this.props.disableAutoFocus) {
      return;
    }

    const currentActiveElement = ownerDocument(this.mountNode).activeElement;
    if (this.dialogElement && !this.dialogElement.contains(currentActiveElement)) {
      this.lastFocus = currentActiveElement;

      if (!this.dialogElement.hasAttribute('tabIndex')) {
        this.dialogElement.setAttribute('tabIndex', '-1');
      }
      if (this.dialogElement.focus)
        this.dialogElement.focus();
    }
  }

  restoreLastFocus() {
    if (this.props.disableRestoreFocus) {
      return;
    }

    if (this.lastFocus) {
      // Not all elements in IE11 have a focus method.
      // Because IE11 market share is low, we accept the restore focus being broken
      // and we silent the issue.
      if (this.lastFocus.focus) {
        this.lastFocus.focus();
      }

      this.lastFocus = null;
    }
  }

  isTopModal() {
    return this.props.manager ? this.props.manager.isTopModal(this) : false;
  }

  render() {
    const {
      children,
      className,
      container,
      disableAutoFocus,
      disableEnforceFocus,
      disableEscapeKeyDown,
      disableRestoreFocus,
      keepMounted,
      onClose,
      onEscapeKeyDown,
      onRendered,
      opened,
      manager,
      ...other
    } = this.props;
    const { exited } = this.state;
    const childProps: any = {};

    if (!keepMounted && !opened && (exited)) {
      return null;
    }
    const c: any = children;
    if (c && c.props.tabIndex === undefined) {
      childProps.tabIndex = c.props.tabIndex || '-1';
    }

    return (
      <Portal
        ref={node => {
          this.mountNode = node ? node.getMountNode() : node;
        }}
        container={container}
        onRendered={this.handleRendered}
      >
        <Root opened={opened} onClick={this.handleBackdropClick}
          {...other}
        >
          <RootRef
            rootRef={node => {
              this.dialogElement = node;
            }}
          >
            {React.cloneElement(c, childProps)}
          </RootRef>
        </Root>
      </Portal>
    );
  }
}

export default Modal;
