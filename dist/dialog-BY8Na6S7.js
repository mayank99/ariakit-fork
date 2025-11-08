import { $ as isSafari, N as noop, Q as isMac, S as chain, X as isApple, Y as queueBeforeEvent, _ as useWrapElement, a as useId, d as usePortalRef, f as useSafeLayoutEffect, i as useForceUpdate, l as useMergeRefs, lt as getWindow, mt as isVisible, n as useBooleanEvent, nt as getActiveElement, r as useEvent, rt as getDocument, tt as contains, ut as isButton, z as addGlobalEventListener } from "./hooks-H6OmsigH.js";
import { d as isFocusable, i as getAllTabbableIn, n as focusIfNeeded, o as getFirstTabbableIn } from "./focus-BzfNYadt.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { i as FocusableContext, n as isSafariFocusAncestor, r as useFocusable } from "./focusable-rBfookfw.js";
import { p as sync, r as useStoreState, t as useStore } from "./store-DLqhzR2r.js";
import { a as isHidden, c as DialogDescriptionContext, f as useDialogProviderContext, l as DialogHeadingContext, n as useDisclosureStoreProps, o as useDisclosureContent, r as createDisclosureStore, t as useDisclosureStore, u as DialogScopedContextProvider } from "./disclosure-store-DZ4wqMBt.js";
import { t as HeadingLevel } from "./heading-level-DcfYVbfS.js";
import { n as usePortal } from "./portal-DuxVwPoo.js";
import { t as Role } from "./role-darPqwKl.js";
import { createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { flushSync } from "react-dom";

//#region packages/ariakit-react-core/src/focusable/focusable-container.tsx
const TagName$1 = "div";
/**
* Returns props to create a `FocusableContainer` component.
* @see https://ariakit.org/components/focusable
* @example
* ```jsx
* const props = useFocusableContainer();
* <Role {...props} />
* ```
*/
const useFocusableContainer = createHook(function useFocusableContainer$1({ autoFocusOnShow = true,...props }) {
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(FocusableContext.Provider, {
		value: autoFocusOnShow,
		children: element
	}), [autoFocusOnShow]);
	return props;
});
/**
* Renders a div that wraps
* [`Focusable`](https://ariakit.org/reference/focusable) components and
* controls whether they can be auto-focused.
* @see https://ariakit.org/components/focusable
* @example
* ```jsx
* <FocusableContainer autoFocusOnShow={false}>
*   <Focusable autoFocus />
* </FocusableContainer>
* ```
*/
const FocusableContainer = forwardRef(function FocusableContainer$1(props) {
	const htmlProps = useFocusableContainer(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/is-backdrop.ts
function isBackdrop(element, ...ids) {
	if (!element) return false;
	const backdrop = element.getAttribute("data-backdrop");
	if (backdrop == null) return false;
	if (backdrop === "") return true;
	if (backdrop === "true") return true;
	if (!ids.length) return true;
	return ids.some((id) => backdrop === id);
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/orchestrate.ts
const cleanups = new WeakMap();
function orchestrate(element, key, setup) {
	if (!cleanups.has(element)) {
		cleanups.set(element, new Map());
	}
	const elementCleanups = cleanups.get(element);
	const prevCleanup = elementCleanups.get(key);
	if (!prevCleanup) {
		elementCleanups.set(key, setup());
		return () => {
			elementCleanups.get(key)?.();
			elementCleanups.delete(key);
		};
	}
	const cleanup = setup();
	const nextCleanup = () => {
		cleanup();
		prevCleanup();
		elementCleanups.delete(key);
	};
	elementCleanups.set(key, nextCleanup);
	return () => {
		const isCurrent = elementCleanups.get(key) === nextCleanup;
		if (!isCurrent) return;
		cleanup();
		elementCleanups.set(key, prevCleanup);
	};
}
function setAttribute(element, attr, value) {
	const setup = () => {
		const previousValue = element.getAttribute(attr);
		element.setAttribute(attr, value);
		return () => {
			if (previousValue == null) {
				element.removeAttribute(attr);
			} else {
				element.setAttribute(attr, previousValue);
			}
		};
	};
	return orchestrate(element, attr, setup);
}
function setProperty(element, property, value) {
	const setup = () => {
		const exists = property in element;
		const previousValue = element[property];
		element[property] = value;
		return () => {
			if (!exists) {
				delete element[property];
			} else {
				element[property] = previousValue;
			}
		};
	};
	return orchestrate(element, property, setup);
}
function assignStyle(element, style) {
	if (!element) return () => {};
	const setup = () => {
		const prevStyle = element.style.cssText;
		Object.assign(element.style, style);
		return () => {
			element.style.cssText = prevStyle;
		};
	};
	return orchestrate(element, "style", setup);
}
function setCSSProperty(element, property, value) {
	if (!element) return () => {};
	const setup = () => {
		const previousValue = element.style.getPropertyValue(property);
		element.style.setProperty(property, value);
		return () => {
			if (previousValue) {
				element.style.setProperty(property, previousValue);
			} else {
				element.style.removeProperty(property);
			}
		};
	};
	return orchestrate(element, property, setup);
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/walk-tree-outside.ts
const ignoreTags = ["SCRIPT", "STYLE"];
function getSnapshotPropertyName(id) {
	return `__ariakit-dialog-snapshot-${id}`;
}
function inSnapshot(id, element) {
	const doc = getDocument(element);
	const propertyName = getSnapshotPropertyName(id);
	if (!doc.body[propertyName]) return true;
	do {
		if (element === doc.body) return false;
		if (element[propertyName]) return true;
		if (!element.parentElement) return false;
		element = element.parentElement;
	} while (true);
}
function isValidElement$1(id, element, ignoredElements) {
	if (ignoreTags.includes(element.tagName)) return false;
	if (!inSnapshot(id, element)) return false;
	return !ignoredElements.some((enabledElement) => enabledElement && contains(element, enabledElement));
}
function walkTreeOutside(id, elements, callback, ancestorCallback) {
	for (let element of elements) {
		if (!element?.isConnected) continue;
		const hasAncestorAlready = elements.some((maybeAncestor) => {
			if (!maybeAncestor) return false;
			if (maybeAncestor === element) return false;
			return maybeAncestor.contains(element);
		});
		const doc = getDocument(element);
		const originalElement = element;
		while (element.parentElement && element !== doc.body) {
			ancestorCallback?.(element.parentElement, originalElement);
			if (!hasAncestorAlready) {
				for (const child of element.parentElement.children) {
					if (isValidElement$1(id, child, elements)) {
						callback(child, originalElement);
					}
				}
			}
			element = element.parentElement;
		}
	}
}
function createWalkTreeSnapshot(id, elements) {
	const { body } = getDocument(elements[0]);
	const cleanups$1 = [];
	const markElement$1 = (element) => {
		cleanups$1.push(setProperty(element, getSnapshotPropertyName(id), true));
	};
	walkTreeOutside(id, elements, markElement$1);
	return chain(setProperty(body, getSnapshotPropertyName(id), true), () => {
		for (const cleanup of cleanups$1) {
			cleanup();
		}
	});
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/mark-tree-outside.ts
function getPropertyName(id = "", ancestor = false) {
	return `__ariakit-dialog-${ancestor ? "ancestor" : "outside"}${id ? `-${id}` : ""}`;
}
function markElement(element, id = "") {
	return chain(setProperty(element, getPropertyName(), true), setProperty(element, getPropertyName(id), true));
}
function markAncestor(element, id = "") {
	return chain(setProperty(element, getPropertyName("", true), true), setProperty(element, getPropertyName(id, true), true));
}
function isElementMarked(element, id) {
	const ancestorProperty = getPropertyName(id, true);
	if (element[ancestorProperty]) return true;
	const elementProperty = getPropertyName(id);
	do {
		if (element[elementProperty]) return true;
		if (!element.parentElement) return false;
		element = element.parentElement;
	} while (true);
}
function markTreeOutside(id, elements) {
	const cleanups$1 = [];
	const ids = elements.map((el) => el?.id);
	walkTreeOutside(id, elements, (element) => {
		if (isBackdrop(element, ...ids)) return;
		cleanups$1.unshift(markElement(element, id));
	}, (ancestor, element) => {
		const isAnotherDialogAncestor = element.hasAttribute("data-dialog") && element.id !== id;
		if (isAnotherDialogAncestor) return;
		cleanups$1.unshift(markAncestor(ancestor, id));
	});
	const restoreAccessibilityTree = () => {
		for (const cleanup of cleanups$1) {
			cleanup();
		}
	};
	return restoreAccessibilityTree;
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/dialog-backdrop.tsx
function DialogBackdrop({ store, backdrop, alwaysVisible, hidden }) {
	const ref = useRef(null);
	const disclosure = useDisclosureStore({ disclosure: store });
	const contentElement = useStoreState(store, "contentElement");
	useEffect(() => {
		const backdrop$1 = ref.current;
		const dialog = contentElement;
		if (!backdrop$1) return;
		if (!dialog) return;
		backdrop$1.style.zIndex = getComputedStyle(dialog).zIndex;
	}, [contentElement]);
	useSafeLayoutEffect(() => {
		const id = contentElement?.id;
		if (!id) return;
		const backdrop$1 = ref.current;
		if (!backdrop$1) return;
		return markAncestor(backdrop$1, id);
	}, [contentElement]);
	const props = useDisclosureContent({
		ref,
		store: disclosure,
		role: "presentation",
		"data-backdrop": contentElement?.id || "",
		alwaysVisible,
		hidden: hidden != null ? hidden : undefined,
		style: {
			position: "fixed",
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}
	});
	if (!backdrop) return null;
	if (isValidElement(backdrop)) {
		return /* @__PURE__ */ jsx(Role, {
			...props,
			render: backdrop
		});
	}
	const Component = typeof backdrop !== "boolean" ? backdrop : "div";
	return /* @__PURE__ */ jsx(Role, {
		...props,
		render: /* @__PURE__ */ jsx(Component, {})
	});
}

//#endregion
//#region packages/ariakit-core/src/dialog/dialog-store.ts
/**
* Creates a dialog store.
*/
function createDialogStore(props = {}) {
	return createDisclosureStore(props);
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/dialog-store.ts
function useDialogStoreProps(store, update, props) {
	return useDisclosureStoreProps(store, update, props);
}
/**
* Creates a dialog store to control the state of
* [Dialog](https://ariakit.org/components/dialog) components.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx
* const dialog = useDialogStore();
*
* <button onClick={dialog.toggle}>Open dialog</button>
* <Dialog store={dialog}>Content</Dialog>
* ```
*/
function useDialogStore(props = {}) {
	const [store, update] = useStore(createDialogStore, props);
	return useDialogStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/disable-accessibility-tree-outside.ts
function hideElementFromAccessibilityTree(element) {
	return setAttribute(element, "aria-hidden", "true");
}
function disableAccessibilityTreeOutside(id, elements) {
	const cleanups$1 = [];
	const ids = elements.map((el) => el?.id);
	walkTreeOutside(id, elements, (element) => {
		if (isBackdrop(element, ...ids)) return;
		cleanups$1.unshift(hideElementFromAccessibilityTree(element));
	});
	const restoreAccessibilityTree = () => {
		for (const cleanup of cleanups$1) {
			cleanup();
		}
	};
	return restoreAccessibilityTree;
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/is-focus-trap.ts
function isFocusTrap(element, ...ids) {
	if (!element) return false;
	const attr = element.getAttribute("data-focus-trap");
	if (attr == null) return false;
	if (!ids.length) return true;
	if (attr === "") return false;
	return ids.some((id) => attr === id);
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/supports-inert.ts
function supportsInert() {
	return "inert" in HTMLElement.prototype;
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/disable-tree.ts
function disableTree(element, ignoredElements) {
	if (!("style" in element)) return noop;
	if (supportsInert()) {
		return setProperty(element, "inert", true);
	}
	const tabbableElements = getAllTabbableIn(element, true);
	const enableElements = tabbableElements.map((element$1) => {
		if (ignoredElements?.some((el) => el && contains(el, element$1))) return noop;
		const restoreFocusMethod = orchestrate(element$1, "focus", () => {
			element$1.focus = noop;
			return () => {
				delete element$1.focus;
			};
		});
		return chain(setAttribute(element$1, "tabindex", "-1"), restoreFocusMethod);
	});
	return chain(...enableElements, hideElementFromAccessibilityTree(element), assignStyle(element, {
		pointerEvents: "none",
		userSelect: "none",
		cursor: "default"
	}));
}
function disableTreeOutside(id, elements) {
	const cleanups$1 = [];
	const ids = elements.map((el) => el?.id);
	walkTreeOutside(id, elements, (element) => {
		if (isBackdrop(element, ...ids)) return;
		if (isFocusTrap(element, ...ids)) return;
		cleanups$1.unshift(disableTree(element, elements));
	}, (element) => {
		if (!element.hasAttribute("role")) return;
		if (elements.some((el) => el && contains(el, element))) return;
		cleanups$1.unshift(setAttribute(element, "role", "none"));
	});
	const restoreTreeOutside = () => {
		for (const cleanup of cleanups$1) {
			cleanup();
		}
	};
	return restoreTreeOutside;
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/prepend-hidden-dismiss.ts
function prependHiddenDismiss(container, onClick) {
	const document = getDocument(container);
	const button = document.createElement("button");
	button.type = "button";
	button.tabIndex = -1;
	button.textContent = "Dismiss popup";
	Object.assign(button.style, {
		border: "0px",
		clip: "rect(0 0 0 0)",
		height: "1px",
		margin: "-1px",
		overflow: "hidden",
		padding: "0px",
		position: "absolute",
		whiteSpace: "nowrap",
		width: "1px"
	});
	button.addEventListener("click", onClick);
	container.prepend(button);
	const removeHiddenDismiss = () => {
		button.removeEventListener("click", onClick);
		button.remove();
	};
	return removeHiddenDismiss;
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/use-previous-mouse-down-ref.ts
function usePreviousMouseDownRef(enabled) {
	const previousMouseDownRef = useRef();
	useEffect(() => {
		if (!enabled) {
			previousMouseDownRef.current = null;
			return;
		}
		const onMouseDown = (event) => {
			previousMouseDownRef.current = event.target;
		};
		return addGlobalEventListener("mousedown", onMouseDown, true);
	}, [enabled]);
	return previousMouseDownRef;
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/use-hide-on-interact-outside.ts
function isInDocument(target) {
	if (target.tagName === "HTML") return true;
	return contains(getDocument(target).body, target);
}
function isDisclosure(disclosure, target) {
	if (!disclosure) return false;
	if (contains(disclosure, target)) return true;
	const activeId = target.getAttribute("aria-activedescendant");
	if (activeId) {
		const activeElement = getDocument(disclosure).getElementById(activeId);
		if (activeElement) {
			return contains(disclosure, activeElement);
		}
	}
	return false;
}
function isMouseEventOnDialog(event, dialog) {
	if (!("clientY" in event)) return false;
	const rect = dialog.getBoundingClientRect();
	if (rect.width === 0 || rect.height === 0) return false;
	return rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
}
function useEventOutside({ store, type, listener, capture, domReady }) {
	const callListener = useEvent(listener);
	const open = useStoreState(store, "open");
	const focusedRef = useRef(false);
	useSafeLayoutEffect(() => {
		if (!open) return;
		if (!domReady) return;
		const { contentElement } = store.getState();
		if (!contentElement) return;
		const onFocus = () => {
			focusedRef.current = true;
		};
		contentElement.addEventListener("focusin", onFocus, true);
		return () => contentElement.removeEventListener("focusin", onFocus, true);
	}, [
		store,
		open,
		domReady
	]);
	useEffect(() => {
		if (!open) return;
		const onEvent = (event) => {
			const { contentElement, disclosureElement } = store.getState();
			const target = event.target;
			if (!contentElement) return;
			if (!target) return;
			if (!isInDocument(target)) return;
			if (contains(contentElement, target)) return;
			if (isDisclosure(disclosureElement, target)) return;
			if (target.hasAttribute("data-focus-trap")) return;
			if (isMouseEventOnDialog(event, contentElement)) return;
			const focused = focusedRef.current;
			if (focused && !isElementMarked(target, contentElement.id)) return;
			if (isSafariFocusAncestor(target)) return;
			callListener(event);
		};
		return addGlobalEventListener(type, onEvent, capture);
	}, [open, capture]);
}
function shouldHideOnInteractOutside(hideOnInteractOutside, event) {
	if (typeof hideOnInteractOutside === "function") {
		return hideOnInteractOutside(event);
	}
	return !!hideOnInteractOutside;
}
function useHideOnInteractOutside(store, hideOnInteractOutside, domReady) {
	const open = useStoreState(store, "open");
	const previousMouseDownRef = usePreviousMouseDownRef(open);
	const props = {
		store,
		domReady,
		capture: true
	};
	useEventOutside({
		...props,
		type: "click",
		listener: (event) => {
			const { contentElement } = store.getState();
			const previousMouseDown = previousMouseDownRef.current;
			if (!previousMouseDown) return;
			if (!isVisible(previousMouseDown)) return;
			if (!isElementMarked(previousMouseDown, contentElement?.id)) return;
			if (!shouldHideOnInteractOutside(hideOnInteractOutside, event)) return;
			store.hide();
		}
	});
	useEventOutside({
		...props,
		type: "focusin",
		listener: (event) => {
			const { contentElement } = store.getState();
			if (!contentElement) return;
			if (event.target === getDocument(contentElement)) return;
			if (!shouldHideOnInteractOutside(hideOnInteractOutside, event)) return;
			store.hide();
		}
	});
	useEventOutside({
		...props,
		type: "contextmenu",
		listener: (event) => {
			if (!shouldHideOnInteractOutside(hideOnInteractOutside, event)) return;
			store.hide();
		}
	});
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/use-nested-dialogs.tsx
const NestedDialogsContext = createContext({});
function useNestedDialogs(store) {
	const context = useContext(NestedDialogsContext);
	const [dialogs, setDialogs] = useState([]);
	const add = useCallback((dialog) => {
		setDialogs((dialogs$1) => [...dialogs$1, dialog]);
		return chain(context.add?.(dialog), () => {
			setDialogs((dialogs$1) => dialogs$1.filter((d) => d !== dialog));
		});
	}, [context]);
	useSafeLayoutEffect(() => {
		return sync(store, ["open", "contentElement"], (state) => {
			if (!state.open) return;
			if (!state.contentElement) return;
			return context.add?.(store);
		});
	}, [store, context]);
	const providerValue = useMemo(() => ({
		store,
		add
	}), [store, add]);
	const wrapElement = useCallback((element) => /* @__PURE__ */ jsx(NestedDialogsContext.Provider, {
		value: providerValue,
		children: element
	}), [providerValue]);
	return {
		wrapElement,
		nestedDialogs: dialogs
	};
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/use-root-dialog.ts
function useRootDialog({ attribute, contentId, contentElement, enabled }) {
	const [updated, retry] = useForceUpdate();
	const isRootDialog = useCallback(() => {
		if (!enabled) return false;
		if (!contentElement) return false;
		const { body } = getDocument(contentElement);
		const id = body.getAttribute(attribute);
		return !id || id === contentId;
	}, [
		updated,
		enabled,
		contentElement,
		attribute,
		contentId
	]);
	useEffect(() => {
		if (!enabled) return;
		if (!contentId) return;
		if (!contentElement) return;
		const { body } = getDocument(contentElement);
		if (isRootDialog()) {
			body.setAttribute(attribute, contentId);
			return () => body.removeAttribute(attribute);
		}
		const observer = new MutationObserver(() => flushSync(retry));
		observer.observe(body, { attributeFilter: [attribute] });
		return () => observer.disconnect();
	}, [
		updated,
		enabled,
		contentId,
		contentElement,
		isRootDialog,
		attribute
	]);
	return isRootDialog;
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/utils/use-prevent-body-scroll.ts
function getPaddingProperty(documentElement) {
	const documentLeft = documentElement.getBoundingClientRect().left;
	const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
	return scrollbarX ? "paddingLeft" : "paddingRight";
}
function usePreventBodyScroll(contentElement, contentId, enabled) {
	const isRootDialog = useRootDialog({
		attribute: "data-dialog-prevent-body-scroll",
		contentElement,
		contentId,
		enabled
	});
	useEffect(() => {
		if (!isRootDialog()) return;
		if (!contentElement) return;
		const doc = getDocument(contentElement);
		const win = getWindow(contentElement);
		const { documentElement, body } = doc;
		const cssScrollbarWidth = documentElement.style.getPropertyValue("--scrollbar-width");
		const scrollbarWidth = cssScrollbarWidth ? Number.parseInt(cssScrollbarWidth, 10) : win.innerWidth - documentElement.clientWidth;
		const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
		const paddingProperty = getPaddingProperty(documentElement);
		const setStyle = () => assignStyle(body, {
			overflow: "hidden",
			[paddingProperty]: `${scrollbarWidth}px`
		});
		const setIOSStyle = () => {
			const { scrollX, scrollY, visualViewport } = win;
			const offsetLeft = visualViewport?.offsetLeft ?? 0;
			const offsetTop = visualViewport?.offsetTop ?? 0;
			const restoreStyle = assignStyle(body, {
				position: "fixed",
				overflow: "hidden",
				top: `${-(scrollY - Math.floor(offsetTop))}px`,
				left: `${-(scrollX - Math.floor(offsetLeft))}px`,
				right: "0",
				[paddingProperty]: `${scrollbarWidth}px`
			});
			return () => {
				restoreStyle();
				// istanbul ignore next: JSDOM doesn't implement window.scrollTo
				if (process.env.NODE_ENV !== "test") {
					win.scrollTo({
						left: scrollX,
						top: scrollY,
						behavior: "instant"
					});
				}
			};
		};
		const isIOS = isApple() && !isMac();
		return chain(setScrollbarWidthProperty(), isIOS ? setIOSStyle() : setStyle());
	}, [isRootDialog, contentElement]);
}

//#endregion
//#region packages/ariakit-react-core/src/dialog/dialog.tsx
const TagName = "div";
const isSafariBrowser = isSafari();
function isAlreadyFocusingAnotherElement(dialog) {
	const activeElement = getActiveElement();
	if (!activeElement) return false;
	if (dialog && contains(dialog, activeElement)) return false;
	if (isFocusable(activeElement)) return true;
	return false;
}
function getElementFromProp(prop, focusable = false) {
	if (!prop) return null;
	const element = "current" in prop ? prop.current : prop;
	if (!element) return null;
	if (focusable) return isFocusable(element) ? element : null;
	return element;
}
/**
* Returns props to create a `Dialog` component.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx
* const store = useDialogStore();
* const props = useDialog({ store });
* <Role {...props}>Dialog</Role>
* ```
*/
const useDialog = createHook(function useDialog$1({ store: storeProp, open: openProp, onClose, focusable = true, modal = true, portal = !!modal, backdrop = !!modal, hideOnEscape = true, hideOnInteractOutside = true, getPersistentElements, preventBodyScroll = !!modal, autoFocusOnShow = true, autoFocusOnHide = true, initialFocus, finalFocus, unmountOnHide, unstable_treeSnapshotKey,...props }) {
	const context = useDialogProviderContext();
	const ref = useRef(null);
	const store = useDialogStore({
		store: storeProp || context,
		open: openProp,
		setOpen(open$1) {
			if (open$1) return;
			const dialog = ref.current;
			if (!dialog) return;
			const event = new Event("close", {
				bubbles: false,
				cancelable: true
			});
			if (onClose) {
				dialog.addEventListener("close", onClose, { once: true });
			}
			dialog.dispatchEvent(event);
			if (!event.defaultPrevented) return;
			store.setOpen(true);
		}
	});
	const { portalRef, domReady } = usePortalRef(portal, props.portalRef);
	const preserveTabOrderProp = props.preserveTabOrder;
	const preserveTabOrder = useStoreState(store, (state) => preserveTabOrderProp && !modal && state.mounted);
	const id = useId(props.id);
	const open = useStoreState(store, "open");
	const mounted = useStoreState(store, "mounted");
	const contentElement = useStoreState(store, "contentElement");
	const hidden = isHidden(mounted, props.hidden, props.alwaysVisible);
	usePreventBodyScroll(contentElement, id, preventBodyScroll && !hidden);
	useHideOnInteractOutside(store, hideOnInteractOutside, domReady);
	const { wrapElement, nestedDialogs } = useNestedDialogs(store);
	props = useWrapElement(props, wrapElement, [wrapElement]);
	useSafeLayoutEffect(() => {
		if (!open) return;
		const dialog = ref.current;
		const activeElement = getActiveElement(dialog, true);
		if (!activeElement) return;
		if (activeElement.tagName === "BODY") return;
		if (dialog && contains(dialog, activeElement)) return;
		store.setDisclosureElement(activeElement);
	}, [store, open]);
	if (isSafariBrowser) {
		useEffect(() => {
			if (!mounted) return;
			const { disclosureElement } = store.getState();
			if (!disclosureElement) return;
			if (!isButton(disclosureElement)) return;
			const onMouseDown = () => {
				let receivedFocus = false;
				const onFocus = () => {
					receivedFocus = true;
				};
				const options = {
					capture: true,
					once: true
				};
				disclosureElement.addEventListener("focusin", onFocus, options);
				queueBeforeEvent(disclosureElement, "mouseup", () => {
					disclosureElement.removeEventListener("focusin", onFocus, true);
					if (receivedFocus) return;
					focusIfNeeded(disclosureElement);
				});
			};
			disclosureElement.addEventListener("mousedown", onMouseDown);
			return () => {
				disclosureElement.removeEventListener("mousedown", onMouseDown);
			};
		}, [store, mounted]);
	}
	useEffect(() => {
		if (!mounted) return;
		if (!domReady) return;
		const dialog = ref.current;
		if (!dialog) return;
		const win = getWindow(dialog);
		const viewport = win.visualViewport || win;
		const setViewportHeight = () => {
			const height = win.visualViewport?.height ?? win.innerHeight;
			dialog.style.setProperty("--dialog-viewport-height", `${height}px`);
		};
		setViewportHeight();
		viewport.addEventListener("resize", setViewportHeight);
		return () => {
			viewport.removeEventListener("resize", setViewportHeight);
		};
	}, [mounted, domReady]);
	useEffect(() => {
		if (!modal) return;
		if (!mounted) return;
		if (!domReady) return;
		const dialog = ref.current;
		if (!dialog) return;
		const existingDismiss = dialog.querySelector("[data-dialog-dismiss]");
		if (existingDismiss) return;
		return prependHiddenDismiss(dialog, store.hide);
	}, [
		store,
		modal,
		mounted,
		domReady
	]);
	useSafeLayoutEffect(() => {
		if (!supportsInert()) return;
		if (open) return;
		if (!mounted) return;
		if (!domReady) return;
		const dialog = ref.current;
		if (!dialog) return;
		return disableTree(dialog);
	}, [
		open,
		mounted,
		domReady
	]);
	const canTakeTreeSnapshot = open && domReady;
	useSafeLayoutEffect(() => {
		if (!id) return;
		if (!canTakeTreeSnapshot) return;
		const dialog = ref.current;
		return createWalkTreeSnapshot(id, [dialog]);
	}, [
		id,
		canTakeTreeSnapshot,
		unstable_treeSnapshotKey
	]);
	const getPersistentElementsProp = useEvent(getPersistentElements);
	useSafeLayoutEffect(() => {
		if (!id) return;
		if (!canTakeTreeSnapshot) return;
		const { disclosureElement } = store.getState();
		const dialog = ref.current;
		const persistentElements = getPersistentElementsProp() || [];
		const allElements = [
			dialog,
			...persistentElements,
			...nestedDialogs.map((dialog$1) => dialog$1.getState().contentElement)
		];
		if (modal) {
			return chain(markTreeOutside(id, allElements), disableTreeOutside(id, allElements));
		}
		return markTreeOutside(id, [disclosureElement, ...allElements]);
	}, [
		id,
		store,
		canTakeTreeSnapshot,
		getPersistentElementsProp,
		nestedDialogs,
		modal,
		unstable_treeSnapshotKey
	]);
	const mayAutoFocusOnShow = !!autoFocusOnShow;
	const autoFocusOnShowProp = useBooleanEvent(autoFocusOnShow);
	const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
	useEffect(() => {
		if (!open) return;
		if (!mayAutoFocusOnShow) return;
		if (!domReady) return;
		if (!contentElement?.isConnected) return;
		const element = getElementFromProp(initialFocus, true) || contentElement.querySelector("[data-autofocus=true],[autofocus]") || getFirstTabbableIn(contentElement, true, portal && preserveTabOrder) || contentElement;
		const isElementFocusable = isFocusable(element);
		if (!autoFocusOnShowProp(isElementFocusable ? element : null)) return;
		setAutoFocusEnabled(true);
		queueMicrotask(() => {
			element.focus();
			if (!isSafariBrowser) return;
			if (!isElementFocusable) return;
			element.scrollIntoView({
				block: "nearest",
				inline: "nearest"
			});
		});
	}, [
		open,
		mayAutoFocusOnShow,
		domReady,
		contentElement,
		initialFocus,
		portal,
		preserveTabOrder,
		autoFocusOnShowProp
	]);
	const mayAutoFocusOnHide = !!autoFocusOnHide;
	const autoFocusOnHideProp = useBooleanEvent(autoFocusOnHide);
	const [hasOpened, setHasOpened] = useState(false);
	useEffect(() => {
		if (!open) return;
		setHasOpened(true);
		return () => setHasOpened(false);
	}, [open]);
	const focusOnHide = useCallback((dialog, retry = true) => {
		const { disclosureElement } = store.getState();
		if (isAlreadyFocusingAnotherElement(dialog)) return;
		let element = getElementFromProp(finalFocus) || disclosureElement;
		if (element?.id) {
			const doc = getDocument(element);
			const selector = `[aria-activedescendant="${element.id}"]`;
			const composite = doc.querySelector(selector);
			if (composite) {
				element = composite;
			}
		}
		if (element && !isFocusable(element)) {
			const maybeParentDialog = element.closest("[data-dialog]");
			if (maybeParentDialog?.id) {
				const doc = getDocument(maybeParentDialog);
				const selector = `[aria-controls~="${maybeParentDialog.id}"]`;
				const control = doc.querySelector(selector);
				if (control) {
					element = control;
				}
			}
		}
		const isElementFocusable = element && isFocusable(element);
		if (!isElementFocusable && retry) {
			requestAnimationFrame(() => focusOnHide(dialog, false));
			return;
		}
		if (!autoFocusOnHideProp(isElementFocusable ? element : null)) return;
		if (!isElementFocusable) return;
		element?.focus({ preventScroll: true });
	}, [
		store,
		finalFocus,
		autoFocusOnHideProp
	]);
	const focusedOnHideRef = useRef(false);
	useSafeLayoutEffect(() => {
		if (open) return;
		if (!hasOpened) return;
		if (!mayAutoFocusOnHide) return;
		const dialog = ref.current;
		focusedOnHideRef.current = true;
		focusOnHide(dialog);
	}, [
		open,
		hasOpened,
		domReady,
		mayAutoFocusOnHide,
		focusOnHide
	]);
	useEffect(() => {
		if (!hasOpened) return;
		if (!mayAutoFocusOnHide) return;
		const dialog = ref.current;
		return () => {
			if (focusedOnHideRef.current) {
				focusedOnHideRef.current = false;
				return;
			}
			focusOnHide(dialog);
		};
	}, [
		hasOpened,
		mayAutoFocusOnHide,
		focusOnHide
	]);
	const hideOnEscapeProp = useBooleanEvent(hideOnEscape);
	useEffect(() => {
		if (!domReady) return;
		if (!mounted) return;
		const onKeyDown = (event) => {
			if (event.key !== "Escape") return;
			if (event.defaultPrevented) return;
			const dialog = ref.current;
			if (!dialog) return;
			if (isElementMarked(dialog)) return;
			const target = event.target;
			if (!target) return;
			const { disclosureElement } = store.getState();
			const isValidTarget = () => {
				if (target.tagName === "BODY") return true;
				if (contains(dialog, target)) return true;
				if (!disclosureElement) return true;
				if (contains(disclosureElement, target)) return true;
				return false;
			};
			if (!isValidTarget()) return;
			if (!hideOnEscapeProp(event)) return;
			store.hide();
		};
		return addGlobalEventListener("keydown", onKeyDown, true);
	}, [
		store,
		domReady,
		mounted,
		hideOnEscapeProp
	]);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(HeadingLevel, {
		level: modal ? 1 : undefined,
		children: element
	}), [modal]);
	const hiddenProp = props.hidden;
	const alwaysVisible = props.alwaysVisible;
	props = useWrapElement(props, (element) => {
		if (!backdrop) return element;
		return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(DialogBackdrop, {
			store,
			backdrop,
			hidden: hiddenProp,
			alwaysVisible
		}), element] });
	}, [
		store,
		backdrop,
		hiddenProp,
		alwaysVisible
	]);
	const [headingId, setHeadingId] = useState();
	const [descriptionId, setDescriptionId] = useState();
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(DialogScopedContextProvider, {
		value: store,
		children: /* @__PURE__ */ jsx(DialogHeadingContext.Provider, {
			value: setHeadingId,
			children: /* @__PURE__ */ jsx(DialogDescriptionContext.Provider, {
				value: setDescriptionId,
				children: element
			})
		})
	}), [store]);
	props = {
		id,
		"data-dialog": "",
		role: "dialog",
		tabIndex: focusable ? -1 : undefined,
		"aria-labelledby": headingId,
		"aria-describedby": descriptionId,
		...props,
		ref: useMergeRefs(ref, props.ref)
	};
	props = useFocusableContainer({
		...props,
		autoFocusOnShow: autoFocusEnabled
	});
	props = useDisclosureContent({
		store,
		...props
	});
	props = useFocusable({
		...props,
		focusable
	});
	props = usePortal({
		portal,
		...props,
		portalRef,
		preserveTabOrder
	});
	return props;
});
function createDialogComponent(Component, useProviderContext = useDialogProviderContext) {
	return forwardRef(function DialogComponent(props) {
		const context = useProviderContext();
		const store = props.store || context;
		const mounted = useStoreState(store, (state) => !props.unmountOnHide || state?.mounted || !!props.open);
		if (!mounted) return null;
		return /* @__PURE__ */ jsx(Component, { ...props });
	});
}
/**
* Renders a dialog similar to the native `dialog` element that's rendered in a
* [`portal`](https://ariakit.org/reference/dialog#portal) by default.
*
* The dialog can be either
* [`modal`](https://ariakit.org/reference/dialog#modal) or non-modal. The
* visibility state can be controlled with the
* [`open`](https://ariakit.org/reference/dialog#open) and
* [`onClose`](https://ariakit.org/reference/dialog#onclose) props.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx {4-6}
* const [open, setOpen] = useState(false);
*
* <button onClick={() => setOpen(true)}>Open dialog</button>
* <Dialog open={open} onClose={() => setOpen(false)}>
*   Dialog
* </Dialog>
* ```
*/
const Dialog = createDialogComponent(forwardRef(function Dialog$1(props) {
	const htmlProps = useDialog(props);
	return createElement(TagName, htmlProps);
}), useDialogProviderContext);

//#endregion
export { useDialogStoreProps as a, useDialogStore as i, createDialogComponent as n, createDialogStore as o, useDialog as r, Dialog as t };