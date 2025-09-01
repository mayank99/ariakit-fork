import { disabledFromProps, fireClickEvent, isButton, isFirefox, isSelfTarget, isTextField, queueBeforeEvent, useEvent, useMergeRefs, useMetadataProps } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { useFocusable } from "./focusable-COT5YOJE.js";
import { useEffect, useRef, useState } from "react";

//#region packages/ariakit-react-core/src/command/command.tsx
const TagName = "button";
function isNativeClick(event) {
	if (!event.isTrusted) return false;
	// istanbul ignore next: can't test trusted events yet
	const element = event.currentTarget;
	if (event.key === "Enter") {
		return isButton(element) || element.tagName === "SUMMARY" || element.tagName === "A";
	}
	if (event.key === " ") {
		return isButton(element) || element.tagName === "SUMMARY" || element.tagName === "INPUT" || element.tagName === "SELECT";
	}
	return false;
}
const symbol = Symbol("command");
/**
* Returns props to create a `Command` component. If the element is not a native
* clickable element (like a button), this hook will return additional props to
* make sure it's accessible.
* @see https://ariakit.org/components/command
* @example
* ```jsx
* const props = useCommand({ render: <div /> });
* <Role {...props}>Accessible button</Role>
* ```
*/
const useCommand = createHook(function useCommand$1({ clickOnEnter = true, clickOnSpace = true,...props }) {
	const ref = useRef(null);
	const [isNativeButton, setIsNativeButton] = useState(false);
	useEffect(() => {
		if (!ref.current) return;
		setIsNativeButton(isButton(ref.current));
	}, []);
	const [active, setActive] = useState(false);
	const activeRef = useRef(false);
	const disabled = disabledFromProps(props);
	const [isDuplicate, metadataProps] = useMetadataProps(props, symbol, true);
	const onKeyDownProp = props.onKeyDown;
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		const element = event.currentTarget;
		if (event.defaultPrevented) return;
		if (isDuplicate) return;
		if (disabled) return;
		if (!isSelfTarget(event)) return;
		if (isTextField(element)) return;
		if (element.isContentEditable) return;
		const isEnter = clickOnEnter && event.key === "Enter";
		const isSpace = clickOnSpace && event.key === " ";
		const shouldPreventEnter = event.key === "Enter" && !clickOnEnter;
		const shouldPreventSpace = event.key === " " && !clickOnSpace;
		if (shouldPreventEnter || shouldPreventSpace) {
			event.preventDefault();
			return;
		}
		if (isEnter || isSpace) {
			const nativeClick = isNativeClick(event);
			if (isEnter) {
				if (!nativeClick) {
					event.preventDefault();
					const click = () => fireClickEvent(element, event);
					if (isFirefox()) {
						queueBeforeEvent(element, "keyup", click);
					} else {
						queueMicrotask(click);
					}
				}
			} else if (isSpace) {
				activeRef.current = true;
				if (!nativeClick) {
					event.preventDefault();
					setActive(true);
				}
			}
		}
	});
	const onKeyUpProp = props.onKeyUp;
	const onKeyUp = useEvent((event) => {
		onKeyUpProp?.(event);
		if (event.defaultPrevented) return;
		if (isDuplicate) return;
		if (disabled) return;
		if (event.metaKey) return;
		const isSpace = clickOnSpace && event.key === " ";
		if (activeRef.current && isSpace) {
			activeRef.current = false;
			if (!isNativeClick(event)) {
				event.preventDefault();
				setActive(false);
				const element = event.currentTarget;
				queueMicrotask(() => fireClickEvent(element, event));
			}
		}
	});
	props = {
		"data-active": active || undefined,
		type: isNativeButton ? "button" : undefined,
		...metadataProps,
		...props,
		ref: useMergeRefs(ref, props.ref),
		onKeyDown,
		onKeyUp
	};
	props = useFocusable(props);
	return props;
});
/**
* Renders a clickable element, which is a `button` by default, and inherits
* features from the [`Focusable`](https://ariakit.org/reference/focusable)
* component.
*
* If the base element isn't a native clickable one, this component will provide
* extra attributes and event handlers to ensure accessibility. It can be
* activated with the keyboard using the
* [`clickOnEnter`](https://ariakit.org/reference/command#clickonenter) and
* [`clickOnSpace`](https://ariakit.org/reference/command#clickonspace)
* props. Both are set to `true` by default.
* @see https://ariakit.org/components/command
* @example
* ```jsx
* <Command>Button</Command>
* ```
*/
const Command = forwardRef(function Command$1(props) {
	const htmlProps = useCommand(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { Command, useCommand };