import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";

//#region packages/ariakit-react-core/src/visually-hidden/visually-hidden.tsx
const TagName = "span";
/**
* Returns props to create a `VisuallyHidden` component. When applying the props
* returned by this hook to a component, the component will be visually hidden,
* but still accessible to screen readers.
* @see https://ariakit.org/components/visually-hidden
* @example
* ```jsx
* const props = useVisuallyHidden();
* <a href="#">
*   Learn more<Role {...props}> about the Solar System</Role>.
* </a>
* ```
*/
const useVisuallyHidden = createHook(function useVisuallyHidden$1(props) {
	props = {
		...props,
		style: {
			border: 0,
			clip: "rect(0 0 0 0)",
			height: "1px",
			margin: "-1px",
			overflow: "hidden",
			padding: 0,
			position: "absolute",
			whiteSpace: "nowrap",
			width: "1px",
			...props.style
		}
	};
	return props;
});
/**
* Renders an element that's visually hidden, but still accessible to screen
* readers.
* @see https://ariakit.org/components/visually-hidden
* @example
* ```jsx
* <a href="#">
*   Learn more<VisuallyHidden> about the Solar System</VisuallyHidden>.
* </a>
* ```
*/
const VisuallyHidden = forwardRef(function VisuallyHidden$1(props) {
	const htmlProps = useVisuallyHidden(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { VisuallyHidden, useVisuallyHidden };