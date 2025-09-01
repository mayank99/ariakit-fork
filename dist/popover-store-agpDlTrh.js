import { defaultValue, invariant, useEvent, usePortalRef, useSafeLayoutEffect, useUpdateEffect, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { createStore, mergeStore, omit, throwOnConflictingProps, useStore, useStoreProps } from "./store-Ddr50htY.js";
import { PopoverScopedContextProvider, usePopoverProviderContext } from "./popover-context-BN0yoLp_.js";
import { createDialogComponent, createDialogStore, useDialog, useDialogStoreProps } from "./dialog-DsMHKXPt.js";
import { useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
import { arrow, autoUpdate, computePosition, flip, limitShift, offset, shift, size } from "@floating-ui/dom";

//#region packages/ariakit-react-core/src/popover/popover.tsx
const TagName = "div";
function createDOMRect(x = 0, y = 0, width = 0, height = 0) {
	if (typeof DOMRect === "function") {
		return new DOMRect(x, y, width, height);
	}
	const rect = {
		x,
		y,
		width,
		height,
		top: y,
		right: x + width,
		bottom: y + height,
		left: x
	};
	return {
		...rect,
		toJSON: () => rect
	};
}
function getDOMRect(anchorRect) {
	if (!anchorRect) return createDOMRect();
	const { x, y, width, height } = anchorRect;
	return createDOMRect(x, y, width, height);
}
function getAnchorElement(anchorElement, getAnchorRect) {
	const contextElement = anchorElement || undefined;
	return {
		contextElement,
		getBoundingClientRect: () => {
			const anchor = anchorElement;
			const anchorRect = getAnchorRect?.(anchor);
			if (anchorRect || !anchor) {
				return getDOMRect(anchorRect);
			}
			return anchor.getBoundingClientRect();
		}
	};
}
function isValidPlacement(flip$1) {
	return /^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(flip$1);
}
function roundByDPR(value) {
	const dpr = window.devicePixelRatio || 1;
	return Math.round(value * dpr) / dpr;
}
function getOffsetMiddleware(arrowElement, props) {
	return offset(({ placement }) => {
		const arrowOffset = (arrowElement?.clientHeight || 0) / 2;
		const finalGutter = typeof props.gutter === "number" ? props.gutter + arrowOffset : props.gutter ?? arrowOffset;
		const hasAlignment = !!placement.split("-")[1];
		return {
			crossAxis: !hasAlignment ? props.shift : undefined,
			mainAxis: finalGutter,
			alignmentAxis: props.shift
		};
	});
}
function getFlipMiddleware(props) {
	if (props.flip === false) return;
	const fallbackPlacements = typeof props.flip === "string" ? props.flip.split(" ") : undefined;
	invariant(!fallbackPlacements || fallbackPlacements.every(isValidPlacement), process.env.NODE_ENV !== "production" && "`flip` expects a spaced-delimited list of placements");
	return flip({
		padding: props.overflowPadding,
		fallbackPlacements
	});
}
function getShiftMiddleware(props) {
	if (!props.slide && !props.overlap) return;
	return shift({
		mainAxis: props.slide,
		crossAxis: props.overlap,
		padding: props.overflowPadding,
		limiter: limitShift()
	});
}
function getSizeMiddleware(props) {
	return size({
		padding: props.overflowPadding,
		apply({ elements, availableWidth, availableHeight, rects }) {
			const wrapper = elements.floating;
			const referenceWidth = Math.round(rects.reference.width);
			availableWidth = Math.floor(availableWidth);
			availableHeight = Math.floor(availableHeight);
			wrapper.style.setProperty("--popover-anchor-width", `${referenceWidth}px`);
			wrapper.style.setProperty("--popover-available-width", `${availableWidth}px`);
			wrapper.style.setProperty("--popover-available-height", `${availableHeight}px`);
			if (props.sameWidth) {
				wrapper.style.width = `${referenceWidth}px`;
			}
			if (props.fitViewport) {
				wrapper.style.maxWidth = `${availableWidth}px`;
				wrapper.style.maxHeight = `${availableHeight}px`;
			}
		}
	});
}
function getArrowMiddleware(arrowElement, props) {
	if (!arrowElement) return;
	return arrow({
		element: arrowElement,
		padding: props.arrowPadding
	});
}
/**
* Returns props to create a `Popover` component.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* const store = usePopoverStore();
* const props = usePopover({ store });
* <Role {...props}>Popover</Role>
* ```
*/
const usePopover = createHook(function usePopover$1({ store, modal = false, portal = !!modal, preserveTabOrder = true, autoFocusOnShow = true, wrapperProps, fixed = false, flip: flip$1 = true, shift: shift$1 = 0, slide = true, overlap = false, sameWidth = false, fitViewport = false, gutter, arrowPadding = 4, overflowPadding = 8, getAnchorRect, updatePosition,...props }) {
	const context = usePopoverProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Popover must receive a `store` prop or be wrapped in a PopoverProvider component.");
	const arrowElement = store.useState("arrowElement");
	const anchorElement = store.useState("anchorElement");
	const disclosureElement = store.useState("disclosureElement");
	const popoverElement = store.useState("popoverElement");
	const contentElement = store.useState("contentElement");
	const placement = store.useState("placement");
	const mounted = store.useState("mounted");
	const rendered = store.useState("rendered");
	const defaultArrowElementRef = useRef(null);
	const [positioned, setPositioned] = useState(false);
	const { portalRef, domReady } = usePortalRef(portal, props.portalRef);
	const getAnchorRectProp = useEvent(getAnchorRect);
	const updatePositionProp = useEvent(updatePosition);
	const hasCustomUpdatePosition = !!updatePosition;
	useSafeLayoutEffect(() => {
		if (!popoverElement?.isConnected) return;
		popoverElement.style.setProperty("--popover-overflow-padding", `${overflowPadding}px`);
		const anchor = getAnchorElement(anchorElement, getAnchorRectProp);
		const updatePosition$1 = async () => {
			if (!mounted) return;
			if (!arrowElement) {
				defaultArrowElementRef.current = defaultArrowElementRef.current || document.createElement("div");
			}
			const arrow$1 = arrowElement || defaultArrowElementRef.current;
			const middleware = [
				getOffsetMiddleware(arrow$1, {
					gutter,
					shift: shift$1
				}),
				getFlipMiddleware({
					flip: flip$1,
					overflowPadding
				}),
				getShiftMiddleware({
					slide,
					shift: shift$1,
					overlap,
					overflowPadding
				}),
				getArrowMiddleware(arrow$1, { arrowPadding }),
				getSizeMiddleware({
					sameWidth,
					fitViewport,
					overflowPadding
				})
			];
			const pos = await computePosition(anchor, popoverElement, {
				placement,
				strategy: fixed ? "fixed" : "absolute",
				middleware
			});
			store?.setState("currentPlacement", pos.placement);
			setPositioned(true);
			const x = roundByDPR(pos.x);
			const y = roundByDPR(pos.y);
			Object.assign(popoverElement.style, {
				top: "0",
				left: "0",
				transform: `translate3d(${x}px,${y}px,0)`
			});
			if (arrow$1 && pos.middlewareData.arrow) {
				const { x: arrowX, y: arrowY } = pos.middlewareData.arrow;
				const side = pos.placement.split("-")[0];
				const centerX = arrow$1.clientWidth / 2;
				const centerY = arrow$1.clientHeight / 2;
				const originX = arrowX != null ? arrowX + centerX : -centerX;
				const originY = arrowY != null ? arrowY + centerY : -centerY;
				popoverElement.style.setProperty("--popover-transform-origin", {
					top: `${originX}px calc(100% + ${centerY}px)`,
					bottom: `${originX}px ${-centerY}px`,
					left: `calc(100% + ${centerX}px) ${originY}px`,
					right: `${-centerX}px ${originY}px`
				}[side]);
				Object.assign(arrow$1.style, {
					left: arrowX != null ? `${arrowX}px` : "",
					top: arrowY != null ? `${arrowY}px` : "",
					[side]: "100%"
				});
			}
		};
		const update = async () => {
			if (hasCustomUpdatePosition) {
				await updatePositionProp({ updatePosition: updatePosition$1 });
				setPositioned(true);
			} else {
				await updatePosition$1();
			}
		};
		const cancelAutoUpdate = autoUpdate(anchor, popoverElement, update, { elementResize: typeof ResizeObserver === "function" });
		return () => {
			setPositioned(false);
			cancelAutoUpdate();
		};
	}, [
		store,
		rendered,
		popoverElement,
		arrowElement,
		anchorElement,
		popoverElement,
		placement,
		mounted,
		domReady,
		fixed,
		flip$1,
		shift$1,
		slide,
		overlap,
		sameWidth,
		fitViewport,
		gutter,
		arrowPadding,
		overflowPadding,
		getAnchorRectProp,
		hasCustomUpdatePosition,
		updatePositionProp
	]);
	useSafeLayoutEffect(() => {
		if (!mounted) return;
		if (!domReady) return;
		if (!popoverElement?.isConnected) return;
		if (!contentElement?.isConnected) return;
		const applyZIndex = () => {
			popoverElement.style.zIndex = getComputedStyle(contentElement).zIndex;
		};
		applyZIndex();
		let raf = requestAnimationFrame(() => {
			raf = requestAnimationFrame(applyZIndex);
		});
		return () => cancelAnimationFrame(raf);
	}, [
		mounted,
		domReady,
		popoverElement,
		contentElement
	]);
	const position = fixed ? "fixed" : "absolute";
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx("div", {
		...wrapperProps,
		style: {
			position,
			top: 0,
			left: 0,
			width: "max-content",
			...wrapperProps?.style
		},
		ref: store?.setPopoverElement,
		children: element
	}), [
		store,
		position,
		wrapperProps
	]);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(PopoverScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	props = {
		"data-placing": !positioned || undefined,
		...props,
		style: {
			position: "relative",
			...props.style
		}
	};
	props = useDialog({
		store,
		modal,
		portal,
		preserveTabOrder,
		preserveTabOrderAnchor: disclosureElement || anchorElement,
		autoFocusOnShow: positioned && autoFocusOnShow,
		...props,
		portalRef
	});
	return props;
});
/**
* Renders a popover element that's automatically positioned relative to an
* anchor element.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {3}
* <PopoverProvider>
*   <PopoverDisclosure>Disclosure</PopoverDisclosure>
*   <Popover>Popover</Popover>
* </PopoverProvider>
* ```
*/
const Popover = createDialogComponent(forwardRef(function Popover$1(props) {
	const htmlProps = usePopover(props);
	return createElement(TagName, htmlProps);
}), usePopoverProviderContext);

//#endregion
//#region packages/ariakit-core/src/popover/popover-store.ts
/**
* Creates a popover store.
*/
function createPopoverStore({ popover: otherPopover,...props } = {}) {
	const store = mergeStore(props.store, omit(otherPopover, [
		"arrowElement",
		"anchorElement",
		"contentElement",
		"popoverElement",
		"disclosureElement"
	]));
	throwOnConflictingProps(props, store);
	const syncState = store?.getState();
	const dialog = createDialogStore({
		...props,
		store
	});
	const placement = defaultValue(props.placement, syncState?.placement, "bottom");
	const initialState = {
		...dialog.getState(),
		placement,
		currentPlacement: placement,
		anchorElement: defaultValue(syncState?.anchorElement, null),
		popoverElement: defaultValue(syncState?.popoverElement, null),
		arrowElement: defaultValue(syncState?.arrowElement, null),
		rendered: Symbol("rendered")
	};
	const popover = createStore(initialState, dialog, store);
	return {
		...dialog,
		...popover,
		setAnchorElement: (element) => popover.setState("anchorElement", element),
		setPopoverElement: (element) => popover.setState("popoverElement", element),
		setArrowElement: (element) => popover.setState("arrowElement", element),
		render: () => popover.setState("rendered", Symbol("rendered"))
	};
}

//#endregion
//#region packages/ariakit-react-core/src/popover/popover-store.ts
function usePopoverStoreProps(store, update, props) {
	useUpdateEffect(update, [props.popover]);
	useStoreProps(store, props, "placement");
	return useDialogStoreProps(store, update, props);
}
/**
* Creates a popover store to control the state of
* [Popover](https://ariakit.org/components/popover) components.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* const popover = usePopoverStore();
* <PopoverDisclosure store={popover}>Disclosure</PopoverDisclosure>
* <Popover store={popover}>Popover</Popover>
* ```
*/
function usePopoverStore(props = {}) {
	const [store, update] = useStore(createPopoverStore, props);
	return usePopoverStoreProps(store, update, props);
}

//#endregion
export { Popover, createPopoverStore, usePopover, usePopoverStore, usePopoverStoreProps };