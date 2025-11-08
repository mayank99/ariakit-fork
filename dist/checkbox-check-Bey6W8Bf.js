import { L as removeUndefinedValues } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { t as CheckboxCheckedContext } from "./checkbox-checked-context-xJyrWxCU.js";
import { useContext } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/checkbox/checkbox-check.tsx
const TagName = "span";
const checkmark = /* @__PURE__ */ jsx("svg", {
	display: "block",
	fill: "none",
	stroke: "currentColor",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	strokeWidth: 1.5,
	viewBox: "0 0 16 16",
	height: "1em",
	width: "1em",
	children: /* @__PURE__ */ jsx("polyline", { points: "4,8 7,12 12,4" })
});
function getChildren(props) {
	if (props.checked) {
		return props.children || checkmark;
	}
	if (typeof props.children === "function") {
		return props.children;
	}
	return null;
}
/**
* Returns props to create a `CheckboxCheck` component, that's usually rendered
* inside a `Checkbox` component.
* @see https://ariakit.org/components/checkbox
* @example
* ```jsx
* const props = useCheckboxCheck({ checked: true });
* <Role {...props} />
* ```
*/
const useCheckboxCheck = createHook(function useCheckboxCheck$1({ store, checked,...props }) {
	const context = useContext(CheckboxCheckedContext);
	checked = checked ?? context;
	const children = getChildren({
		checked,
		children: props.children
	});
	props = {
		"aria-hidden": true,
		...props,
		children,
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
* Renders a checkmark icon when the
* [`checked`](https://ariakit.org/reference/checkbox-check#checked) prop is
* `true`. The icon can be overridden by providing a different one as children.
*
* When rendered inside a [`Checkbox`](https://ariakit.org/reference/checkbox)
* component, the
* [`checked`](https://ariakit.org/reference/checkbox-check#checked) prop is
* automatically derived from the context.
* @see https://ariakit.org/components/checkbox
* @example
* ```jsx
* <CheckboxCheck checked />
* ```
*/
const CheckboxCheck = forwardRef(function CheckboxCheck$1(props) {
	const htmlProps = useCheckboxCheck(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useCheckboxCheck as n, CheckboxCheck as t };