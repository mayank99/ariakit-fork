import { L as removeUndefinedValues, T as disabledFromProps, a as useId, i as useForceUpdate, l as useMergeRefs, p as useTagName, r as useEvent } from "./hooks-H6OmsigH.js";
import { a as memo, i as forwardRef, n as createHook, r as createStoreContext, t as createElement } from "./system-CMX9uFDP.js";
import { r as useStoreState } from "./store-DLqhzR2r.js";
import { f as CompositeScopedContextProvider, l as CompositeContextProvider } from "./utils-CJtcgbaU.js";
import { n as useCompositeItem } from "./composite-item-CjOOUl7v.js";
import { useEffect, useRef } from "react";

//#region packages/ariakit-react-core/src/radio/radio-context.tsx
const ctx = createStoreContext([CompositeContextProvider], [CompositeScopedContextProvider]);
/**
* Returns the radio store from the nearest radio container.
* @example
* function Radio() {
*   const store = useRadioContext();
*
*   if (!store) {
*     throw new Error("Radio must be wrapped in RadioProvider");
*   }
*
*   // Use the store...
* }
*/
const useRadioContext = ctx.useContext;
const useRadioScopedContext = ctx.useScopedContext;
const useRadioProviderContext = ctx.useProviderContext;
const RadioContextProvider = ctx.ContextProvider;
const RadioScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/radio/radio.tsx
const TagName = "input";
function getIsChecked(value, storeValue) {
	if (storeValue === undefined) return;
	if (value != null && storeValue != null) {
		return storeValue === value;
	}
	return !!storeValue;
}
function isNativeRadio(tagName, type) {
	return tagName === "input" && (!type || type === "radio");
}
/**
* Returns props to create a `Radio` component.
* @see https://ariakit.org/components/radio
* @example
* ```jsx
* const store = useRadioStore();
* const props = useRadio({ store, value: "Apple" });
* <RadioGroup store={store}>
*   <Role {...props} render={<input />} />
*   <Radio value="Orange" />
* </RadioGroup>
* ```
*/
const useRadio = createHook(function useRadio$1({ store, name, value, checked,...props }) {
	const context = useRadioContext();
	store = store || context;
	const id = useId(props.id);
	const ref = useRef(null);
	const isChecked = useStoreState(store, (state) => checked ?? getIsChecked(value, state?.value));
	useEffect(() => {
		if (!id) return;
		if (!isChecked) return;
		const isActiveItem = store?.getState().activeId === id;
		if (isActiveItem) return;
		store?.setActiveId(id);
	}, [
		store,
		isChecked,
		id
	]);
	const onChangeProp = props.onChange;
	const tagName = useTagName(ref, TagName);
	const nativeRadio = isNativeRadio(tagName, props.type);
	const disabled = disabledFromProps(props);
	const [propertyUpdated, schedulePropertyUpdate] = useForceUpdate();
	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		if (nativeRadio) return;
		if (isChecked !== undefined) {
			element.checked = isChecked;
		}
		if (name !== undefined) {
			element.name = name;
		}
		if (value !== undefined) {
			element.value = `${value}`;
		}
	}, [
		propertyUpdated,
		nativeRadio,
		isChecked,
		name,
		value
	]);
	const onChange = useEvent((event) => {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if (store?.getState().value === value) return;
		if (!nativeRadio) {
			event.currentTarget.checked = true;
			schedulePropertyUpdate();
		}
		onChangeProp?.(event);
		if (event.defaultPrevented) return;
		store?.setValue(value);
	});
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (nativeRadio) return;
		onChange(event);
	});
	const onFocusProp = props.onFocus;
	const onFocus = useEvent((event) => {
		onFocusProp?.(event);
		if (event.defaultPrevented) return;
		if (!nativeRadio) return;
		if (!store) return;
		const { moves, activeId } = store.getState();
		if (!moves) return;
		if (id && activeId !== id) return;
		onChange(event);
	});
	props = {
		id,
		role: !nativeRadio ? "radio" : undefined,
		type: nativeRadio ? "radio" : undefined,
		"aria-checked": isChecked,
		...props,
		ref: useMergeRefs(ref, props.ref),
		onChange,
		onClick,
		onFocus
	};
	props = useCompositeItem({
		store,
		clickOnEnter: !nativeRadio,
		...props
	});
	return removeUndefinedValues({
		name: nativeRadio ? name : undefined,
		value: nativeRadio ? value : undefined,
		checked: isChecked,
		...props
	});
});
/**
* Renders a radio button element that's typically wrapped in a
* [`RadioGroup`](https://ariakit.org/reference/radio-group) component.
* @see https://ariakit.org/components/radio
* @example
* ```jsx {3-4}
* <RadioProvider>
*   <RadioGroup>
*     <Radio value="Apple" />
*     <Radio value="Orange" />
*   </RadioGroup>
* </RadioProvider>
* ```
*/
const Radio = memo(forwardRef(function Radio$1(props) {
	const htmlProps = useRadio(props);
	return createElement(TagName, htmlProps);
}));

//#endregion
export { useRadioContext as a, RadioScopedContextProvider as i, useRadio as n, useRadioProviderContext as o, RadioContextProvider as r, Radio as t };