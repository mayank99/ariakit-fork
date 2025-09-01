import { addGlobalEventListener, disabledFromProps, isButton, isFocusEventOutside, isPortalEvent, isSafari, isSelfTarget, queueBeforeEvent, removeUndefinedValues, useEvent, useMergeRefs, useTagName } from "./hooks-BNp9qiVx.js";
import { focusIfNeeded, getClosestFocusable, hasFocus, isFocusable } from "./focus-fCQxuv3j.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

//#region packages/ariakit-react-core/src/focusable/focusable-context.tsx
const FocusableContext = createContext(true);

//#endregion
//#region packages/ariakit-react-core/src/focusable/focusable.tsx
const TagName = "div";
const isSafariBrowser = isSafari();
const alwaysFocusVisibleInputTypes = [
	"text",
	"search",
	"url",
	"tel",
	"email",
	"password",
	"number",
	"date",
	"month",
	"week",
	"time",
	"datetime",
	"datetime-local"
];
const safariFocusAncestorSymbol = Symbol("safariFocusAncestor");
function isSafariFocusAncestor(element) {
	if (!element) return false;
	return !!element[safariFocusAncestorSymbol];
}
function markSafariFocusAncestor(element, value) {
	if (!element) return;
	element[safariFocusAncestorSymbol] = value;
}
function isAlwaysFocusVisible(element) {
	const { tagName, readOnly, type } = element;
	if (tagName === "TEXTAREA" && !readOnly) return true;
	if (tagName === "SELECT" && !readOnly) return true;
	if (tagName === "INPUT" && !readOnly) {
		return alwaysFocusVisibleInputTypes.includes(type);
	}
	if (element.isContentEditable) return true;
	const role = element.getAttribute("role");
	if (role === "combobox" && element.dataset.name) {
		return true;
	}
	return false;
}
function getLabels(element) {
	if ("labels" in element) {
		return element.labels;
	}
	return null;
}
function isNativeCheckboxOrRadio(element) {
	const tagName = element.tagName.toLowerCase();
	if (tagName === "input" && element.type) {
		return element.type === "radio" || element.type === "checkbox";
	}
	return false;
}
function isNativeTabbable(tagName) {
	if (!tagName) return true;
	return tagName === "button" || tagName === "summary" || tagName === "input" || tagName === "select" || tagName === "textarea" || tagName === "a";
}
function supportsDisabledAttribute(tagName) {
	if (!tagName) return true;
	return tagName === "button" || tagName === "input" || tagName === "select" || tagName === "textarea";
}
function getTabIndex(focusable, trulyDisabled, nativeTabbable, supportsDisabled, tabIndexProp) {
	if (!focusable) {
		return tabIndexProp;
	}
	if (trulyDisabled) {
		if (nativeTabbable && !supportsDisabled) {
			return -1;
		}
		return;
	}
	if (nativeTabbable) {
		return tabIndexProp;
	}
	return tabIndexProp || 0;
}
function useDisableEvent(onEvent, disabled) {
	return useEvent((event) => {
		onEvent?.(event);
		if (event.defaultPrevented) return;
		if (disabled) {
			event.stopPropagation();
			event.preventDefault();
		}
	});
}
let hasInstalledGlobalEventListeners = false;
let isKeyboardModality = true;
function onGlobalMouseDown(event) {
	const target = event.target;
	if (target && "hasAttribute" in target) {
		if (!target.hasAttribute("data-focus-visible")) {
			isKeyboardModality = false;
		}
	}
}
function onGlobalKeyDown(event) {
	if (event.metaKey) return;
	if (event.ctrlKey) return;
	if (event.altKey) return;
	isKeyboardModality = true;
}
/**
* Returns props to create a `Focusable` component.
* @see https://ariakit.org/components/focusable
* @example
* ```jsx
* const props = useFocusable();
* <Role {...props}>Focusable</Role>
* ```
*/
const useFocusable = createHook(function useFocusable$1({ focusable = true, accessibleWhenDisabled, autoFocus, onFocusVisible,...props }) {
	const ref = useRef(null);
	useEffect(() => {
		if (!focusable) return;
		if (hasInstalledGlobalEventListeners) return;
		addGlobalEventListener("mousedown", onGlobalMouseDown, true);
		addGlobalEventListener("keydown", onGlobalKeyDown, true);
		hasInstalledGlobalEventListeners = true;
	}, [focusable]);
	if (isSafariBrowser) {
		useEffect(() => {
			if (!focusable) return;
			const element = ref.current;
			if (!element) return;
			if (!isNativeCheckboxOrRadio(element)) return;
			const labels = getLabels(element);
			if (!labels) return;
			const onMouseUp = () => queueMicrotask(() => element.focus());
			for (const label of labels) {
				label.addEventListener("mouseup", onMouseUp);
			}
			return () => {
				for (const label of labels) {
					label.removeEventListener("mouseup", onMouseUp);
				}
			};
		}, [focusable]);
	}
	const disabled = focusable && disabledFromProps(props);
	const trulyDisabled = !!disabled && !accessibleWhenDisabled;
	const [focusVisible, setFocusVisible] = useState(false);
	useEffect(() => {
		if (!focusable) return;
		if (trulyDisabled && focusVisible) {
			setFocusVisible(false);
		}
	}, [
		focusable,
		trulyDisabled,
		focusVisible
	]);
	useEffect(() => {
		if (!focusable) return;
		if (!focusVisible) return;
		const element = ref.current;
		if (!element) return;
		if (typeof IntersectionObserver === "undefined") return;
		const observer = new IntersectionObserver(() => {
			if (!isFocusable(element)) {
				setFocusVisible(false);
			}
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, [focusable, focusVisible]);
	const onKeyPressCapture = useDisableEvent(props.onKeyPressCapture, disabled);
	const onMouseDownCapture = useDisableEvent(props.onMouseDownCapture, disabled);
	const onClickCapture = useDisableEvent(props.onClickCapture, disabled);
	const onMouseDownProp = props.onMouseDown;
	const onMouseDown = useEvent((event) => {
		onMouseDownProp?.(event);
		if (event.defaultPrevented) return;
		if (!focusable) return;
		const element = event.currentTarget;
		if (!isSafariBrowser) return;
		if (isPortalEvent(event)) return;
		if (!isButton(element) && !isNativeCheckboxOrRadio(element)) return;
		let receivedFocus = false;
		const onFocus = () => {
			receivedFocus = true;
		};
		const options = {
			capture: true,
			once: true
		};
		element.addEventListener("focusin", onFocus, options);
		const focusableContainer = getClosestFocusable(element.parentElement);
		markSafariFocusAncestor(focusableContainer, true);
		queueBeforeEvent(element, "mouseup", () => {
			element.removeEventListener("focusin", onFocus, true);
			markSafariFocusAncestor(focusableContainer, false);
			if (receivedFocus) return;
			focusIfNeeded(element);
		});
	});
	const handleFocusVisible = (event, currentTarget) => {
		if (currentTarget) {
			Object.defineProperty(event, "currentTarget", {
				writable: false,
				value: currentTarget
			});
		}
		if (!focusable) return;
		const element = event.currentTarget;
		if (!element) return;
		if (!hasFocus(element)) return;
		onFocusVisible?.(event);
		if (event.defaultPrevented) return;
		element.dataset.focusVisible = "true";
		setFocusVisible(true);
	};
	const onKeyDownCaptureProp = props.onKeyDownCapture;
	const onKeyDownCapture = useEvent((event) => {
		onKeyDownCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!focusable) return;
		if (focusVisible) return;
		if (event.metaKey) return;
		if (event.altKey) return;
		if (event.ctrlKey) return;
		if (!isSelfTarget(event)) return;
		const element = event.currentTarget;
		const applyFocusVisible = () => handleFocusVisible(event, element);
		queueBeforeEvent(element, "focusout", applyFocusVisible);
	});
	const onFocusCaptureProp = props.onFocusCapture;
	const onFocusCapture = useEvent((event) => {
		onFocusCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!focusable) return;
		if (!isSelfTarget(event)) {
			setFocusVisible(false);
			return;
		}
		const element = event.currentTarget;
		const applyFocusVisible = () => handleFocusVisible(event, element);
		if (isKeyboardModality || isAlwaysFocusVisible(event.target)) {
			queueBeforeEvent(event.target, "focusout", applyFocusVisible);
		} else {
			setFocusVisible(false);
		}
	});
	const onBlurProp = props.onBlur;
	const onBlur = useEvent((event) => {
		onBlurProp?.(event);
		if (!focusable) return;
		if (!isFocusEventOutside(event)) return;
		event.currentTarget.removeAttribute("data-focus-visible");
		setFocusVisible(false);
	});
	const autoFocusOnShow = useContext(FocusableContext);
	const autoFocusRef = useEvent((element) => {
		if (!focusable) return;
		if (!autoFocus) return;
		if (!element) return;
		if (!autoFocusOnShow) return;
		queueMicrotask(() => {
			if (hasFocus(element)) return;
			if (!isFocusable(element)) return;
			element.focus();
		});
	});
	const tagName = useTagName(ref);
	const nativeTabbable = focusable && isNativeTabbable(tagName);
	const supportsDisabled = focusable && supportsDisabledAttribute(tagName);
	const styleProp = props.style;
	const style = useMemo(() => {
		if (trulyDisabled) {
			return {
				pointerEvents: "none",
				...styleProp
			};
		}
		return styleProp;
	}, [trulyDisabled, styleProp]);
	props = {
		"data-focus-visible": focusable && focusVisible || undefined,
		"data-autofocus": autoFocus || undefined,
		"aria-disabled": disabled || undefined,
		...props,
		ref: useMergeRefs(ref, autoFocusRef, props.ref),
		style,
		tabIndex: getTabIndex(focusable, trulyDisabled, nativeTabbable, supportsDisabled, props.tabIndex),
		disabled: supportsDisabled && trulyDisabled ? true : undefined,
		contentEditable: disabled ? undefined : props.contentEditable,
		onKeyPressCapture,
		onClickCapture,
		onMouseDownCapture,
		onMouseDown,
		onKeyDownCapture,
		onFocusCapture,
		onBlur
	};
	return removeUndefinedValues(props);
});
/**
* Renders a focusable element. When this element gains keyboard focus, it gets
* a
* [`data-focus-visible`](https://ariakit.org/guide/styling#data-focus-visible)
* attribute and triggers the
* [`onFocusVisible`](https://ariakit.org/reference/focusable#onfocusvisible)
* prop.
*
* The `Focusable` component supports the
* [`disabled`](https://ariakit.org/reference/focusable#disabled) prop for all
* elements, even those not supporting the native `disabled` attribute. Disabled
* elements using the `Focusable` component may be still accessible via keyboard
* by using the the
* [`accessibleWhenDisabled`](https://ariakit.org/reference/focusable#accessiblewhendisabled)
* prop.
* @see https://ariakit.org/components/focusable
* @example
* ```jsx
* <Focusable>Focusable</Focusable>
* ```
*/
const Focusable = forwardRef(function Focusable$1(props) {
	const htmlProps = useFocusable(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { Focusable, FocusableContext, isSafariFocusAncestor, useFocusable };