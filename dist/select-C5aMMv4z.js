import { defaultValue, disabledFromProps, getPopupItemRole, getPopupRole, invariant, isDownloading, isOpeningInNewTab, isSelfTarget, queueBeforeEvent, removeUndefinedValues, useAttribute, useBooleanEvent, useEvent, useId, useMergeRefs, useSafeLayoutEffect, useTransactionState, useUpdateEffect, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef, memo } from "./system-BBb67kU9.js";
import { batch, createStore, mergeStore, omit, setup, sync, throwOnConflictingProps, useStore, useStoreProps, useStoreState, useStoreStateObject } from "./store-Ddr50htY.js";
import { useCheckboxCheck } from "./checkbox-check-C0SId0fn.js";
import { createCompositeStore, toArray, useComposite, useCompositeStoreOptions, useCompositeStoreProps } from "./composite-store-Eq4wZZQ7.js";
import { isHidden } from "./disclosure-store-Czymr2mJ.js";
import { useComboboxProviderContext } from "./combobox-context-Bnps9PfQ.js";
import { useCompositeGroup, useCompositeGroupLabel, useCompositeHover } from "./composite-hover-gUyMxR6c.js";
import { useCompositeItem } from "./composite-item-BOmY0GIN.js";
import { createDialogComponent } from "./dialog-DsMHKXPt.js";
import { createPopoverStore, usePopover, usePopoverStoreProps } from "./popover-store-agpDlTrh.js";
import { useCompositeRow } from "./composite-row-B4d3nlFF.js";
import { useCompositeSeparator } from "./composite-separator-CODf9KHJ.js";
import { useCompositeTypeahead } from "./composite-typeahead-BcQAB49A.js";
import { usePopoverDismiss, usePopoverHeading } from "./popover-heading-D5WoNzD4.js";
import { usePopoverDisclosure, usePopoverDisclosureArrow } from "./popover-disclosure-arrow-DdOLG_XS.js";
import { SelectContextProvider, SelectHeadingContext, SelectItemCheckedContext, SelectScopedContextProvider, useSelectContext, useSelectProviderContext, useSelectScopedContext } from "./select-context-D1eregwH.js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/select/select-arrow.tsx
const TagName$12 = "span";
/**
* Returns props to create a `SelectArrow` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectArrow({ store });
* <Select store={store}>
*   {store.value}
*   <Role {...props} />
* </Select>
* <SelectPopover store={store}>
*   <SelectItem value="Apple" />
*   <SelectItem value="Orange" />
* </SelectPopover>
* ```
*/
const useSelectArrow = createHook(function useSelectArrow$1({ store,...props }) {
	const context = useSelectContext();
	store = store || context;
	props = usePopoverDisclosureArrow({
		store,
		...props
	});
	return props;
});
/**
* Renders an arrow pointing to the select popover position. It's usually
* rendered inside the [`Select`](https://ariakit.org/reference/select)
* component.
* @see https://ariakit.org/components/select
* @example
* ```jsx {4}
* <SelectProvider>
*   <Select>
*     {select.value}
*     <SelectArrow />
*   </Select>
*   <SelectPopover>
*     <SelectItem value="Apple" />
*     <SelectItem value="Orange" />
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectArrow = forwardRef(function SelectArrow$1(props) {
	const htmlProps = useSelectArrow(props);
	return createElement(TagName$12, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select.tsx
const TagName$11 = "button";
function getSelectedValues(select) {
	return Array.from(select.selectedOptions).map((option) => option.value);
}
function nextWithValue(store, next) {
	return () => {
		const nextId = next();
		if (!nextId) return;
		let i = 0;
		let nextItem = store.item(nextId);
		const firstItem = nextItem;
		while (nextItem && nextItem.value == null) {
			const nextId$1 = next(++i);
			if (!nextId$1) return;
			nextItem = store.item(nextId$1);
			if (nextItem === firstItem) break;
		}
		return nextItem?.id;
	};
}
/**
* Returns props to create a `Select` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelect({ store });
* <Role {...props} />
* ```
*/
const useSelect = createHook(function useSelect$1({ store, name, form, required, showOnKeyDown = true, moveOnKeyDown = true, toggleOnPress = true, toggleOnClick = toggleOnPress,...props }) {
	const context = useSelectProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Select must receive a `store` prop or be wrapped in a SelectProvider component.");
	const onKeyDownProp = props.onKeyDown;
	const showOnKeyDownProp = useBooleanEvent(showOnKeyDown);
	const moveOnKeyDownProp = useBooleanEvent(moveOnKeyDown);
	const placement = store.useState("placement");
	const dir = placement.split("-")[0];
	const value = store.useState("value");
	const multiSelectable = Array.isArray(value);
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const { orientation, items: items$1, activeId } = store.getState();
		const isVertical = orientation !== "horizontal";
		const isHorizontal = orientation !== "vertical";
		const isGrid = !!items$1.find((item) => !item.disabled && item.value != null)?.rowId;
		const moveKeyMap = {
			ArrowUp: (isGrid || isVertical) && nextWithValue(store, store.up),
			ArrowRight: (isGrid || isHorizontal) && nextWithValue(store, store.next),
			ArrowDown: (isGrid || isVertical) && nextWithValue(store, store.down),
			ArrowLeft: (isGrid || isHorizontal) && nextWithValue(store, store.previous)
		};
		const getId = moveKeyMap[event.key];
		if (getId && moveOnKeyDownProp(event)) {
			event.preventDefault();
			store.move(getId());
		}
		const isTopOrBottom = dir === "top" || dir === "bottom";
		const isLeft = dir === "left";
		const isRight = dir === "right";
		const canShowKeyMap = {
			ArrowDown: isTopOrBottom,
			ArrowUp: isTopOrBottom,
			ArrowLeft: isLeft,
			ArrowRight: isRight
		};
		const canShow = canShowKeyMap[event.key];
		if (canShow && showOnKeyDownProp(event)) {
			event.preventDefault();
			store.move(activeId);
			queueBeforeEvent(event.currentTarget, "keyup", store.show);
		}
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(SelectScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	const [autofill, setAutofill] = useState(false);
	const nativeSelectChangedRef = useRef(false);
	useEffect(() => {
		const nativeSelectChanged = nativeSelectChangedRef.current;
		nativeSelectChangedRef.current = false;
		if (nativeSelectChanged) return;
		setAutofill(false);
	}, [value]);
	const labelId = store.useState((state) => state.labelElement?.id);
	const label = props["aria-label"];
	const labelledBy = props["aria-labelledby"] || labelId;
	const items = store.useState((state) => {
		if (!name) return;
		return state.items;
	});
	const values = useMemo(() => {
		return [...new Set(items?.map((i) => i.value).filter((v) => v != null))];
	}, [items]);
	props = useWrapElement(props, (element) => {
		if (!name) return element;
		return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("select", {
			style: {
				border: 0,
				clip: "rect(0 0 0 0)",
				height: "1px",
				margin: "-1px",
				overflow: "hidden",
				padding: 0,
				position: "absolute",
				whiteSpace: "nowrap",
				width: "1px"
			},
			tabIndex: -1,
			"aria-hidden": true,
			"aria-label": label,
			"aria-labelledby": labelledBy,
			name,
			form,
			required,
			disabled: props.disabled,
			value,
			multiple: multiSelectable,
			onFocus: () => store?.getState().selectElement?.focus(),
			onChange: (event) => {
				nativeSelectChangedRef.current = true;
				setAutofill(true);
				store?.setValue(multiSelectable ? getSelectedValues(event.target) : event.target.value);
			},
			children: [toArray(value).map((value$1) => {
				if (value$1 == null) return null;
				if (values.includes(value$1)) return null;
				return /* @__PURE__ */ jsx("option", {
					value: value$1,
					children: value$1
				}, value$1);
			}), values.map((value$1) => /* @__PURE__ */ jsx("option", {
				value: value$1,
				children: value$1
			}, value$1))]
		}), element] });
	}, [
		store,
		label,
		labelledBy,
		name,
		form,
		required,
		value,
		multiSelectable,
		values,
		props.disabled
	]);
	const children = /* @__PURE__ */ jsxs(Fragment$1, { children: [value, /* @__PURE__ */ jsx(SelectArrow, {})] });
	const contentElement = store.useState("contentElement");
	props = {
		role: "combobox",
		"aria-autocomplete": "none",
		"aria-labelledby": labelId,
		"aria-haspopup": getPopupRole(contentElement, "listbox"),
		"data-autofill": autofill || undefined,
		"data-name": name,
		children,
		...props,
		ref: useMergeRefs(store.setSelectElement, props.ref),
		onKeyDown
	};
	props = usePopoverDisclosure({
		store,
		toggleOnClick,
		...props
	});
	props = useCompositeTypeahead({
		store,
		...props
	});
	return props;
});
/**
* Renders a custom select element that controls the visibility of either a
* [`SelectList`](https://ariakit.org/reference/select-list) or a
* [`SelectPopover`](https://ariakit.org/reference/select-popover) component.
*
* By default, the
* [`value`](https://ariakit.org/reference/select-provider#value) state is
* rendered as the children, followed by a
* [`SelectArrow`](https://ariakit.org/reference/select-arrow) component. This
* can be customized by passing different children to the component.
* @see https://ariakit.org/components/select
* @example
* ```jsx {2}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectItem value="Apple" />
*     <SelectItem value="Orange" />
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const Select = forwardRef(function Select$1(props) {
	const htmlProps = useSelect(props);
	return createElement(TagName$11, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-dismiss.tsx
const TagName$10 = "button";
/**
* Returns props to create a `SelectDismiss` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const props = useSelectDismiss();
* <Role.button {...props} />
* ```
*/
const useSelectDismiss = createHook(function useSelectDismiss$1({ store,...props }) {
	const context = useSelectScopedContext();
	store = store || context;
	props = usePopoverDismiss({
		store,
		...props
	});
	return props;
});
/**
* Renders a button that hides a
* [`SelectPopover`](https://ariakit.org/reference/select-popover) component
* when clicked.
*
* When this component is rendered within
* [`SelectPopover`](https://ariakit.org/reference/select-popover), all
* [`SelectItem`](https://ariakit.org/reference/select-item) elements must be
* rendered within a [`SelectList`](https://ariakit.org/reference/select-list)
* instead of directly within the popover.
* @see https://ariakit.org/components/select
* @example
* ```jsx {4}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectDismiss />
*     <SelectList>
*       <SelectItem value="Apple" />
*       <SelectItem value="Orange" />
*     </SelectList>
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectDismiss = forwardRef(function SelectDismiss$1(props) {
	const htmlProps = useSelectDismiss(props);
	return createElement(TagName$10, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-group.tsx
const TagName$9 = "div";
/**
* Returns props to create a `SelectGroup` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectGroup({ store });
* <Select store={store} />
* <SelectPopover store={store}>
*   <Role {...props}>
*     <SelectGroupLabel>Fruits</SelectGroupLabel>
*     <SelectItem value="Apple" />
*     <SelectItem value="Orange" />
*   </Role>
* </SelectPopover>
* ```
*/
const useSelectGroup = createHook(function useSelectGroup$1(props) {
	props = useCompositeGroup(props);
	return props;
});
/**
* Renders a group for [`SelectItem`](https://ariakit.org/reference/select-item)
* elements. Optionally, a
* [`SelectGroupLabel`](https://ariakit.org/reference/select-group-label) can be
* rendered as a child to provide a label for the group.
* @see https://ariakit.org/components/select
* @example
* ```jsx {4-8}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectGroup>
*       <SelectGroupLabel>Fruits</SelectGroupLabel>
*       <SelectItem value="Apple" />
*       <SelectItem value="Orange" />
*     </SelectGroup>
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectGroup = forwardRef(function SelectGroup$1(props) {
	const htmlProps = useSelectGroup(props);
	return createElement(TagName$9, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-group-label.tsx
const TagName$8 = "div";
/**
* Returns props to create a `SelectGroupLabel` component. This hook must be
* used in a component that's wrapped with `SelectGroup` so the
* `aria-labelledby` prop is properly set on the select group element.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* // This component must be wrapped with SelectGroup
* const props = useSelectGroupLabel();
* <Role {...props}>Label</Role>
* ```
*/
const useSelectGroupLabel = createHook(function useSelectGroupLabel$1(props) {
	props = useCompositeGroupLabel(props);
	return props;
});
/**
* Renders a label in a select group. This component must be wrapped with
* [`SelectGroup`](https://ariakit.org/reference/select-group) so the
* `aria-labelledby` prop is properly set on the select group element.
* @see https://ariakit.org/components/select
* @example
* ```jsx {5,10}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectGroup>
*       <SelectGroupLabel>Fruits</SelectGroupLabel>
*       <SelectItem value="Apple" />
*       <SelectItem value="Orange" />
*     </SelectGroup>
*     <SelectGroup>
*       <SelectGroupLabel>Meat</SelectGroupLabel>
*       <SelectItem value="Beef" />
*       <SelectItem value="Chicken" />
*     </SelectGroup>
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectGroupLabel = forwardRef(function SelectGroupLabel$1(props) {
	const htmlProps = useSelectGroupLabel(props);
	return createElement(TagName$8, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-heading.tsx
const TagName$7 = "h1";
/**
* Returns props to create a `SelectHeading` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const props = useSelectHeading();
* <Role {...props}>Heading</Role>
* ```
*/
const useSelectHeading = createHook(function useSelectHeading$1(props) {
	const [, setHeadingId] = useContext(SelectHeadingContext) || [];
	const id = useId(props.id);
	useSafeLayoutEffect(() => {
		setHeadingId?.(id);
		return () => setHeadingId?.(undefined);
	}, [setHeadingId, id]);
	props = {
		id,
		...props
	};
	props = usePopoverHeading(props);
	return props;
});
/**
* Renders a heading element that serves as a label for
* [`SelectPopover`](https://ariakit.org/reference/select-popover) and
* [`SelectList`](https://ariakit.org/reference/select-list) components.
*
* When this component is rendered within
* [`SelectPopover`](https://ariakit.org/reference/select-popover), all
* [`SelectItem`](https://ariakit.org/reference/select-item) elements must be
* rendered within a [`SelectList`](https://ariakit.org/reference/select-list)
* instead of directly within the popover.
* @see https://ariakit.org/components/select
* @example
* ```jsx {4}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectHeading>Fruits</SelectHeading>
*     <SelectList>
*       <SelectItem value="Apple" />
*       <SelectItem value="Orange" />
*     </SelectList>
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectHeading = forwardRef(function SelectHeading$1(props) {
	const htmlProps = useSelectHeading(props);
	return createElement(TagName$7, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-item.tsx
const TagName$6 = "div";
function isSelected(storeValue, itemValue) {
	if (itemValue == null) return;
	if (storeValue == null) return false;
	if (Array.isArray(storeValue)) {
		return storeValue.includes(itemValue);
	}
	return storeValue === itemValue;
}
/**
* Returns props to create a `SelectItem` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectItem({ store, value: "Apple" });
* <Role {...props} />
* ```
*/
const useSelectItem = createHook(function useSelectItem$1({ store, value, getItem: getItemProp, hideOnClick, setValueOnClick = value != null, preventScrollOnKeyDown = true, focusOnHover = true,...props }) {
	const context = useSelectScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "SelectItem must be wrapped in a SelectList or SelectPopover component.");
	const id = useId(props.id);
	const disabled = disabledFromProps(props);
	const { listElement, multiSelectable, selected, autoFocus } = useStoreStateObject(store, {
		listElement: "listElement",
		multiSelectable(state) {
			return Array.isArray(state.value);
		},
		selected(state) {
			return isSelected(state.value, value);
		},
		autoFocus(state) {
			if (value == null) return false;
			if (state.value == null) return false;
			if (state.activeId !== id && store?.item(state.activeId)) {
				return false;
			}
			if (Array.isArray(state.value)) {
				return state.value[state.value.length - 1] === value;
			}
			return state.value === value;
		}
	});
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			value: disabled ? undefined : value,
			children: value
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [
		disabled,
		value,
		getItemProp
	]);
	hideOnClick = hideOnClick ?? (value != null && !multiSelectable);
	const onClickProp = props.onClick;
	const setValueOnClickProp = useBooleanEvent(setValueOnClick);
	const hideOnClickProp = useBooleanEvent(hideOnClick);
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (isDownloading(event)) return;
		if (isOpeningInNewTab(event)) return;
		if (setValueOnClickProp(event) && value != null) {
			store?.setValue((prevValue) => {
				if (!Array.isArray(prevValue)) return value;
				if (prevValue.includes(value)) {
					return prevValue.filter((v) => v !== value);
				}
				return [...prevValue, value];
			});
		}
		if (hideOnClickProp(event)) {
			store?.hide();
		}
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(SelectItemCheckedContext.Provider, {
		value: selected ?? false,
		children: element
	}), [selected]);
	props = {
		id,
		role: getPopupItemRole(listElement),
		"aria-selected": selected,
		children: value,
		...props,
		autoFocus: props.autoFocus ?? autoFocus,
		onClick
	};
	props = useCompositeItem({
		store,
		getItem,
		preventScrollOnKeyDown,
		...props
	});
	const focusOnHoverProp = useBooleanEvent(focusOnHover);
	props = useCompositeHover({
		store,
		...props,
		focusOnHover(event) {
			if (!focusOnHoverProp(event)) return false;
			const state = store?.getState();
			return !!state?.open;
		}
	});
	return props;
});
/**
* Renders a select item inside a
* [`SelectList`](https://ariakit.org/reference/select-list) or
* [`SelectPopover`](https://ariakit.org/reference/select-popover).
*
* The `role` attribute will be automatically set on the item based on the
* list's own `role` attribute. For example, if the
* [`SelectPopover`](https://ariakit.org/reference/select-popover) component's
* `role` attribute is set to `listbox` (which is the default), the item `role`
* will be set to `option`.
*
* By default, the [`value`](https://ariakit.org/reference/select-item#value)
* prop will be rendered as the children, but this can be overriden if a custom
* children is provided.
* @see https://ariakit.org/components/select
* @example
* ```jsx {4-5}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectItem value="Apple" />
*     <SelectItem value="Orange" />
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectItem = memo(forwardRef(function SelectItem$1(props) {
	const htmlProps = useSelectItem(props);
	return createElement(TagName$6, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/select/select-item-check.tsx
const TagName$5 = "span";
/**
* Returns props to create a `SelectItemCheck` component. This hook must be used
* in a component that's wrapped with `SelectItem` or the `checked` prop must be
* explicitly passed to the component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const props = useSelectItemCheck({ checked: true });
* <Role {...props} />
* ```
*/
const useSelectItemCheck = createHook(function useSelectItemCheck$1({ store, checked,...props }) {
	const context = useContext(SelectItemCheckedContext);
	checked = checked ?? context;
	props = useCheckboxCheck({
		...props,
		checked
	});
	return props;
});
/**
* Renders a checkmark icon when the
* [`checked`](https://ariakit.org/reference/select-item-check#checked) prop is
* `true`. The icon can be overridden by providing a different one as children.
*
* When rendered inside a
* [`SelectItem`](https://ariakit.org/reference/select-item) component, the
* [`checked`](https://ariakit.org/reference/select-item-check#checked) prop is
* automatically derived from the context.
* @see https://ariakit.org/components/select
* @example
* ```jsx {5,9}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectItem value="Apple">
*       <SelectItemCheck />
*       Apple
*     </SelectItem>
*     <SelectItem value="Orange">
*       <SelectItemCheck />
*       Orange
*     </SelectItem>
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectItemCheck = forwardRef(function SelectItemCheck$1(props) {
	const htmlProps = useSelectItemCheck(props);
	return createElement(TagName$5, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-label.tsx
const TagName$4 = "div";
/**
* Returns props to create a `SelectLabel` component. Since it's not a native
* select element, we can't use the native label element. The `SelectLabel`
* component will move focus and click on the `Select` component when the user
* clicks on the label.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectLabel({ store });
* <Role {...props}>Favorite fruit</Role>
* <Select store={store} />
* ```
*/
const useSelectLabel = createHook(function useSelectLabel$1({ store,...props }) {
	const context = useSelectProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "SelectLabel must receive a `store` prop or be wrapped in a SelectProvider component.");
	const id = useId(props.id);
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		queueMicrotask(() => {
			const select = store?.getState().selectElement;
			select?.focus();
		});
	});
	props = {
		id,
		...props,
		ref: useMergeRefs(store.setLabelElement, props.ref),
		onClick,
		style: {
			cursor: "default",
			...props.style
		}
	};
	return removeUndefinedValues(props);
});
/**
* Renders a label for the [`Select`](https://ariakit.org/reference/select)
* component. Since it's not a native select element, we can't use the native
* label element. This component will move focus and click on the
* [`Select`](https://ariakit.org/reference/select) component when clicked.
* @see https://ariakit.org/components/select
* @example
* ```jsx {2}
* <SelectProvider defaultValue="Apple">
*   <SelectLabel>Favorite fruit</SelectLabel>
*   <Select />
*   <SelectPopover>
*     <SelectItem value="Apple" />
*     <SelectItem value="Orange" />
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectLabel = memo(forwardRef(function SelectLabel$1(props) {
	const htmlProps = useSelectLabel(props);
	return createElement(TagName$4, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/select/select-list.tsx
const TagName$3 = "div";
const SelectListContext = createContext(null);
/**
* Returns props to create a `SelectList` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectList({ store });
* <Role {...props}>
*   <SelectItem value="Apple" />
*   <SelectItem value="Orange" />
* </Role>
* ```
*/
const useSelectList = createHook(function useSelectList$1({ store, resetOnEscape = true, hideOnEnter = true, focusOnMove = true, composite, alwaysVisible,...props }) {
	const context = useSelectContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "SelectList must receive a `store` prop or be wrapped in a SelectProvider component.");
	const id = useId(props.id);
	const value = store.useState("value");
	const multiSelectable = Array.isArray(value);
	const [defaultValue$1, setDefaultValue] = useState(value);
	const mounted = store.useState("mounted");
	useEffect(() => {
		if (mounted) return;
		setDefaultValue(value);
	}, [mounted, value]);
	resetOnEscape = resetOnEscape && !multiSelectable;
	const onKeyDownProp = props.onKeyDown;
	const resetOnEscapeProp = useBooleanEvent(resetOnEscape);
	const hideOnEnterProp = useBooleanEvent(hideOnEnter);
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		if (event.key === "Escape" && resetOnEscapeProp(event)) {
			store?.setValue(defaultValue$1);
		}
		if (event.key === " " || event.key === "Enter") {
			if (isSelfTarget(event) && hideOnEnterProp(event)) {
				event.preventDefault();
				store?.hide();
			}
		}
	});
	const headingContext = useContext(SelectHeadingContext);
	const headingState = useState();
	const [headingId, setHeadingId] = headingContext || headingState;
	const headingContextValue = useMemo(() => [headingId, setHeadingId], [headingId]);
	const [childStore, setChildStore] = useState(null);
	const setStore = useContext(SelectListContext);
	useEffect(() => {
		if (!setStore) return;
		setStore(store);
		return () => setStore(null);
	}, [setStore, store]);
	props = useWrapElement(props, (element$1) => /* @__PURE__ */ jsx(SelectScopedContextProvider, {
		value: store,
		children: /* @__PURE__ */ jsx(SelectListContext.Provider, {
			value: setChildStore,
			children: /* @__PURE__ */ jsx(SelectHeadingContext.Provider, {
				value: headingContextValue,
				children: element$1
			})
		})
	}), [store, headingContextValue]);
	const hasCombobox = !!store.combobox;
	composite = composite ?? (!hasCombobox && childStore !== store);
	const [element, setElement] = useTransactionState(composite ? store.setListElement : null);
	const role = useAttribute(element, "role", props.role);
	const isCompositeRole = role === "listbox" || role === "menu" || role === "tree" || role === "grid";
	const ariaMultiSelectable = composite || isCompositeRole ? multiSelectable || undefined : undefined;
	const hidden = isHidden(mounted, props.hidden, alwaysVisible);
	const style = hidden ? {
		...props.style,
		display: "none"
	} : props.style;
	if (composite) {
		props = {
			role: "listbox",
			"aria-multiselectable": ariaMultiSelectable,
			...props
		};
	}
	const labelId = store.useState((state) => headingId || state.labelElement?.id);
	props = {
		id,
		"aria-labelledby": labelId,
		hidden,
		...props,
		ref: useMergeRefs(setElement, props.ref),
		style,
		onKeyDown
	};
	props = useComposite({
		store,
		...props,
		composite
	});
	props = useCompositeTypeahead({
		store,
		typeahead: !hasCombobox,
		...props
	});
	return props;
});
/**
* Renders a wrapper for
* [`SelectItem`](https://ariakit.org/reference/select-item) elements. This
* component may be rendered within a
* [`SelectPopover`](https://ariakit.org/reference/select-popover) component if
* there are other non-item elements inside the popover.
*
* The `aria-labelledby` prop is set to the
* [`Select`](https://ariakit.org/reference/select) element's `id` by default.
* @see https://ariakit.org/components/select
* @example
* ```jsx {5-8}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectDismiss />
*     <SelectList>
*       <SelectItem value="Apple" />
*       <SelectItem value="Orange" />
*     </SelectList>
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectList = forwardRef(function SelectList$1(props) {
	const htmlProps = useSelectList(props);
	return createElement(TagName$3, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-popover.tsx
const TagName$2 = "div";
/**
* Returns props to create a `SelectPopover` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectPopover({ store });
* <Role {...props}>
*   <SelectItem value="Apple" />
*   <SelectItem value="Orange" />
* </Role>
* ```
*/
const useSelectPopover = createHook(function useSelectPopover$1({ store, alwaysVisible,...props }) {
	const context = useSelectProviderContext();
	store = store || context;
	props = useSelectList({
		store,
		alwaysVisible,
		...props
	});
	props = usePopover({
		store,
		alwaysVisible,
		...props
	});
	return props;
});
/**
* Renders a select popover. The `role` attribute is set to `listbox` by
* default, but can be overriden by any other valid select popup role
* (`listbox`, `menu`, `tree`, `grid` or `dialog`).
* @see https://ariakit.org/components/select
* @example
* ```jsx {3-6}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectItem value="Apple" />
*     <SelectItem value="Orange" />
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectPopover = createDialogComponent(forwardRef(function SelectPopover$1(props) {
	const htmlProps = useSelectPopover(props);
	return createElement(TagName$2, htmlProps);
}), useSelectProviderContext);

//#endregion
//#region packages/ariakit-core/src/select/select-store.ts
function createSelectStore({ combobox,...props } = {}) {
	const store = mergeStore(props.store, omit(combobox, [
		"value",
		"items",
		"renderedItems",
		"baseElement",
		"arrowElement",
		"anchorElement",
		"contentElement",
		"popoverElement",
		"disclosureElement"
	]));
	throwOnConflictingProps(props, store);
	const syncState = store.getState();
	const composite = createCompositeStore({
		...props,
		store,
		virtualFocus: defaultValue(props.virtualFocus, syncState.virtualFocus, true),
		includesBaseElement: defaultValue(props.includesBaseElement, syncState.includesBaseElement, false),
		activeId: defaultValue(props.activeId, syncState.activeId, props.defaultActiveId, null),
		orientation: defaultValue(props.orientation, syncState.orientation, "vertical")
	});
	const popover = createPopoverStore({
		...props,
		store,
		placement: defaultValue(props.placement, syncState.placement, "bottom-start")
	});
	const initialValue = new String("");
	const initialState = {
		...composite.getState(),
		...popover.getState(),
		value: defaultValue(props.value, syncState.value, props.defaultValue, initialValue),
		setValueOnMove: defaultValue(props.setValueOnMove, syncState.setValueOnMove, false),
		labelElement: defaultValue(syncState.labelElement, null),
		selectElement: defaultValue(syncState.selectElement, null),
		listElement: defaultValue(syncState.listElement, null)
	};
	const select = createStore(initialState, composite, popover, store);
	setup(select, () => sync(select, ["value", "items"], (state) => {
		if (state.value !== initialValue) return;
		if (!state.items.length) return;
		const item = state.items.find((item$1) => !item$1.disabled && item$1.value != null);
		if (item?.value == null) return;
		select.setState("value", item.value);
	}));
	setup(select, () => sync(select, ["mounted"], (state) => {
		if (state.mounted) return;
		select.setState("activeId", initialState.activeId);
	}));
	setup(select, () => sync(select, [
		"mounted",
		"items",
		"value"
	], (state) => {
		if (combobox) return;
		if (state.mounted) return;
		const values = toArray(state.value);
		const lastValue = values[values.length - 1];
		if (lastValue == null) return;
		const item = state.items.find((item$1) => !item$1.disabled && item$1.value === lastValue);
		if (!item) return;
		select.setState("activeId", item.id);
	}));
	setup(select, () => batch(select, ["setValueOnMove", "moves"], (state) => {
		const { mounted, value, activeId } = select.getState();
		if (!state.setValueOnMove && mounted) return;
		if (Array.isArray(value)) return;
		if (!state.moves) return;
		if (!activeId) return;
		const item = composite.item(activeId);
		if (!item || item.disabled || item.value == null) return;
		select.setState("value", item.value);
	}));
	return {
		...composite,
		...popover,
		...select,
		combobox,
		setValue: (value) => select.setState("value", value),
		setLabelElement: (element) => select.setState("labelElement", element),
		setSelectElement: (element) => select.setState("selectElement", element),
		setListElement: (element) => select.setState("listElement", element)
	};
}

//#endregion
//#region packages/ariakit-react-core/src/select/select-store.ts
function useSelectStoreOptions(props) {
	const combobox = useComboboxProviderContext();
	props = {
		...props,
		combobox: props.combobox !== undefined ? props.combobox : combobox
	};
	return useCompositeStoreOptions(props);
}
function useSelectStoreProps(store, update, props) {
	useUpdateEffect(update, [props.combobox]);
	useStoreProps(store, props, "value", "setValue");
	useStoreProps(store, props, "setValueOnMove");
	return Object.assign(usePopoverStoreProps(useCompositeStoreProps(store, update, props), update, props), { combobox: props.combobox });
}
function useSelectStore(props = {}) {
	props = useSelectStoreOptions(props);
	const [store, update] = useStore(createSelectStore, props);
	return useSelectStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/select/select-provider.tsx
function SelectProvider(props = {}) {
	const store = useSelectStore(props);
	return /* @__PURE__ */ jsx(SelectContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
//#region packages/ariakit-react-core/src/select/select-row.tsx
const TagName$1 = "div";
/**
* Returns props to create a `SelectRow` component.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectRow({ store });
* <SelectPopover store={store}>
*   <Role {...props}>
*     <SelectItem value="Apple" />
*     <SelectItem value="Orange" />
*   </Role>
* </SelectPopover>
* ```
*/
const useSelectRow = createHook(function useSelectRow$1({ store,...props }) {
	const context = useSelectContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "SelectRow must be wrapped in a SelectList or SelectPopover component");
	const listElement = store.useState("listElement");
	const popupRole = getPopupRole(listElement);
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
* Renders a select row that allows two-dimensional arrow key navigation.
* [`SelectItem`](https://ariakit.org/reference/select-item) elements wrapped
* within this component will automatically receive a
* [`rowId`](https://ariakit.org/reference/select-item#rowid) prop.
* @see https://ariakit.org/components/select
* @example
* ```jsx {4-11}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectRow>
*       <SelectItem value="Apple" />
*       <SelectItem value="Orange" />
*     </SelectRow>
*     <SelectRow>
*       <SelectItem value="Banana" />
*       <SelectItem value="Grape" />
*     </SelectRow>
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectRow = forwardRef(function SelectRow$1(props) {
	const htmlProps = useSelectRow(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-separator.tsx
const TagName = "hr";
/**
* Returns props to create a `SelectSeparator` component.
* @deprecated Use `useSelectGroup` with CSS borders instead.
* @see https://ariakit.org/components/select
* @example
* ```jsx
* const store = useSelectStore();
* const props = useSelectSeparator({ store });
* <SelectPopover store={store}>
*   <SelectItem value="Item 1" />
*   <Role {...props} />
*   <SelectItem value="Item 2" />
*   <SelectItem value="Item 3" />
* </SelectPopover>
* ```
*/
const useSelectSeparator = createHook(function useSelectSeparator$1({ store,...props }) {
	const context = useSelectContext();
	store = store || context;
	props = useCompositeSeparator({
		store,
		...props
	});
	return props;
});
/**
* Renders a divider between
* [`SelectItem`](https://ariakit.org/reference/select-item) elements.
* @deprecated Use [`SelectGroup`](https://ariakit.org/reference/select-group)
* with CSS borders instead.
* @see https://ariakit.org/components/select
* @example
* ```jsx {5}
* <SelectProvider>
*   <Select />
*   <SelectPopover>
*     <SelectItem value="Item 1" />
*     <SelectSeparator />
*     <SelectItem value="Item 2" />
*     <SelectItem value="Item 3" />
*   </SelectPopover>
* </SelectProvider>
* ```
*/
const SelectSeparator = forwardRef(function SelectSeparator$1(props) {
	const htmlProps = useSelectSeparator(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/select/select-value.tsx
function SelectValue({ store, fallback, children } = {}) {
	const context = useSelectContext();
	store = store || context;
	const value = useStoreState(store, (state) => {
		if (!state?.value.length) return fallback;
		return state.value;
	});
	if (children) {
		return children(value || "");
	}
	return value;
}

//#endregion
export { Select, SelectArrow, SelectDismiss, SelectGroup, SelectGroupLabel, SelectHeading, SelectItem, SelectItemCheck, SelectLabel, SelectList, SelectPopover, SelectProvider, SelectRow, SelectSeparator, SelectValue, useSelectStore };