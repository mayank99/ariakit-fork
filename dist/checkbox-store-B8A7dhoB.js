import { defaultValue, disabledFromProps, removeUndefinedValues, useEvent, useForceUpdate, useMergeRefs, useTagName, useUpdateEffect, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, createStoreContext, forwardRef } from "./system-BBb67kU9.js";
import { useCommand } from "./command-DNCetXyu.js";
import { createStore, throwOnConflictingProps, useStore, useStoreProps, useStoreState } from "./store-Ddr50htY.js";
import { CheckboxCheckedContext } from "./checkbox-checked-context-10Fwef6F.js";
import { useEffect, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/checkbox/checkbox-context.tsx
const ctx = createStoreContext();
/**
* Returns the checkbox store from the nearest checkbox container.
* @example
* function Checkbox() {
*   const store = useCheckboxContext();
*
*   if (!store) {
*     throw new Error("Checkbox must be wrapped in CheckboxProvider");
*   }
*
*   // Use the store...
* }
*/
const useCheckboxContext = ctx.useContext;
const useCheckboxScopedContext = ctx.useScopedContext;
const useCheckboxProviderContext = ctx.useProviderContext;
const CheckboxContextProvider = ctx.ContextProvider;
const CheckboxScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/checkbox/checkbox.tsx
const TagName = "input";
function setMixed(element, mixed) {
	if (mixed) {
		element.indeterminate = true;
	} else if (element.indeterminate) {
		element.indeterminate = false;
	}
}
function isNativeCheckbox(tagName, type) {
	return tagName === "input" && (!type || type === "checkbox");
}
function getPrimitiveValue(value) {
	if (Array.isArray(value)) {
		return value.toString();
	}
	return value;
}
/**
* Returns props to create a `Checkbox` component. If the element is not a
* native checkbox, the hook will return additional props to make sure it's
* accessible.
* @see https://ariakit.org/components/checkbox
* @example
* ```jsx
* const props = useCheckbox({ render: <div /> });
* <Role {...props}>Accessible checkbox</Role>
* ```
*/
const useCheckbox = createHook(function useCheckbox$1({ store, name, value: valueProp, checked: checkedProp, defaultChecked,...props }) {
	const context = useCheckboxContext();
	store = store || context;
	const [_checked, setChecked] = useState(defaultChecked ?? false);
	const checked = useStoreState(store, (state) => {
		if (checkedProp !== undefined) return checkedProp;
		if (state?.value === undefined) return _checked;
		if (valueProp != null) {
			if (Array.isArray(state.value)) {
				const primitiveValue = getPrimitiveValue(valueProp);
				return state.value.includes(primitiveValue);
			}
			return state.value === valueProp;
		}
		if (Array.isArray(state.value)) return false;
		if (typeof state.value === "boolean") return state.value;
		return false;
	});
	const ref = useRef(null);
	const tagName = useTagName(ref, TagName);
	const nativeCheckbox = isNativeCheckbox(tagName, props.type);
	const mixed = checked ? checked === "mixed" : undefined;
	const isChecked = checked === "mixed" ? false : checked;
	const disabled = disabledFromProps(props);
	const [propertyUpdated, schedulePropertyUpdate] = useForceUpdate();
	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		setMixed(element, mixed);
		if (nativeCheckbox) return;
		element.checked = isChecked;
		if (name !== undefined) {
			element.name = name;
		}
		if (valueProp !== undefined) {
			element.value = `${valueProp}`;
		}
	}, [
		propertyUpdated,
		mixed,
		nativeCheckbox,
		isChecked,
		name,
		valueProp
	]);
	const onChangeProp = props.onChange;
	const onChange = useEvent((event) => {
		if (disabled) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}
		setMixed(event.currentTarget, mixed);
		if (!nativeCheckbox) {
			event.currentTarget.checked = !event.currentTarget.checked;
			schedulePropertyUpdate();
		}
		onChangeProp?.(event);
		if (event.defaultPrevented) return;
		const elementChecked = event.currentTarget.checked;
		setChecked(elementChecked);
		store?.setValue((prevValue) => {
			if (valueProp == null) return elementChecked;
			const primitiveValue = getPrimitiveValue(valueProp);
			if (!Array.isArray(prevValue)) {
				return prevValue === primitiveValue ? false : primitiveValue;
			}
			if (elementChecked) {
				if (prevValue.includes(primitiveValue)) {
					return prevValue;
				}
				return [...prevValue, primitiveValue];
			}
			return prevValue.filter((v) => v !== primitiveValue);
		});
	});
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (nativeCheckbox) return;
		onChange(event);
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(CheckboxCheckedContext.Provider, {
		value: isChecked,
		children: element
	}), [isChecked]);
	props = {
		role: !nativeCheckbox ? "checkbox" : undefined,
		type: nativeCheckbox ? "checkbox" : undefined,
		"aria-checked": checked,
		...props,
		ref: useMergeRefs(ref, props.ref),
		onChange,
		onClick
	};
	props = useCommand({
		clickOnEnter: !nativeCheckbox,
		...props
	});
	return removeUndefinedValues({
		name: nativeCheckbox ? name : undefined,
		value: nativeCheckbox ? valueProp : undefined,
		checked: isChecked,
		...props
	});
});
/**
* Renders an accessible checkbox element. If the underlying element is not a
* native checkbox, this component will pass additional attributes to make sure
* it's accessible.
* @see https://ariakit.org/components/checkbox
* @example
* ```jsx
* <Checkbox render={<div />}>Accessible checkbox</Checkbox>
* ```
*/
const Checkbox = forwardRef(function Checkbox$1(props) {
	const htmlProps = useCheckbox(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-core/src/checkbox/checkbox-store.ts
function createCheckboxStore(props = {}) {
	throwOnConflictingProps(props, props.store);
	const syncState = props.store?.getState();
	const initialState = { value: defaultValue(props.value, syncState?.value, props.defaultValue, false) };
	const checkbox = createStore(initialState, props.store);
	return {
		...checkbox,
		setValue: (value) => checkbox.setState("value", value)
	};
}

//#endregion
//#region packages/ariakit-react-core/src/checkbox/checkbox-store.ts
function useCheckboxStoreProps(store, update, props) {
	useUpdateEffect(update, [props.store]);
	useStoreProps(store, props, "value", "setValue");
	return store;
}
function useCheckboxStore(props = {}) {
	const [store, update] = useStore(createCheckboxStore, props);
	return useCheckboxStoreProps(store, update, props);
}

//#endregion
export { Checkbox, CheckboxContextProvider, useCheckbox, useCheckboxContext, useCheckboxStore };