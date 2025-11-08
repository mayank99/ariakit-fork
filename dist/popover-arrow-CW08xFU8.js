import { L as removeUndefinedValues, a as useId, f as useSafeLayoutEffect, k as invariant, l as useMergeRefs, lt as getWindow } from "./hooks-H6OmsigH.js";
import { a as memo, i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { r as useStoreState } from "./store-DLqhzR2r.js";
import { r as usePopoverContext } from "./popover-context-DedaNfGB.js";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/popover/popover-arrow-path.ts
const POPOVER_ARROW_PATH = "M23 27.8C24.1 29 26.4 30 28 30H30H0H2C3.7 30 5.9 29 7 27.8L14 20.6C14.7 19.8 15.3 19.8 16 20.6L23 27.8Z";

//#endregion
//#region packages/ariakit-react-core/src/popover/popover-arrow.tsx
const TagName = "div";
const defaultSize = 30;
const halfDefaultSize = defaultSize / 2;
const rotateMap = {
	top: `rotate(180 ${halfDefaultSize} ${halfDefaultSize})`,
	right: `rotate(-90 ${halfDefaultSize} ${halfDefaultSize})`,
	bottom: `rotate(0 ${halfDefaultSize} ${halfDefaultSize})`,
	left: `rotate(90 ${halfDefaultSize} ${halfDefaultSize})`
};
function useComputedStyle(store) {
	const [style, setStyle] = useState();
	const contentElement = useStoreState(store, "contentElement");
	useSafeLayoutEffect(() => {
		if (!contentElement) return;
		const win = getWindow(contentElement);
		const computedStyle = win.getComputedStyle(contentElement);
		setStyle(computedStyle);
	}, [contentElement]);
	return style;
}
function getRingWidth(style) {
	if (!style) return;
	const boxShadow = style.getPropertyValue("box-shadow");
	const ringWidth = boxShadow.match(/0px 0px 0px ([^0]+px)/)?.[1];
	return ringWidth;
}
function getBorderColor(dir, style) {
	if (!style) return;
	const borderColor = style.getPropertyValue(`border-${dir}-color`);
	if (borderColor) return borderColor;
	const boxShadow = style.getPropertyValue("box-shadow");
	const match = boxShadow.match(/0px 0px 0px [^,]+/);
	if (!match) return;
	const segment = match[0];
	const ringColor = segment.replace(/^0px 0px 0px\s+[^\s,]+/, "").trim();
	return ringColor || undefined;
}
/**
* Returns props to create a `PopoverArrow` component.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* const store = usePopoverStore();
* const props = usePopoverArrow({ store });
* <Popover store={store}>
*   <Role {...props} />
*   Popover
* </Popover>
* ```
*/
const usePopoverArrow = createHook(function usePopoverArrow$1({ store, size = defaultSize, borderWidth: borderWidthProp,...props }) {
	const context = usePopoverContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "PopoverArrow must be wrapped in a Popover component.");
	const dir = useStoreState(store, (state) => state.currentPlacement.split("-")[0]);
	const maskId = useId();
	const style = useComputedStyle(store);
	const stroke = getBorderColor(dir, style) || "none";
	const fill = style?.getPropertyValue("background-color") || "none";
	const [borderWidth, isRing] = useMemo(() => {
		if (borderWidthProp != null) return [borderWidthProp, false];
		if (!style) return [0, false];
		const ringWidth = getRingWidth(style);
		if (ringWidth) return [Number.parseInt(ringWidth, 10), true];
		const borderWidth$1 = style.getPropertyValue(`border-${dir}-width`);
		if (borderWidth$1) return [Math.ceil(Number.parseFloat(borderWidth$1)), false];
		return [0, false];
	}, [
		borderWidthProp,
		style,
		dir
	]);
	const strokeWidth = borderWidth * 2 * (defaultSize / size);
	const transform = rotateMap[dir];
	const children = useMemo(() => /* @__PURE__ */ jsx("svg", {
		display: "block",
		viewBox: "0 0 30 30",
		children: /* @__PURE__ */ jsxs("g", {
			transform,
			children: [
				!isRing && /* @__PURE__ */ jsx("path", {
					fill: "none",
					stroke: `var(--ak-layer, ${fill})`,
					d: POPOVER_ARROW_PATH,
					mask: `url(#${maskId})`
				}),
				/* @__PURE__ */ jsx("path", {
					fill: "none",
					d: POPOVER_ARROW_PATH,
					mask: `url(#${maskId})`
				}),
				/* @__PURE__ */ jsx("path", {
					stroke: "none",
					d: POPOVER_ARROW_PATH
				}),
				/* @__PURE__ */ jsx("mask", {
					id: maskId,
					maskUnits: "userSpaceOnUse",
					children: /* @__PURE__ */ jsx("rect", {
						x: "-15",
						y: "0",
						width: "60",
						height: "30",
						fill: "white",
						stroke: "black"
					})
				})
			]
		})
	}), [
		transform,
		isRing,
		fill,
		maskId
	]);
	props = {
		children,
		"aria-hidden": true,
		...props,
		ref: useMergeRefs(store.setArrowElement, props.ref),
		style: {
			position: "absolute",
			fontSize: size,
			width: "1em",
			height: "1em",
			pointerEvents: "none",
			fill: `var(--ak-layer, ${fill})`,
			stroke: `var(--ak-layer-border, ${stroke})`,
			strokeWidth,
			...props.style
		}
	};
	return removeUndefinedValues(props);
});
/**
* Renders an arrow inside a [`Popover`](https://ariakit.org/reference/popover)
* component pointing to the anchor element.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {4}
* <PopoverProvider>
*   <PopoverAnchor />
*   <Popover>
*     <PopoverArrow />
*     Popover
*   </Popover>
* </PopoverProvider>
* ```
*/
const PopoverArrow = memo(forwardRef(function PopoverArrow$1(props) {
	const htmlProps = usePopoverArrow(props);
	return createElement(TagName, htmlProps);
}));

//#endregion
export { usePopoverArrow as n, PopoverArrow as t };