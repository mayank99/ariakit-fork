import { chain, contains, defaultValue, invariant, isFalsyBooleanCallback, useEvent, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, createStoreContext, forwardRef } from "./system-BBb67kU9.js";
import { createStore, sync, useStore, useStoreProps } from "./store-Ddr50htY.js";
import { createDialogComponent } from "./dialog-DsMHKXPt.js";
import { HovercardContextProvider, HovercardScopedContextProvider, createHovercardStore, useHovercard, useHovercardAnchor, useHovercardStoreProps } from "./hovercard-store-9D3fw7RZ.js";
import { usePopoverArrow } from "./popover-arrow-C8H6zRta.js";
import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/tooltip/tooltip-context.tsx
const ctx = createStoreContext([HovercardContextProvider], [HovercardScopedContextProvider]);
/**
* Returns the tooltip store from the nearest tooltip container.
* @example
* function Tooltip() {
*   const store = useTooltipContext();
*
*   if (!store) {
*     throw new Error("Tooltip must be wrapped in TooltipProvider");
*   }
*
*   // Use the store...
* }
*/
const useTooltipContext = ctx.useContext;
const useTooltipScopedContext = ctx.useScopedContext;
const useTooltipProviderContext = ctx.useProviderContext;
const TooltipContextProvider = ctx.ContextProvider;
const TooltipScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/tooltip/tooltip.tsx
const TagName$2 = "div";
/**
* Returns props to create a `Tooltip` component.
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx
* const store = useToolTipStore();
* const props = useTooltip({ store });
* <TooltipAnchor store={store}>Anchor</TooltipAnchor>
* <Role {...props}>Tooltip</Role>
* ```
*/
const useTooltip = createHook(function useTooltip$1({ store, portal = true, gutter = 8, preserveTabOrder = false, hideOnHoverOutside = true, hideOnInteractOutside = true,...props }) {
	const context = useTooltipProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Tooltip must receive a `store` prop or be wrapped in a TooltipProvider component.");
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(TooltipScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	const role = store.useState((state) => state.type === "description" ? "tooltip" : "none");
	props = {
		role,
		...props
	};
	props = useHovercard({
		...props,
		store,
		portal,
		gutter,
		preserveTabOrder,
		hideOnHoverOutside(event) {
			if (isFalsyBooleanCallback(hideOnHoverOutside, event)) return false;
			const anchorElement = store?.getState().anchorElement;
			if (!anchorElement) return true;
			if ("focusVisible" in anchorElement.dataset) return false;
			return true;
		},
		hideOnInteractOutside: (event) => {
			if (isFalsyBooleanCallback(hideOnInteractOutside, event)) return false;
			const anchorElement = store?.getState().anchorElement;
			if (!anchorElement) return true;
			if (contains(anchorElement, event.target)) return false;
			return true;
		}
	});
	return props;
});
/**
* Renders a tooltip element that visually describes a
* [`TooltipAnchor`](https://ariakit.org/reference/tooltip-anchor) when it
* receives focus or is hovered.
*
* The tooltip is strictly for visual purposes. It's your responsibility to
* ensure the anchor element has an accessible name. See [Tooltip anchors must
* have accessible
* names](https://ariakit.org/components/tooltip#tooltip-anchors-must-have-accessible-names)
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx {3}
* <TooltipProvider>
*   <TooltipAnchor>Anchor</TooltipAnchor>
*   <Tooltip>Tooltip</Tooltip>
* </TooltipProvider>
* ```
*/
const Tooltip = createDialogComponent(forwardRef(function Tooltip$1(props) {
	const htmlProps = useTooltip(props);
	return createElement(TagName$2, htmlProps);
}), useTooltipProviderContext);

//#endregion
//#region packages/ariakit-react-core/src/tooltip/tooltip-anchor.tsx
const TagName$1 = "div";
const globalStore = createStore({ activeStore: null });
function createRemoveStoreCallback(store) {
	return () => {
		const { activeStore } = globalStore.getState();
		if (activeStore !== store) return;
		globalStore.setState("activeStore", null);
	};
}
/**
* Returns props to create a `TooltipAnchor` component.
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx
* const store = useToolTipStore();
* const props = useTooltipAnchor({ store });
* <Role {...props}>Anchor</Role>
* <Tooltip store={store}>Tooltip</Tooltip>
* ```
*/
const useTooltipAnchor = createHook(function useTooltipAnchor$1({ store, showOnHover = true,...props }) {
	const context = useTooltipProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "TooltipAnchor must receive a `store` prop or be wrapped in a TooltipProvider component.");
	const canShowOnHoverRef = useRef(false);
	useEffect(() => {
		return sync(store, ["mounted"], (state) => {
			if (state.mounted) return;
			canShowOnHoverRef.current = false;
		});
	}, [store]);
	useEffect(() => {
		if (!store) return;
		return chain(createRemoveStoreCallback(store), sync(store, ["mounted", "skipTimeout"], (state) => {
			if (!store) return;
			if (state.mounted) {
				const { activeStore } = globalStore.getState();
				if (activeStore !== store) {
					activeStore?.hide();
				}
				return globalStore.setState("activeStore", store);
			}
			const id = setTimeout(createRemoveStoreCallback(store), state.skipTimeout);
			return () => clearTimeout(id);
		}));
	}, [store]);
	const onMouseEnterProp = props.onMouseEnter;
	const onMouseEnter = useEvent((event) => {
		onMouseEnterProp?.(event);
		canShowOnHoverRef.current = true;
	});
	const onFocusVisibleProp = props.onFocusVisible;
	const onFocusVisible = useEvent((event) => {
		onFocusVisibleProp?.(event);
		if (event.defaultPrevented) return;
		store?.setAnchorElement(event.currentTarget);
		store?.show();
	});
	const onBlurProp = props.onBlur;
	const onBlur = useEvent((event) => {
		onBlurProp?.(event);
		if (event.defaultPrevented) return;
		const { activeStore } = globalStore.getState();
		canShowOnHoverRef.current = false;
		if (activeStore === store) {
			globalStore.setState("activeStore", null);
		}
	});
	const type = store.useState("type");
	const contentId = store.useState((state) => state.contentElement?.id);
	props = {
		"aria-labelledby": type === "label" ? contentId : undefined,
		...props,
		onMouseEnter,
		onFocusVisible,
		onBlur
	};
	props = useHovercardAnchor({
		store,
		showOnHover(event) {
			if (!canShowOnHoverRef.current) return false;
			if (isFalsyBooleanCallback(showOnHover, event)) return false;
			const { activeStore } = globalStore.getState();
			if (!activeStore) return true;
			store?.show();
			return false;
		},
		...props
	});
	return props;
});
/**
* Renders a reference element for a
* [`Tooltip`](https://ariakit.org/reference/tooltip), which is triggered by
* focusing or hovering over the anchor.
*
* The tooltip is strictly for visual purposes. It's your responsibility to
* ensure the anchor element has an accessible name. See [Tooltip anchors must
* have accessible
* names](https://ariakit.org/components/tooltip#tooltip-anchors-must-have-accessible-names)
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx {2}
* <TooltipProvider>
*   <TooltipAnchor>Anchor</TooltipAnchor>
*   <Tooltip>Tooltip</Tooltip>
* </TooltipProvider>
* ```
*/
const TooltipAnchor = forwardRef(function TooltipAnchor$1(props) {
	const htmlProps = useTooltipAnchor(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/tooltip/tooltip-arrow.tsx
const TagName = "div";
/**
* Returns props to create a `TooltipArrow` component.
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx
* const store = useToolTipStore();
* const props = useTooltipArrow({ store });
* <TooltipAnchor store={store}>Anchor</TooltipAnchor>
* <Tooltip store={store}>
*   <Role {...props} />
*   Tooltip
* </Tooltip>
* ```
*/
const useTooltipArrow = createHook(function useTooltipArrow$1({ store, size = 16,...props }) {
	const context = useTooltipContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "TooltipArrow must be wrapped in a Tooltip component.");
	props = usePopoverArrow({
		store,
		size,
		...props
	});
	return props;
});
/**
* Renders an arrow inside a [`Tooltip`](https://ariakit.org/reference/tooltip)
* pointing to the anchor element.
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx {4}
* <TooltipProvider>
*   <TooltipAnchor>Anchor</TooltipAnchor>
*   <Tooltip>
*     <TooltipArrow />
*     Tooltip
*   </Tooltip>
* </TooltipProvider>
* ```
*/
const TooltipArrow = forwardRef(function TooltipArrow$1(props) {
	const htmlProps = useTooltipArrow(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-core/src/tooltip/tooltip-store.ts
/**
* Creates a tooltip store.
*/
function createTooltipStore(props = {}) {
	if (process.env.NODE_ENV !== "production") {
		if (props.type === "label") {
			console.warn("The `type` option on the tooltip store is deprecated.", "Render a visually hidden label or use the `aria-label` or `aria-labelledby` attributes on the anchor element instead.", "See https://ariakit.org/components/tooltip#tooltip-anchors-must-have-accessible-names");
		}
	}
	const syncState = props.store?.getState();
	const hovercard = createHovercardStore({
		...props,
		placement: defaultValue(props.placement, syncState?.placement, "top"),
		hideTimeout: defaultValue(props.hideTimeout, syncState?.hideTimeout, 0)
	});
	const initialState = {
		...hovercard.getState(),
		type: defaultValue(props.type, syncState?.type, "description"),
		skipTimeout: defaultValue(props.skipTimeout, syncState?.skipTimeout, 300)
	};
	const tooltip = createStore(initialState, hovercard, props.store);
	return {
		...hovercard,
		...tooltip
	};
}

//#endregion
//#region packages/ariakit-react-core/src/tooltip/tooltip-store.ts
function useTooltipStoreProps(store, update, props) {
	useStoreProps(store, props, "type");
	useStoreProps(store, props, "skipTimeout");
	return useHovercardStoreProps(store, update, props);
}
/**
* Creates a tooltip store to control the state of
* [Tooltip](https://ariakit.org/components/tooltip) components.
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx
* const tooltip = useTooltipStore();
*
* <TooltipAnchor store={tooltip}>Anchor</TooltipAnchor>
* <Tooltip store={tooltip}>Tooltip</Tooltip>
* ```
*/
function useTooltipStore(props = {}) {
	const [store, update] = useStore(createTooltipStore, props);
	return useTooltipStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/tooltip/tooltip-provider.tsx
/**
* Provides a tooltip store to [Tooltip](https://ariakit.org/components/tooltip)
* components.
* @see https://ariakit.org/components/tooltip
* @example
* ```jsx
* <TooltipProvider timeout={250}>
*   <TooltipAnchor />
*   <Tooltip />
* </TooltipProvider>
* ```
*/
function TooltipProvider(props = {}) {
	const store = useTooltipStore(props);
	return /* @__PURE__ */ jsx(TooltipContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { Tooltip, TooltipAnchor, TooltipArrow, TooltipProvider, useTooltipContext, useTooltipStore };