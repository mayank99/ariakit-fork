import { $ as isSafari, A as isFalsyBooleanCallback, G as isFocusEventOutside, K as isOpeningInNewTab, L as removeUndefinedValues, N as noop, P as normalizeString, S as chain, W as isDownloading, Y as queueBeforeEvent, _ as useWrapElement, a as useId, at as getPopupRole, et as isTouchDevice, f as useSafeLayoutEffect, ft as isTextField, g as useUpdateLayoutEffect, h as useUpdateEffect, ht as setSelectionRange, i as useForceUpdate, k as invariant, l as useMergeRefs, n as useBooleanEvent, ot as getScrollingElement, r as useEvent, rt as getDocument, st as getTextboxSelection, t as useAttribute, w as defaultValue } from "./hooks-H6OmsigH.js";
import { l as hasFocus } from "./focus-BzfNYadt.js";
import { a as memo, i as forwardRef, n as createHook, r as createStoreContext, t as createElement } from "./system-CMX9uFDP.js";
import { n as useButton } from "./button-CTf7d7DU.js";
import { a as batch, c as mergeStore, d as setup, i as useStoreStateObject, m as throwOnConflictingProps, n as useStoreProps, o as createStore, p as sync, r as useStoreState, t as useStore, u as pick } from "./store-DLqhzR2r.js";
import { n as useCheckboxCheck } from "./checkbox-check-Bey6W8Bf.js";
import { i as createCompositeStore, n as useCompositeStoreOptions, o as useComposite, r as useCompositeStoreProps, s as toArray } from "./composite-store-BRNkRGdm.js";
import { f as CompositeScopedContextProvider, l as CompositeContextProvider } from "./utils-CJtcgbaU.js";
import { a as isHidden } from "./disclosure-store-DZ4wqMBt.js";
import { n as usePopoverAnchor } from "./popover-anchor-Dz151KaW.js";
import { a as ComboboxScopedContextProvider, c as useComboboxScopedContext, i as ComboboxListRoleContext, n as ComboboxItemCheckedContext, o as useComboboxContext, r as ComboboxItemValueContext, s as useComboboxProviderContext, t as ComboboxContextProvider } from "./combobox-context-DxAre050.js";
import { n as useDialogDisclosure } from "./dialog-disclosure-Cu78IAh8.js";
import { i as useCompositeGroupLabel, n as useCompositeHover, o as useCompositeGroup } from "./composite-hover-D-lAhR5x.js";
import { n as useCompositeItem } from "./composite-item-CjOOUl7v.js";
import { n as createDialogComponent } from "./dialog-BY8Na6S7.js";
import { a as usePopover, n as usePopoverStoreProps, r as createPopoverStore } from "./popover-store-DWE0Zrud.js";
import { n as useCompositeRow } from "./composite-row-BcyhLjzN.js";
import { n as useCompositeSeparator } from "./composite-separator-CrAYinen.js";
import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/combobox/combobox.tsx
const TagName$12 = "input";
function isFirstItemAutoSelected(items, activeValue, autoSelect) {
	if (!autoSelect) return false;
	const firstItem = items.find((item) => !item.disabled && item.value);
	return firstItem?.value === activeValue;
}
function hasCompletionString(value, activeValue) {
	if (!activeValue) return false;
	if (value == null) return false;
	value = normalizeString(value);
	return activeValue.length > value.length && activeValue.toLowerCase().indexOf(value.toLowerCase()) === 0;
}
function isInputEvent(event) {
	return event.type === "input";
}
function isAriaAutoCompleteValue(value) {
	return value === "inline" || value === "list" || value === "both" || value === "none";
}
function getDefaultAutoSelectId(items) {
	const item = items.find((item$1) => {
		if (item$1.disabled) return false;
		return item$1.element?.getAttribute("role") !== "tab";
	});
	return item?.id;
}
/**
* Returns props to create a `Combobox` component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useCombobox({ store });
* <Role {...props} />
* <ComboboxPopover store={store}>
*   <ComboboxItem value="Apple" />
*   <ComboboxItem value="Banana" />
*   <ComboboxItem value="Orange" />
* </ComboboxPopover>
* ```
*/
const useCombobox = createHook(function useCombobox$1({ store, focusable = true, autoSelect: autoSelectProp = false, getAutoSelectId, setValueOnChange, showMinLength = 0, showOnChange, showOnMouseDown, showOnClick = showOnMouseDown, showOnKeyDown, showOnKeyPress = showOnKeyDown, blurActiveItemOnClick, setValueOnClick = true, moveOnKeyPress = true, autoComplete = "list",...props }) {
	const context = useComboboxProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Combobox must receive a `store` prop or be wrapped in a ComboboxProvider component.");
	const ref = useRef(null);
	const [valueUpdated, forceValueUpdate] = useForceUpdate();
	const canAutoSelectRef = useRef(false);
	const composingRef = useRef(false);
	const autoSelect = store.useState((state) => state.virtualFocus && autoSelectProp);
	const inline = autoComplete === "inline" || autoComplete === "both";
	const [canInline, setCanInline] = useState(inline);
	useUpdateLayoutEffect(() => {
		if (!inline) return;
		setCanInline(true);
	}, [inline]);
	const storeValue = store.useState("value");
	const prevSelectedValueRef = useRef();
	useEffect(() => {
		return sync(store, ["selectedValue", "activeId"], (_, prev) => {
			prevSelectedValueRef.current = prev.selectedValue;
		});
	}, []);
	const inlineActiveValue = store.useState((state) => {
		if (!inline) return;
		if (!canInline) return;
		if (state.activeValue && Array.isArray(state.selectedValue)) {
			if (state.selectedValue.includes(state.activeValue)) return;
			if (prevSelectedValueRef.current?.includes(state.activeValue)) return;
		}
		return state.activeValue;
	});
	const items = store.useState("renderedItems");
	const open = store.useState("open");
	const contentElement = store.useState("contentElement");
	const value = useMemo(() => {
		if (!inline) return storeValue;
		if (!canInline) return storeValue;
		const firstItemAutoSelected = isFirstItemAutoSelected(items, inlineActiveValue, autoSelect);
		if (firstItemAutoSelected) {
			if (hasCompletionString(storeValue, inlineActiveValue)) {
				const slice = inlineActiveValue?.slice(storeValue.length) || "";
				return storeValue + slice;
			}
			return storeValue;
		}
		return inlineActiveValue || storeValue;
	}, [
		inline,
		canInline,
		items,
		inlineActiveValue,
		autoSelect,
		storeValue
	]);
	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		const onCompositeItemMove = () => setCanInline(true);
		element.addEventListener("combobox-item-move", onCompositeItemMove);
		return () => {
			element.removeEventListener("combobox-item-move", onCompositeItemMove);
		};
	}, []);
	useEffect(() => {
		if (!inline) return;
		if (!canInline) return;
		if (!inlineActiveValue) return;
		const firstItemAutoSelected = isFirstItemAutoSelected(items, inlineActiveValue, autoSelect);
		if (!firstItemAutoSelected) return;
		if (!hasCompletionString(storeValue, inlineActiveValue)) return;
		let cleanup = noop;
		queueMicrotask(() => {
			const element = ref.current;
			if (!element) return;
			const { start: prevStart, end: prevEnd } = getTextboxSelection(element);
			const nextStart = storeValue.length;
			const nextEnd = inlineActiveValue.length;
			setSelectionRange(element, nextStart, nextEnd);
			cleanup = () => {
				if (!hasFocus(element)) return;
				const { start, end } = getTextboxSelection(element);
				if (start !== nextStart) return;
				if (end !== nextEnd) return;
				setSelectionRange(element, prevStart, prevEnd);
			};
		});
		return () => cleanup();
	}, [
		valueUpdated,
		inline,
		canInline,
		inlineActiveValue,
		items,
		autoSelect,
		storeValue
	]);
	const scrollingElementRef = useRef(null);
	const getAutoSelectIdProp = useEvent(getAutoSelectId);
	const autoSelectIdRef = useRef(null);
	useEffect(() => {
		if (!open) return;
		if (!contentElement) return;
		const scrollingElement = getScrollingElement(contentElement);
		if (!scrollingElement) return;
		scrollingElementRef.current = scrollingElement;
		const onUserScroll = () => {
			canAutoSelectRef.current = false;
		};
		const onScroll = () => {
			if (!store) return;
			if (!canAutoSelectRef.current) return;
			const { activeId } = store.getState();
			if (activeId === null) return;
			if (activeId === autoSelectIdRef.current) return;
			canAutoSelectRef.current = false;
		};
		const options = {
			passive: true,
			capture: true
		};
		scrollingElement.addEventListener("wheel", onUserScroll, options);
		scrollingElement.addEventListener("touchmove", onUserScroll, options);
		scrollingElement.addEventListener("scroll", onScroll, options);
		return () => {
			scrollingElement.removeEventListener("wheel", onUserScroll, true);
			scrollingElement.removeEventListener("touchmove", onUserScroll, true);
			scrollingElement.removeEventListener("scroll", onScroll, true);
		};
	}, [
		open,
		contentElement,
		store
	]);
	useSafeLayoutEffect(() => {
		if (!storeValue) return;
		if (composingRef.current) return;
		canAutoSelectRef.current = true;
	}, [storeValue]);
	useSafeLayoutEffect(() => {
		if (autoSelect !== "always" && open) return;
		canAutoSelectRef.current = open;
	}, [autoSelect, open]);
	const resetValueOnSelect = store.useState("resetValueOnSelect");
	useUpdateEffect(() => {
		const canAutoSelect = canAutoSelectRef.current;
		if (!store) return;
		if (!open) return;
		if (!canAutoSelect && !resetValueOnSelect) return;
		const { baseElement, contentElement: contentElement$1, activeId } = store.getState();
		if (baseElement && !hasFocus(baseElement)) return;
		if (contentElement$1?.hasAttribute("data-placing")) {
			const observer = new MutationObserver(forceValueUpdate);
			observer.observe(contentElement$1, { attributeFilter: ["data-placing"] });
			return () => observer.disconnect();
		}
		if (autoSelect && canAutoSelect) {
			const userAutoSelectId = getAutoSelectIdProp(items);
			const autoSelectId = userAutoSelectId !== undefined ? userAutoSelectId : getDefaultAutoSelectId(items) ?? store.first();
			autoSelectIdRef.current = autoSelectId;
			store.move(autoSelectId ?? null);
		} else {
			const element = store.item(activeId || store.first())?.element;
			if (element && "scrollIntoView" in element) {
				element.scrollIntoView({
					block: "nearest",
					inline: "nearest"
				});
			}
		}
		return;
	}, [
		store,
		open,
		valueUpdated,
		storeValue,
		autoSelect,
		resetValueOnSelect,
		getAutoSelectIdProp,
		items
	]);
	useEffect(() => {
		if (!inline) return;
		const combobox = ref.current;
		if (!combobox) return;
		const elements = [combobox, contentElement].filter((value$1) => !!value$1);
		const onBlur$1 = (event) => {
			if (elements.every((el) => isFocusEventOutside(event, el))) {
				store?.setValue(value);
			}
		};
		for (const element of elements) {
			element.addEventListener("focusout", onBlur$1);
		}
		return () => {
			for (const element of elements) {
				element.removeEventListener("focusout", onBlur$1);
			}
		};
	}, [
		inline,
		contentElement,
		store,
		value
	]);
	const canShow = (event) => {
		const currentTarget = event.currentTarget;
		return currentTarget.value.length >= showMinLength;
	};
	const onChangeProp = props.onChange;
	const showOnChangeProp = useBooleanEvent(showOnChange ?? canShow);
	const setValueOnChangeProp = useBooleanEvent(setValueOnChange ?? !store.tag);
	const onChange = useEvent((event) => {
		onChangeProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const currentTarget = event.currentTarget;
		const { value: value$1, selectionStart, selectionEnd } = currentTarget;
		const nativeEvent = event.nativeEvent;
		canAutoSelectRef.current = true;
		if (isInputEvent(nativeEvent)) {
			if (nativeEvent.isComposing) {
				canAutoSelectRef.current = false;
				composingRef.current = true;
			}
			if (inline) {
				const textInserted = nativeEvent.inputType === "insertText" || nativeEvent.inputType === "insertCompositionText";
				const caretAtEnd = selectionStart === value$1.length;
				setCanInline(textInserted && caretAtEnd);
			}
		}
		if (setValueOnChangeProp(event)) {
			const isSameValue = value$1 === store.getState().value;
			store.setValue(value$1);
			queueMicrotask(() => {
				setSelectionRange(currentTarget, selectionStart, selectionEnd);
			});
			if (inline && autoSelect && isSameValue) {
				forceValueUpdate();
			}
		}
		if (showOnChangeProp(event)) {
			store.show();
		}
		if (!autoSelect || !canAutoSelectRef.current) {
			store.setActiveId(null);
		}
	});
	const onCompositionEndProp = props.onCompositionEnd;
	const onCompositionEnd = useEvent((event) => {
		canAutoSelectRef.current = true;
		composingRef.current = false;
		onCompositionEndProp?.(event);
		if (event.defaultPrevented) return;
		if (!autoSelect) return;
		forceValueUpdate();
	});
	const onMouseDownProp = props.onMouseDown;
	const blurActiveItemOnClickProp = useBooleanEvent(blurActiveItemOnClick ?? (() => !!store?.getState().includesBaseElement));
	const setValueOnClickProp = useBooleanEvent(setValueOnClick);
	const showOnClickProp = useBooleanEvent(showOnClick ?? canShow);
	const onMouseDown = useEvent((event) => {
		onMouseDownProp?.(event);
		if (event.defaultPrevented) return;
		if (event.button) return;
		if (event.ctrlKey) return;
		if (!store) return;
		if (blurActiveItemOnClickProp(event)) {
			store.setActiveId(null);
		}
		if (setValueOnClickProp(event)) {
			store.setValue(value);
		}
		if (showOnClickProp(event)) {
			queueBeforeEvent(event.currentTarget, "mouseup", store.show);
		}
	});
	const onKeyDownProp = props.onKeyDown;
	const showOnKeyPressProp = useBooleanEvent(showOnKeyPress ?? canShow);
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (!event.repeat) {
			canAutoSelectRef.current = false;
		}
		if (event.defaultPrevented) return;
		if (event.ctrlKey) return;
		if (event.altKey) return;
		if (event.shiftKey) return;
		if (event.metaKey) return;
		if (!store) return;
		const { open: open$1 } = store.getState();
		if (open$1) return;
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			if (showOnKeyPressProp(event)) {
				event.preventDefault();
				store.show();
			}
		}
	});
	const onBlurProp = props.onBlur;
	const onBlur = useEvent((event) => {
		canAutoSelectRef.current = false;
		onBlurProp?.(event);
		if (event.defaultPrevented) return;
	});
	const id = useId(props.id);
	const ariaAutoComplete = isAriaAutoCompleteValue(autoComplete) ? autoComplete : undefined;
	const isActiveItem = store.useState((state) => state.activeId === null);
	props = {
		id,
		role: "combobox",
		"aria-autocomplete": ariaAutoComplete,
		"aria-haspopup": getPopupRole(contentElement, "listbox"),
		"aria-expanded": open,
		"aria-controls": contentElement?.id,
		"data-active-item": isActiveItem || undefined,
		value,
		...props,
		ref: useMergeRefs(ref, props.ref),
		onChange,
		onCompositionEnd,
		onMouseDown,
		onKeyDown,
		onBlur
	};
	props = useComposite({
		store,
		focusable,
		...props,
		moveOnKeyPress: (event) => {
			if (isFalsyBooleanCallback(moveOnKeyPress, event)) return false;
			if (inline) setCanInline(true);
			return true;
		}
	});
	props = usePopoverAnchor({
		store,
		...props
	});
	return {
		autoComplete: "off",
		...props
	};
});
/**
* Renders a combobox input element that can be used to filter a list of items.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {2}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple" />
*     <ComboboxItem value="Banana" />
*     <ComboboxItem value="Orange" />
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const Combobox = forwardRef(function Combobox$1(props) {
	const htmlProps = useCombobox(props);
	return createElement(TagName$12, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-cancel.tsx
const TagName$11 = "button";
const children$1 = /* @__PURE__ */ jsxs("svg", {
	"aria-hidden": "true",
	display: "block",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	strokeWidth: 1.5,
	width: "1em",
	height: "1em",
	pointerEvents: "none",
	children: [/* @__PURE__ */ jsx("line", {
		x1: "5",
		y1: "5",
		x2: "11",
		y2: "11"
	}), /* @__PURE__ */ jsx("line", {
		x1: "5",
		y1: "11",
		x2: "11",
		y2: "5"
	})]
});
/**
* Returns props to create a `ComboboxCancel` component that clears the combobox
* input when clicked.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxCancel({ store });
* <Combobox store={store} />
* <Role {...props} />
* ```
*/
const useComboboxCancel = createHook(function useComboboxCancel$1({ store, hideWhenEmpty,...props }) {
	const context = useComboboxProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxCancel must receive a `store` prop or be wrapped in a ComboboxProvider component.");
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		store?.setValue("");
		store?.move(null);
	});
	const comboboxId = store.useState((state) => state.baseElement?.id);
	const empty = store.useState((state) => state.value === "");
	props = useWrapElement(props, (element) => {
		if (!hideWhenEmpty) return element;
		if (empty) return /* @__PURE__ */ jsx(Fragment, {});
		return element;
	}, [hideWhenEmpty, empty]);
	props = {
		children: children$1,
		"aria-label": "Clear input",
		"aria-controls": comboboxId,
		...props,
		onClick
	};
	props = useButton(props);
	return props;
});
/**
* Renders a combobox cancel button that clears the combobox input value when
* clicked.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {3}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxCancel />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple" />
*     <ComboboxItem value="Banana" />
*     <ComboboxItem value="Orange" />
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxCancel = forwardRef(function ComboboxCancel$1(props) {
	const htmlProps = useComboboxCancel(props);
	return createElement(TagName$11, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-disclosure.tsx
const TagName$10 = "button";
const children = /* @__PURE__ */ jsx("svg", {
	"aria-hidden": "true",
	display: "block",
	fill: "none",
	stroke: "currentColor",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	strokeWidth: 1.5,
	viewBox: "0 0 16 16",
	height: "1em",
	width: "1em",
	pointerEvents: "none",
	children: /* @__PURE__ */ jsx("polyline", { points: "4,6 8,10 12,6" })
});
/**
* Returns props to create a `ComboboxDisclosure` component that toggles the
* combobox popover visibility when clicked.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxDisclosure({ store });
* <Combobox store={store} />
* <Role {...props} />
* <ComboboxPopover store={store}>
*   <ComboboxItem value="Item 1" />
*   <ComboboxItem value="Item 2" />
*   <ComboboxItem value="Item 3" />
* </ComboboxPopover>
* ```
*/
const useComboboxDisclosure = createHook(function useComboboxDisclosure$1({ store,...props }) {
	const context = useComboboxProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxDisclosure must receive a `store` prop or be wrapped in a ComboboxProvider component.");
	const onMouseDownProp = props.onMouseDown;
	const onMouseDown = useEvent((event) => {
		onMouseDownProp?.(event);
		event.preventDefault();
		store?.move(null);
	});
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const { baseElement } = store.getState();
		store.setDisclosureElement(baseElement);
	});
	const open = store.useState("open");
	props = {
		children,
		tabIndex: -1,
		"aria-label": open ? "Hide popup" : "Show popup",
		"aria-expanded": open,
		...props,
		onMouseDown,
		onClick
	};
	props = useDialogDisclosure({
		store,
		...props
	});
	return props;
});
/**
* Renders a combobox disclosure button that toggles the
* [`ComboboxPopover`](https://ariakit.org/reference/combobox-popover) element's
* visibility when clicked.
*
* Although this button is not tabbable, it remains accessible to screen reader
* users. On clicking, it automatically shifts focus to the
* [`Combobox`](https://ariakit.org/reference/combobox) element.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {3}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxDisclosure />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple" />
*     <ComboboxItem value="Banana" />
*     <ComboboxItem value="Orange" />
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxDisclosure = forwardRef(function ComboboxDisclosure$1(props) {
	const htmlProps = useComboboxDisclosure(props);
	return createElement(TagName$10, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-group.tsx
const TagName$9 = "div";
/**
* Returns props to create a `ComboboxGroup` component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxGroup({ store });
* <Combobox store={store} />
* <ComboboxPopover store={store}>
*   <Role {...props}>
*     <ComboboxGroupLabel>Label</ComboboxGroupLabel>
*     <ComboboxItem value="Item 1" />
*     <ComboboxItem value="Item 2" />
*   </Role>
* </ComboboxPopover>
* ```
*/
const useComboboxGroup = createHook(function useComboboxGroup$1({ store,...props }) {
	const context = useComboboxScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxRow must be wrapped in a ComboboxList or ComboboxPopover component");
	const contentElement = store.useState("contentElement");
	const popupRole = getPopupRole(contentElement);
	if (popupRole === "grid") {
		props = {
			role: "rowgroup",
			...props
		};
	}
	props = useCompositeGroup({
		store,
		...props
	});
	return props;
});
/**
* Renders a group for
* [`ComboboxItem`](https://ariakit.org/reference/combobox-item) elements.
* Optionally, a
* [`ComboboxGroupLabel`](https://ariakit.org/reference/combobox-group-label)
* can be rendered as a child to provide a label for the group.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {4-8}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxGroup>
*       <ComboboxGroupLabel>Fruits</ComboboxGroupLabel>
*       <ComboboxItem value="Apple" />
*       <ComboboxItem value="Banana" />
*     </ComboboxGroup>
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxGroup = forwardRef(function ComboboxGroup$1(props) {
	const htmlProps = useComboboxGroup(props);
	return createElement(TagName$9, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-group-label.tsx
const TagName$8 = "div";
/**
* Returns props to create a `ComboboxGroupLabel` component. This hook should be
* used in a component that's wrapped with `ComboboxGroup` so the
* `aria-labelledby` is correctly set on the combobox group element.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* // This component should be wrapped with ComboboxGroup
* const props = useComboboxGroupLabel();
* <Role {...props}>Label</Role>
* ```
*/
const useComboboxGroupLabel = createHook(function useComboboxGroupLabel$1(props) {
	props = useCompositeGroupLabel(props);
	return props;
});
/**
* Renders a label in a combobox group. This component should be wrapped with
* [`ComboboxGroup`](https://ariakit.org/reference/combobox-group) so the
* `aria-labelledby` is correctly set on the group element.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {5}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxGroup>
*       <ComboboxGroupLabel>Fruits</ComboboxGroupLabel>
*       <ComboboxItem value="Apple" />
*       <ComboboxItem value="Banana" />
*     </ComboboxGroup>
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxGroupLabel = forwardRef(function ComboboxGroupLabel$1(props) {
	const htmlProps = useComboboxGroupLabel(props);
	return createElement(TagName$8, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-item.tsx
const TagName$7 = "div";
function isSelected(storeValue, itemValue) {
	if (itemValue == null) return;
	if (storeValue == null) return false;
	if (Array.isArray(storeValue)) {
		return storeValue.includes(itemValue);
	}
	return storeValue === itemValue;
}
function getItemRole(popupRole) {
	const itemRoleByPopupRole = {
		menu: "menuitem",
		listbox: "option",
		tree: "treeitem"
	};
	const key = popupRole;
	return itemRoleByPopupRole[key] ?? "option";
}
/**
* Returns props to create a `ComboboxItem` component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxItem({ store, value: "value" });
* <Role {...props} />
* ```
*/
const useComboboxItem = createHook(function useComboboxItem$1({ store, value, hideOnClick, setValueOnClick, selectValueOnClick = true, resetValueOnSelect, focusOnHover = false, moveOnKeyPress = true, getItem: getItemProp,...props }) {
	const context = useComboboxScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxItem must be wrapped in a ComboboxList or ComboboxPopover component.");
	const { resetValueOnSelectState, multiSelectable, selected } = useStoreStateObject(store, {
		resetValueOnSelectState: "resetValueOnSelect",
		multiSelectable(state) {
			return Array.isArray(state.selectedValue);
		},
		selected(state) {
			return isSelected(state.selectedValue, value);
		}
	});
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			value
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [value, getItemProp]);
	setValueOnClick = setValueOnClick ?? !multiSelectable;
	hideOnClick = hideOnClick ?? (value != null && !multiSelectable);
	const onClickProp = props.onClick;
	const setValueOnClickProp = useBooleanEvent(setValueOnClick);
	const selectValueOnClickProp = useBooleanEvent(selectValueOnClick);
	const resetValueOnSelectProp = useBooleanEvent(resetValueOnSelect ?? resetValueOnSelectState ?? multiSelectable);
	const hideOnClickProp = useBooleanEvent(hideOnClick);
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (isDownloading(event)) return;
		if (isOpeningInNewTab(event)) return;
		if (value != null) {
			if (selectValueOnClickProp(event)) {
				if (resetValueOnSelectProp(event)) {
					store?.resetValue();
				}
				store?.setSelectedValue((prevValue) => {
					if (!Array.isArray(prevValue)) return value;
					if (prevValue.includes(value)) {
						return prevValue.filter((v) => v !== value);
					}
					return [...prevValue, value];
				});
			}
			if (setValueOnClickProp(event)) {
				store?.setValue(value);
			}
		}
		if (hideOnClickProp(event)) {
			store?.hide();
		}
	});
	const onKeyDownProp = props.onKeyDown;
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		const baseElement = store?.getState().baseElement;
		if (!baseElement) return;
		if (hasFocus(baseElement)) return;
		const printable = event.key.length === 1;
		if (printable || event.key === "Backspace" || event.key === "Delete") {
			queueMicrotask(() => baseElement.focus());
			if (isTextField(baseElement)) {
				store?.setValue(baseElement.value);
			}
		}
	});
	if (multiSelectable && selected != null) {
		props = {
			"aria-selected": selected,
			...props
		};
	}
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(ComboboxItemValueContext.Provider, {
		value,
		children: /* @__PURE__ */ jsx(ComboboxItemCheckedContext.Provider, {
			value: selected ?? false,
			children: element
		})
	}), [value, selected]);
	const popupRole = useContext(ComboboxListRoleContext);
	props = {
		role: getItemRole(popupRole),
		children: value,
		...props,
		onClick,
		onKeyDown
	};
	const moveOnKeyPressProp = useBooleanEvent(moveOnKeyPress);
	props = useCompositeItem({
		store,
		...props,
		getItem,
		moveOnKeyPress: (event) => {
			if (!moveOnKeyPressProp(event)) return false;
			const moveEvent = new Event("combobox-item-move");
			const baseElement = store?.getState().baseElement;
			baseElement?.dispatchEvent(moveEvent);
			return true;
		}
	});
	props = useCompositeHover({
		store,
		focusOnHover,
		...props
	});
	return props;
});
/**
* Renders a combobox item inside
* [`ComboboxList`](https://ariakit.org/reference/combobox-list) or
* [`ComboboxPopover`](https://ariakit.org/reference/combobox-popover)
* components.
*
* By default, the [`value`](https://ariakit.org/reference/combobox-item#value)
* prop will be rendered as the children, but this can be overriden.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {4-6}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple" />
*     <ComboboxItem value="Banana" />
*     <ComboboxItem value="Orange" />
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxItem = memo(forwardRef(function ComboboxItem$1(props) {
	const htmlProps = useComboboxItem(props);
	return createElement(TagName$7, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-item-check.tsx
const TagName$6 = "span";
/**
* Returns props to create a `ComboboxItemCheck` component. This hook must be
* used in a component that's wrapped with `ComboboxItem` or the `checked` prop
* must be explicitly passed to the component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const props = useComboboxItemCheck({ checked: true });
* <Role {...props} />
* ```
*/
const useComboboxItemCheck = createHook(function useComboboxItemCheck$1({ store, checked,...props }) {
	const context = useContext(ComboboxItemCheckedContext);
	checked = checked ?? context;
	props = useCheckboxCheck({
		...props,
		checked
	});
	return props;
});
/**
* Renders a checkmark icon when the
* [`checked`](https://ariakit.org/reference/combobox-item-check#checked) prop
* is `true`. The icon can be overridden by providing a different one as
* children.
*
* When rendered inside a
* [`ComboboxItem`](https://ariakit.org/reference/combobox-item) component, the
* [`checked`](https://ariakit.org/reference/combobox-item-check#checked) prop
* is automatically derived from the context.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {5,9}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple">
*       <ComboboxItemCheck />
*       Apple
*     </ComboboxItem>
*     <ComboboxItem value="Orange">
*       <ComboboxItemCheck />
*       Orange
*     </ComboboxItem>
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxItemCheck = forwardRef(function ComboboxItemCheck$1(props) {
	const htmlProps = useComboboxItemCheck(props);
	return createElement(TagName$6, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-item-value.tsx
const TagName$5 = "span";
function normalizeValue(value) {
	return normalizeString(value).toLowerCase();
}
function getOffsets(string, values) {
	const offsets = [];
	for (const value of values) {
		let pos = 0;
		const length = value.length;
		while (string.indexOf(value, pos) !== -1) {
			const index = string.indexOf(value, pos);
			if (index !== -1) {
				offsets.push([index, length]);
			}
			pos = index + 1;
		}
	}
	return offsets;
}
function filterOverlappingOffsets(offsets) {
	return offsets.filter(([offset, length], i, arr) => {
		return !arr.some(([o, l], j) => j !== i && o <= offset && o + l >= offset + length);
	});
}
function sortOffsets(offsets) {
	return offsets.sort(([a], [b]) => a - b);
}
function splitValue(itemValue, userValue) {
	if (!itemValue) return itemValue;
	if (!userValue) return itemValue;
	const userValues = toArray(userValue).filter(Boolean).map(normalizeValue);
	const parts = [];
	const span = (value, autocomplete = false) => /* @__PURE__ */ jsx("span", {
		"data-autocomplete-value": autocomplete ? "" : undefined,
		"data-user-value": autocomplete ? undefined : "",
		children: value
	}, parts.length);
	const offsets = sortOffsets(filterOverlappingOffsets(getOffsets(normalizeValue(itemValue), new Set(userValues))));
	if (!offsets.length) {
		parts.push(span(itemValue, true));
		return parts;
	}
	const [firstOffset] = offsets[0];
	const values = [itemValue.slice(0, firstOffset), ...offsets.flatMap(([offset, length], i) => {
		const value = itemValue.slice(offset, offset + length);
		const nextOffset = offsets[i + 1]?.[0];
		const nextValue = itemValue.slice(offset + length, nextOffset);
		return [value, nextValue];
	})];
	values.forEach((value, i) => {
		if (!value) return;
		parts.push(span(value, i % 2 === 0));
	});
	return parts;
}
/**
* Returns props to create a `ComboboxItemValue` component that displays a value
* element inside a combobox item. The value will be split into span elements
* and returned as the children prop. The portions of the value that correspond
* to the store value will have a `data-user-value` attribute. The other
* portions will have a `data-autocomplete-value` attribute.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore({ value: "p" });
* const props = useComboboxItemValue({ store, value: "Apple" });
* <Role {...props} />
* // This will result in the following DOM:
* <span>
*   <span data-autocomplete-value>A</span>
*   <span data-user-value>p</span>
*   <span data-user-value>p</span>
*   <span data-autocomplete-value>le</span>
* </span>
* ```
*/
const useComboboxItemValue = createHook(function useComboboxItemValue$1({ store, value, userValue,...props }) {
	const context = useComboboxScopedContext();
	store = store || context;
	const itemContext = useContext(ComboboxItemValueContext);
	const itemValue = value ?? itemContext;
	const inputValue = useStoreState(store, (state) => userValue ?? state?.value);
	const children$2 = useMemo(() => {
		if (!itemValue) return;
		if (!inputValue) return itemValue;
		return splitValue(itemValue, inputValue);
	}, [itemValue, inputValue]);
	props = {
		children: children$2,
		...props
	};
	return removeUndefinedValues(props);
});
/**
* Renders a `span` element with the combobox item value as children. The value
* is split into span elements. Portions of the value matching the user input
* will have a
* [`data-user-value`](https://ariakit.org/guide/styling#data-user-value)
* attribute, while the rest will have a
* [`data-autocomplete-value`](https://ariakit.org/guide/styling#data-autocomplete-value)
* attribute.
*
* The item value is automatically set to the value of the closest
* [`ComboboxItem`](https://ariakit.org/reference/combobox-item) component's
* [`value`](https://ariakit.org/reference/combobox-item#value) prop. The user
* input value is automatically set to the combobox store's
* [`value`](https://ariakit.org/reference/use-combobox-store#value) state. Both
* values can be overridden by providing the
* [`value`](https://ariakit.org/reference/combobox-item-value#value) and
* [`userValue`](https://ariakit.org/reference/combobox-item-value#uservalue)
* props, respectively.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {5} "value"
* <ComboboxProvider value="p">
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple">
*       <ComboboxItemValue />
*     </ComboboxItem>
*   </ComboboxPopover>
* </ComboboxProvider>
*
* // The Apple item will have a value element that looks like this:
* <span>
*   <span data-autocomplete-value>A</span>
*   <span data-user-value>p</span>
*   <span data-user-value>p</span>
*   <span data-autocomplete-value>le</span>
* </span>
* ```
*/
const ComboboxItemValue = forwardRef(function ComboboxItemValue$1(props) {
	const htmlProps = useComboboxItemValue(props);
	return createElement(TagName$5, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-label.tsx
const TagName$4 = "label";
/**
* Returns props to create a `ComboboxLabel` component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxLabel({ store });
* <Role {...props}>Favorite fruit</Role>
* <Combobox store={store} />
* ```
*/
const useComboboxLabel = createHook(function useComboboxLabel$1({ store,...props }) {
	const context = useComboboxProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxLabel must receive a `store` prop or be wrapped in a ComboboxProvider component.");
	const comboboxId = store.useState((state) => state.baseElement?.id);
	props = {
		htmlFor: comboboxId,
		...props
	};
	return removeUndefinedValues(props);
});
/**
* Renders a label for the [`Combobox`](https://ariakit.org/reference/combobox)
* component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {2}
* <ComboboxProvider>
*   <ComboboxLabel>Favorite fruit</ComboboxLabel>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple" />
*     <ComboboxItem value="Orange" />
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxLabel = memo(forwardRef(function ComboboxLabel$1(props) {
	const htmlProps = useComboboxLabel(props);
	return createElement(TagName$4, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-list.tsx
const TagName$3 = "div";
/**
* Returns props to create a `ComboboxList` component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxList({ store });
* <Role {...props}>
*   <ComboboxItem value="Item 1" />
*   <ComboboxItem value="Item 2" />
*   <ComboboxItem value="Item 3" />
* </Role>
* ```
*/
const useComboboxList = createHook(function useComboboxList$1({ store, alwaysVisible,...props }) {
	const scopedContext = useComboboxScopedContext(true);
	const context = useComboboxContext();
	store = store || context;
	const scopedContextSameStore = !!store && store === scopedContext;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxList must receive a `store` prop or be wrapped in a ComboboxProvider component.");
	const ref = useRef(null);
	const id = useId(props.id);
	const mounted = store.useState("mounted");
	const hidden = isHidden(mounted, props.hidden, alwaysVisible);
	const style = hidden ? {
		...props.style,
		display: "none"
	} : props.style;
	const multiSelectable = store.useState((state) => Array.isArray(state.selectedValue));
	const role = useAttribute(ref, "role", props.role);
	const isCompositeRole = role === "listbox" || role === "tree" || role === "grid";
	const ariaMultiSelectable = isCompositeRole ? multiSelectable || undefined : undefined;
	const [hasListboxInside, setHasListboxInside] = useState(false);
	const contentElement = store.useState("contentElement");
	useSafeLayoutEffect(() => {
		if (!mounted) return;
		const element = ref.current;
		if (!element) return;
		if (contentElement !== element) return;
		const callback = () => {
			setHasListboxInside(!!element.querySelector("[role='listbox']"));
		};
		const observer = new MutationObserver(callback);
		observer.observe(element, {
			subtree: true,
			childList: true,
			attributeFilter: ["role"]
		});
		callback();
		return () => observer.disconnect();
	}, [mounted, contentElement]);
	if (!hasListboxInside) {
		props = {
			role: "listbox",
			"aria-multiselectable": ariaMultiSelectable,
			...props
		};
	}
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(ComboboxScopedContextProvider, {
		value: store,
		children: /* @__PURE__ */ jsx(ComboboxListRoleContext.Provider, {
			value: role,
			children: element
		})
	}), [store, role]);
	const setContentElement = id && (!scopedContext || !scopedContextSameStore) ? store.setContentElement : null;
	props = {
		id,
		hidden,
		...props,
		ref: useMergeRefs(setContentElement, ref, props.ref),
		style
	};
	return removeUndefinedValues(props);
});
/**
* Renders a combobox list. The `role` prop is set to `listbox` by default, but
* can be overriden by any other valid combobox popup role (`listbox`, `menu`,
* `tree`, `grid` or `dialog`).
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {3-7}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxList>
*     <ComboboxItem value="Apple" />
*     <ComboboxItem value="Banana" />
*     <ComboboxItem value="Orange" />
*   </ComboboxList>
* </ComboboxProvider>
* ```
*/
const ComboboxList = forwardRef(function ComboboxList$1(props) {
	const htmlProps = useComboboxList(props);
	return createElement(TagName$3, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-popover.tsx
const TagName$2 = "div";
function isController(target, ...ids) {
	if (!target) return false;
	if ("id" in target) {
		const selector = ids.filter(Boolean).map((id) => `[aria-controls~="${id}"]`).join(", ");
		if (!selector) return false;
		return target.matches(selector);
	}
	return false;
}
/**
* Returns props to create a `ComboboxPopover` component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxPopover({ store });
* <Role {...props}>
*   <ComboboxItem value="Item 1" />
*   <ComboboxItem value="Item 2" />
*   <ComboboxItem value="Item 3" />
* </Role>
* ```
*/
const useComboboxPopover = createHook(function useComboboxPopover$1({ store, modal, tabIndex, alwaysVisible, autoFocusOnHide = true, hideOnInteractOutside = true,...props }) {
	const context = useComboboxProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxPopover must receive a `store` prop or be wrapped in a ComboboxProvider component.");
	const baseElement = store.useState("baseElement");
	const hiddenByClickOutsideRef = useRef(false);
	const treeSnapshotKey = useStoreState(store.tag, (state) => state?.renderedItems.length);
	props = useComboboxList({
		store,
		alwaysVisible,
		...props
	});
	props = usePopover({
		store,
		modal,
		alwaysVisible,
		backdrop: false,
		autoFocusOnShow: false,
		finalFocus: baseElement,
		preserveTabOrderAnchor: null,
		unstable_treeSnapshotKey: treeSnapshotKey,
		...props,
		getPersistentElements() {
			const elements = props.getPersistentElements?.() || [];
			if (!modal) return elements;
			if (!store) return elements;
			const { contentElement, baseElement: baseElement$1 } = store.getState();
			if (!baseElement$1) return elements;
			const doc = getDocument(baseElement$1);
			const selectors = [];
			if (contentElement?.id) {
				selectors.push(`[aria-controls~="${contentElement.id}"]`);
			}
			if (baseElement$1?.id) {
				selectors.push(`[aria-controls~="${baseElement$1.id}"]`);
			}
			if (!selectors.length) return [...elements, baseElement$1];
			const selector = selectors.join(",");
			const controlElements = doc.querySelectorAll(selector);
			return [...elements, ...controlElements];
		},
		autoFocusOnHide(element) {
			if (isFalsyBooleanCallback(autoFocusOnHide, element)) return false;
			if (hiddenByClickOutsideRef.current) {
				hiddenByClickOutsideRef.current = false;
				return false;
			}
			return true;
		},
		hideOnInteractOutside(event) {
			const state = store?.getState();
			const contentId = state?.contentElement?.id;
			const baseId = state?.baseElement?.id;
			if (isController(event.target, contentId, baseId)) return false;
			const result = typeof hideOnInteractOutside === "function" ? hideOnInteractOutside(event) : hideOnInteractOutside;
			if (result) {
				hiddenByClickOutsideRef.current = event.type === "click";
			}
			return result;
		}
	});
	return props;
});
/**
* Renders a combobox popover. The `role` prop is set to `listbox` by default,
* but can be overriden by any other valid combobox popup role (`listbox`,
* `menu`, `tree`, `grid` or `dialog`).
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {3-7}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxItem value="Apple" />
*     <ComboboxItem value="Banana" />
*     <ComboboxItem value="Orange" />
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxPopover = createDialogComponent(forwardRef(function ComboboxPopover$1(props) {
	const htmlProps = useComboboxPopover(props);
	return createElement(TagName$2, htmlProps);
}), useComboboxProviderContext);

//#endregion
//#region packages/ariakit-core/src/combobox/combobox-store.ts
const isTouchSafari = isSafari() && isTouchDevice();
function createComboboxStore({ tag,...props } = {}) {
	const store = mergeStore(props.store, pick(tag, ["value", "rtl"]));
	throwOnConflictingProps(props, store);
	const tagState = tag?.getState();
	const syncState = store?.getState();
	const activeId = defaultValue(props.activeId, syncState?.activeId, props.defaultActiveId, null);
	const composite = createCompositeStore({
		...props,
		activeId,
		includesBaseElement: defaultValue(props.includesBaseElement, syncState?.includesBaseElement, true),
		orientation: defaultValue(props.orientation, syncState?.orientation, "vertical"),
		focusLoop: defaultValue(props.focusLoop, syncState?.focusLoop, true),
		focusWrap: defaultValue(props.focusWrap, syncState?.focusWrap, true),
		virtualFocus: defaultValue(props.virtualFocus, syncState?.virtualFocus, true)
	});
	const popover = createPopoverStore({
		...props,
		placement: defaultValue(props.placement, syncState?.placement, "bottom-start")
	});
	const value = defaultValue(props.value, syncState?.value, props.defaultValue, "");
	const selectedValue = defaultValue(props.selectedValue, syncState?.selectedValue, tagState?.values, props.defaultSelectedValue, "");
	const multiSelectable = Array.isArray(selectedValue);
	const initialState = {
		...composite.getState(),
		...popover.getState(),
		value,
		selectedValue,
		resetValueOnSelect: defaultValue(props.resetValueOnSelect, syncState?.resetValueOnSelect, multiSelectable),
		resetValueOnHide: defaultValue(props.resetValueOnHide, syncState?.resetValueOnHide, multiSelectable && !tag),
		activeValue: syncState?.activeValue
	};
	const combobox = createStore(initialState, composite, popover, store);
	if (isTouchSafari) {
		setup(combobox, () => sync(combobox, ["virtualFocus"], () => {
			combobox.setState("virtualFocus", false);
		}));
	}
	setup(combobox, () => {
		if (!tag) return;
		return chain(sync(combobox, ["selectedValue"], (state) => {
			if (!Array.isArray(state.selectedValue)) return;
			tag.setValues(state.selectedValue);
		}), sync(tag, ["values"], (state) => {
			combobox.setState("selectedValue", state.values);
		}));
	});
	setup(combobox, () => sync(combobox, ["resetValueOnHide", "mounted"], (state) => {
		if (!state.resetValueOnHide) return;
		if (state.mounted) return;
		combobox.setState("value", value);
	}));
	setup(combobox, () => sync(combobox, ["open"], (state) => {
		if (state.open) return;
		combobox.setState("activeId", activeId);
		combobox.setState("moves", 0);
	}));
	setup(combobox, () => sync(combobox, ["moves", "activeId"], (state, prevState) => {
		if (state.moves === prevState.moves) {
			combobox.setState("activeValue", undefined);
		}
	}));
	setup(combobox, () => batch(combobox, ["moves", "renderedItems"], (state, prev) => {
		if (state.moves === prev.moves) return;
		const { activeId: activeId$1 } = combobox.getState();
		const activeItem = composite.item(activeId$1);
		combobox.setState("activeValue", activeItem?.value);
	}));
	return {
		...popover,
		...composite,
		...combobox,
		tag,
		setValue: (value$1) => combobox.setState("value", value$1),
		resetValue: () => combobox.setState("value", initialState.value),
		setSelectedValue: (selectedValue$1) => combobox.setState("selectedValue", selectedValue$1)
	};
}

//#endregion
//#region packages/ariakit-react-core/src/tag/tag-context.tsx
const TagValueContext = createContext(null);
const TagRemoveIdContext = createContext(null);
const ctx = createStoreContext([CompositeContextProvider], [CompositeScopedContextProvider]);
/**
* Returns the tag store from the nearest tag container.
* @example
* function Tag() {
*   const store = useTagContext();
*
*   if (!store) {
*     throw new Error("Tag must be wrapped in TagProvider");
*   }
*
*   // Use the store...
* }
*/
const useTagContext = ctx.useContext;
const useTagScopedContext = ctx.useScopedContext;
const useTagProviderContext = ctx.useProviderContext;
const TagContextProvider = ctx.ContextProvider;
const TagScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-store.ts
function useComboboxStoreOptions(props) {
	const tag = useTagContext();
	props = {
		...props,
		tag: props.tag !== undefined ? props.tag : tag
	};
	return useCompositeStoreOptions(props);
}
function useComboboxStoreProps(store, update, props) {
	useUpdateEffect(update, [props.tag]);
	useStoreProps(store, props, "value", "setValue");
	useStoreProps(store, props, "selectedValue", "setSelectedValue");
	useStoreProps(store, props, "resetValueOnHide");
	useStoreProps(store, props, "resetValueOnSelect");
	return Object.assign(useCompositeStoreProps(usePopoverStoreProps(store, update, props), update, props), { tag: props.tag });
}
function useComboboxStore(props = {}) {
	props = useComboboxStoreOptions(props);
	const [store, update] = useStore(createComboboxStore, props);
	return useComboboxStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-provider.tsx
function ComboboxProvider(props = {}) {
	const store = useComboboxStore(props);
	return /* @__PURE__ */ jsx(ComboboxContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-row.tsx
const TagName$1 = "div";
/**
* Returns props to create a `ComboboxRow` component.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxRow({ store });
* <ComboboxPopover store={store}>
*   <Role {...props}>
*     <ComboboxItem value="Item 1" />
*     <ComboboxItem value="Item 2" />
*     <ComboboxItem value="Item 3" />
*   </Role>
* </ComboboxPopover>
* ```
*/
const useComboboxRow = createHook(function useComboboxRow$1({ store,...props }) {
	const context = useComboboxScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxRow must be wrapped in a ComboboxList or ComboboxPopover component");
	const contentElement = store.useState("contentElement");
	const popupRole = getPopupRole(contentElement);
	const role = popupRole === "grid" ? "row" : "presentation";
	props = {
		role,
		...props
	};
	props = useCompositeRow({
		store,
		...props
	});
	return props;
});
/**
* Renders a combobox row that allows two-dimensional arrow key navigation.
* [`ComboboxItem`](https://ariakit.org/reference/combobox-item) elements
* wrapped within this component will automatically receive a
* [`rowId`](https://ariakit.org/reference/combobox-item#rowid) prop.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {4-13}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxRow>
*       <ComboboxItem value="Item 1.1" />
*       <ComboboxItem value="Item 1.2" />
*       <ComboboxItem value="Item 1.3" />
*     </ComboboxRow>
*     <ComboboxRow>
*       <ComboboxItem value="Item 2.1" />
*       <ComboboxItem value="Item 2.2" />
*       <ComboboxItem value="Item 2.3" />
*     </ComboboxRow>
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxRow = forwardRef(function ComboboxRow$1(props) {
	const htmlProps = useComboboxRow(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-separator.tsx
const TagName = "hr";
/**
* Returns props a `ComboboxSeparator` component for combobox items.
* @deprecated Use `useComboboxGroup` with CSS borders instead.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx
* const store = useComboboxStore();
* const props = useComboboxSeparator({ store });
* <ComboboxPopover store={store}>
*   <ComboboxItem value="Item 1" />
*   <Role {...props} />
*   <ComboboxItem value="Item 2" />
*   <ComboboxItem value="Item 3" />
* </ComboboxPopover>
* ```
*/
const useComboboxSeparator = createHook(function useComboboxSeparator$1({ store,...props }) {
	const context = useComboboxScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxSeparator must be wrapped in a ComboboxList or ComboboxPopover component.");
	props = useCompositeSeparator({
		store,
		...props
	});
	return props;
});
/**
* Renders a divider between
* [`ComboboxItem`](https://ariakit.org/reference/combobox-item) elements.
* @deprecated Use
* [`ComboboxGroup`](https://ariakit.org/reference/combobox-group) with CSS
* borders instead.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {5}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxPopover>
*     <ComboboxItem value="Item 1" />
*     <ComboboxSeparator />
*     <ComboboxItem value="Item 2" />
*     <ComboboxItem value="Item 3" />
*   </ComboboxPopover>
* </ComboboxProvider>
* ```
*/
const ComboboxSeparator = forwardRef(function ComboboxSeparator$1(props) {
	const htmlProps = useComboboxSeparator(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/combobox/combobox-value.tsx
/**
* Renders the current
* [`value`](https://ariakit.org/reference/use-combobox-store#value) state in
* the [combobox store](https://ariakit.org/reference/use-combobox-store).
*
* As a value component, it doesn't render any DOM elements and therefore
* doesn't accept HTML props.
*
* It takes a
* [`children`](https://ariakit.org/reference/combobox-value#children) function
* that gets called with the current value as an argument. This can be used as
* an uncontrolled API to render the combobox value in a custom way.
* @see https://ariakit.org/components/combobox
* @example
* ```jsx {3-5}
* <ComboboxProvider>
*   <Combobox />
*   <ComboboxValue>
*     {(value) => `Current value: ${value}`}
*   </ComboboxValue>
* </ComboboxProvider>
* ```
*/
function ComboboxValue({ store, children: children$2 } = {}) {
	const context = useComboboxContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "ComboboxValue must receive a `store` prop or be wrapped in a ComboboxProvider component.");
	const value = store.useState("value");
	if (children$2) {
		return children$2(value);
	}
	return value;
}

//#endregion
export { useComboboxStore as a, ComboboxLabel as c, ComboboxItem as d, ComboboxGroupLabel as f, Combobox as g, ComboboxCancel as h, ComboboxProvider as i, ComboboxItemValue as l, ComboboxDisclosure as m, ComboboxSeparator as n, ComboboxPopover as o, ComboboxGroup as p, ComboboxRow as r, ComboboxList as s, ComboboxValue as t, ComboboxItemCheck as u };