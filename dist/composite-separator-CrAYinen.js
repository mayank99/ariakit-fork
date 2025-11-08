import { k as invariant } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { p as useCompositeContext } from "./utils-CJtcgbaU.js";
import { n as useSeparator } from "./separator-dKxh0iuB.js";

//#region packages/ariakit-react-core/src/composite/composite-separator.tsx
const TagName = "hr";
/**
* Returns props to create a `CompositeSeparator` component.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useCompositeSeparator({ store });
* <Composite store={store}>
*   <CompositeItem>Item 1</CompositeItem>
*   <Role {...props} />
*   <CompositeItem>Item 2</CompositeItem>
* </Composite>
* ```
*/
const useCompositeSeparator = createHook(function useCompositeSeparator$1({ store,...props }) {
	const context = useCompositeContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "CompositeSeparator must be wrapped in a Composite component.");
	const orientation = store.useState((state) => state.orientation === "horizontal" ? "vertical" : "horizontal");
	props = useSeparator({
		...props,
		orientation
	});
	return props;
});
/**
* Renders a divider between
* [`CompositeItem`](https://ariakit.org/reference/composite-item) elements.
* @see https://ariakit.org/components/composite
* @example
* ```jsx {4}
* <CompositeProvider>
*   <Composite>
*     <CompositeItem>Item 1</CompositeItem>
*     <CompositeSeparator />
*     <CompositeItem>Item 2</CompositeItem>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeSeparator = forwardRef(function CompositeSeparator$1(props) {
	const htmlProps = useCompositeSeparator(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useCompositeSeparator as n, CompositeSeparator as t };