import { contains, hasOwnProperty, invariant, removeUndefinedValues, useBooleanEvent, useEvent, useIsMouseMoving, useMergeRefs } from "./hooks-BNp9qiVx.js";
import { hasFocus, hasFocusWithin } from "./focus-fCQxuv3j.js";
import { createElement, createHook, forwardRef, memo } from "./system-BBb67kU9.js";
import { useCompositeContext } from "./utils-DgFD4-mq.js";
import { useGroup, useGroupLabel } from "./group-label-D1EhJCOe.js";
import { useCallback } from "react";

//#region packages/ariakit-react-core/src/composite/composite-group.tsx
const TagName$2 = "div";
/**
* Returns props to create a `CompositeGroup` component.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useCompositeGroup({ store });
* <Composite store={store}>
*   <Role {...props}>
*     <CompositeGroupLabel>Label</CompositeGroupLabel>
*     <CompositeItem>Item 1</CompositeItem>
*     <CompositeItem>Item 2</CompositeItem>
*   </Role>
* </Composite>
* ```
*/
const useCompositeGroup = createHook(function useCompositeGroup$1({ store,...props }) {
	props = useGroup(props);
	return props;
});
/**
* Renders a group element for composite items. The
* [`CompositeGroupLabel`](https://ariakit.org/reference/composite-group-label)
* component can be used inside this component so the `aria-labelledby` prop is
* properly set on the group element.
* @see https://ariakit.org/components/composite
* @example
* ```jsx {3-7}
* <CompositeProvider>
*   <Composite>
*     <CompositeGroup>
*       <CompositeGroupLabel>Label</CompositeGroupLabel>
*       <CompositeItem>Item 1</CompositeItem>
*       <CompositeItem>Item 2</CompositeItem>
*     </CompositeGroup>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeGroup = forwardRef(function CompositeGroup$1(props) {
	const htmlProps = useCompositeGroup(props);
	return createElement(TagName$2, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/composite/composite-group-label.tsx
const TagName$1 = "div";
/**
* Returns props to create a `CompositeGroupLabel` component. This hook must be
* used in a component that's wrapped with `CompositeGroup` so the
* `aria-labelledby` prop is properly set on the composite group element.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* // This component must be wrapped with CompositeGroup
* const props = useCompositeGroupLabel();
* <Role {...props}>Label</Role>
* ```
*/
const useCompositeGroupLabel = createHook(function useCompositeGroupLabel$1({ store,...props }) {
	props = useGroupLabel(props);
	return props;
});
/**
* Renders a label in a composite group. This component must be wrapped with
* [`CompositeGroup`](https://ariakit.org/reference/composite-group) so the
* `aria-labelledby` prop is properly set on the group element.
* @see https://ariakit.org/components/composite
* @example
* ```jsx {4}
* <CompositeProvider>
*   <Composite>
*     <CompositeGroup>
*       <CompositeGroupLabel>Label</CompositeGroupLabel>
*       <CompositeItem>Item 1</CompositeItem>
*       <CompositeItem>Item 2</CompositeItem>
*     </CompositeGroup>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeGroupLabel = forwardRef(function CompositeGroupLabel$1(props) {
	const htmlProps = useCompositeGroupLabel(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/composite/composite-hover.tsx
const TagName = "div";
function getMouseDestination(event) {
	const relatedTarget = event.relatedTarget;
	if (relatedTarget?.nodeType === Node.ELEMENT_NODE) {
		return relatedTarget;
	}
	return null;
}
function hoveringInside(event) {
	const nextElement = getMouseDestination(event);
	if (!nextElement) return false;
	return contains(event.currentTarget, nextElement);
}
const symbol = Symbol("composite-hover");
function movingToAnotherItem(event) {
	let dest = getMouseDestination(event);
	if (!dest) return false;
	do {
		if (hasOwnProperty(dest, symbol) && dest[symbol]) return true;
		dest = dest.parentElement;
	} while (dest);
	return false;
}
/**
* Returns props to create a `CompositeHover` component. The composite item that
* receives these props will get focused on mouse move and lose focus to the
* composite base element on mouse leave. This should be combined with the
* `CompositeItem` component, the `useCompositeItem` hook or any component/hook
* that uses them underneath.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useCompositeHover({ store });
* <CompositeItem store={store} {...props}>Item</CompositeItem>
* ```
*/
const useCompositeHover = createHook(function useCompositeHover$1({ store, focusOnHover = true, blurOnHoverEnd = !!focusOnHover,...props }) {
	const context = useCompositeContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "CompositeHover must be wrapped in a Composite component.");
	const isMouseMoving = useIsMouseMoving();
	const onMouseMoveProp = props.onMouseMove;
	const focusOnHoverProp = useBooleanEvent(focusOnHover);
	const onMouseMove = useEvent((event) => {
		onMouseMoveProp?.(event);
		if (event.defaultPrevented) return;
		if (!isMouseMoving()) return;
		if (!focusOnHoverProp(event)) return;
		if (!hasFocusWithin(event.currentTarget)) {
			const baseElement = store?.getState().baseElement;
			if (baseElement && !hasFocus(baseElement)) {
				baseElement.focus();
			}
		}
		store?.setActiveId(event.currentTarget.id);
	});
	const onMouseLeaveProp = props.onMouseLeave;
	const blurOnHoverEndProp = useBooleanEvent(blurOnHoverEnd);
	const onMouseLeave = useEvent((event) => {
		onMouseLeaveProp?.(event);
		if (event.defaultPrevented) return;
		if (!isMouseMoving()) return;
		if (hoveringInside(event)) return;
		if (movingToAnotherItem(event)) return;
		if (!focusOnHoverProp(event)) return;
		if (!blurOnHoverEndProp(event)) return;
		store?.setActiveId(null);
		store?.getState().baseElement?.focus();
	});
	const ref = useCallback((element) => {
		if (!element) return;
		element[symbol] = true;
	}, []);
	props = {
		...props,
		ref: useMergeRefs(ref, props.ref),
		onMouseMove,
		onMouseLeave
	};
	return removeUndefinedValues(props);
});
/**
* Renders an element in a composite widget that receives focus on mouse move
* and loses focus to the composite base element on mouse leave.
*
* This should be combined with the
* [`CompositeItem`](https://ariakit.org/reference/composite-item) component.
* The
* [`focusOnHover`](https://ariakit.org/reference/composite-hover#focusonhover)
* and
* [`blurOnHoverEnd`](https://ariakit.org/reference/composite-hover#bluronhoverend)
* props can be used to customize the behavior.
* @see https://ariakit.org/components/composite
* @example
* ```jsx {3-5}
* <CompositeProvider>
*   <Composite>
*     <CompositeHover render={<CompositeItem />}>
*       Item
*     </CompositeHover>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeHover = memo(forwardRef(function CompositeHover$1(props) {
	const htmlProps = useCompositeHover(props);
	return createElement(TagName, htmlProps);
}));

//#endregion
export { CompositeGroup, CompositeGroupLabel, CompositeHover, useCompositeGroup, useCompositeGroupLabel, useCompositeHover };