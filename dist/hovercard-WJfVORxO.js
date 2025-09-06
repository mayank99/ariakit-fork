import { addGlobalEventListener, contains, invariant, useEvent, useMergeRefs } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { sync } from "./store-Ddr50htY.js";
import { useDialogDisclosure } from "./dialog-disclosure-DttDXq2Y.js";
import { useVisuallyHidden } from "./visually-hidden-CYGj8nJz.js";
import { HovercardContextProvider, useHovercardContext, useHovercardProviderContext, useHovercardStore } from "./hovercard-store-DPGUctEu.js";
import { usePopoverArrow } from "./popover-arrow-C8H6zRta.js";
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/hovercard/hovercard-arrow.tsx
const TagName$1 = "div";
/**
* Returns props to create a `HovercardArrow` component.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* const store = useHovercardStore();
* const props = useHovercardArrow({ store });
* <Hovercard store={store}>
*   <Role {...props} />
*   Details
* </Hovercard>
* ```
*/
const useHovercardArrow = createHook(function useHovercardArrow$1({ store,...props }) {
	const context = useHovercardContext();
	store = store || context;
	props = usePopoverArrow({
		store,
		...props
	});
	return props;
});
/**
* Renders an arrow element inside a
* [`Hovercard`](https://ariakit.org/reference/hovercard) component that points
* to the anchor element.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx {4}
* <HovercardProvider>
*   <HovercardAnchor>@username</HovercardAnchor>
*   <Hovercard>
*     <HovercardArrow />
*     Details
*   </Hovercard>
* </HovercardProvider>
* ```
*/
const HovercardArrow = forwardRef(function HovercardArrow$1(props) {
	const htmlProps = useHovercardArrow(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/hovercard/hovercard-disclosure.tsx
const TagName = "button";
/**
* Returns props to create a `HovercardDisclosure` component.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* const store = useHovercardStore();
* const props = useHovercardDisclosure({ store });
* <HovercardAnchor store={store}>@username</HovercardAnchor>
* <Role {...props} />
* <Hovercard store={store}>Details</Hovercard>
* ```
*/
const useHovercardDisclosure = createHook(function useHovercardDisclosure$1({ store,...props }) {
	const context = useHovercardProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "HovercardDisclosure must receive a `store` prop or be wrapped in a HovercardProvider component.");
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (!visible) return;
		const onBlur = (event) => {
			if (!store) return;
			const nextActiveElement = event.relatedTarget;
			if (nextActiveElement) {
				const { anchorElement: anchor, popoverElement: popover, disclosureElement: disclosure } = store.getState();
				if (anchor && contains(anchor, nextActiveElement)) return;
				if (popover && contains(popover, nextActiveElement)) return;
				if (disclosure && contains(disclosure, nextActiveElement)) return;
				if (nextActiveElement.hasAttribute("data-focus-trap")) return;
			}
			setVisible(false);
		};
		return addGlobalEventListener("focusout", onBlur, true);
	}, [visible, store]);
	useEffect(() => {
		return sync(store, ["anchorElement"], (state) => {
			const anchor = state.anchorElement;
			if (!anchor) return;
			const observer = new MutationObserver(() => {
				if (!anchor.hasAttribute("data-focus-visible")) return;
				setVisible(true);
			});
			observer.observe(anchor, { attributeFilter: ["data-focus-visible"] });
			return () => observer.disconnect();
		});
	}, [store]);
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		store?.setAutoFocusOnShow(true);
	});
	const onFocusProp = props.onFocus;
	const onFocus = useEvent((event) => {
		onFocusProp?.(event);
		if (event.defaultPrevented) return;
		setVisible(true);
	});
	const { style } = useVisuallyHidden();
	if (!visible) {
		props = {
			...props,
			style: {
				...style,
				...props.style
			}
		};
	}
	const children = /* @__PURE__ */ jsx("svg", {
		display: "block",
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		viewBox: "0 0 16 16",
		height: "1em",
		width: "1em",
		children: /* @__PURE__ */ jsx("polyline", { points: "4,6 8,10 12,6" })
	});
	props = {
		children,
		...props,
		ref: useMergeRefs(store.setDisclosureElement, props.ref),
		onClick,
		onFocus
	};
	props = useDialogDisclosure({
		store,
		...props
	});
	return props;
});
/**
* Renders a hidden disclosure button that will be visible when the
* [`HovercardAnchor`](https://ariakit.org/reference/hovercard-anchor) receives
* keyboard focus. The user can then navigate to the button to open the
* hovercard when using the keyboard.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx {3}
* <HovercardProvider>
*   <HovercardAnchor>@username</HovercardAnchor>
*   <HovercardDisclosure />
*   <Hovercard>Details</Hovercard>
* </HovercardProvider>
* ```
*/
const HovercardDisclosure = forwardRef(function HovercardDisclosure$1(props) {
	const htmlProps = useHovercardDisclosure(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/hovercard/hovercard-provider.tsx
/**
* Provides a hovercard store to
* [Hovercard](https://ariakit.org/components/hovercard) components.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* <HovercardProvider timeout={250}>
*   <HovercardAnchor />
*   <Hovercard />
* </HovercardProvider>
* ```
*/
function HovercardProvider(props = {}) {
	const store = useHovercardStore(props);
	return /* @__PURE__ */ jsx(HovercardContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { HovercardArrow, HovercardDisclosure, HovercardProvider };