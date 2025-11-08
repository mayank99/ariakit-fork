import { S as chain, T as disabledFromProps, _ as useWrapElement, a as useId, h as useUpdateEffect, k as invariant, l as useMergeRefs, r as useEvent, w as defaultValue } from "./hooks-H6OmsigH.js";
import { i as getAllTabbableIn } from "./focus-BzfNYadt.js";
import { a as memo, i as forwardRef, n as createHook, r as createStoreContext, t as createElement } from "./system-CMX9uFDP.js";
import { r as useFocusable } from "./focusable-rBfookfw.js";
import { a as batch, c as mergeStore, d as setup, l as omit, n as useStoreProps, o as createStore, p as sync, r as useStoreState, t as useStore } from "./store-DLqhzR2r.js";
import { r as createCollectionStore } from "./collection-store-5DV4OeOi.js";
import { n as useCollectionItem } from "./collection-item-D-a6Dc-H.js";
import { i as createCompositeStore, o as useComposite, r as useCompositeStoreProps } from "./composite-store-BRNkRGdm.js";
import { f as CompositeScopedContextProvider, l as CompositeContextProvider } from "./utils-CJtcgbaU.js";
import { o as useDisclosureContent, t as useDisclosureStore } from "./disclosure-store-DZ4wqMBt.js";
import { o as useComboboxContext } from "./combobox-context-DxAre050.js";
import { n as useCompositeItem, t as CompositeItem } from "./composite-item-CjOOUl7v.js";
import { a as useSelectContext } from "./select-context-DPsvgwzo.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/tab/tab-context.tsx
const ctx = createStoreContext([CompositeContextProvider], [CompositeScopedContextProvider]);
/**
* Returns the tab store from the nearest tab container.
* @example
* function Tab() {
*   const store = useTabContext();
*
*   if (!store) {
*     throw new Error("Tab must be wrapped in TabProvider");
*   }
*
*   // Use the store...
* }
*/
const useTabContext = ctx.useContext;
const useTabScopedContext = ctx.useScopedContext;
const useTabProviderContext = ctx.useProviderContext;
const TabContextProvider = ctx.ContextProvider;
const TabScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/tab/tab.tsx
const TagName$2 = "button";
/**
* Returns props to create a `Tab` component.
* @see https://ariakit.org/components/tab
* @example
* ```jsx
* const store = useTabStore();
* const props = useTab({ store });
* <TabList store={store}>
*   <Role {...props}>Tab 1</Role>
* </TabList>
* <TabPanel store={store}>Panel 1</TabPanel>
* ```
*/
const useTab = createHook(function useTab$1({ store, getItem: getItemProp,...props }) {
	const context = useTabScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Tab must be wrapped in a TabList component.");
	const defaultId = useId();
	const id = props.id || defaultId;
	const dimmed = disabledFromProps(props);
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			dimmed
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [dimmed, getItemProp]);
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		store?.setSelectedId(id);
	});
	const panelId = store.panels.useState((state) => state.items.find((item) => item.tabId === id)?.id);
	const shouldRegisterItem = defaultId ? props.shouldRegisterItem : false;
	const isActive = store.useState((state) => !!id && state.activeId === id);
	const selected = store.useState((state) => !!id && state.selectedId === id);
	const hasActiveItem = store.useState((state) => !!store.item(state.activeId));
	const canRegisterComposedItem = isActive || selected && !hasActiveItem;
	const accessibleWhenDisabled = selected || (props.accessibleWhenDisabled ?? true);
	const isWithinVirtualFocusComposite = useStoreState(store.combobox || store.composite, "virtualFocus");
	if (isWithinVirtualFocusComposite) {
		props = {
			...props,
			tabIndex: -1
		};
	}
	props = {
		id,
		role: "tab",
		"aria-selected": selected,
		"aria-controls": panelId || undefined,
		...props,
		onClick
	};
	if (store.composite) {
		const defaultProps = {
			id,
			accessibleWhenDisabled,
			store: store.composite,
			shouldRegisterItem: canRegisterComposedItem && shouldRegisterItem,
			rowId: props.rowId,
			render: props.render
		};
		props = {
			...props,
			render: /* @__PURE__ */ jsx(CompositeItem, {
				...defaultProps,
				render: store.combobox && store.composite !== store.combobox ? /* @__PURE__ */ jsx(CompositeItem, {
					...defaultProps,
					store: store.combobox
				}) : defaultProps.render
			})
		};
	}
	props = useCompositeItem({
		store,
		...props,
		accessibleWhenDisabled,
		getItem,
		shouldRegisterItem
	});
	return props;
});
/**
* Renders a tab element inside a
* [`TabList`](https://ariakit.org/reference/tab-list) wrapper.
* @see https://ariakit.org/components/tab
* @example
* ```jsx {3,4}
* <TabProvider>
*   <TabList>
*     <Tab>Tab 1</Tab>
*     <Tab>Tab 2</Tab>
*   </TabList>
*   <TabPanel>Panel 1</TabPanel>
*   <TabPanel>Panel 2</TabPanel>
* </TabProvider>
* ```
*/
const Tab = memo(forwardRef(function Tab$1(props) {
	const htmlProps = useTab(props);
	return createElement(TagName$2, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/tab/tab-list.tsx
const TagName$1 = "div";
/**
* Returns props to create a `TabList` component.
* @see https://ariakit.org/components/tab
* @example
* ```jsx
* const store = useTabStore();
* const props = useTabList({ store });
* <Role {...props}>
*   <Tab>Tab 1</Tab>
*   <Tab>Tab 2</Tab>
* </Role>
* <TabPanel store={store}>Panel 1</TabPanel>
* <TabPanel store={store}>Panel 2</TabPanel>
* ```
*/
const useTabList = createHook(function useTabList$1({ store,...props }) {
	const context = useTabProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "TabList must receive a `store` prop or be wrapped in a TabProvider component.");
	const orientation = store.useState((state) => state.orientation === "both" ? undefined : state.orientation);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(TabScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	if (store.composite) {
		props = {
			focusable: false,
			...props
		};
	}
	props = {
		role: "tablist",
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
* Renders a composite tab list wrapper for
* [`Tab`](https://ariakit.org/reference/tab) elements.
* @see https://ariakit.org/components/tab
* @example
* ```jsx {2-5}
* <TabProvider>
*   <TabList>
*     <Tab>Tab 1</Tab>
*     <Tab>Tab 2</Tab>
*   </TabList>
*   <TabPanel>Panel 1</TabPanel>
*   <TabPanel>Panel 2</TabPanel>
* </TabProvider>
* ```
*/
const TabList = forwardRef(function TabList$1(props) {
	const htmlProps = useTabList(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/tab/tab-panel.tsx
const TagName = "div";
/**
* Returns props to create a `TabPanel` component.
* @see https://ariakit.org/components/tab
* @example
* ```jsx
* const store = useTabStore();
* const props = useTabPanel({ store });
* <TabList store={store}>
*   <Tab>Tab 1</Tab>
* </TabList>
* <Role {...props}>Panel 1</Role>
* ```
*/
const useTabPanel = createHook(function useTabPanel$1({ store, unmountOnHide, tabId: tabIdProp, getItem: getItemProp, scrollRestoration, scrollElement,...props }) {
	const context = useTabProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "TabPanel must receive a `store` prop or be wrapped in a TabProvider component.");
	const ref = useRef(null);
	const id = useId(props.id);
	const tabId = useStoreState(store.panels, () => tabIdProp || store?.panels.item(id)?.tabId);
	const open = useStoreState(store, (state) => !!tabId && state.selectedId === tabId);
	const disclosure = useDisclosureStore({ open });
	const mounted = useStoreState(disclosure, "mounted");
	const scrollPositionRef = useRef(new Map());
	const getScrollElement = useEvent(() => {
		const panelElement = ref.current;
		if (!panelElement) return null;
		if (!scrollElement) return panelElement;
		if (typeof scrollElement === "function") {
			return scrollElement(panelElement);
		}
		if ("current" in scrollElement) {
			return scrollElement.current;
		}
		return scrollElement;
	});
	useEffect(() => {
		if (!scrollRestoration) return;
		if (!mounted) return;
		const element = getScrollElement();
		if (!element) return;
		if (scrollRestoration === "reset") {
			element.scroll(0, 0);
			return;
		}
		if (!tabId) return;
		const position = scrollPositionRef.current.get(tabId);
		element.scroll(position?.x ?? 0, position?.y ?? 0);
		const onScroll = () => {
			scrollPositionRef.current.set(tabId, {
				x: element.scrollLeft,
				y: element.scrollTop
			});
		};
		element.addEventListener("scroll", onScroll);
		return () => {
			element.removeEventListener("scroll", onScroll);
		};
	}, [
		scrollRestoration,
		mounted,
		tabId,
		getScrollElement,
		store
	]);
	const [hasTabbableChildren, setHasTabbableChildren] = useState(false);
	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		const tabbable = getAllTabbableIn(element);
		setHasTabbableChildren(!!tabbable.length);
	}, []);
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			id: id || item.id,
			tabId: tabIdProp
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [
		id,
		tabIdProp,
		getItemProp
	]);
	const onKeyDownProp = props.onKeyDown;
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		if (!store?.composite) return;
		const keyMap = {
			ArrowLeft: store.previous,
			ArrowRight: store.next,
			Home: store.first,
			End: store.last
		};
		const action = keyMap[event.key];
		if (!action) return;
		const { selectedId } = store.getState();
		const nextId = action({ activeId: selectedId });
		if (!nextId) return;
		event.preventDefault();
		store.move(nextId);
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(TabScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	props = {
		id,
		role: "tabpanel",
		"aria-labelledby": tabId || undefined,
		...props,
		children: unmountOnHide && !mounted ? null : props.children,
		ref: useMergeRefs(ref, props.ref),
		onKeyDown
	};
	props = useFocusable({
		focusable: !store.composite && !hasTabbableChildren,
		...props
	});
	props = useDisclosureContent({
		store: disclosure,
		...props
	});
	props = useCollectionItem({
		store: store.panels,
		...props,
		getItem
	});
	return props;
});
/**
* Renders a tab panel element that's controlled by a
* [`Tab`](https://ariakit.org/reference/tab) component.
*
* If the [`tabId`](https://ariakit.org/reference/tab-panel#tabid) prop isn't
* provided, the tab panel will automatically associate with a
* [`Tab`](https://ariakit.org/reference/tab) based on its position in the DOM.
* Alternatively, you can render a single tab panel with a dynamic
* [`tabId`](https://ariakit.org/reference/tab-panel#tabid) value pointing to
* the selected tab.
* @see https://ariakit.org/components/tab
* @example
* ```jsx {6,7}
* <TabProvider>
*   <TabList>
*     <Tab>Tab 1</Tab>
*     <Tab>Tab 2</Tab>
*   </TabList>
*   <TabPanel>Panel 1</TabPanel>
*   <TabPanel>Panel 2</TabPanel>
* </TabProvider>
* ```
*/
const TabPanel = forwardRef(function TabPanel$1(props) {
	const htmlProps = useTabPanel(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-core/src/tab/tab-store.ts
function createTabStore({ composite: parentComposite, combobox,...props } = {}) {
	const independentKeys = [
		"items",
		"renderedItems",
		"moves",
		"orientation",
		"virtualFocus",
		"includesBaseElement",
		"baseElement",
		"focusLoop",
		"focusShift",
		"focusWrap"
	];
	const store = mergeStore(props.store, omit(parentComposite, independentKeys), omit(combobox, independentKeys));
	const syncState = store?.getState();
	const composite = createCompositeStore({
		...props,
		store,
		includesBaseElement: defaultValue(props.includesBaseElement, syncState?.includesBaseElement, false),
		orientation: defaultValue(props.orientation, syncState?.orientation, "horizontal"),
		focusLoop: defaultValue(props.focusLoop, syncState?.focusLoop, true)
	});
	const panels = createCollectionStore();
	const initialState = {
		...composite.getState(),
		selectedId: defaultValue(props.selectedId, syncState?.selectedId, props.defaultSelectedId),
		selectOnMove: defaultValue(props.selectOnMove, syncState?.selectOnMove, true)
	};
	const tab = createStore(initialState, composite, store);
	setup(tab, () => sync(tab, ["moves"], () => {
		const { activeId, selectOnMove } = tab.getState();
		if (!selectOnMove) return;
		if (!activeId) return;
		const tabItem = composite.item(activeId);
		if (!tabItem) return;
		if (tabItem.dimmed) return;
		if (tabItem.disabled) return;
		tab.setState("selectedId", tabItem.id);
	}));
	let syncActiveId = true;
	setup(tab, () => batch(tab, ["selectedId"], (state, prev) => {
		if (!syncActiveId) {
			syncActiveId = true;
			return;
		}
		if (parentComposite && state.selectedId === prev.selectedId) return;
		tab.setState("activeId", state.selectedId);
	}));
	setup(tab, () => sync(tab, ["selectedId", "renderedItems"], (state) => {
		if (state.selectedId !== undefined) return;
		const { activeId, renderedItems } = tab.getState();
		const tabItem = composite.item(activeId);
		if (tabItem && !tabItem.disabled && !tabItem.dimmed) {
			tab.setState("selectedId", tabItem.id);
		} else {
			const tabItem$1 = renderedItems.find((item) => !item.disabled && !item.dimmed);
			tab.setState("selectedId", tabItem$1?.id);
		}
	}));
	setup(tab, () => sync(tab, ["renderedItems"], (state) => {
		const tabs = state.renderedItems;
		if (!tabs.length) return;
		return sync(panels, ["renderedItems"], (state$1) => {
			const items = state$1.renderedItems;
			const hasOrphanPanels = items.some((panel) => !panel.tabId);
			if (!hasOrphanPanels) return;
			items.forEach((panel, i) => {
				if (panel.tabId) return;
				const tabItem = tabs[i];
				if (!tabItem) return;
				panels.renderItem({
					...panel,
					tabId: tabItem.id
				});
			});
		});
	}));
	let selectedIdFromSelectedValue = null;
	setup(tab, () => {
		const backupSelectedId = () => {
			selectedIdFromSelectedValue = tab.getState().selectedId;
		};
		const restoreSelectedId = () => {
			syncActiveId = false;
			tab.setState("selectedId", selectedIdFromSelectedValue);
		};
		if (parentComposite && "setSelectElement" in parentComposite) {
			return chain(sync(parentComposite, ["value"], backupSelectedId), sync(parentComposite, ["mounted"], restoreSelectedId));
		}
		if (!combobox) return;
		return chain(sync(combobox, ["selectedValue"], backupSelectedId), sync(combobox, ["mounted"], restoreSelectedId));
	});
	return {
		...composite,
		...tab,
		panels,
		setSelectedId: (id) => tab.setState("selectedId", id),
		select: (id) => {
			tab.setState("selectedId", id);
			composite.move(id);
		}
	};
}

//#endregion
//#region packages/ariakit-react-core/src/tab/tab-store.ts
function useTabStoreProps(store, update, props) {
	useUpdateEffect(update, [props.composite, props.combobox]);
	store = useCompositeStoreProps(store, update, props);
	useStoreProps(store, props, "selectedId", "setSelectedId");
	useStoreProps(store, props, "selectOnMove");
	const [panels, updatePanels] = useStore(() => store.panels, {});
	useUpdateEffect(updatePanels, [store, updatePanels]);
	return Object.assign(useMemo(() => ({
		...store,
		panels
	}), [store, panels]), {
		composite: props.composite,
		combobox: props.combobox
	});
}
/**
* Creates a tab store to control the state of
* [Tab](https://ariakit.org/components/tab) components.
* @see https://ariakit.org/components/tab
* @example
* ```jsx
* const tab = useTabStore();
*
* <TabList store={tab}>
*   <Tab>Tab 1</Tab>
*   <Tab>Tab 2</Tab>
* </TabList>
* <TabPanel store={tab}>Panel 1</TabPanel>
* <TabPanel store={tab}>Panel 2</TabPanel>
* ```
*/
function useTabStore(props = {}) {
	const combobox = useComboboxContext();
	const composite = useSelectContext() || combobox;
	props = {
		...props,
		composite: props.composite !== undefined ? props.composite : composite,
		combobox: props.combobox !== undefined ? props.combobox : combobox
	};
	const [store, update] = useStore(createTabStore, props);
	return useTabStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/tab/tab-provider.tsx
/**
* Provides a tab store to [Tab](https://ariakit.org/components/tab) components.
* @see https://ariakit.org/components/tab
* @example
* ```jsx
* <TabProvider>
*   <TabList>
*     <Tab>For You</Tab>
*     <Tab>Following</Tab>
*   </TabList>
*   <TabPanel>For You</TabPanel>
*   <TabPanel>Following</TabPanel>
* </TabProvider>
* ```
*/
function TabProvider(props = {}) {
	const store = useTabStore(props);
	return /* @__PURE__ */ jsx(TabContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { Tab as a, TabList as i, useTabStore as n, useTabContext as o, TabPanel as r, TabProvider as t };