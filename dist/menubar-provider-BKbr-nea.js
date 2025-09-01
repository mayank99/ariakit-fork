import { defaultValue, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, createStoreContext, forwardRef } from "./system-BBb67kU9.js";
import { createStore, useStore } from "./store-Ddr50htY.js";
import { createCompositeStore, useComposite, useCompositeStoreProps } from "./composite-store-Eq4wZZQ7.js";
import { CompositeContextProvider, CompositeScopedContextProvider } from "./utils-DgFD4-mq.js";
import { createContext } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/menubar/menubar-context.tsx
const menubar = createStoreContext([CompositeContextProvider], [CompositeScopedContextProvider]);
/**
* Returns the menubar store from the nearest menubar container.
* @example
* function Menubar() {
*   const store = useMenubarContext();
*
*   if (!store) {
*     throw new Error("Menubar must be wrapped in MenubarProvider");
*   }
*
*   // Use the store...
* }
*/
const useMenubarContext = menubar.useContext;
const useMenubarScopedContext = menubar.useScopedContext;
const useMenubarProviderContext = menubar.useProviderContext;
const MenubarContextProvider = menubar.ContextProvider;
const MenubarScopedContextProvider = menubar.ScopedContextProvider;
const MenuItemCheckedContext = createContext(undefined);

//#endregion
//#region packages/ariakit-core/src/menubar/menubar-store.ts
/**
* Creates a menubar store.
*/
function createMenubarStore(props = {}) {
	const syncState = props.store?.getState();
	const composite = createCompositeStore({
		...props,
		orientation: defaultValue(props.orientation, syncState?.orientation, "horizontal"),
		focusLoop: defaultValue(props.focusLoop, syncState?.focusLoop, true)
	});
	const initialState = { ...composite.getState() };
	const menubar$1 = createStore(initialState, composite, props.store);
	return {
		...composite,
		...menubar$1
	};
}

//#endregion
//#region packages/ariakit-react-core/src/menubar/menubar-store.ts
function useMenubarStoreProps(store, update, props) {
	return useCompositeStoreProps(store, update, props);
}
/**
* Creates a menubar store to control the state of
* [Menubar](https://ariakit.org/components/menubar) components.
* @see https://ariakit.org/components/menubar
* @example
* ```jsx
* const menu = useMenubarStore();
*
* <Menubar store={menu} />
* ```
*/
function useMenubarStore(props = {}) {
	const [store, update] = useStore(createMenubarStore, props);
	return useMenubarStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/menubar/menubar.tsx
const TagName = "div";
/**
* Returns props to create a `Menubar` component.
* @see https://ariakit.org/components/menubar
* @example
* ```jsx
* const store = useMenubarStore();
* const menubarProps = useMenubar({ store });
* const fileProps = useMenuItem({ store });
* const fileMenu = useMenuStore();
* <Role {...menubarProps}>
*   <MenuButton {...fileProps} store={fileMenu}>
*     File
*   </MenuButton>
*   <Menu store={fileMenu}>
*     <MenuItem>New File</MenuItem>
*     <MenuItem>New Window</MenuItem>
*   </Menu>
* </Role>
* ```
*/
const useMenubar = createHook(function useMenubar$1({ store: storeProp, composite = true, orientation: orientationProp, virtualFocus, focusLoop, rtl,...props }) {
	const context = useMenubarProviderContext();
	storeProp = storeProp || context;
	const store = useMenubarStore({
		store: storeProp,
		orientation: orientationProp,
		virtualFocus,
		focusLoop,
		rtl
	});
	const orientation = store.useState((state) => !composite || state.orientation === "both" ? undefined : state.orientation);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(MenubarScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	if (composite) {
		props = {
			role: "menubar",
			"aria-orientation": orientation,
			...props
		};
	}
	props = useComposite({
		store,
		composite,
		...props
	});
	return props;
});
/**
* Renders a menubar that may contain a group of
* [`MenuItem`](https://ariakit.org/reference/menu-item) elements that control
* other submenus.
* @see https://ariakit.org/components/menubar
* @example
* ```jsx
* <Menubar>
*   <MenuProvider>
*     <MenuItem render={<MenuButton />}>File</MenuItem>
*     <Menu>
*       <MenuItem>New File</MenuItem>
*       <MenuItem>New Window</MenuItem>
*     </Menu>
*   </MenuProvider>
*   <MenuProvider>
*     <MenuItem render={<MenuButton />}>Edit</MenuItem>
*     <Menu>
*       <MenuItem>Undo</MenuItem>
*       <MenuItem>Redo</MenuItem>
*     </Menu>
*   </MenuProvider>
* </Menubar>
* ```
*/
const Menubar = forwardRef(function Menubar$1(props) {
	const htmlProps = useMenubar(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menubar/menubar-provider.tsx
/**
* Provides a menubar store to [Menubar](https://ariakit.org/components/menubar)
* components.
* @see https://ariakit.org/components/menubar
* @example
* ```jsx
* <MenubarProvider>
*   <Menubar>
*     <MenuProvider>
*       <MenuItem render={<MenuButton />}>File</MenuItem>
*       <Menu>
*         <MenuItem>New File</MenuItem>
*         <MenuItem>New Window</MenuItem>
*       </Menu>
*     </MenuProvider>
*     <MenuProvider>
*       <MenuItem render={<MenuButton />}>Edit</MenuItem>
*       <Menu>
*         <MenuItem>Undo</MenuItem>
*         <MenuItem>Redo</MenuItem>
*       </Menu>
*     </MenuProvider>
*   </Menubar>
* </MenubarProvider>
* ```
*/
function MenubarProvider(props = {}) {
	const store = useMenubarStore(props);
	return /* @__PURE__ */ jsx(MenubarContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { Menubar, MenubarContextProvider, MenubarProvider, MenubarScopedContextProvider, useMenubar, useMenubarContext, useMenubarProviderContext, useMenubarScopedContext, useMenubarStore, useMenubarStoreProps };