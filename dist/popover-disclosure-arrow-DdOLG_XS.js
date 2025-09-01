import { invariant, removeUndefinedValues, useEvent, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { PopoverScopedContextProvider, usePopoverContext, usePopoverProviderContext } from "./popover-context-BN0yoLp_.js";
import { usePopoverAnchor } from "./popover-anchor-MiGtzprf.js";
import { useDialogDisclosure } from "./dialog-disclosure-DttDXq2Y.js";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/popover/popover-disclosure.tsx
const TagName$1 = "button";
/**
* Returns props to create a `PopoverDisclosure` component.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* const store = usePopoverStore();
* const props = usePopoverDisclosure({ store });
* <Role {...props}>Disclosure</Role>
* <Popover store={store}>Popover</Popover>
* ```
*/
const usePopoverDisclosure = createHook(function usePopoverDisclosure$1({ store,...props }) {
	const context = usePopoverProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "PopoverDisclosure must receive a `store` prop or be wrapped in a PopoverProvider component.");
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		store?.setAnchorElement(event.currentTarget);
		onClickProp?.(event);
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(PopoverScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	props = {
		...props,
		onClick
	};
	props = usePopoverAnchor({
		store,
		...props
	});
	props = useDialogDisclosure({
		store,
		...props
	});
	return props;
});
/**
* Renders a button that controls the visibility of the
* [`Popover`](https://ariakit.org/reference/popover) component when clicked.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {2}
* <PopoverProvider>
*   <PopoverDisclosure>Disclosure</PopoverDisclosure>
*   <Popover>Popover</Popover>
* </PopoverProvider>
* ```
*/
const PopoverDisclosure = forwardRef(function PopoverDisclosure$1(props) {
	const htmlProps = usePopoverDisclosure(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/popover/popover-disclosure-arrow.tsx
const TagName = "span";
const pointsMap = {
	top: "4,10 8,6 12,10",
	right: "6,4 10,8 6,12",
	bottom: "4,6 8,10 12,6",
	left: "10,4 6,8 10,12"
};
/**
* Returns props to create a `PopoverDisclosureArrow` component.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* const store = usePopoverStore();
* const props = usePopoverDisclosureArrow({ store });
* <PopoverDisclosure store={store}>
*   Disclosure
*   <Role {...props} />
* </PopoverDisclosure>
* ```
*/
const usePopoverDisclosureArrow = createHook(function usePopoverDisclosureArrow$1({ store, placement,...props }) {
	const context = usePopoverContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "PopoverDisclosureArrow must be wrapped in a PopoverDisclosure component.");
	const position = store.useState((state) => placement || state.placement);
	const dir = position.split("-")[0];
	const points = pointsMap[dir];
	const children = useMemo(() => /* @__PURE__ */ jsx("svg", {
		display: "block",
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		viewBox: "0 0 16 16",
		height: "1em",
		width: "1em",
		children: /* @__PURE__ */ jsx("polyline", { points })
	}), [points]);
	props = {
		children,
		"aria-hidden": true,
		...props,
		style: {
			width: "1em",
			height: "1em",
			pointerEvents: "none",
			...props.style
		}
	};
	return removeUndefinedValues(props);
});
/**
* Renders an arrow pointing to the popover position. It's usually rendered
* inside the
* [`PopoverDisclosure`](https://ariakit.org/reference/popover-disclosure)
* component.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {4}
* <PopoverProvider>
*   <PopoverDisclosure>
*     Disclosure
*     <PopoverDisclosureArrow />
*   </PopoverDisclosure>
*   <Popover>Popover</Popover>
* </PopoverProvider>
* ```
*/
const PopoverDisclosureArrow = forwardRef(function PopoverDisclosureArrow$1(props) {
	const htmlProps = usePopoverDisclosureArrow(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { PopoverDisclosure, PopoverDisclosureArrow, usePopoverDisclosure, usePopoverDisclosureArrow };