import * as React from 'react';
import { isUndefined, isArray } from 'macoolka-predicate';
import ReactDOM from 'react-dom';
import acceptLanguage from 'accept-language';
import url from 'url';
function isWindow(node: any) {
  return node === node.window ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
}
export function isBody(node: any) {
  return node && node.tagName.toLowerCase() === 'body';
}

// Do we have a scroll bar?
export function isOverflowing(container: any) {
  const doc = ownerDocument(container);
  const win = ownerWindow(doc);

  /* istanbul ignore next */
  if (!isWindow(doc) && !isBody(container)) {
    return container.scrollHeight > container.clientHeight;
  }

  // Takes in account potential non zero margin on the body.
  const style = win.getComputedStyle(doc.body);
  const marginLeft = parseInt(style.getPropertyValue('margin-left'), 10);
  const marginRight = parseInt(style.getPropertyValue('margin-right'), 10);

  return marginLeft + doc.body.clientWidth + marginRight < win.innerWidth;
}

export const ownerDocument = (node?: any): Document => {
  return (node && node.ownerDocument) || getDocument();
}
export const ownerDocumentBody = (node?: any) => {
  const a = ownerDocument(node);
  return a ? a.body : undefined
}
export const ownerWindow = (node: any, fallback: Window = window): Window => {
  const doc: any = ownerDocument(node);
  return doc.defaultView || doc.parentView || fallback;
}
export const getOwnerDocument = (element: React.ReactInstance) => {
  return ownerDocument(ReactDOM.findDOMNode(element));
}
export const getOwnerDocumentBody = (element: React.ReactInstance) => {
  return getOwnerDocument(element).body
}
export const getDocument = () =>
  canUseDOM ? window.document : undefined

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
let size: number = 0;
export const getScrollbarSize = (recalc: boolean = false) => {
  if (!size && size !== 0 || recalc) {
    if (canUseDOM) {
      var scrollDiv = document.createElement('div');

      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';

      document.body.appendChild(scrollDiv);
      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return size;
};
export const isTouchEvent = (a: React.SyntheticEvent): a is React.TouchEvent => isUndefined((a as any).clientX) && !isUndefined((a as any).touches);
export const isMouseEvent = (a: React.SyntheticEvent): a is React.MouseEvent => !isUndefined((a as any).clientX) && !isUndefined((a as any).clientY);
export const isAnchorHTML = (a: React.HTMLAttributes<any>): a is React.AnchorHTMLAttributes<HTMLElement> => !isUndefined((a as any).href);


export const getCookie = (name: string): string | undefined => {
  const regex = new RegExp(`(?:(?:^|.*;*)${name}*=*([^;]*).*$)|^.*$`);
  const value = document.cookie.replace(regex, '$1');
  if (value && value.trim() !== '') {
    return value;
  }
  return undefined;
}
export const setCookie = (o: { [key: string]: string }) => {
  const s = Object.entries(o).map(([key, value]) => `${key}=${value}`).join(';')
  document.cookie = `${s};path=/;max-age=31536000`;

}
export {
  acceptLanguage
}
export const getLanguage = () => {
  const URL = url.parse(document!.location!.href!, true);

  const urlLans = URL.query.lang;
  const urllan = isArray(urlLans) ? urlLans.length > 0 ? urlLans[0] : undefined : urlLans;
  return acceptLanguage.get(urllan || getCookie('lang') || navigator.language) || 'en';
}
export const loadCSS = (href: string, before: string, media: string) => {
  // Arguments explained:
  // `href` [REQUIRED] is the URL for your CSS file.
  // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
  // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
  // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
  var doc = document;
  var ss: any = doc.createElement("link");
  var ref: any;
  if (before) {
    ref = before;
  }
  else {
    var refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
    ref = refs[refs.length - 1];
  }

  var sheets = doc.styleSheets;
  ss.rel = "stylesheet";
  ss.href = href;
  // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
  ss.media = "only x";

  // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
  function ready(cb: any) {
    if (doc.body) {
      return cb();
    }
    setTimeout(function () {
      ready(cb);
    });
  }
  // Inject link
  // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
  // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
  ready(function () {
    ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
  });
  // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
  var onloadcssdefined = function (cb: any) {
    var resolvedHref = ss.href;
    var i = sheets.length;
    while (i--) {
      if (sheets[i].href === resolvedHref) {
        return cb();
      }
    }
    setTimeout(function () {
      onloadcssdefined(cb);
    });
  };

  function loadCB() {
    if (ss.addEventListener) {
      ss.removeEventListener("load", loadCB);
    }
    ss.media = media || "all";
  }

  // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
  if (ss.addEventListener) {
    ss.addEventListener("load", loadCB);
  }
  ss.onloadcssdefined = onloadcssdefined;
  onloadcssdefined(loadCB);
  return ss;
};
export const isDev = (): boolean => process.env.NODE_ENV !== 'production';
export const isBrowse = (): boolean => !!(process as any).browser;



