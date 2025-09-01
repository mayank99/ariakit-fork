import { getDocument, invariant, isSelfTarget, isTextField, normalizeString, removeUndefinedValues, sortBasedOnDOMPosition, useEvent } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { flipItems, useCompositeContext } from "./utils-DgFD4-mq.js";
import { useRef } from "react";

//#region packages/ariakit-react-core/src/composite/composite-typeahead.tsx
const TagName = "div";
let chars = "";
function clearChars() {
	chars = "";
}
function isValidTypeaheadEvent(event) {
	const target = event.target;
	if (target && isTextField(target)) return false;
	if (event.key === " " && chars.length) return true;
	return event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey && /^[\p{Letter}\p{Number}]$/u.test(event.key);
}
function isSelfTargetOrItem(event, items) {
	if (isSelfTarget(event)) return true;
	const target = event.target;
	if (!target) return false;
	const isItem = items.some((item) => item.element === target);
	return isItem;
}
function getEnabledItems(items) {
	return items.filter((item) => !item.disabled);
}
function itemTextStartsWith(item, text) {
	const itemText = item.element?.textContent || item.children || "value" in item && item.value;
	if (!itemText) return false;
	return normalizeString(itemText).trim().toLowerCase().startsWith(text.toLowerCase());
}
function getSameInitialItems(items, char, activeId) {
	if (!activeId) return items;
	const activeItem = items.find((item) => item.id === activeId);
	if (!activeItem) return items;
	if (!itemTextStartsWith(activeItem, char)) return items;
	if (chars !== char && itemTextStartsWith(activeItem, chars)) return items;
	chars = char;
	return flipItems(items.filter((item) => itemTextStartsWith(item, chars)), activeId).filter((item) => item.id !== activeId);
}
/**
* Returns props to create a `CompositeTypeahead` component.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useCompositeTypeahead({ store });
* <Composite store={store} {...props}>
*   <CompositeItem>Item 1</CompositeItem>
*   <CompositeItem>Item 2</CompositeItem>
* </Composite>
* ```
*/
const useCompositeTypeahead = createHook(function useCompositeTypeahead$1({ store, typeahead = true,...props }) {
	const context = useCompositeContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "CompositeTypeahead must be a Composite component");
	const onKeyDownCaptureProp = props.onKeyDownCapture;
	const cleanupTimeoutRef = useRef(0);
	const onKeyDownCapture = useEvent((event) => {
		onKeyDownCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!typeahead) return;
		if (!store) return;
		if (!isValidTypeaheadEvent(event)) {
			return clearChars();
		}
		const { renderedItems, items, activeId, id } = store.getState();
		let enabledItems = getEnabledItems(items.length > renderedItems.length ? items : renderedItems);
		const document = getDocument(event.currentTarget);
		const selector = `[data-offscreen-id="${id}"]`;
		const offscreenItems = document.querySelectorAll(selector);
		for (const element of offscreenItems) {
			const disabled = element.ariaDisabled === "true" || "disabled" in element && !!element.disabled;
			enabledItems.push({
				id: element.id,
				element,
				disabled
			});
		}
		if (offscreenItems.length) {
			enabledItems = sortBasedOnDOMPosition(enabledItems, (i) => i.element);
		}
		if (!isSelfTargetOrItem(event, enabledItems)) return clearChars();
		event.preventDefault();
		window.clearTimeout(cleanupTimeoutRef.current);
		cleanupTimeoutRef.current = window.setTimeout(() => {
			chars = "";
		}, 500);
		const char = event.key.toLowerCase();
		chars += char;
		enabledItems = getSameInitialItems(enabledItems, char, activeId);
		const item = enabledItems.find((item$1) => itemTextStartsWith(item$1, chars));
		if (item) {
			store.move(item.id);
		} else {
			clearChars();
		}
	});
	props = {
		...props,
		onKeyDownCapture
	};
	return removeUndefinedValues(props);
});
/**
* Renders a component that adds typeahead functionality to composite
* components.
*
* When the
* [`typeahead`](https://ariakit.org/reference/composite-typeahead#typeahead)
* prop is enabled, which it is by default, hitting printable character keys
* will move focus to the next composite item that begins with the input
* characters.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* <CompositeProvider>
*   <Composite render={<CompositeTypeahead />}>
*     <CompositeItem>Item 1</CompositeItem>
*     <CompositeItem>Item 2</CompositeItem>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeTypeahead = forwardRef(function CompositeTypeahead$1(props) {
	const htmlProps = useCompositeTypeahead(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { CompositeTypeahead, useCompositeTypeahead };