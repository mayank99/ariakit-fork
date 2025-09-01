import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { useVisuallyHidden } from "./visually-hidden-CYGj8nJz.js";

//#region packages/ariakit-react-core/src/focus-trap/focus-trap.tsx
const TagName = "span";
/**
* Returns props to create a `FocusTrap` component.
* @see https://ariakit.org/components/focus-trap
* @example
* ```jsx
* const props = useFocusTrap();
* <Role {...props} />
* ```
*/
const useFocusTrap = createHook(function useFocusTrap$1(props) {
	props = {
		"data-focus-trap": "",
		tabIndex: 0,
		"aria-hidden": true,
		...props,
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			...props.style
		}
	};
	props = useVisuallyHidden(props);
	return props;
});
/**
* Renders a focus trap element.
* @see https://ariakit.org/components/focus-trap
* @example
* ```jsx
* <FocusTrap onFocus={focusSomethingElse} />
* ```
*/
const FocusTrap = forwardRef(function FocusTrap$1(props) {
	const htmlProps = useFocusTrap(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { FocusTrap };