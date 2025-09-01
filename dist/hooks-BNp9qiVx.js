import * as React from "react";
import { isValidElement, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";

//#region packages/ariakit-core/src/utils/dom.ts
/**
* It's `true` if it is running in a browser environment or `false` if it is not
* (SSR).
* @example
* const title = canUseDOM ? document.title : "";
*/
const canUseDOM = checkIsBrowser();
function checkIsBrowser() {
	return typeof window !== "undefined" && !!window.document?.createElement;
}
/**
* Returns `element.ownerDocument || document`.
*/
function getDocument(node) {
	if (!node) return document;
	if ("self" in node) return node.document;
	return node.ownerDocument || document;
}
/**
* Returns `element.ownerDocument.defaultView || window`.
*/
function getWindow(node) {
	if (!node) return self;
	if ("self" in node) return node.self;
	return getDocument(node).defaultView || window;
}
/**
* Returns `element.ownerDocument.activeElement`.
*/
function getActiveElement(node, activeDescendant = false) {
	const { activeElement } = getDocument(node);
	if (!activeElement?.nodeName) {
		return null;
	}
	if (isFrame(activeElement) && activeElement.contentDocument) {
		return getActiveElement(activeElement.contentDocument.body, activeDescendant);
	}
	if (activeDescendant) {
		const id = activeElement.getAttribute("aria-activedescendant");
		if (id) {
			const element = getDocument(activeElement).getElementById(id);
			if (element) {
				return element;
			}
		}
	}
	return activeElement;
}
/**
* Similar to `Element.prototype.contains`, but a little bit faster when
* `element` is the same as `child`.
* @example
* contains(
*   document.getElementById("parent"),
*   document.getElementById("child")
* );
*/
function contains(parent, child) {
	return parent === child || parent.contains(child);
}
/**
* Checks whether `element` is a frame element.
*/
function isFrame(element) {
	return element.tagName === "IFRAME";
}
/**
* Checks whether `element` is a native HTML button element.
* @example
* isButton(document.querySelector("button")); // true
* isButton(document.querySelector("input[type='button']")); // true
* isButton(document.querySelector("div")); // false
* isButton(document.querySelector("input[type='text']")); // false
* isButton(document.querySelector("div[role='button']")); // false
*/
function isButton(element) {
	const tagName = element.tagName.toLowerCase();
	if (tagName === "button") return true;
	if (tagName === "input" && element.type) {
		return buttonInputTypes.indexOf(element.type) !== -1;
	}
	return false;
}
const buttonInputTypes = [
	"button",
	"color",
	"file",
	"image",
	"reset",
	"submit"
];
/**
* Checks if the element is visible or not.
*/
function isVisible(element) {
	if (typeof element.checkVisibility === "function") {
		return element.checkVisibility();
	}
	const htmlElement = element;
	return htmlElement.offsetWidth > 0 || htmlElement.offsetHeight > 0 || element.getClientRects().length > 0;
}
/**
* Check whether the given element is a text field, where text field is defined
* by the ability to select within the input.
* @example
* isTextField(document.querySelector("div")); // false
* isTextField(document.querySelector("input")); // true
* isTextField(document.querySelector("input[type='button']")); // false
* isTextField(document.querySelector("textarea")); // true
*/
function isTextField(element) {
	try {
		const isTextInput = element instanceof HTMLInputElement && element.selectionStart !== null;
		const isTextArea = element.tagName === "TEXTAREA";
		return isTextInput || isTextArea || false;
	} catch (_error) {
		return false;
	}
}
/**
* Check whether the given element is a text field or a content editable
* element.
*/
function isTextbox(element) {
	return element.isContentEditable || isTextField(element);
}
/**
* Returns the value of the text field or content editable element as a string.
*/
function getTextboxValue(element) {
	if (isTextField(element)) {
		return element.value;
	}
	if (element.isContentEditable) {
		const range = getDocument(element).createRange();
		range.selectNodeContents(element);
		return range.toString();
	}
	return "";
}
/**
* Returns the start and end offsets of the selection in the element.
*/
function getTextboxSelection(element) {
	let start = 0;
	let end = 0;
	if (isTextField(element)) {
		start = element.selectionStart || 0;
		end = element.selectionEnd || 0;
	} else if (element.isContentEditable) {
		const selection = getDocument(element).getSelection();
		if (selection?.rangeCount && selection.anchorNode && contains(element, selection.anchorNode) && selection.focusNode && contains(element, selection.focusNode)) {
			const range = selection.getRangeAt(0);
			const nextRange = range.cloneRange();
			nextRange.selectNodeContents(element);
			nextRange.setEnd(range.startContainer, range.startOffset);
			start = nextRange.toString().length;
			nextRange.setEnd(range.endContainer, range.endOffset);
			end = nextRange.toString().length;
		}
	}
	return {
		start,
		end
	};
}
/**
* Returns the element's role attribute, if it has one.
*/
function getPopupRole(element, fallback) {
	const allowedPopupRoles = [
		"dialog",
		"menu",
		"listbox",
		"tree",
		"grid"
	];
	const role = element?.getAttribute("role");
	if (role && allowedPopupRoles.indexOf(role) !== -1) {
		return role;
	}
	return fallback;
}
/**
* Returns the item role attribute based on the popup's role.
*/
function getPopupItemRole(element, fallback) {
	const itemRoleByPopupRole = {
		menu: "menuitem",
		listbox: "option",
		tree: "treeitem"
	};
	const popupRole = getPopupRole(element);
	if (!popupRole) return fallback;
	const key = popupRole;
	return itemRoleByPopupRole[key] ?? fallback;
}
/**
* Calls `element.scrollIntoView()` if the element is hidden or partly hidden in
* the viewport.
*/
function scrollIntoViewIfNeeded(element, arg) {
	if (isPartiallyHidden(element) && "scrollIntoView" in element) {
		element.scrollIntoView(arg);
	}
}
/**
* Returns the scrolling container element of a given element.
*/
function getScrollingElement(element) {
	if (!element) return null;
	const isScrollableOverflow = (overflow) => {
		if (overflow === "auto") return true;
		if (overflow === "scroll") return true;
		return false;
	};
	if (element.clientHeight && element.scrollHeight > element.clientHeight) {
		const { overflowY } = getComputedStyle(element);
		if (isScrollableOverflow(overflowY)) return element;
	} else if (element.clientWidth && element.scrollWidth > element.clientWidth) {
		const { overflowX } = getComputedStyle(element);
		if (isScrollableOverflow(overflowX)) return element;
	}
	return getScrollingElement(element.parentElement) || document.scrollingElement || document.body;
}
/**
* Determines whether an element is hidden or partially hidden in the viewport.
*/
function isPartiallyHidden(element) {
	const elementRect = element.getBoundingClientRect();
	const scroller = getScrollingElement(element);
	if (!scroller) return false;
	const scrollerRect = scroller.getBoundingClientRect();
	const isHTML = scroller.tagName === "HTML";
	const scrollerTop = isHTML ? scrollerRect.top + scroller.scrollTop : scrollerRect.top;
	const scrollerBottom = isHTML ? scroller.clientHeight : scrollerRect.bottom;
	const scrollerLeft = isHTML ? scrollerRect.left + scroller.scrollLeft : scrollerRect.left;
	const scrollerRight = isHTML ? scroller.clientWidth : scrollerRect.right;
	const top = elementRect.top < scrollerTop;
	const left = elementRect.left < scrollerLeft;
	const bottom = elementRect.bottom > scrollerBottom;
	const right = elementRect.right > scrollerRight;
	return top || left || bottom || right;
}
/**
* SelectionRange only works on a few types of input. Calling
* `setSelectionRange` on a unsupported input type may throw an error on certain
* browsers. To avoid it, we check if its type supports SelectionRange first. It
* will be a noop to non-supported types until we find a workaround.
*
* @see
* https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
*/
function setSelectionRange(element, ...args) {
	if (/text|search|password|tel|url/i.test(element.type)) {
		element.setSelectionRange(...args);
	}
}
/**
* Sort the items based on their DOM position.
*/
function sortBasedOnDOMPosition(items, getElement) {
	const pairs = items.map((item, index) => [index, item]);
	let isOrderDifferent = false;
	pairs.sort(([indexA, a], [indexB, b]) => {
		const elementA = getElement(a);
		const elementB = getElement(b);
		if (elementA === elementB) return 0;
		if (!elementA || !elementB) return 0;
		if (isElementPreceding(elementA, elementB)) {
			if (indexA > indexB) {
				isOrderDifferent = true;
			}
			return -1;
		}
		if (indexA < indexB) {
			isOrderDifferent = true;
		}
		return 1;
	});
	if (isOrderDifferent) {
		return pairs.map(([_, item]) => item);
	}
	return items;
}
function isElementPreceding(a, b) {
	return Boolean(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}

//#endregion
//#region packages/ariakit-core/src/utils/platform.ts
/**
* Detects if the device has touch capabilities.
*/
function isTouchDevice() {
	return canUseDOM && !!navigator.maxTouchPoints;
}
/**
* Detects Apple device.
*/
function isApple() {
	if (!canUseDOM) return false;
	return /mac|iphone|ipad|ipod/i.test(navigator.platform);
}
/**
* Detects Safari browser.
*/
function isSafari() {
	return canUseDOM && isApple() && /apple/i.test(navigator.vendor);
}
/**
* Detects Firefox browser.
*/
function isFirefox() {
	return canUseDOM && /firefox\//i.test(navigator.userAgent);
}
/**
* Detects Mac computer.
*/
function isMac() {
	return canUseDOM && navigator.platform.startsWith("Mac") && !isTouchDevice();
}

//#endregion
//#region packages/ariakit-core/src/utils/events.ts
/**
* Returns `true` if `event` has been fired within a React Portal element.
*/
function isPortalEvent(event) {
	return Boolean(event.currentTarget && !contains(event.currentTarget, event.target));
}
/**
* Returns `true` if `event.target` and `event.currentTarget` are the same.
*/
function isSelfTarget(event) {
	return event.target === event.currentTarget;
}
/**
* Checks whether the user event is triggering a page navigation in a new tab.
*/
function isOpeningInNewTab(event) {
	const element = event.currentTarget;
	if (!element) return false;
	const isAppleDevice = isApple();
	if (isAppleDevice && !event.metaKey) return false;
	if (!isAppleDevice && !event.ctrlKey) return false;
	const tagName = element.tagName.toLowerCase();
	if (tagName === "a") return true;
	if (tagName === "button" && element.type === "submit") return true;
	if (tagName === "input" && element.type === "submit") return true;
	return false;
}
/**
* Checks whether the user event is triggering a download.
*/
function isDownloading(event) {
	const element = event.currentTarget;
	if (!element) return false;
	const tagName = element.tagName.toLowerCase();
	if (!event.altKey) return false;
	if (tagName === "a") return true;
	if (tagName === "button" && element.type === "submit") return true;
	if (tagName === "input" && element.type === "submit") return true;
	return false;
}
/**
* Creates and dispatches an event.
* @example
* fireEvent(document.getElementById("id"), "blur", {
*   bubbles: true,
*   cancelable: true,
* });
*/
function fireEvent(element, type, eventInit) {
	const event = new Event(type, eventInit);
	return element.dispatchEvent(event);
}
/**
* Creates and dispatches a blur event.
* @example
* fireBlurEvent(document.getElementById("id"));
*/
function fireBlurEvent(element, eventInit) {
	const event = new FocusEvent("blur", eventInit);
	const defaultAllowed = element.dispatchEvent(event);
	Object.defineProperty(eventInit, "bubbles", {
		writable: false,
		value: true
	});
	element.dispatchEvent(new FocusEvent("focusout", eventInit));
	return defaultAllowed;
}
/**
* Creates and dispatches a focus event.
* @example
* fireFocusEvent(document.getElementById("id"));
*/
function fireFocusEvent(element, eventInit) {
	const event = new FocusEvent("focus", eventInit);
	const defaultAllowed = element.dispatchEvent(event);
	Object.defineProperty(eventInit, "bubbles", {
		writable: false,
		value: true
	});
	element.dispatchEvent(new FocusEvent("focusin", eventInit));
	return defaultAllowed;
}
/**
* Creates and dispatches a keyboard event.
* @example
* fireKeyboardEvent(document.getElementById("id"), "keydown", {
*   key: "ArrowDown",
*   shiftKey: true,
* });
*/
function fireKeyboardEvent(element, type, eventInit) {
	const event = new KeyboardEvent(type, eventInit);
	return element.dispatchEvent(event);
}
/**
* Creates and dispatches a click event.
* @example
* fireClickEvent(document.getElementById("id"));
*/
function fireClickEvent(element, eventInit) {
	const event = new MouseEvent("click", eventInit);
	return element.dispatchEvent(event);
}
/**
* Checks whether the focus/blur event is happening from/to outside of the
* container element.
* @example
* const element = document.getElementById("id");
* element.addEventListener("blur", (event) => {
*   if (isFocusEventOutside(event)) {
*     // ...
*   }
* });
*/
function isFocusEventOutside(event, container) {
	const containerElement = container || event.currentTarget;
	const relatedTarget = event.relatedTarget;
	return !relatedTarget || !contains(containerElement, relatedTarget);
}
/**
* Returns the `inputType` property of the event, if available.
*/
function getInputType(event) {
	const nativeEvent = "nativeEvent" in event ? event.nativeEvent : event;
	if (!nativeEvent) return;
	if (!("inputType" in nativeEvent)) return;
	if (typeof nativeEvent.inputType !== "string") return;
	return nativeEvent.inputType;
}
/**
* Runs a callback on the next animation frame, but before a certain event.
*/
function queueBeforeEvent(element, type, callback, timeout) {
	const createTimer = (callback$1) => {
		if (timeout) {
			const timerId$1 = setTimeout(callback$1, timeout);
			return () => clearTimeout(timerId$1);
		}
		const timerId = requestAnimationFrame(callback$1);
		return () => cancelAnimationFrame(timerId);
	};
	const cancelTimer = createTimer(() => {
		element.removeEventListener(type, callSync, true);
		callback();
	});
	const callSync = () => {
		cancelTimer();
		callback();
	};
	element.addEventListener(type, callSync, {
		once: true,
		capture: true
	});
	return cancelTimer;
}
/**
* Adds a global event listener, including on child frames.
*/
function addGlobalEventListener(type, listener, options, scope = window) {
	const children = [];
	try {
		scope.document.addEventListener(type, listener, options);
		for (const frame of Array.from(scope.frames)) {
			children.push(addGlobalEventListener(type, listener, options, frame));
		}
	} catch {}
	const removeEventListener = () => {
		try {
			scope.document.removeEventListener(type, listener, options);
		} catch {}
		for (const remove of children) {
			remove();
		}
	};
	return removeEventListener;
}

//#endregion
//#region packages/ariakit-core/src/utils/misc.ts
/**
* Empty function.
*/
function noop(..._) {}
/**
* Compares two objects.
* @example
* shallowEqual({ a: "a" }, {}); // false
* shallowEqual({ a: "a" }, { b: "b" }); // false
* shallowEqual({ a: "a" }, { a: "a" }); // true
* shallowEqual({ a: "a" }, { a: "a", b: "b" }); // false
*/
function shallowEqual(a, b) {
	if (a === b) return true;
	if (!a) return false;
	if (!b) return false;
	if (typeof a !== "object") return false;
	if (typeof b !== "object") return false;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	const { length } = aKeys;
	if (bKeys.length !== length) return false;
	for (const key of aKeys) {
		if (a[key] !== b[key]) {
			return false;
		}
	}
	return true;
}
/**
* Receives a `setState` argument and calls it with `currentValue` if it's a
* function. Otherwise return the argument as the new value.
* @example
* applyState((value) => value + 1, 1); // 2
* applyState(2, 1); // 2
*/
function applyState(argument, currentValue) {
	if (isUpdater(argument)) {
		const value = isLazyValue(currentValue) ? currentValue() : currentValue;
		return argument(value);
	}
	return argument;
}
function isUpdater(argument) {
	return typeof argument === "function";
}
function isLazyValue(value) {
	return typeof value === "function";
}
/**
* Checks whether `arg` is an object or not.
* @returns {boolean}
*/
function isObject(arg) {
	return typeof arg === "object" && arg != null;
}
/**
* Checks whether `arg` is empty or not.
* @example
* isEmpty([]); // true
* isEmpty(["a"]); // false
* isEmpty({}); // true
* isEmpty({ a: "a" }); // false
* isEmpty(); // true
* isEmpty(null); // true
* isEmpty(undefined); // true
* isEmpty(""); // true
*/
function isEmpty(arg) {
	if (Array.isArray(arg)) return !arg.length;
	if (isObject(arg)) return !Object.keys(arg).length;
	if (arg == null) return true;
	if (arg === "") return true;
	return false;
}
/**
* Checks whether `arg` is an integer or not.
* @example
* isInteger(1); // true
* isInteger(1.5); // false
* isInteger("1"); // true
* isInteger("1.5"); // false
*/
function isInteger(arg) {
	if (typeof arg === "number") {
		return Math.floor(arg) === arg;
	}
	return String(Math.floor(Number(arg))) === arg;
}
/**
* Checks whether `prop` is an own property of `obj` or not.
*/
function hasOwnProperty(object, prop) {
	if (typeof Object.hasOwn === "function") {
		return Object.hasOwn(object, prop);
	}
	return Object.prototype.hasOwnProperty.call(object, prop);
}
/**
* Receives functions as arguments and returns a new function that calls all.
*/
function chain(...fns) {
	return (...args) => {
		for (const fn of fns) {
			if (typeof fn === "function") {
				fn(...args);
			}
		}
	};
}
/**
* Returns a string with the truthy values of `args` separated by space.
*/
function cx(...args) {
	return args.filter(Boolean).join(" ") || undefined;
}
/**
* Removes diatrics from a string.
*/
function normalizeString(str) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
/**
* Omits specific keys from an object.
* @example
* omit({ a: "a", b: "b" }, ["a"]); // { b: "b" }
*/
function omit(object, keys) {
	const result = { ...object };
	for (const key of keys) {
		if (hasOwnProperty(result, key)) {
			delete result[key];
		}
	}
	return result;
}
/**
* Picks specific keys from an object.
* @example
* pick({ a: "a", b: "b" }, ["a"]); // { a: "a" }
*/
function pick(object, paths) {
	const result = {};
	for (const key of paths) {
		if (hasOwnProperty(object, key)) {
			result[key] = object[key];
		}
	}
	return result;
}
/**
* Returns the same argument.
*/
function identity(value) {
	return value;
}
/**
* Runs right before the next paint.
*/
function beforePaint(cb = noop) {
	const raf = requestAnimationFrame(cb);
	return () => cancelAnimationFrame(raf);
}
/**
* Runs after the next paint.
*/
function afterPaint(cb = noop) {
	let raf = requestAnimationFrame(() => {
		raf = requestAnimationFrame(cb);
	});
	return () => cancelAnimationFrame(raf);
}
/**
* Asserts that a condition is true, otherwise throws an error.
* @example
* invariant(
*   condition,
*   process.env.NODE_ENV !== "production" && "Invariant failed"
* );
*/
function invariant(condition, message) {
	if (condition) return;
	if (typeof message !== "string") throw new Error("Invariant failed");
	throw new Error(message);
}
/**
* Similar to `Object.keys` but returns a type-safe array of keys.
*/
function getKeys(obj) {
	return Object.keys(obj);
}
/**
* Checks whether a boolean event prop (e.g., hideOnInteractOutside) was
* intentionally set to false, either with a boolean value or a callback that
* returns false.
*/
function isFalsyBooleanCallback(booleanOrCallback, ...args) {
	const result = typeof booleanOrCallback === "function" ? booleanOrCallback(...args) : booleanOrCallback;
	if (result == null) return false;
	return !result;
}
/**
* Checks whether something is disabled or not based on its props.
*/
function disabledFromProps(props) {
	return props.disabled || props["aria-disabled"] === true || props["aria-disabled"] === "true";
}
/**
* Removes undefined values from an object.
*/
function removeUndefinedValues(obj) {
	const result = {};
	for (const key in obj) {
		if (obj[key] !== undefined) {
			result[key] = obj[key];
		}
	}
	return result;
}
function defaultValue(...values) {
	for (const value of values) {
		if (value !== undefined) return value;
	}
	return undefined;
}

//#endregion
//#region packages/ariakit-react-core/src/utils/misc.ts
/**
* Sets both a function and object React ref.
*/
function setRef(ref, value) {
	if (typeof ref === "function") {
		ref(value);
	} else if (ref) {
		ref.current = value;
	}
}
/**
* Checks if an element is a valid React element with a ref.
*/
function isValidElementWithRef(element) {
	if (!element) return false;
	if (!isValidElement(element)) return false;
	if ("ref" in element.props) return true;
	if ("ref" in element) return true;
	return false;
}
/**
* Gets the ref property from a React element.
*/
function getRefProperty(element) {
	if (!isValidElementWithRef(element)) return null;
	const props = { ...element.props };
	return props.ref || element.ref;
}
/**
* Merges two sets of props.
*/
function mergeProps(base, overrides) {
	const props = { ...base };
	for (const key in overrides) {
		if (!hasOwnProperty(overrides, key)) continue;
		if (key === "className") {
			const prop = "className";
			props[prop] = base[prop] ? `${base[prop]} ${overrides[prop]}` : overrides[prop];
			continue;
		}
		if (key === "style") {
			const prop = "style";
			props[prop] = base[prop] ? {
				...base[prop],
				...overrides[prop]
			} : overrides[prop];
			continue;
		}
		const overrideValue = overrides[key];
		if (typeof overrideValue === "function" && key.startsWith("on")) {
			const baseValue = base[key];
			if (typeof baseValue === "function") {
				props[key] = (...args) => {
					overrideValue(...args);
					baseValue(...args);
				};
				continue;
			}
		}
		props[key] = overrideValue;
	}
	return props;
}

//#endregion
//#region packages/ariakit-react-core/src/utils/hooks.ts
const _React = { ...React };
const useReactId = _React.useId;
const useReactDeferredValue = _React.useDeferredValue;
/**
* `React.useLayoutEffect` that fallbacks to `React.useEffect` on server side.
*/
const useSafeLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
/**
* Returns a value that never changes even if the argument is updated.
* @example
* function Component({ prop }) {
*   const initialProp = useInitialValue(prop);
* }
*/
function useInitialValue(value) {
	const [initialValue] = useState(value);
	return initialValue;
}
/**
* Returns a value that is lazily initiated and never changes.
* @example
* function Component() {
*   const set = useLazyValue(() => new Set());
* }
*/
function useLazyValue(init) {
	const ref = useRef();
	if (ref.current === undefined) {
		ref.current = init();
	}
	return ref.current;
}
/**
* Creates a `React.RefObject` that is constantly updated with the incoming
* value.
* @example
* function Component({ prop }) {
*   const propRef = useLiveRef(prop);
* }
*/
function useLiveRef(value) {
	const ref = useRef(value);
	useSafeLayoutEffect(() => {
		ref.current = value;
	});
	return ref;
}
/**
* Keeps the reference of the previous value to be used in the render phase.
*/
function usePreviousValue(value) {
	const [previousValue, setPreviousValue] = useState(value);
	if (value !== previousValue) {
		setPreviousValue(value);
	}
	return previousValue;
}
/**
* Creates a stable callback function that has access to the latest state and
* can be used within event handlers and effect callbacks. Throws when used in
* the render phase.
* @example
* function Component(props) {
*   const onClick = useEvent(props.onClick);
*   React.useEffect(() => {}, [onClick]);
* }
*/
function useEvent(callback) {
	const ref = useRef(() => {
		console.error("Cannot call an event handler while rendering.");
	});
	ref.current = callback;
	return useCallback((...args) => ref.current?.(...args), []);
}
/**
* Creates a React state that calls a callback function whenever the state
* changes and rolls back to the previous state on cleanup.
*/
function useTransactionState(callback) {
	const [state, setState] = useState(null);
	useSafeLayoutEffect(() => {
		if (state == null) return;
		if (!callback) return;
		let prevState = null;
		callback((prev) => {
			prevState = prev;
			return state;
		});
		return () => {
			callback(prevState);
		};
	}, [state, callback]);
	return [state, setState];
}
/**
* Merges React Refs into a single memoized function ref so you can pass it to
* an element.
* @example
* const Component = React.forwardRef((props, ref) => {
*   const internalRef = React.useRef();
*   return <div {...props} ref={useMergeRefs(internalRef, ref)} />;
* });
*/
function useMergeRefs(...refs) {
	return useMemo(() => {
		if (!refs.some(Boolean)) return;
		return (value) => {
			for (const ref of refs) {
				setRef(ref, value);
			}
		};
	}, refs);
}
/**
* Generates a unique ID. Uses React's useId if available.
*/
function useId(defaultId) {
	if (useReactId) {
		const reactId = useReactId();
		if (defaultId) return defaultId;
		return reactId;
	}
	const [id, setId] = useState(defaultId);
	useSafeLayoutEffect(() => {
		if (defaultId || id) return;
		const random = Math.random().toString(36).slice(2, 8);
		setId(`id-${random}`);
	}, [defaultId, id]);
	return defaultId || id;
}
/**
* Uses React's useDeferredValue if available.
*/
function useDeferredValue(value) {
	if (useReactDeferredValue) {
		return useReactDeferredValue(value);
	}
	const [deferredValue, setDeferredValue] = useState(value);
	useEffect(() => {
		const raf = requestAnimationFrame(() => setDeferredValue(value));
		return () => cancelAnimationFrame(raf);
	}, [value]);
	return deferredValue;
}
/**
* Returns the tag name by parsing an element ref.
* @example
* function Component(props) {
*   const ref = React.useRef();
*   const tagName = useTagName(ref, "button"); // div
*   return <div ref={ref} {...props} />;
* }
*/
function useTagName(refOrElement, type) {
	const stringOrUndefined = (type$1) => {
		if (typeof type$1 !== "string") return;
		return type$1;
	};
	const [tagName, setTagName] = useState(() => stringOrUndefined(type));
	useSafeLayoutEffect(() => {
		const element = refOrElement && "current" in refOrElement ? refOrElement.current : refOrElement;
		setTagName(element?.tagName.toLowerCase() || stringOrUndefined(type));
	}, [refOrElement, type]);
	return tagName;
}
/**
* Returns the attribute value of an element.
* @example
* function Component(props) {
*   const ref = React.useRef();
*   const role = useAttribute(ref, "role", props.role);
*   return <div ref={ref} {...props} />;
* }
*/
function useAttribute(refOrElement, attributeName, defaultValue$1) {
	const initialValue = useInitialValue(defaultValue$1);
	const [attribute, setAttribute] = useState(initialValue);
	useEffect(() => {
		const element = refOrElement && "current" in refOrElement ? refOrElement.current : refOrElement;
		if (!element) return;
		const callback = () => {
			const value = element.getAttribute(attributeName);
			setAttribute(value == null ? initialValue : value);
		};
		const observer = new MutationObserver(callback);
		observer.observe(element, { attributeFilter: [attributeName] });
		callback();
		return () => observer.disconnect();
	}, [
		refOrElement,
		attributeName,
		initialValue
	]);
	return attribute;
}
/**
* A `React.useEffect` that will not run on the first render.
*/
function useUpdateEffect(effect, deps) {
	const mounted = useRef(false);
	useEffect(() => {
		if (mounted.current) {
			return effect();
		}
		mounted.current = true;
	}, deps);
	useEffect(() => () => {
		mounted.current = false;
	}, []);
}
/**
* A `React.useLayoutEffect` that will not run on the first render.
*/
function useUpdateLayoutEffect(effect, deps) {
	const mounted = useRef(false);
	useSafeLayoutEffect(() => {
		if (mounted.current) {
			return effect();
		}
		mounted.current = true;
	}, deps);
	useSafeLayoutEffect(() => () => {
		mounted.current = false;
	}, []);
}
/**
* A React hook similar to `useState` and `useReducer`, but with the only
* purpose of re-rendering the component.
*/
function useForceUpdate() {
	return useReducer(() => [], []);
}
/**
* Returns an event callback similar to `useEvent`, but this also accepts a
* boolean value, which will be turned into a function.
*/
function useBooleanEvent(booleanOrCallback) {
	return useEvent(typeof booleanOrCallback === "function" ? booleanOrCallback : () => booleanOrCallback);
}
/**
* Returns props with an additional `wrapElement` prop.
*/
function useWrapElement(props, callback, deps = []) {
	const wrapElement = useCallback((element) => {
		if (props.wrapElement) {
			element = props.wrapElement(element);
		}
		return callback(element);
	}, [...deps, props.wrapElement]);
	return {
		...props,
		wrapElement
	};
}
/**
* Merges the portalRef prop and returns a `domReady` to be used in the
* components that use Portal underneath.
*/
function usePortalRef(portalProp = false, portalRefProp) {
	const [portalNode, setPortalNode] = useState(null);
	const portalRef = useMergeRefs(setPortalNode, portalRefProp);
	const domReady = !portalProp || portalNode;
	return {
		portalRef,
		portalNode,
		domReady
	};
}
/**
* A hook that passes metadata props around without leaking them to the DOM.
*/
function useMetadataProps(props, key, value) {
	const parent = props.onLoadedMetadataCapture;
	const onLoadedMetadataCapture = useMemo(() => {
		return Object.assign(() => {}, {
			...parent,
			[key]: value
		});
	}, [
		parent,
		key,
		value
	]);
	return [parent?.[key], { onLoadedMetadataCapture }];
}
let hasInstalledGlobalEventListeners = false;
/**
* Returns a function that checks whether the mouse is moving.
*/
function useIsMouseMoving() {
	useEffect(() => {
		if (hasInstalledGlobalEventListeners) return;
		addGlobalEventListener("mousemove", setMouseMoving, true);
		addGlobalEventListener("mousedown", resetMouseMoving, true);
		addGlobalEventListener("mouseup", resetMouseMoving, true);
		addGlobalEventListener("keydown", resetMouseMoving, true);
		addGlobalEventListener("scroll", resetMouseMoving, true);
		hasInstalledGlobalEventListeners = true;
	}, []);
	const isMouseMoving = useEvent(() => mouseMoving);
	return isMouseMoving;
}
let mouseMoving = false;
let previousScreenX = 0;
let previousScreenY = 0;
function hasMouseMovement(event) {
	const movementX = event.movementX || event.screenX - previousScreenX;
	const movementY = event.movementY || event.screenY - previousScreenY;
	previousScreenX = event.screenX;
	previousScreenY = event.screenY;
	return movementX || movementY || process.env.NODE_ENV === "test";
}
function setMouseMoving(event) {
	if (!hasMouseMovement(event)) return;
	mouseMoving = true;
}
function resetMouseMoving() {
	mouseMoving = false;
}

//#endregion
export { addGlobalEventListener, applyState, chain, contains, cx, defaultValue, disabledFromProps, fireBlurEvent, fireClickEvent, fireEvent, fireKeyboardEvent, getActiveElement, getDocument, getKeys, getPopupItemRole, getPopupRole, getRefProperty, getScrollingElement, getTextboxSelection, getTextboxValue, getWindow, hasOwnProperty, identity, invariant, isApple, isButton, isDownloading, isFalsyBooleanCallback, isFirefox, isFocusEventOutside, isFrame, isInteger, isMac, isObject, isOpeningInNewTab, isPortalEvent, isSafari, isSelfTarget, isTextField, isTextbox, isTouchDevice, isVisible, mergeProps, noop, normalizeString, omit, pick, queueBeforeEvent, removeUndefinedValues, setRef, setSelectionRange, shallowEqual, sortBasedOnDOMPosition, useAttribute, useBooleanEvent, useEvent, useForceUpdate, useId, useInitialValue, useIsMouseMoving, useLiveRef, useMergeRefs, useMetadataProps, usePortalRef, useSafeLayoutEffect, useTagName, useTransactionState, useUpdateEffect, useUpdateLayoutEffect, useWrapElement };