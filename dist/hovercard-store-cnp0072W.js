import { A as isFalsyBooleanCallback, S as chain, T as disabledFromProps, _ as useWrapElement, c as useLiveRef, d as usePortalRef, f as useSafeLayoutEffect, k as invariant, l as useMergeRefs, n as useBooleanEvent, r as useEvent, s as useIsMouseMoving, tt as contains, w as defaultValue, z as addGlobalEventListener } from "./hooks-H6OmsigH.js";
import { u as hasFocusWithin } from "./focus-BzfNYadt.js";
import { i as forwardRef, n as createHook, r as createStoreContext, t as createElement } from "./system-CMX9uFDP.js";
import { r as useFocusable } from "./focusable-rBfookfw.js";
import { n as useStoreProps, o as createStore, p as sync, t as useStore } from "./store-DLqhzR2r.js";
import { n as PopoverScopedContextProvider, t as PopoverContextProvider } from "./popover-context-DedaNfGB.js";
import { n as createDialogComponent } from "./dialog-BY8Na6S7.js";
import { a as usePopover, n as usePopoverStoreProps, r as createPopoverStore } from "./popover-store-DWE0Zrud.js";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/hovercard/hovercard-context.tsx
const ctx = createStoreContext([PopoverContextProvider], [PopoverScopedContextProvider]);
/**
* Returns the hovercard store from the nearest hovercard container.
* @example
* function Hovercard() {
*   const store = useHovercardContext();
*
*   if (!store) {
*     throw new Error("Hovercard must be wrapped in HovercardProvider");
*   }
*
*   // Use the store...
* }
*/
const useHovercardContext = ctx.useContext;
const useHovercardScopedContext = ctx.useScopedContext;
const useHovercardProviderContext = ctx.useProviderContext;
const HovercardContextProvider = ctx.ContextProvider;
const HovercardScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/hovercard/utils/polygon.ts
function getEventPoint(event) {
	return [event.clientX, event.clientY];
}
function isPointInPolygon(point, polygon) {
	const [x, y] = point;
	let inside = false;
	const length = polygon.length;
	for (let l = length, i = 0, j = l - 1; i < l; j = i++) {
		const [xi, yi] = polygon[i];
		const [xj, yj] = polygon[j];
		const [, vy] = polygon[j === 0 ? l - 1 : j - 1] || [0, 0];
		const where = (yi - yj) * (x - xi) - (xi - xj) * (y - yi);
		if (yj < yi) {
			if (y >= yj && y < yi) {
				if (where === 0) return true;
				if (where > 0) {
					if (y === yj) {
						if (y > vy) {
							inside = !inside;
						}
					} else {
						inside = !inside;
					}
				}
			}
		} else if (yi < yj) {
			if (y > yi && y <= yj) {
				if (where === 0) return true;
				if (where < 0) {
					if (y === yj) {
						if (y < vy) {
							inside = !inside;
						}
					} else {
						inside = !inside;
					}
				}
			}
		} else if (y === yi && (x >= xj && x <= xi || x >= xi && x <= xj)) {
			return true;
		}
	}
	return inside;
}
function getEnterPointPlacement(enterPoint, rect) {
	const { top, right, bottom, left } = rect;
	const [x, y] = enterPoint;
	const placementX = x < left ? "left" : x > right ? "right" : null;
	const placementY = y < top ? "top" : y > bottom ? "bottom" : null;
	return [placementX, placementY];
}
function getElementPolygon(element, enterPoint) {
	const rect = element.getBoundingClientRect();
	const { top, right, bottom, left } = rect;
	const [x, y] = getEnterPointPlacement(enterPoint, rect);
	const polygon = [enterPoint];
	if (x) {
		if (y !== "top") {
			polygon.push([x === "left" ? left : right, top]);
		}
		polygon.push([x === "left" ? right : left, top]);
		polygon.push([x === "left" ? right : left, bottom]);
		if (y !== "bottom") {
			polygon.push([x === "left" ? left : right, bottom]);
		}
	} else if (y === "top") {
		polygon.push([left, top]);
		polygon.push([left, bottom]);
		polygon.push([right, bottom]);
		polygon.push([right, top]);
	} else {
		polygon.push([left, bottom]);
		polygon.push([left, top]);
		polygon.push([right, top]);
		polygon.push([right, bottom]);
	}
	return polygon;
}

