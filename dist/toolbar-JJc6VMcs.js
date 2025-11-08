import { G as isFocusEventOutside, J as isSelfTarget, L as removeUndefinedValues, _ as useWrapElement, ft as isTextField, l as useMergeRefs, r as useEvent, ut as isButton, w as defaultValue } from "./hooks-H6OmsigH.js";
import { f as restoreFocusIn, o as getFirstTabbableIn, t as disableFocusIn } from "./focus-BzfNYadt.js";
import { a as memo, i as forwardRef, n as createHook, r as createStoreContext, t as createElement } from "./system-CMX9uFDP.js";
import { r as useStoreState, t as useStore } from "./store-DLqhzR2r.js";
import { i as createCompositeStore, o as useComposite, r as useCompositeStoreProps } from "./composite-store-BRNkRGdm.js";
import { f as CompositeScopedContextProvider, l as CompositeContextProvider, p as useCompositeContext, s as selectTextField } from "./utils-CJtcgbaU.js";
import { n as useCompositeItem } from "./composite-item-CjOOUl7v.js";
import { n as useCompositeSeparator } from "./composite-separator-CrAYinen.js";
import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/toolbar/toolbar-context.tsx
const ctx = createStoreContext([CompositeContextProvider], [CompositeScopedContextProvider]);
/**
* Returns the toolbar store from the nearest toolbar container.
* @example
* function ToolbarItem() {
*   const store = useToolbarContext();
*
*   if (!store) {
*     throw new Error("ToolbarItem must be wrapped in ToolbarProvider");
*   }
*
*   // Use the store...
* }
*/
const useToolbarContext = ctx.useContext;
const useToolbarScopedContext = ctx.useScopedContext;
const useToolbarProviderContext = ctx.useProviderContext;
const ToolbarContextProvider = ctx.ContextProvider;
const ToolbarScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-core/src/toolbar/toolbar-store.ts
/**
* Creates a toolbar store.
*/
function createToolbarStore(props = {}) {
	const syncState = props.store?.getState();
	return createCompositeStore({
		...props,
		orientation: defaultValue(props.orientation, syncState?.orientation, "horizontal"),
		focusLoop: defaultValue(props.focusLoop, syncState?.focusLoop, true)
	});
}

