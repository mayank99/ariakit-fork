import { l as useMergeRefs, p as useTagName, ut as isButton } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { n as useCommand } from "./command-NyK7yayU.js";
import { useEffect, useRef, useState } from "react";

//#region packages/ariakit-react-core/src/button/button.tsx
const TagName = "button";
/**
* Returns props to create a `Button` component. If the element is not a native
* button, the hook will return additional props to make sure it's accessible.
* @see https://ariakit.org/components/button
* @example
* ```jsx
* const props = useButton({ render: <div /> });
* <Role {...props}>Accessible button</Role>
* ```
*/
const useButton = createHook(function useButton$1(props) {
	const ref = useRef(null);
	const tagName = useTagName(ref, TagName);
	const [isNativeButton, setIsNativeButton] = useState(() => !!tagName && isButton({
		tagName,
		type: props.type
	}));
	useEffect(() => {
		if (!ref.current) return;
		setIsNativeButton(isButton(ref.current));
	}, []);
	props = {
		role: !isNativeButton && tagName !== "a" ? "button" : undefined,
		...props,
		ref: useMergeRefs(ref, props.ref)
	};
	props = useCommand(props);
	return props;
});
/**
* Renders an accessible button element. If the underlying element is not a
* native button, this component will pass additional attributes to make sure
* it's accessible.
* @see https://ariakit.org/components/button
* @example
* ```jsx
* <Button>Button</Button>
* ```
*/
const Button = forwardRef(function Button$1(props) {
	const htmlProps = useButton(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useButton as n, Button as t };