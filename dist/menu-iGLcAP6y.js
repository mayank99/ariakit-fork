import { A as isFalsyBooleanCallback, H as fireEvent, K as isOpeningInNewTab, R as shallowEqual, T as disabledFromProps, W as isDownloading, _ as useWrapElement, a as useId, at as getPopupRole, h as useUpdateEffect, it as getPopupItemRole, k as invariant, l as useMergeRefs, n as useBooleanEvent, o as useInitialValue, r as useEvent, rt as getDocument, w as defaultValue, x as applyState } from "./hooks-H6OmsigH.js";
import { u as hasFocusWithin } from "./focus-BzfNYadt.js";
import { a as memo, i as forwardRef, n as createHook, r as createStoreContext, t as createElement } from "./system-CMX9uFDP.js";
import { c as mergeStore, d as setup, l as omit, m as throwOnConflictingProps, n as useStoreProps, o as createStore, p as sync, r as useStoreState, t as useStore, u as pick } from "./store-DLqhzR2r.js";
import { r as useCheckbox, t as useCheckboxStore } from "./checkbox-store-GuuI_f-K.js";
import { n as useCheckboxCheck } from "./checkbox-check-Bey6W8Bf.js";
import { i as createCompositeStore, o as useComposite, r as useCompositeStoreProps } from "./composite-store-BRNkRGdm.js";
import { f as CompositeScopedContextProvider, l as CompositeContextProvider } from "./utils-CJtcgbaU.js";
import { a as isHidden } from "./disclosure-store-DZ4wqMBt.js";
import { s as useComboboxProviderContext } from "./combobox-context-DxAre050.js";
import { i as useCompositeGroupLabel, n as useCompositeHover, o as useCompositeGroup } from "./composite-hover-D-lAhR5x.js";
import { n as useCompositeItem } from "./composite-item-CjOOUl7v.js";
import { n as createDialogComponent } from "./dialog-BY8Na6S7.js";
import { t as Role } from "./role-darPqwKl.js";
import { n as useCompositeSeparator } from "./composite-separator-CrAYinen.js";
import { n as useCompositeTypeahead } from "./composite-typeahead-i9De049l.js";
import { n as useRadio } from "./radio-B22Rih5i.js";
import { a as useHovercardAnchor, c as HovercardContextProvider, l as HovercardScopedContextProvider, n as useHovercardStoreProps, r as createHovercardStore, s as useHovercard } from "./hovercard-store-cnp0072W.js";
import { n as usePopoverArrow } from "./popover-arrow-CW08xFU8.js";
import { i as useHovercardDismiss, n as useHovercardHeading, o as useHovercardDescription } from "./hovercard-heading-DdTSt04G.js";
import { a as useMenubarStoreProps, c as useMenubarContext, i as useMenubarStore, l as useMenubarProviderContext, o as MenubarContextProvider, r as useMenubar, s as MenubarScopedContextProvider, t as MenubarProvider, u as useMenubarScopedContext } from "./menubar-provider-Cq178q_b.js";
import { i as usePopoverDisclosure, n as usePopoverDisclosureArrow } from "./popover-disclosure-arrow-8uIvMfkp.js";
import { createContext, createRef, useContext, useEffect, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/menu/menu-context.tsx
const menu = createStoreContext([CompositeContextProvider, HovercardContextProvider], [CompositeScopedContextProvider, HovercardScopedContextProvider]);
/**
* Returns the menu store from the nearest menu container.
* @example
* function Menu() {
*   const store = useMenuContext();
*
*   if (!store) {
*     throw new Error("Menu must be wrapped in MenuProvider");
*   }
*
*   // Use the store...
* }
*/
const useMenuContext = menu.useContext;
const useMenuScopedContext = menu.useScopedContext;
const useMenuProviderContext = menu.useProviderContext;
const MenuContextProvider = menu.ContextProvider;
const MenuScopedContextProvider = menu.ScopedContextProvider;
/**
* Returns the menuBar store from the nearest menuBar container.
* @deprecated
* Use [`useMenubarContext`](https://ariakit.org/reference/use-menubar-context)
* instead.
* @example
* function MenuBar() {
*   const store = useMenuBarContext();
*
*   if (!store) {
*     throw new Error("MenuBar must be wrapped in MenuBarProvider");
*   }
*
*   // Use the store...
* }
*/
const useMenuBarContext = useMenubarContext;
const useMenuBarScopedContext = useMenubarScopedContext;
const useMenuBarProviderContext = useMenubarProviderContext;
const MenuBarContextProvider = MenubarContextProvider;
const MenuBarScopedContextProvider = MenubarScopedContextProvider;
const MenuItemCheckedContext = createContext(undefined);

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-list.tsx
const TagName$15 = "div";
function useAriaLabelledBy({ store,...props }) {
	const [id, setId] = useState(undefined);
	const label = props["aria-label"];
	const disclosureElement = useStoreState(store, "disclosureElement");
	const contentElement = useStoreState(store, "contentElement");
	useEffect(() => {
		const disclosure = disclosureElement;
		if (!disclosure) return;
		const menu$1 = contentElement;
		if (!menu$1) return;
		const menuLabel = label || menu$1.hasAttribute("aria-label");
		if (menuLabel) {
			setId(undefined);
		} else if (disclosure.id) {
			setId(disclosure.id);
		}
	}, [
		label,
		disclosureElement,
		contentElement
	]);
	return id;
}
/**
* Returns props to create a `MenuList` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenuList({ store });
* <MenuButton store={store}>Edit</MenuButton>
* <Role {...props}>
*   <MenuItem>Undo</MenuItem>
*   <MenuItem>Redo</MenuItem>
* </Role>
* ```
*/
const useMenuList = createHook(function useMenuList$1({ store, alwaysVisible, composite,...props }) {
	const context = useMenuProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "MenuList must receive a `store` prop or be wrapped in a MenuProvider component.");
	const parentMenu = store.parent;
	const parentMenubar = store.menubar;
	const hasParentMenu = !!parentMenu;
	const id = useId(props.id);
	const onKeyDownProp = props.onKeyDown;
	const dir = store.useState((state) => state.placement.split("-")[0]);
	const orientation = store.useState((state) => state.orientation === "both" ? undefined : state.orientation);
	const isHorizontal = orientation !== "vertical";
	const isMenubarHorizontal = useStoreState(parentMenubar, (state) => !!state && state.orientation !== "vertical");
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		if (hasParentMenu || parentMenubar && !isHorizontal) {
			const hideMap = {
				ArrowRight: () => dir === "left" && !isHorizontal,
				ArrowLeft: () => dir === "right" && !isHorizontal,
				ArrowUp: () => dir === "bottom" && isHorizontal,
				ArrowDown: () => dir === "top" && isHorizontal
			};
			const action = hideMap[event.key];
			if (action?.()) {
				event.stopPropagation();
				event.preventDefault();
				return store?.hide();
			}
		}
		if (parentMenubar) {
			const keyMap = {
				ArrowRight: () => {
					if (!isMenubarHorizontal) return;
					return parentMenubar.next();
				},
				ArrowLeft: () => {
					if (!isMenubarHorizontal) return;
					return parentMenubar.previous();
				},
				ArrowDown: () => {
					if (isMenubarHorizontal) return;
					return parentMenubar.next();
				},
				ArrowUp: () => {
					if (isMenubarHorizontal) return;
					return parentMenubar.previous();
				}
			};
			const action = keyMap[event.key];
			const id$1 = action?.();
			if (id$1 !== undefined) {
				event.stopPropagation();
				event.preventDefault();
				parentMenubar.move(id$1);
			}
		}
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(MenuScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	const ariaLabelledBy = useAriaLabelledBy({
		store,
		...props
	});
	const mounted = store.useState("mounted");
	const hidden = isHidden(mounted, props.hidden, alwaysVisible);
	const style = hidden ? {
		...props.style,
		display: "none"
	} : props.style;
	props = {
		id,
		"aria-labelledby": ariaLabelledBy,
		hidden,
		...props,
		ref: useMergeRefs(id ? store.setContentElement : null, props.ref),
		style,
		onKeyDown
	};
	const hasCombobox = !!store.combobox;
	composite = composite ?? !hasCombobox;
	if (composite) {
		props = {
			role: "menu",
			"aria-orientation": orientation,
			...props
		};
	}
	props = useComposite({
		store,
		composite,
		...props
	});
	props = useCompositeTypeahead({
		store,
		typeahead: !hasCombobox,
		...props
	});
	return props;
});
/**
* Renders a menu list element. This is the primitive component used by the
* [`Menu`](https://ariakit.org/reference/menu) component.
*
* Unlike [`Menu`](https://ariakit.org/reference/menu), this component doesn't
* render a popover and therefore doesn't automatically focus on items when
* opened.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {3-6}
* <MenuProvider>
*   <MenuButton>Edit</MenuButton>
*   <MenuList>
*     <MenuItem>Undo</MenuItem>
*     <MenuItem>Redo</MenuItem>
*   </MenuList>
* </MenuProvider>
* ```
*/
const MenuList = forwardRef(function MenuList$1(props) {
	const htmlProps = useMenuList(props);
	return createElement(TagName$15, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu.tsx
const TagName$14 = "div";
/**
* Returns props to create a `Menu` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenu({ store });
* <MenuButton store={store}>Edit</MenuButton>
* <Role {...props}>
*   <MenuItem>Undo</MenuItem>
*   <MenuItem>Redo</MenuItem>
* </Role>
* ```
*/
const useMenu = createHook(function useMenu$1({ store, modal: modalProp = false, portal = !!modalProp, hideOnEscape = true, autoFocusOnShow = true, hideOnHoverOutside, alwaysVisible,...props }) {
	const context = useMenuProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Menu must receive a `store` prop or be wrapped in a MenuProvider component.");
	const ref = useRef(null);
	const parentMenu = store.parent;
	const parentMenubar = store.menubar;
	const hasParentMenu = !!parentMenu;
	const parentIsMenubar = !!parentMenubar && !hasParentMenu;
	props = {
		...props,
		ref: useMergeRefs(ref, props.ref)
	};
	const { "aria-labelledby": ariaLabelledBy,...menuListProps } = useMenuList({
		store,
		alwaysVisible,
		...props
	});
	props = menuListProps;
	const [initialFocusRef, setInitialFocusRef] = useState();
	const autoFocusOnShowState = store.useState("autoFocusOnShow");
	const initialFocus = store.useState("initialFocus");
	const baseElement = store.useState("baseElement");
	const items = store.useState("renderedItems");
	useEffect(() => {
		let cleaning = false;
		setInitialFocusRef((prevInitialFocusRef) => {
			if (cleaning) return;
			if (!autoFocusOnShowState) return;
			if (prevInitialFocusRef?.current?.isConnected) return prevInitialFocusRef;
			const ref$1 = createRef();
			switch (initialFocus) {
				case "first":
					ref$1.current = items.find((item) => !item.disabled && item.element)?.element || null;
					break;
				case "last":
					ref$1.current = [...items].reverse().find((item) => !item.disabled && item.element)?.element || null;
					break;
				default: ref$1.current = baseElement;
			}
			return ref$1;
		});
		return () => {
			cleaning = true;
		};
	}, [
		store,
		autoFocusOnShowState,
		initialFocus,
		items,
		baseElement
	]);
	const modal = hasParentMenu ? false : modalProp;
	const mayAutoFocusOnShow = !!autoFocusOnShow;
	const canAutoFocusOnShow = !!initialFocusRef || !!props.initialFocus || !!modal;
	const contentElement = useStoreState(store.combobox || store, "contentElement");
	const parentContentElement = useStoreState(parentMenu?.combobox || parentMenu, "contentElement");
	const preserveTabOrderAnchor = useMemo(() => {
		if (!parentContentElement) return;
		if (!contentElement) return;
		const role = contentElement.getAttribute("role");
		const parentRole = parentContentElement.getAttribute("role");
		const parentIsMenuOrMenubar = parentRole === "menu" || parentRole === "menubar";
		if (parentIsMenuOrMenubar && role === "menu") return;
		return parentContentElement;
	}, [contentElement, parentContentElement]);
	if (preserveTabOrderAnchor !== undefined) {
		props = {
			preserveTabOrderAnchor,
			...props
		};
	}
	props = useHovercard({
		store,
		alwaysVisible,
		initialFocus: initialFocusRef,
		autoFocusOnShow: mayAutoFocusOnShow ? canAutoFocusOnShow && autoFocusOnShow : autoFocusOnShowState || !!modal,
		...props,
		hideOnEscape(event) {
			if (isFalsyBooleanCallback(hideOnEscape, event)) return false;
			store?.hideAll();
			return true;
		},
		hideOnHoverOutside(event) {
			const disclosureElement = store?.getState().disclosureElement;
			const getHideOnHoverOutside = () => {
				if (typeof hideOnHoverOutside === "function") {
					return hideOnHoverOutside(event);
				}
				if (hideOnHoverOutside != null) return hideOnHoverOutside;
				if (hasParentMenu) return true;
				if (!parentIsMenubar) return false;
				if (!disclosureElement) return true;
				if (hasFocusWithin(disclosureElement)) return false;
				return true;
			};
			if (!getHideOnHoverOutside()) return false;
			if (event.defaultPrevented) return true;
			if (!hasParentMenu) return true;
			if (!disclosureElement) return true;
			fireEvent(disclosureElement, "mouseout", event);
			if (!hasFocusWithin(disclosureElement)) return true;
			requestAnimationFrame(() => {
				if (hasFocusWithin(disclosureElement)) return;
				store?.hide();
			});
			return false;
		},
		modal,
		portal,
		backdrop: hasParentMenu ? false : props.backdrop
	});
	props = {
		"aria-labelledby": ariaLabelledBy,
		...props
	};
	return props;
});
/**
* Renders a dropdown menu element that's controlled by a
* [`MenuButton`](https://ariakit.org/reference/menu-button) component.
*
* This component uses the primitive
* [`MenuList`](https://ariakit.org/reference/menu-list) component under the
* hood. It renders a popover and automatically focuses on items when the menu
* is shown.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {3-6}
* <MenuProvider>
*   <MenuButton>Edit</MenuButton>
*   <Menu>
*     <MenuItem>Undo</MenuItem>
*     <MenuItem>Redo</MenuItem>
*   </Menu>
* </MenuProvider>
* ```
*/
const Menu = createDialogComponent(forwardRef(function Menu$1(props) {
	const htmlProps = useMenu(props);
	return createElement(TagName$14, htmlProps);
}), useMenuProviderContext);

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-arrow.tsx
const TagName$13 = "div";
/**
* Returns props to create a `MenuArrow` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenuArrow({ store });
* <MenuButton store={store}>Menu</MenuButton>
* <Menu store={store}>
*   <Role {...props} />
* </Menu>
* ```
*/
const useMenuArrow = createHook(function useMenuArrow$1({ store,...props }) {
	const context = useMenuContext();
	store = store || context;
	return usePopoverArrow({
		store,
		...props
	});
});
/**
* Renders an arrow element inside a
* [`Menu`](https://ariakit.org/reference/menu) component that points to its
* [`MenuButton`](https://ariakit.org/reference/menu-button).
* @see https://ariakit.org/components/menu
* @example
* ```jsx {4}
* <MenuProvider>
*   <MenuButton>Menu</MenuButton>
*   <Menu>
*     <MenuArrow />
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuArrow = forwardRef(function MenuArrow$1(props) {
	const htmlProps = useMenuArrow(props);
	return createElement(TagName$13, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-bar.tsx
const TagName$12 = "div";
/**
* Returns props to create a `MenuBar` component.
* @deprecated Use `useMenubar` instead.
* @example
* ```jsx
* const store = useMenuBarStore();
* const menuBarProps = useMenuBar({ store });
* const fileProps = useMenuItem({ store });
* const fileMenu = useMenuStore();
* <Role {...menuBarProps}>
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
const useMenuBar = createHook(function useMenuBar$1(props) {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production") {
			console.warn("MenuBar is deprecated. Use Menubar instead.", "See https://ariakit.org/reference/menubar");
		}
	}, []);
	return useMenubar(props);
});
/**
* Renders a menu bar that may contain a group of menu items that control other
* submenus.
* @deprecated
* Use [`Menubar`](https://ariakit.org/reference/menubar) instead.
* @example
* ```jsx
* <MenuBarProvider>
*   <MenuBar>
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
*   </MenuBar>
* </MenuBarProvider>
* ```
*/
const MenuBar = forwardRef(function MenuBar$1(props) {
	const htmlProps = useMenuBar(props);
	return createElement(TagName$12, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-bar-provider.tsx
/**
* Provides a menubar store to MenuBar components.
* @deprecated
* Use [`MenubarProvider`](https://ariakit.org/reference/menubar-provider)
* instead.
* @example
* ```jsx
* <MenuBarProvider>
*   <MenuBar>
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
*   </MenuBar>
* </MenuBarProvider>
* ```
*/
function MenuBarProvider(props = {}) {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production") {
			console.warn("MenuBarProvider is deprecated. Use MenubarProvider instead.", "See https://ariakit.org/reference/menubar-provider");
		}
	}, []);
	return /* @__PURE__ */ jsx(MenubarProvider, { ...props });
}

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-bar-store.ts
function useMenuBarStoreProps(store, update, props) {
	return useMenubarStoreProps(store, update, props);
}
/**
* Creates a menu bar store.
* @deprecated
* Use [`useMenubarStore`](https://ariakit.org/reference/use-menubar-store)
* instead.
* @example
* ```jsx
* const menu = useMenuBarStore();
* <MenuBar store={menu} />
* ```
*/
function useMenuBarStore(props = {}) {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production") {
			console.warn("useMenuBarStore is deprecated. Use useMenubarStore instead.", "See https://ariakit.org/reference/use-menubar-store");
		}
	}, []);
	return useMenubarStore(props);
}

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-button.tsx
const TagName$11 = "button";
function getInitialFocus(event, dir) {
	const keyMap = {
		ArrowDown: dir === "bottom" || dir === "top" ? "first" : false,
		ArrowUp: dir === "bottom" || dir === "top" ? "last" : false,
		ArrowRight: dir === "right" ? "first" : false,
		ArrowLeft: dir === "left" ? "first" : false
	};
	return keyMap[event.key];
}
function hasActiveItem(items, excludeElement) {
	return !!items?.some((item) => {
		if (!item.element) return false;
		if (item.element === excludeElement) return false;
		return item.element.getAttribute("aria-expanded") === "true";
	});
}
/**
* Returns props to create a `MenuButton` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenuButton({ store });
* <Role {...props}>Edit</Role>
* <Menu store={store}>
*   <MenuItem>Undo</MenuItem>
*   <MenuItem>Redo</MenuItem>
* </Menu>
* ```
*/
const useMenuButton = createHook(function useMenuButton$1({ store, focusable, accessibleWhenDisabled, showOnHover,...props }) {
	const context = useMenuProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "MenuButton must receive a `store` prop or be wrapped in a MenuProvider component.");
	const ref = useRef(null);
	const parentMenu = store.parent;
	const parentMenubar = store.menubar;
	const hasParentMenu = !!parentMenu;
	const parentIsMenubar = !!parentMenubar && !hasParentMenu;
	const disabled = disabledFromProps(props);
	const showMenu = () => {
		const trigger = ref.current;
		if (!trigger) return;
		store?.setDisclosureElement(trigger);
		store?.setAnchorElement(trigger);
		store?.show();
	};
	const onFocusProp = props.onFocus;
	const onFocus = useEvent((event) => {
		onFocusProp?.(event);
		if (disabled) return;
		if (event.defaultPrevented) return;
		store?.setAutoFocusOnShow(false);
		store?.setActiveId(null);
		if (!parentMenubar) return;
		if (!parentIsMenubar) return;
		const { items } = parentMenubar.getState();
		if (hasActiveItem(items, event.currentTarget)) {
			showMenu();
		}
	});
	const dir = useStoreState(store, (state) => state.placement.split("-")[0]);
	const onKeyDownProp = props.onKeyDown;
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (disabled) return;
		if (event.defaultPrevented) return;
		const initialFocus = getInitialFocus(event, dir);
		if (initialFocus) {
			event.preventDefault();
			showMenu();
			store?.setAutoFocusOnShow(true);
			store?.setInitialFocus(initialFocus);
		}
	});
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const isKeyboardClick = !event.detail;
		const { open } = store.getState();
		if (!open || isKeyboardClick) {
			if (!hasParentMenu || isKeyboardClick) {
				store.setAutoFocusOnShow(true);
			}
			store.setInitialFocus(isKeyboardClick ? "first" : "container");
		}
		if (hasParentMenu) {
			showMenu();
		}
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(MenuContextProvider, {
		value: store,
		children: element
	}), [store]);
	if (hasParentMenu) {
		props = {
			...props,
			render: /* @__PURE__ */ jsx(Role.div, { render: props.render })
		};
	}
	const id = useId(props.id);
	const parentContentElement = useStoreState(parentMenu?.combobox || parentMenu, "contentElement");
	const role = hasParentMenu || parentIsMenubar ? getPopupItemRole(parentContentElement, "menuitem") : undefined;
	const contentElement = store.useState("contentElement");
	props = {
		id,
		role,
		"aria-haspopup": getPopupRole(contentElement, "menu"),
		...props,
		ref: useMergeRefs(ref, props.ref),
		onFocus,
		onKeyDown,
		onClick
	};
	props = useHovercardAnchor({
		store,
		focusable,
		accessibleWhenDisabled,
		...props,
		showOnHover: (event) => {
			const getShowOnHover = () => {
				if (typeof showOnHover === "function") return showOnHover(event);
				if (showOnHover != null) return showOnHover;
				if (hasParentMenu) return true;
				if (!parentMenubar) return false;
				const { items } = parentMenubar.getState();
				return parentIsMenubar && hasActiveItem(items);
			};
			const canShowOnHover = getShowOnHover();
			if (!canShowOnHover) return false;
			const parent = parentIsMenubar ? parentMenubar : parentMenu;
			if (!parent) return true;
			parent.setActiveId(event.currentTarget.id);
			return true;
		}
	});
	props = usePopoverDisclosure({
		store,
		toggleOnClick: !hasParentMenu,
		focusable,
		accessibleWhenDisabled,
		...props
	});
	props = useCompositeTypeahead({
		store,
		typeahead: parentIsMenubar,
		...props
	});
	return props;
});
/**
* Renders a menu button that toggles the visibility of a
* [`Menu`](https://ariakit.org/reference/menu) component when clicked or when
* using arrow keys.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {2}
* <MenuProvider>
*   <MenuButton>Edit</MenuButton>
*   <Menu>
*     <MenuItem>Undo</MenuItem>
*     <MenuItem>Redo</MenuItem>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuButton = forwardRef(function MenuButton$1(props) {
	const htmlProps = useMenuButton(props);
	return createElement(TagName$11, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-button-arrow.tsx
const TagName$10 = "span";
/**
* Returns props to create a `MenuButtonArrow` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenuButtonArrow({ store });
* <MenuButton store={store}>
*   Edit
*   <Role {...props} />
* </MenuButton>
* <Menu store={store}>
*   <MenuItem>Undo</MenuItem>
*   <MenuItem>Redo</MenuItem>
* </Menu>
* ```
*/
const useMenuButtonArrow = createHook(function useMenuButtonArrow$1({ store,...props }) {
	const context = useMenuContext();
	store = store || context;
	props = usePopoverDisclosureArrow({
		store,
		...props
	});
	return props;
});
/**
* Displays an arrow within a
* [`MenuButton`](https://ariakit.org/reference/menu-button), pointing to the
* [`Menu`](https://ariakit.org/reference/menu) position. It's typically based
* on the [`placement`](https://ariakit.org/reference/menu-provider#placement)
* state from the menu store, but this can be overridden with the
* [`placement`](https://ariakit.org/reference/menu-button-arrow#placement)
* prop.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {4}
* <MenuProvider placement="bottom-start">
*   <MenuButton>
*     Edit
*     <MenuButtonArrow />
*   </MenuButton>
*   <Menu>
*     <MenuItem>Undo</MenuItem>
*     <MenuItem>Redo</MenuItem>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuButtonArrow = forwardRef(function MenuButtonArrow$1(props) {
	const htmlProps = useMenuButtonArrow(props);
	return createElement(TagName$10, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-description.tsx
const TagName$9 = "p";
/**
* Returns props to create a `MenuDescription` component. This hook must be used
* in a component that's wrapped with `Menu` so the `aria-describedby` prop is
* properly set on the menu element.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* // This component must be wrapped with Menu
* const props = useMenuDescription();
* <Role {...props}>Description</Role>
* ```
*/
const useMenuDescription = createHook(function useMenuDescription$1(props) {
	props = useHovercardDescription(props);
	return props;
});
/**
* Renders a description in a menu. This component must be wrapped with a
* [`Menu`](https://ariakit.org/reference/menu) component so the
* `aria-describedby` prop is properly set on the menu element.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {3}
* <MenuProvider>
*   <Menu>
*     <MenuDescription>Description</MenuDescription>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuDescription = forwardRef(function MenuDescription$1(props) {
	const htmlProps = useMenuDescription(props);
	return createElement(TagName$9, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-dismiss.tsx
const TagName$8 = "button";
/**
* Returns props to create a `MenuDismiss` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenuDismiss({ store });
* <Menu store={store}>
*   <Role {...props} />
* </Menu>
* ```
*/
const useMenuDismiss = createHook(function useMenuDismiss$1({ store,...props }) {
	const context = useMenuScopedContext();
	store = store || context;
	props = useHovercardDismiss({
		store,
		...props
	});
	return props;
});
/**
* Renders a button that hides a [`Menu`](https://ariakit.org/reference/menu)
* when clicked.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {3}
* <MenuProvider>
*   <Menu>
*     <MenuDismiss />
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuDismiss = forwardRef(function MenuDismiss$1(props) {
	const htmlProps = useMenuDismiss(props);
	return createElement(TagName$8, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-group.tsx
const TagName$7 = "div";
/**
* Returns props to create a `MenuGroup` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenuGroup({ store });
* <MenuButton store={store}>Recent Items</MenuButton>
* <Menu store={store}>
*   <Role {...props}>
*     <MenuGroupLabel>Applications</MenuGroupLabel>
*     <MenuItem>Google Chrome.app</MenuItem>
*     <MenuItem>Safari.app</MenuItem>
*   </Role>
* </Menu>
* ```
*/
const useMenuGroup = createHook(function useMenuGroup$1(props) {
	props = useCompositeGroup(props);
	return props;
});
/**
* Renders a group for [`MenuItem`](https://ariakit.org/reference/menu-item)
* elements. Optionally, a
* [`MenuGroupLabel`](https://ariakit.org/reference/menu-group-label) can be
* rendered as a child to provide a label for the group.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {4-8}
* <MenuProvider>
*   <MenuButton>Recent Items</MenuButton>
*   <Menu>
*     <MenuGroup>
*       <MenuGroupLabel>Applications</MenuGroupLabel>
*       <MenuItem>Google Chrome.app</MenuItem>
*       <MenuItem>Safari.app</MenuItem>
*     </MenuGroup>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuGroup = forwardRef(function MenuGroup$1(props) {
	const htmlProps = useMenuGroup(props);
	return createElement(TagName$7, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-group-label.tsx
const TagName$6 = "div";
/**
* Returns props to create a `MenuGroupLabel` component. This hook must be used
* in a component that's wrapped with `MenuGroup` so the `aria-labelledby` prop
* is properly set on the menu group element.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* // This component must be wrapped with MenuGroup
* const props = useMenuGroupLabel();
* <Role {...props}>Label</Role>
* ```
*/
const useMenuGroupLabel = createHook(function useMenuGroupLabel$1(props) {
	props = useCompositeGroupLabel(props);
	return props;
});
/**
* Renders a label in a menu group. This component should be wrapped with
* [`MenuGroup`](https://ariakit.org/reference/menu-group) so the
* `aria-labelledby` is correctly set on the group element.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {5}
* <MenuProvider>
*   <MenuButton>Recent Items</MenuButton>
*   <Menu>
*     <MenuGroup>
*       <MenuGroupLabel>Applications</MenuGroupLabel>
*       <MenuItem>Google Chrome.app</MenuItem>
*       <MenuItem>Safari.app</MenuItem>
*     </MenuGroup>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuGroupLabel = forwardRef(function MenuGroupLabel$1(props) {
	const htmlProps = useMenuGroupLabel(props);
	return createElement(TagName$6, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-heading.tsx
const TagName$5 = "h1";
/**
* Returns props to create a `MenuHeading` component. This hook must be used in
* a component that's wrapped with `Menu` so the `aria-labelledby` prop is
* properly set on the menu element.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* // This component must be wrapped with Menu
* const props = useMenuHeading();
* <Role {...props}>Heading</Role>
* ```
*/
const useMenuHeading = createHook(function useMenuHeading$1(props) {
	props = useHovercardHeading(props);
	return props;
});
/**
* Renders a heading in a menu. This component must be wrapped within
* [`Menu`](https://ariakit.org/reference/menu) so the `aria-labelledby` prop is
* properly set on the content element.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* <MenuProvider>
*   <Menu>
*     <MenuHeading>Heading</MenuHeading>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuHeading = forwardRef(function MenuHeading$1(props) {
	const htmlProps = useMenuHeading(props);
	return createElement(TagName$5, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-item.tsx
const TagName$4 = "div";
function menuHasFocus(baseElement, items, currentTarget) {
	if (!baseElement) return false;
	if (hasFocusWithin(baseElement)) return true;
	const expandedItem = items?.find((item) => {
		if (item.element === currentTarget) return false;
		return item.element?.getAttribute("aria-expanded") === "true";
	});
	const expandedMenuId = expandedItem?.element?.getAttribute("aria-controls");
	if (!expandedMenuId) return false;
	const doc = getDocument(baseElement);
	const expandedMenu = doc.getElementById(expandedMenuId);
	if (!expandedMenu) return false;
	if (hasFocusWithin(expandedMenu)) return true;
	return !!expandedMenu.querySelector("[role=menuitem][aria-expanded=true]");
}
/**
* Returns props to create a `MenuItem` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const undo = useMenuItem({ store });
* const redo = useMenuItem({ store });
* <MenuButton store={store}>Edit</MenuButton>
* <Menu store={store}>
*   <Role {...undo}>Undo</Role>
*   <Role {...redo}>Redo</Role>
* </Menu>
* ```
*/
const useMenuItem = createHook(function useMenuItem$1({ store, hideOnClick = true, preventScrollOnKeyDown = true, focusOnHover, blurOnHoverEnd,...props }) {
	const menuContext = useMenuScopedContext(true);
	const menubarContext = useMenubarScopedContext();
	store = store || menuContext || menubarContext;
	invariant(store, process.env.NODE_ENV !== "production" && "MenuItem must be wrapped in a MenuList, Menu or Menubar component");
	const onClickProp = props.onClick;
	const hideOnClickProp = useBooleanEvent(hideOnClick);
	const hideMenu = "hideAll" in store ? store.hideAll : undefined;
	const isWithinMenu = !!hideMenu;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (isDownloading(event)) return;
		if (isOpeningInNewTab(event)) return;
		if (!hideMenu) return;
		const popupType = event.currentTarget.getAttribute("aria-haspopup");
		if (popupType === "menu") return;
		if (!hideOnClickProp(event)) return;
		hideMenu();
	});
	const contentElement = useStoreState(store, (state) => "contentElement" in state ? state.contentElement : null);
	const role = getPopupItemRole(contentElement, "menuitem");
	props = {
		role,
		...props,
		onClick
	};
	props = useCompositeItem({
		store,
		preventScrollOnKeyDown,
		...props
	});
	props = useCompositeHover({
		store,
		...props,
		focusOnHover(event) {
			const getFocusOnHover = () => {
				if (typeof focusOnHover === "function") return focusOnHover(event);
				if (focusOnHover != null) return focusOnHover;
				return true;
			};
			if (!store) return false;
			if (!getFocusOnHover()) return false;
			const { baseElement, items } = store.getState();
			if (isWithinMenu) {
				if (event.currentTarget.hasAttribute("aria-expanded")) {
					event.currentTarget.focus();
				}
				return true;
			}
			if (menuHasFocus(baseElement, items, event.currentTarget)) {
				event.currentTarget.focus();
				return true;
			}
			return false;
		},
		blurOnHoverEnd(event) {
			if (typeof blurOnHoverEnd === "function") return blurOnHoverEnd(event);
			if (blurOnHoverEnd != null) return blurOnHoverEnd;
			return isWithinMenu;
		}
	});
	return props;
});
/**
* Renders a menu item inside
* [`MenuList`](https://ariakit.org/reference/menu-list) or
* [`Menu`](https://ariakit.org/reference/menu)
* components.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {4-5}
* <MenuProvider>
*   <MenuButton>Edit</MenuButton>
*   <Menu>
*     <MenuItem>Undo</MenuItem>
*     <MenuItem>Redo</MenuItem>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuItem = memo(forwardRef(function MenuItem$1(props) {
	const htmlProps = useMenuItem(props);
	return createElement(TagName$4, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-item-check.tsx
const TagName$3 = "span";
/**
* Returns props to create a `MenuItemCheck` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const props = useMenuItemCheck({ checked: true });
* <Role {...props} />
* ```
*/
const useMenuItemCheck = createHook(function useMenuItemCheck$1({ store, checked,...props }) {
	const context = useContext(MenuItemCheckedContext);
	checked = checked ?? context;
	props = useCheckboxCheck({
		...props,
		checked
	});
	return props;
});
/**
* Renders a checkmark icon when the
* [`checked`](https://ariakit.org/reference/menu-item-check#checked) prop is
* `true`. The icon can be overridden by providing a different one as children.
*
* When rendered inside
* [`MenuItemCheckbox`](https://ariakit.org/reference/menu-item-checkbox) or
* [`MenuItemRadio`](https://ariakit.org/reference/menu-item-radio) components,
* the [`checked`](https://ariakit.org/reference/menu-item-check#checked) prop
* is automatically derived from the context.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {5,9}
* <MenuProvider defaultValues={{ apple: true, orange: false }}>
*   <MenuButton>Fruits</MenuButton>
*   <Menu>
*     <MenuItemCheckbox name="apple">
*       <MenuItemCheck />
*       Apple
*     </MenuItemCheckbox>
*     <MenuItemCheckbox name="orange">
*       <MenuItemCheck />
*       Orange
*     </MenuItemCheckbox>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuItemCheck = forwardRef(function MenuItemCheck$1(props) {
	const htmlProps = useMenuItemCheck(props);
	return createElement(TagName$3, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-item-checkbox.tsx
const TagName$2 = "div";
function getPrimitiveValue(value) {
	if (Array.isArray(value)) {
		return value.toString();
	}
	return value;
}
function getValue$1(storeValue, value, checked) {
	if (value === undefined) {
		if (Array.isArray(storeValue)) return storeValue;
		return !!checked;
	}
	const primitiveValue = getPrimitiveValue(value);
	if (!Array.isArray(storeValue)) {
		if (checked) {
			return primitiveValue;
		}
		return storeValue === primitiveValue ? false : storeValue;
	}
	if (checked) {
		if (storeValue.includes(primitiveValue)) {
			return storeValue;
		}
		return [...storeValue, primitiveValue];
	}
	return storeValue.filter((v) => v !== primitiveValue);
}
/**
* Returns props to create a `MenuItemCheckbox` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore({ defaultValues: { apple: false } });
* const props = useMenuItemCheckbox({ store, name: "apple" });
* <MenuButton store={store}>Fruits</MenuButton>
* <Menu store={store}>
*   <Role {...props}>Apple</Role>
* </Menu>
* ```
*/
const useMenuItemCheckbox = createHook(function useMenuItemCheckbox$1({ store, name, value, checked, defaultChecked: defaultCheckedProp, hideOnClick = false,...props }) {
	const context = useMenuScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "MenuItemCheckbox must be wrapped in a MenuList or Menu component");
	const defaultChecked = useInitialValue(defaultCheckedProp);
	useEffect(() => {
		store?.setValue(name, (prevValue = []) => {
			if (!defaultChecked) return prevValue;
			return getValue$1(prevValue, value, true);
		});
	}, [
		store,
		name,
		value,
		defaultChecked
	]);
	useEffect(() => {
		if (checked === undefined) return;
		store?.setValue(name, (prevValue) => {
			return getValue$1(prevValue, value, checked);
		});
	}, [
		store,
		name,
		value,
		checked
	]);
	const checkboxStore = useCheckboxStore({
		value: store.useState((state) => state.values[name]),
		setValue(internalValue) {
			store?.setValue(name, () => {
				if (checked === undefined) return internalValue;
				const nextValue = getValue$1(internalValue, value, checked);
				if (!Array.isArray(nextValue)) return nextValue;
				if (!Array.isArray(internalValue)) return nextValue;
				if (shallowEqual(internalValue, nextValue)) return internalValue;
				return nextValue;
			});
		}
	});
	props = {
		role: "menuitemcheckbox",
		...props
	};
	props = useCheckbox({
		store: checkboxStore,
		name,
		value,
		checked,
		...props
	});
	props = useMenuItem({
		store,
		hideOnClick,
		...props
	});
	return props;
});
/**
* Renders a [`menuitemcheckbox`](https://w3c.github.io/aria/#menuitemcheckbox)
* element within a [`Menu`](https://ariakit.org/reference/menu) component. The
* [`name`](https://ariakit.org/reference/menu-item-checkbox#name) prop must be
* provided to identify the field in the
* [`values`](https://ariakit.org/reference/menu-provider#values) state.
*
* A [`MenuItemCheck`](https://ariakit.org/reference/menu-item-check) can be
* used to render a checkmark inside this component.
* @see https://ariakit.org/components/menu
* @example
* The [`name`](https://ariakit.org/reference/menu-item-checkbox#name) prop can
* refer to a single value in the state:
* ```jsx {4-7}
* <MenuProvider defaultValues={{ warnBeforeQuitting: true }}>
*   <MenuButton>Chrome</MenuButton>
*   <Menu>
*     <MenuItemCheckbox name="warnBeforeQuitting">
*       <MenuItemCheck />
*       Warn Before Quitting
*     </MenuItemCheckbox>
*   </Menu>
* </MenuProvider>
* ```
* @example
* Or it can refer to an array of values, in which case the
* [`value`](https://ariakit.org/reference/menu-item-checkbox#value) prop must
* be provided:
* ```jsx {4-9}
* <MenuProvider defaultValues={{ watching: ["issues"] }}>
*   <MenuButton>Watch</MenuButton>
*   <Menu>
*     <MenuItemCheckbox name="watching" value="issues">
*       Issues
*     </MenuItemCheckbox>
*     <MenuItemCheckbox name="watching" value="pull-requests">
*       Pull Requests
*     </MenuItemCheckbox>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuItemCheckbox = memo(forwardRef(function MenuItemCheckbox$1(props) {
	const htmlProps = useMenuItemCheckbox(props);
	return createElement(TagName$2, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-item-radio.tsx
const TagName$1 = "div";
function getValue(prevValue, value, checked) {
	if (checked === undefined) return prevValue;
	if (checked) return value;
	return prevValue;
}
/**
* Returns props to create a `MenuItemRadio` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore({ defaultValues: { fruit: "apple" } });
* const apple = useMenuItemRadio({ store, name: "fruit", value: "apple" });
* const orange = useMenuItemRadio({ store, name: "fruit", value: "orange" });
* <MenuButton store={store}>Fruit</MenuButton>
* <Menu store={store}>
*   <Role {...apple}>Apple</Role>
*   <Role {...orange}>Orange</Role>
* </Menu>
* ```
*/
const useMenuItemRadio = createHook(function useMenuItemRadio$1({ store, name, value, checked, onChange: onChangeProp, hideOnClick = false,...props }) {
	const context = useMenuScopedContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "MenuItemRadio must be wrapped in a MenuList or Menu component");
	const defaultChecked = useInitialValue(props.defaultChecked);
	useEffect(() => {
		store?.setValue(name, (prevValue = false) => {
			return getValue(prevValue, value, defaultChecked);
		});
	}, [
		store,
		name,
		value,
		defaultChecked
	]);
	useEffect(() => {
		if (checked === undefined) return;
		store?.setValue(name, (prevValue) => {
			return getValue(prevValue, value, checked);
		});
	}, [
		store,
		name,
		value,
		checked
	]);
	const isChecked = store.useState((state) => state.values[name] === value);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(MenuItemCheckedContext.Provider, {
		value: !!isChecked,
		children: element
	}), [isChecked]);
	props = {
		role: "menuitemradio",
		...props
	};
	props = useRadio({
		name,
		value,
		checked: isChecked,
		onChange(event) {
			onChangeProp?.(event);
			if (event.defaultPrevented) return;
			const element = event.currentTarget;
			store?.setValue(name, (prevValue) => {
				return getValue(prevValue, value, checked ?? element.checked);
			});
		},
		...props
	});
	props = useMenuItem({
		store,
		hideOnClick,
		...props
	});
	return props;
});
/**
* Renders a [`menuitemradio`](https://w3c.github.io/aria/#menuitemradio)
* element within a [`Menu`](https://ariakit.org/reference/menu) component. The
* [`name`](https://ariakit.org/reference/menu-item-radio#name) prop must be
* provided to identify the field in the
* [`values`](https://ariakit.org/reference/menu-provider#values) state.
*
* A [`MenuItemCheck`](https://ariakit.org/reference/menu-item-check) can be
* used to render a checkmark inside this component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {4-11}
* <MenuProvider defaultValues={{ profile: "john" }}>
*   <MenuButton>Profiles</MenuButton>
*   <Menu>
*     <MenuItemRadio name="profile" value="john">
*       <MenuItemCheck />
*       John Doe
*     </MenuItemRadio>
*     <MenuItemRadio name="profile" value="jane">
*       <MenuItemCheck />
*       Jane Doe
*     </MenuItemRadio>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuItemRadio = memo(forwardRef(function MenuItemRadio$1(props) {
	const htmlProps = useMenuItemRadio(props);
	return createElement(TagName$1, htmlProps);
}));

//#endregion
//#region packages/ariakit-core/src/menu/menu-store.ts
function createMenuStore({ combobox, parent, menubar,...props } = {}) {
	const parentIsMenubar = !!menubar && !parent;
	const store = mergeStore(props.store, pick(parent, ["values"]), omit(combobox, [
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
		orientation: defaultValue(props.orientation, syncState.orientation, "vertical")
	});
	const hovercard = createHovercardStore({
		...props,
		store,
		placement: defaultValue(props.placement, syncState.placement, "bottom-start"),
		timeout: defaultValue(props.timeout, syncState.timeout, parentIsMenubar ? 0 : 150),
		hideTimeout: defaultValue(props.hideTimeout, syncState.hideTimeout, 0)
	});
	const initialState = {
		...composite.getState(),
		...hovercard.getState(),
		initialFocus: defaultValue(syncState.initialFocus, "container"),
		values: defaultValue(props.values, syncState.values, props.defaultValues, {})
	};
	const menu$1 = createStore(initialState, composite, hovercard, store);
	setup(menu$1, () => sync(menu$1, ["mounted"], (state) => {
		if (state.mounted) return;
		menu$1.setState("activeId", null);
	}));
	setup(menu$1, () => sync(parent, ["orientation"], (state) => {
		menu$1.setState("placement", state.orientation === "vertical" ? "right-start" : "bottom-start");
	}));
	return {
		...composite,
		...hovercard,
		...menu$1,
		combobox,
		parent,
		menubar,
		hideAll: () => {
			hovercard.hide();
			parent?.hideAll();
		},
		setInitialFocus: (value) => menu$1.setState("initialFocus", value),
		setValues: (values) => menu$1.setState("values", values),
		setValue: (name, value) => {
			if (name === "__proto__") return;
			if (name === "constructor") return;
			if (Array.isArray(name)) return;
			menu$1.setState("values", (values) => {
				const prevValue = values[name];
				const nextValue = applyState(value, prevValue);
				if (nextValue === prevValue) return values;
				return {
					...values,
					[name]: nextValue !== undefined && nextValue
				};
			});
		}
	};
}

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-store.ts
function useMenuStoreProps(store, update, props) {
	useUpdateEffect(update, [
		props.combobox,
		props.parent,
		props.menubar
	]);
	useStoreProps(store, props, "values", "setValues");
	return Object.assign(useHovercardStoreProps(useCompositeStoreProps(store, update, props), update, props), {
		combobox: props.combobox,
		parent: props.parent,
		menubar: props.menubar
	});
}
function useMenuStore(props = {}) {
	const parent = useMenuContext();
	const menubar = useMenubarContext();
	const combobox = useComboboxProviderContext();
	props = {
		...props,
		parent: props.parent !== undefined ? props.parent : parent,
		menubar: props.menubar !== undefined ? props.menubar : menubar,
		combobox: props.combobox !== undefined ? props.combobox : combobox
	};
	const [store, update] = useStore(createMenuStore, props);
	return useMenuStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-provider.tsx
function MenuProvider(props = {}) {
	const store = useMenuStore(props);
	return /* @__PURE__ */ jsx(MenuContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
//#region packages/ariakit-react-core/src/menu/menu-separator.tsx
const TagName = "hr";
/**
* Returns props to create a `MenuSeparator` component.
* @see https://ariakit.org/components/menu
* @example
* ```jsx
* const store = useMenuStore();
* const props = useMenuSeparator({ store });
* <MenuButton store={store}>Edit</MenuButton>
* <Menu store={store}>
*   <MenuItem>Undo</MenuItem>
*   <MenuItem>Redo</MenuItem>
*   <Role {...props} />
*   <MenuItem>Cut</MenuItem>
* </Menu>
* ```
*/
const useMenuSeparator = createHook(function useMenuSeparator$1({ store,...props }) {
	const context = useMenuContext();
	store = store || context;
	props = useCompositeSeparator({
		store,
		...props
	});
	return props;
});
/**
* Renders a divider between
* [`MenuItem`](https://ariakit.org/reference/menu-item),
* [`MenuItemCheckbox`](https://ariakit.org/reference/menu-item-checkbox), and
* [`MenuItemRadio`](https://ariakit.org/reference/menu-item-radio) elements.
* @see https://ariakit.org/components/menu
* @example
* ```jsx {6}
* <MenuProvider>
*   <MenuButton>Edit</MenuButton>
*   <Menu>
*     <MenuItem>Undo</MenuItem>
*     <MenuItem>Redo</MenuItem>
*     <MenuSeparator />
*     <MenuItem>Cut</MenuItem>
*   </Menu>
* </MenuProvider>
* ```
*/
const MenuSeparator = forwardRef(function MenuSeparator$1(props) {
	const htmlProps = useMenuSeparator(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useMenuContext as S, MenuBar as _, MenuItemCheckbox as a, MenuList as b, MenuHeading as c, MenuDismiss as d, MenuDescription as f, MenuBarProvider as g, useMenuBarStore as h, MenuItemRadio as i, MenuGroupLabel as l, MenuButton as m, MenuProvider as n, MenuItemCheck as o, MenuButtonArrow as p, useMenuStore as r, MenuItem as s, MenuSeparator as t, MenuGroup as u, MenuArrow as v, useMenuBarContext as x, Menu as y };