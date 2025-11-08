import { L as removeUndefinedValues, _ as useWrapElement, a as useId, k as invariant } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { d as CompositeRowContext, p as useCompositeContext } from "./utils-CJtcgbaU.js";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/composite/composite-row.tsx
const TagName = "div";
/**
* Returns props to create a `CompositeRow` component. Wrapping `CompositeItem`
* elements within rows will create a two-dimensional composite widget, such as
* a grid.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useCompositeRow({ store });
* <Composite store={store}>
*   <Role {...props}>
*     <CompositeItem>Item 1</CompositeItem>
*     <CompositeItem>Item 2</CompositeItem>
*     <CompositeItem>Item 3</CompositeItem>
*   </Role>
* </Composite>
* ```
*/
const useCompositeRow = createHook(function useCompositeRow$1({ store, "aria-setsize": ariaSetSize, "aria-posinset": ariaPosInSet,...props }) {
	const context = useCompositeContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "CompositeRow must be wrapped in a Composite component.");
	const id = useId(props.id);
	const baseElement = store.useState((state) => state.baseElement || undefined);
	const providerValue = useMemo(() => ({
		id,
		baseElement,
		ariaSetSize,
		ariaPosInSet
	}), [
		id,
		baseElement,
		ariaSetSize,
		ariaPosInSet
	]);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(CompositeRowContext.Provider, {
		value: providerValue,
		children: element
	}), [providerValue]);
	props = {
		id,
		...props
	};
	return removeUndefinedValues(props);
});
/**
* Renders a row element for composite items that allows two-dimensional arrow
* key navigation.
* [`CompositeItem`](https://ariakit.org/reference/composite-item) elements
* wrapped within this component will automatically receive a
* [`rowId`](https://ariakit.org/reference/composite-item#rowid) prop.
* @see https://ariakit.org/components/composite
* @example
* ```jsx {3-12}
* <CompositeProvider>
*   <Composite>
*     <CompositeRow>
*       <CompositeItem>Item 1.1</CompositeItem>
*       <CompositeItem>Item 1.2</CompositeItem>
*       <CompositeItem>Item 1.3</CompositeItem>
*     </CompositeRow>
*     <CompositeRow>
*       <CompositeItem>Item 2.1</CompositeItem>
*       <CompositeItem>Item 2.2</CompositeItem>
*       <CompositeItem>Item 2.3</CompositeItem>
*     </CompositeRow>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeRow = forwardRef(function CompositeRow$1(props) {
	const htmlProps = useCompositeRow(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useCompositeRow as n, CompositeRow as t };