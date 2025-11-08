import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";

//#region packages/ariakit-react-core/src/separator/separator.tsx
const TagName = "hr";
/**
* Returns props to create a `Separator` component.
* @see https://ariakit.org/components/separator
* @example
* ```jsx
* const props = useSeparator({ orientation: "horizontal" });
* <Role {...props} />
* ```
*/
const useSeparator = createHook(function useSeparator$1({ orientation = "horizontal",...props }) {
	props = {
		role: "separator",
		"aria-orientation": orientation,
		...props
	};
	return props;
});
/**
* Renders a separator element.
* @see https://ariakit.org/components/separator
* @example
* ```jsx
* <Separator orientation="horizontal" />
* ```
*/
const Separator = forwardRef(function Separator$1(props) {
	const htmlProps = useSeparator(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useSeparator as n, Separator as t };