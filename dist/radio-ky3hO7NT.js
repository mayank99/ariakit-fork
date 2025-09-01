import { defaultValue, invariant, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { createStore, useStore, useStoreProps } from "./store-Ddr50htY.js";
import { createCompositeStore, useComposite, useCompositeStoreProps } from "./composite-store-Eq4wZZQ7.js";
import { RadioContextProvider, RadioScopedContextProvider, useRadioProviderContext } from "./radio-DgJP70O3.js";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/radio/radio-group.tsx
const TagName = "div";
/**
* Returns props to create a `RadioGroup` component.
* @see https://ariakit.org/components/radio
* @example
* ```jsx
* const store = useRadioStore();
* const props = useRadioGroup({ store });
* <Role {...props}>
*   <Radio value="Apple" />
*   <Radio value="Orange" />
* </Role>
* ```
*/
const useRadioGroup = createHook(function useRadioGroup$1({ store,...props }) {
	const context = useRadioProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "RadioGroup must receive a `store` prop or be wrapped in a RadioProvider component.");
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(RadioScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	props = {
		role: "radiogroup",
		...props
	};
	props = useComposite({
		store,
		...props
	});
	return props;
});
/**
* Renders a [`radiogroup`](https://w3c.github.io/aria/#radiogroup) element that
* manages a group of [`Radio`](https://ariakit.org/reference/radio) elements.
* @see https://ariakit.org/components/radio
* @example
* ```jsx
* <RadioProvider>
*   <RadioGroup>
*     <Radio value="Apple" />
*     <Radio value="Orange" />
*   </RadioGroup>
* </RadioProvider>
* ```
*/
const RadioGroup = forwardRef(function RadioGroup$1(props) {
	const htmlProps = useRadioGroup(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-core/src/radio/radio-store.ts
/**
* Creates a radio store.
*/
function createRadioStore({ ...props } = {}) {
	const syncState = props.store?.getState();
	const composite = createCompositeStore({
		...props,
		focusLoop: defaultValue(props.focusLoop, syncState?.focusLoop, true)
	});
	const initialState = {
		...composite.getState(),
		value: defaultValue(props.value, syncState?.value, props.defaultValue, null)
	};
	const radio = createStore(initialState, composite, props.store);
	return {
		...composite,
		...radio,
		setValue: (value) => radio.setState("value", value)
	};
}

//#endregion
//#region packages/ariakit-react-core/src/radio/radio-store.ts
function useRadioStoreProps(store, update, props) {
	store = useCompositeStoreProps(store, update, props);
	useStoreProps(store, props, "value", "setValue");
	return store;
}
/**
* Creates a radio store to control the state of
* [Radio](https://ariakit.org/components/radio) components.
* @see https://ariakit.org/components/radio
* @example
* ```jsx
* const radio = useRadioStore();
*
* <RadioGroup store={radio}>
*   <Radio value="Apple" />
*   <Radio value="Orange" />
* </RadioGroup>
* ```
*/
function useRadioStore(props = {}) {
	const [store, update] = useStore(createRadioStore, props);
	return useRadioStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/radio/radio-provider.tsx
/**
* Provides a radio store to [Radio](https://ariakit.org/components/radio)
* components.
* @see https://ariakit.org/components/radio
* @example
* ```jsx
* <RadioProvider defaultValue="Apple">
*   <RadioGroup>
*     <Radio value="Apple" />
*     <Radio value="Orange" />
*   </RadioGroup>
* </RadioProvider>
* ```
*/
function RadioProvider(props = {}) {
	const store = useRadioStore(props);
	return /* @__PURE__ */ jsx(RadioContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { RadioGroup, RadioProvider, useRadioStore };