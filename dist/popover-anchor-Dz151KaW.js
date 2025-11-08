import { l as useMergeRefs } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { i as usePopoverProviderContext } from "./popover-context-DedaNfGB.js";

//#region packages/ariakit-react-core/src/popover/popover-anchor.tsx
const TagName = "div";
/**
* Returns props to create a `PopoverAnchor` component.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* const store = usePopoverStore();
* const props = usePopoverAnchor({ store });
* <Role {...props}>Anchor</Role>
* <Popover store={store}>Popover</Popover>
* ```
*/
const usePopoverAnchor = createHook(function usePopoverAnchor$1({ store,...props }) {
	const context = usePopoverProviderContext();
	store = store || context;
	props = {
		...props,
		ref: useMergeRefs(store?.setAnchorElement, props.ref)
	};
	return props;
});
/**
* Renders an element that acts as the anchor for the popover. The
* [`Popover`](https://ariakit.org/reference/popover) component will be
* positioned in relation to this element.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {2}
* <PopoverProvider>
*   <PopoverAnchor>Anchor</PopoverAnchor>
*   <Popover>Popover</Popover>
* </PopoverProvider>
* ```
*/
const PopoverAnchor = forwardRef(function PopoverAnchor$1(props) {
	const htmlProps = usePopoverAnchor(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { usePopoverAnchor as n, PopoverAnchor as t };