//#endregion
//#region packages/ariakit-react-core/src/toolbar/toolbar-store.ts
function useToolbarStoreProps(store, update, props) {
	return useCompositeStoreProps(store, update, props);
}
/**
* Creates a toolbar store to control the state of
* [Toolbar](https://ariakit.org/components/toolbar) components.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx
* const toolbar = useToolbarStore();
*
* <Toolbar store={toolbar}>
*   <ToolbarItem>Item 1</ToolbarItem>
*   <ToolbarItem>Item 2</ToolbarItem>
*   <ToolbarItem>Item 3</ToolbarItem>
* </Toolbar>
* ```
*/
function useToolbarStore(props = {}) {
	const [store, update] = useStore(createToolbarStore, props);
	return useToolbarStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/toolbar/toolbar.tsx
const TagName$5 = "div";
/**
* Returns props to create a `Toolbar` component.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx
* const store = useToolbarStore();
* const props = useToolbar({ store });
* <Role {...props}>
*   <ToolbarItem>Item 1</ToolbarItem>
*   <ToolbarItem>Item 2</ToolbarItem>
* </Role>
* ```
*/
const useToolbar = createHook(function useToolbar$1({ store: storeProp, orientation: orientationProp, virtualFocus, focusLoop, rtl,...props }) {
	const context = useToolbarProviderContext();
	storeProp = storeProp || context;
	const store = useToolbarStore({
		store: storeProp,
		orientation: orientationProp,
		virtualFocus,
		focusLoop,
		rtl
	});
	const orientation = store.useState((state) => state.orientation === "both" ? undefined : state.orientation);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(ToolbarScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	props = {
		role: "toolbar",
		"aria-orientation": orientation,
		...props
	};
	props = useComposite({
		store,
		...props
	});
	return props;
});
/**
* Renders a toolbar element that groups interactive elements together.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx
* <Toolbar>
*   <ToolbarItem>Item 1</ToolbarItem>
*   <ToolbarItem>Item 2</ToolbarItem>
* </Toolbar>
* ```
*/
const Toolbar = forwardRef(function Toolbar$1(props) {
	const htmlProps = useToolbar(props);
	return createElement(TagName$5, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/composite/composite-container.tsx
const TagName$4 = "div";
function getFirstTabbable(container) {
	restoreFocusIn(container);
	const tabbable = getFirstTabbableIn(container);
	disableFocusIn(container);
	return tabbable;
}
/**
* Returns props to create a `CompositeContainer` component. This component
* renders interactive widgets inside composite items. This should be used in
* conjunction with the `CompositeItem` component, the `useCompositeItem` hook,
* or any other component/hook that uses `CompositeItem` underneath.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useCompositeContainer({ store });
* <Composite store={store}>
*   <CompositeItem {...props}>
*     <input type="text" />
*   </CompositeItem>
* </Composite>
* ```
*/
const useCompositeContainer = createHook(function useCompositeContainer$1({ store,...props }) {
	const context = useCompositeContext();
	store = store || context;
	const ref = useRef(null);
	const isOpenRef = useRef(false);
	const open = (collapseToEnd = false) => {
		const container = ref.current;
		if (!container) return;
		restoreFocusIn(container);
		const tabbable = getFirstTabbableIn(container);
		if (!tabbable) {
			disableFocusIn(container);
			return;
		}
		isOpenRef.current = true;
		queueMicrotask(() => {
			tabbable.focus();
			if (isTextField(tabbable) || tabbable.isContentEditable) {
				selectTextField(tabbable, collapseToEnd);
			}
		});
	};
	const close = () => {
		const container = ref.current;
		if (!container) return;
		isOpenRef.current = false;
		disableFocusIn(container);
	};
	const renderedItems = useStoreState(store, "renderedItems");
	useEffect(() => {
		const container = ref.current;
		if (!container) return;
		const isOpen = isOpenRef.current;
		if (!isOpen && renderedItems?.length) {
			disableFocusIn(container);
		}
	}, [renderedItems]);
	const onFocusProp = props.onFocus;
	const onFocus = useEvent((event) => {
		onFocusProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const isOpen = isOpenRef.current;
		if (isSelfTarget(event)) {
			isOpenRef.current = false;
			const { baseElement } = store.getState();
			const composite = baseElement;
			const selector = "[data-composite-container]";
			const containers = composite?.querySelectorAll(selector);
			if (containers) {
				for (const container of containers) {
					disableFocusIn(container);
				}
			}
		} else if (!isOpen) {
			isOpenRef.current = true;
			restoreFocusIn(event.currentTarget);
			store?.setState("moves", 0);
		}
	});
	const onBlurProp = props.onBlur;
	const onBlur = useEvent((event) => {
		onBlurProp?.(event);
		if (event.defaultPrevented) return;
		if (isFocusEventOutside(event)) {
			close();
		}
	});
	const onKeyDownProp = props.onKeyDown;
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		if (event.altKey) return;
		if (event.ctrlKey) return;
		if (event.metaKey) return;
		if (event.shiftKey) return;
		const container = event.currentTarget;
		if (isSelfTarget(event)) {
			if (event.key.length === 1 && event.key !== " ") {
				const tabbable = getFirstTabbable(container);
				if (!tabbable) return;
				if (isTextField(tabbable) || tabbable.isContentEditable) {
					event.stopPropagation();
					open();
				}
			} else if (event.key === "Delete" || event.key === "Backspace") {
				const tabbable = getFirstTabbable(container);
				if (!tabbable) return;
				if (isTextField(tabbable) || tabbable.isContentEditable) {
					open();
					const onInput = () => queueMicrotask(() => container.focus());
					container.addEventListener("input", onInput, { once: true });
				}
			}
		} else if (event.key === "Escape") {
			queueMicrotask(() => container.focus());
		} else if (event.key === "Enter") {
			const target = event.target;
			const isInput = target.tagName === "INPUT" && !isButton(target) || target.tagName === "TEXTAREA";
			if (isInput || target.isContentEditable) {
				event.preventDefault();
				queueMicrotask(() => container.focus());
			}
		}
	});
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (isSelfTarget(event) && !event.detail) {
			open(true);
		}
	});
	props = {
		"data-composite-container": "",
		...props,
		ref: useMergeRefs(ref, props.ref),
		onFocus,
		onBlur,
		onKeyDown,
		onClick
	};
	return removeUndefinedValues(props);
});
/**
* Renders a container for interactive widgets inside composite items. This
* should be used in conjunction with the
* [`CompositeItem`](https://ariakit.org/reference/composite-item) component or
* a component that uses
* [`CompositeItem`](https://ariakit.org/reference/composite-item) underneath.
* @see https://ariakit.org/components/composite
* @example
* ```jsx {3-5}
* <CompositeProvider>
*   <Composite>
*     <CompositeItem render={<CompositeContainer />}>
*       <input type="text" />
*     </CompositeItem>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeContainer = forwardRef(function CompositeContainer$1(props) {
	const htmlProps = useCompositeContainer(props);
	return createElement(TagName$4, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/toolbar/toolbar-item.tsx
const TagName$3 = "button";
/**
* Returns props to create a `ToolbarItem` component.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx
* const store = useToolbarStore();
* const props = useToolbarItem({ store });
* <Toolbar store={store}>
*   <Role {...props}>Item</Role>
* </Toolbar>
* ```
*/
const useToolbarItem = createHook(function useToolbarItem$1({ store,...props }) {
	const context = useToolbarContext();
	store = store || context;
	props = useCompositeItem({
		store,
		...props
	});
	return props;
});
/**
* Renders an interactive element inside a
* [`Toolbar`](https://ariakit.org/reference/toolbar).
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx {2}
* <Toolbar>
*   <ToolbarItem>Item</ToolbarItem>
* </Toolbar>
* ```
*/
const ToolbarItem = memo(forwardRef(function ToolbarItem$1(props) {
	const htmlProps = useToolbarItem(props);
	return createElement(TagName$3, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/toolbar/toolbar-container.tsx
const TagName$2 = "div";
/**
* Returns props to create a `ToolbarContainer` component.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx
* const store = useToolbarStore();
* const props = useToolbarContainer({ store });
* <Toolbar store={store}>
*   <Role {...props}>
*     <input type="text" />
*   </Role>
* </Toolbar>
* ```
*/
const useToolbarContainer = createHook(function useToolbarContainer$1({ store,...props }) {
	const context = useToolbarContext();
	store = store || context;
	props = useCompositeContainer({
		store,
		...props
	});
	props = useToolbarItem({
		store,
		...props
	});
	return props;
});
/**
* Renders a toolbar item that may contain interactive widgets inside.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx {2-4}
* <Toolbar>
*   <ToolbarContainer>
*     <input type="text" />
*   </ToolbarContainer>
* </Toolbar>
* ```
*/
const ToolbarContainer = memo(forwardRef(function ToolbarContainer$1(props) {
	const htmlProps = useToolbarContainer(props);
	return createElement(TagName$2, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/toolbar/toolbar-input.tsx
const TagName$1 = "input";
/**
* Returns props to create a `ToolbarInput` component.
* @see https://ariakit.org/components/toolbar
* @deprecated Use `useToolbarItem` instead.
* @example
* ```jsx
* const store = useToolbarStore();
* const props = useToolbarInput({ store });
* <Toolbar store={store}>
*   <Role {...props} />
* </Toolbar>
* ```
*/
const useToolbarInput = createHook(function useToolbarInput$1({ store,...props }) {
	const context = useToolbarContext();
	store = store || context;
	props = useToolbarItem({
		store,
		...props
	});
	return props;
});
/**
* Renders a text input as a toolbar item, maintaining arrow key navigation on
* the toolbar.
* @see https://ariakit.org/components/toolbar
* @deprecated Use `<ToolbarItem render={<input />}>` instead.
* @example
* ```jsx {2}
* <Toolbar>
*   <ToolbarInput />
* </Toolbar>
* ```
*/
const ToolbarInput = memo(forwardRef(function ToolbarInput$1(props) {
	const htmlProps = useToolbarInput(props);
	return createElement(TagName$1, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/toolbar/toolbar-provider.tsx
/**
* Provides a toolbar store to [Toolbar](https://ariakit.org/components/toolbar)
* components.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx
* <ToolbarProvider>
*   <Toolbar>
*     <ToolbarItem />
*     <ToolbarItem />
*     <ToolbarItem />
*   </Toolbar>
* </ToolbarProvider>
* ```
*/
function ToolbarProvider(props = {}) {
	const store = useToolbarStore(props);
	return /* @__PURE__ */ jsx(ToolbarContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
//#region packages/ariakit-react-core/src/toolbar/toolbar-separator.tsx
const TagName = "hr";
/**
* Returns props to create a `ToolbarSeparator` component.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx
* const store = useToolbarStore();
* const props = useToolbarSeparator({ store });
* <Toolbar store={store}>
*   <ToolbarItem>Item 1</ToolbarItem>
*   <Role {...props} />
*   <ToolbarItem>Item 2</ToolbarItem>
* </Toolbar>
* ```
*/
const useToolbarSeparator = createHook(function useToolbarSeparator$1({ store,...props }) {
	const context = useToolbarContext();
	store = store || context;
	props = useCompositeSeparator({
		store,
		...props
	});
	return props;
});
/**
* Renders a divider between
* [`ToolbarItem`](https://ariakit.org/reference/toolbar-item) elements.
* @see https://ariakit.org/components/toolbar
* @example
* ```jsx {3}
* <Toolbar>
*   <ToolbarItem>Item 1</ToolbarItem>
*   <ToolbarSeparator />
*   <ToolbarItem>Item 2</ToolbarItem>
* </Toolbar>
* ```
*/
const ToolbarSeparator = forwardRef(function ToolbarSeparator$1(props) {
	const htmlProps = useToolbarSeparator(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { ToolbarItem as a, useToolbarContext as c, ToolbarContainer as i, ToolbarProvider as n, Toolbar as o, ToolbarInput as r, useToolbarStore as s, ToolbarSeparator as t };