//#endregion
//#region packages/ariakit-react-core/src/hovercard/hovercard.tsx
const TagName$1 = "div";
function isMovingOnHovercard(target, card, anchor, nested) {
	if (hasFocusWithin(card)) return true;
	if (!target) return false;
	if (contains(card, target)) return true;
	if (anchor && contains(anchor, target)) return true;
	if (nested?.some((card$1) => isMovingOnHovercard(target, card$1, anchor))) {
		return true;
	}
	return false;
}
function useAutoFocusOnHide({ store,...props }) {
	const [autoFocusOnHide, setAutoFocusOnHide] = useState(false);
	const mounted = store.useState("mounted");
	useEffect(() => {
		if (!mounted) {
			setAutoFocusOnHide(false);
		}
	}, [mounted]);
	const onFocusProp = props.onFocus;
	const onFocus = useEvent((event) => {
		onFocusProp?.(event);
		if (event.defaultPrevented) return;
		setAutoFocusOnHide(true);
	});
	const finalFocusRef = useRef(null);
	useEffect(() => {
		return sync(store, ["anchorElement"], (state) => {
			finalFocusRef.current = state.anchorElement;
		});
	}, []);
	props = {
		autoFocusOnHide,
		finalFocus: finalFocusRef,
		...props,
		onFocus
	};
	return props;
}
const NestedHovercardContext = createContext(null);
/**
* Returns props to create a `Hovercard` component.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* const store = useHovercardStore();
* const props = useHovercard({ store });
* <HovercardAnchor store={store}>@username</HovercardAnchor>
* <Role {...props}>Details</Role>
* ```
*/
const useHovercard = createHook(function useHovercard$1({ store, modal = false, portal = !!modal, hideOnEscape = true, hideOnHoverOutside = true, disablePointerEventsOnApproach = !!hideOnHoverOutside,...props }) {
	const context = useHovercardProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Hovercard must receive a `store` prop or be wrapped in a HovercardProvider component.");
	const element = store.useState("contentElement");
	const [nestedHovercards, setNestedHovercards] = useState([]);
	const hideTimeoutRef = useRef(0);
	const enterPointRef = useRef(null);
	const { portalRef, domReady } = usePortalRef(portal, props.portalRef);
	const isMouseMoving = useIsMouseMoving();
	const mayHideOnHoverOutside = !!hideOnHoverOutside;
	const hideOnHoverOutsideProp = useBooleanEvent(hideOnHoverOutside);
	const mayDisablePointerEvents = !!disablePointerEventsOnApproach;
	const disablePointerEventsProp = useBooleanEvent(disablePointerEventsOnApproach);
	const open = store.useState("open");
	const mounted = store.useState("mounted");
	useEffect(() => {
		if (!domReady) return;
		if (!mounted) return;
		if (!mayHideOnHoverOutside && !mayDisablePointerEvents) return;
		if (!element) return;
		const onMouseMove = (event) => {
			if (!store) return;
			if (!isMouseMoving()) return;
			const { anchorElement, hideTimeout, timeout } = store.getState();
			const enterPoint = enterPointRef.current;
			const [target] = event.composedPath();
			const anchor = anchorElement;
			if (isMovingOnHovercard(target, element, anchor, nestedHovercards)) {
				enterPointRef.current = target && anchor && contains(anchor, target) ? getEventPoint(event) : null;
				window.clearTimeout(hideTimeoutRef.current);
				hideTimeoutRef.current = 0;
				return;
			}
			if (hideTimeoutRef.current) return;
			if (enterPoint) {
				const currentPoint = getEventPoint(event);
				const polygon = getElementPolygon(element, enterPoint);
				if (isPointInPolygon(currentPoint, polygon)) {
					enterPointRef.current = currentPoint;
					if (!disablePointerEventsProp(event)) return;
					event.preventDefault();
					event.stopPropagation();
					return;
				}
			}
			if (!hideOnHoverOutsideProp(event)) return;
			hideTimeoutRef.current = window.setTimeout(() => {
				hideTimeoutRef.current = 0;
				store?.hide();
			}, hideTimeout ?? timeout);
		};
		return chain(addGlobalEventListener("mousemove", onMouseMove, true), () => clearTimeout(hideTimeoutRef.current));
	}, [
		store,
		isMouseMoving,
		domReady,
		mounted,
		mayHideOnHoverOutside,
		mayDisablePointerEvents,
		nestedHovercards,
		disablePointerEventsProp,
		hideOnHoverOutsideProp,
		element
	]);
	useEffect(() => {
		if (!domReady) return;
		if (!mounted) return;
		if (!mayDisablePointerEvents) return;
		const disableEvent = (event) => {
			if (!element) return;
			const enterPoint = enterPointRef.current;
			if (!enterPoint) return;
			const polygon = getElementPolygon(element, enterPoint);
			if (isPointInPolygon(getEventPoint(event), polygon)) {
				if (!disablePointerEventsProp(event)) return;
				event.preventDefault();
				event.stopPropagation();
			}
		};
		return chain(addGlobalEventListener("mouseenter", disableEvent, true), addGlobalEventListener("mouseover", disableEvent, true), addGlobalEventListener("mouseout", disableEvent, true), addGlobalEventListener("mouseleave", disableEvent, true));
	}, [
		domReady,
		mounted,
		mayDisablePointerEvents,
		disablePointerEventsProp,
		element
	]);
	useEffect(() => {
		if (!domReady) return;
		if (open) return;
		store?.setAutoFocusOnShow(false);
	}, [
		store,
		domReady,
		open
	]);
	const openRef = useLiveRef(open);
	useEffect(() => {
		if (!domReady) return;
		return () => {
			if (!openRef.current) {
				store?.setAutoFocusOnShow(false);
			}
		};
	}, [store, domReady]);
	const registerOnParent = useContext(NestedHovercardContext);
	useSafeLayoutEffect(() => {
		if (modal) return;
		if (!portal) return;
		if (!mounted) return;
		if (!domReady) return;
		if (!element) return;
		return registerOnParent?.(element);
	}, [
		modal,
		portal,
		mounted,
		domReady,
		element
	]);
	const registerNestedHovercard = useCallback((element$1) => {
		setNestedHovercards((prevElements) => [...prevElements, element$1]);
		const parentUnregister = registerOnParent?.(element$1);
		return () => {
			setNestedHovercards((prevElements) => prevElements.filter((item) => item !== element$1));
			parentUnregister?.();
		};
	}, [registerOnParent]);
	props = useWrapElement(props, (element$1) => /* @__PURE__ */ jsx(HovercardScopedContextProvider, {
		value: store,
		children: /* @__PURE__ */ jsx(NestedHovercardContext.Provider, {
			value: registerNestedHovercard,
			children: element$1
		})
	}), [store, registerNestedHovercard]);
	props = useAutoFocusOnHide({
		store,
		...props
	});
	const autoFocusOnShow = store.useState((state) => modal || state.autoFocusOnShow);
	props = usePopover({
		store,
		modal,
		portal,
		autoFocusOnShow,
		...props,
		portalRef,
		hideOnEscape(event) {
			if (isFalsyBooleanCallback(hideOnEscape, event)) return false;
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					store?.hide();
				});
			});
			return true;
		}
	});
	return props;
});
/**
* Renders a hovercard element, which is a popover that's usually made visible
* by hovering the mouse cursor over a
* [`HovercardAnchor`](https://ariakit.org/reference/hovercard-anchor).
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx {3}
* <HovercardProvider>
*   <HovercardAnchor>@username</HovercardAnchor>
*   <Hovercard>Details</Hovercard>
* </HovercardProvider>
* ```
*/
const Hovercard = createDialogComponent(forwardRef(function Hovercard$1(props) {
	const htmlProps = useHovercard(props);
	return createElement(TagName$1, htmlProps);
}), useHovercardProviderContext);

