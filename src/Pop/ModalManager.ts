import css from 'dom-helpers/style';
import { ownerDocument, isOverflowing ,getScrollbarSize} from '../utils';
const BLACKLIST = ['template', 'script', 'style'];

function isHidable(node) {
  return node.nodeType === 1 && BLACKLIST.indexOf(node.tagName.toLowerCase()) === -1;
}

function siblings(container, mount, callback) {
  mount = [].concat(mount); // eslint-disable-line no-param-reassign
  [].forEach.call(container.children, node => {
    if (mount.indexOf(node) === -1 && isHidable(node)) {
      callback(node);
    }
  });
}

function ariaHidden(show, node) {
  if (!node) {
    return;
  }
  if (show) {
    node.setAttribute('aria-hidden', 'true');
  } else {
    node.removeAttribute('aria-hidden');
  }
}

function hideSiblings(container, mountNode) {
  siblings(container, mountNode, node => ariaHidden(true, node));
}

function showSiblings(container, mountNode) {
  siblings(container, mountNode, node => ariaHidden(false, node));
}

function findIndexOf(data, callback) {
  let idx = -1;
  data.some((item, index) => {
    if (callback(item)) {
      idx = index;
      return true;
    }
    return false;
  });
  return idx;
}

const getPaddingRight = (node) => {
  return parseInt(css(node, 'paddingRight') || '0', 10);
}

const setContainerStyle = (data: any, container: any) => {
  const style: React.CSSProperties = { overflow: 'hidden' };

  // We are only interested in the actual `style` here because we will override it.
  data.style = {
    overflow: container.style.overflow,
    paddingRight: container.style.paddingRight,
  };

  if (data.overflowing) {
    const scrollbarSize = getScrollbarSize();

    // Use computed style, here to get the real padding to add our scrollbar width.
    style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;

    // .mk-fixed is a global helper.
    const fixedNodes: any = ownerDocument(container).querySelectorAll('.mk-fixed');
    for (let i = 0; i < fixedNodes.length; i += 1) {
      const paddingRight = getPaddingRight(fixedNodes[i]);
      data.prevPaddings.push(paddingRight);
      fixedNodes[i].style.paddingRight = `${paddingRight + scrollbarSize}px`;
    }
  }

  Object.keys(style).forEach(key => {
    container.style[key] = style[key];
  });
}

function removeContainerStyle(data, container) {
  Object.keys(data.style).forEach(key => {
    container.style[key] = data.style[key];
  });

  const fixedNodes: any = ownerDocument(container).querySelectorAll('.mk-fixed');
  for (let i = 0; i < fixedNodes.length; i += 1) {
    fixedNodes[i].style.paddingRight = `${data.prevPaddings[i]}px`;
  }
}

/**
 * @ignore - do not document.
 *
 * Proper state managment for containers and the modals in those containers.
 * Simplified, but inspired by react-overlay's ModalManager class
 * Used by the Modal to ensure proper styling of containers.
 */
class ModalManager {
  hideSiblingNodes
  handleContainerOverflow
  modals
  containers
  data
  constructor(options: { hideSiblingNodes?: boolean; handleContainerOverflow?: boolean } = {}) {
    const { hideSiblingNodes = true, handleContainerOverflow = true } = options;

    this.hideSiblingNodes = hideSiblingNodes;
    this.handleContainerOverflow = handleContainerOverflow;
    this.modals = [];
    this.containers = [];
    this.data = [];
  }

  add(modal, container) {
    let modalIdx = this.modals.indexOf(modal);
    if (modalIdx !== -1) {
      return modalIdx;
    }

    modalIdx = this.modals.length;
    this.modals.push(modal);

    if (this.hideSiblingNodes) {
      hideSiblings(container, modal.mountNode);
    }
    const containerIdx = this.containers.indexOf(container);
    if (containerIdx !== -1) {
      this.data[containerIdx].modals.push(modal);
      return modalIdx;
    }

    const data = {
      modals: [modal],
      overflowing: isOverflowing(container),
      prevPaddings: [],
    };

    if (this.handleContainerOverflow) {
      setContainerStyle(data, container);
    }

    this.containers.push(container);
    this.data.push(data);

    return modalIdx;
  }

  remove(modal) {
    const modalIdx = this.modals.indexOf(modal);

    if (modalIdx === -1) {
      return modalIdx;
    }

    const containerIdx = findIndexOf(this.data, item => item.modals.indexOf(modal) !== -1);
    const data = this.data[containerIdx];
    const container = this.containers[containerIdx];

    data.modals.splice(data.modals.indexOf(modal), 1);
    this.modals.splice(modalIdx, 1);

    // If that was the last modal in a container, clean up the container.
    if (data.modals.length === 0) {
      if (this.handleContainerOverflow) {
        removeContainerStyle(data, container);
      }
      if (this.hideSiblingNodes) {
        showSiblings(container, modal.mountNode);
      }
      this.containers.splice(containerIdx, 1);
      this.data.splice(containerIdx, 1);
    }else if (this.hideSiblingNodes) {
      // Otherwise make sure the next top modal is visible to a screan reader.
      ariaHidden(false, data.modals[data.modals.length - 1].mountNode);
    }
    return modalIdx;
  }

  isTopModal(modal) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
  }
}

export default ModalManager;