//#endregion
//#region packages/ariakit-react-core/src/hovercard/hovercard-anchor.tsx
const TagName = "a";
/**
* Returns props to create a `HovercardAnchor` component.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* const store = useHovercardStore();
* const props = useHovercardAnchor({ store });
* <Role {...props} render={<a />}>@username</Role>
* <Hovercard store={store}>Details</Hovercard>
* ```
*/
const useHovercardAnchor = createHook(function useHovercardAnchor$1({ store, showOnHover = true,...props }) {
	const context = useHovercardProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "HovercardAnchor must receive a `store` prop or be wrapped in a HovercardProvider component.");
	const disabled = disabledFromProps(props);
	const showTimeoutRef = useRef(0);
	useEffect(() => () => window.clearTimeout(showTimeoutRef.current), []);
	useEffect(() => {
		const onMouseLeave = (event) => {
			if (!store) return;
			const { anchorElement } = store.getState();
			if (!anchorElement) return;
			if (event.target !== anchorElement) return;
			window.clearTimeout(showTimeoutRef.current);
			showTimeoutRef.current = 0;
		};
		return addGlobalEventListener("mouseleave", onMouseLeave, true);
	}, [store]);
	const onMouseMoveProp = props.onMouseMove;
	const showOnHoverProp = useBooleanEvent(showOnHover);
	const isMouseMoving = useIsMouseMoving();
	const onMouseMove = useEvent((event) => {
		onMouseMoveProp?.(event);
		if (disabled) return;
		if (!store) return;
		if (event.defaultPrevented) return;
		if (showTimeoutRef.current) return;
		if (!isMouseMoving()) return;
		if (!showOnHoverProp(event)) return;
		const element = event.currentTarget;
		store.setAnchorElement(element);
		store.setDisclosureElement(element);
		const { showTimeout, timeout } = store.getState();
		const showHovercard = () => {
			showTimeoutRef.current = 0;
			if (!isMouseMoving()) return;
			store?.setAnchorElement(element);
			store?.show();
			queueMicrotask(() => {
				store?.setDisclosureElement(element);
			});
		};
		const timeoutMs = showTimeout ?? timeout;
		if (timeoutMs === 0) {
			showHovercard();
		} else {
			showTimeoutRef.current = window.setTimeout(showHovercard, timeoutMs);
		}
	});
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (!store) return;
		window.clearTimeout(showTimeoutRef.current);
		showTimeoutRef.current = 0;
	});
	const ref = useCallback((element) => {
		if (!store) return;
		const { anchorElement } = store.getState();
		if (anchorElement?.isConnected) return;
		store.setAnchorElement(element);
	}, [store]);
	props = {
		...props,
		ref: useMergeRefs(ref, props.ref),
		onMouseMove,
		onClick
	};
	props = useFocusable(props);
	return props;
});
/**
* Renders an anchor element that will open a
* [`Hovercard`](https://ariakit.org/reference/hovercard) popup on hover.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx {2}
* <HovercardProvider>
*   <HovercardAnchor>@username</HovercardAnchor>
*   <Hovercard>Details</Hovercard>
* </HovercardProvider>
* ```
*/
const HovercardAnchor = forwardRef(function HovercardAnchor$1(props) {
	const htmlProps = useHovercardAnchor(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-core/src/hovercard/hovercard-store.ts
/**
* Creates a hovercard store.
*/
function createHovercardStore(props = {}) {
	const syncState = props.store?.getState();
	const popover = createPopoverStore({
		...props,
		placement: defaultValue(props.placement, syncState?.placement, "bottom")
	});
	const timeout = defaultValue(props.timeout, syncState?.timeout, 500);
	const initialState = {
		...popover.getState(),
		timeout,
		showTimeout: defaultValue(props.showTimeout, syncState?.showTimeout),
		hideTimeout: defaultValue(props.hideTimeout, syncState?.hideTimeout),
		autoFocusOnShow: defaultValue(syncState?.autoFocusOnShow, false)
	};
	const hovercard = createStore(initialState, popover, props.store);
	return {
		...popover,
		...hovercard,
		setAutoFocusOnShow: (value) => hovercard.setState("autoFocusOnShow", value)
	};
}

//#endregion
//#region packages/ariakit-react-core/src/hovercard/hovercard-store.ts
function useHovercardStoreProps(store, update, props) {
	useStoreProps(store, props, "timeout");
	useStoreProps(store, props, "showTimeout");
	useStoreProps(store, props, "hideTimeout");
	return usePopoverStoreProps(store, update, props);
}
/**
* Creates a hovercard store to control the state of
* [Hovercard](https://ariakit.org/reference/hovercard) components.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* const hovercard = useHovercardStore({ placement: "top" });
*
* <HovercardAnchor store={hovercard}>@username</HovercardAnchor>
* <Hovercard store={hovercard}>Details</Hovercard>
* ```
*/
function useHovercardStore(props = {}) {
	const [store, update] = useStore(createHovercardStore, props);
	return useHovercardStoreProps(store, update, props);
}

//#endregion
export { useHovercardAnchor as a, HovercardContextProvider as c, useHovercardProviderContext as d, useHovercardScopedContext as f, HovercardAnchor as i, HovercardScopedContextProvider as l, useHovercardStoreProps as n, Hovercard as o, createHovercardStore as r, useHovercard as s, useHovercardStore as t, useHovercardContext as u };