import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { a as usePopoverScopedContext } from "./popover-context-DedaNfGB.js";
import { i as useDialogDismiss, n as useDialogHeading } from "./dialog-heading-Dt4e4iHY.js";

//#region packages/ariakit-react-core/src/popover/popover-dismiss.tsx
const TagName$1 = "button";
/**
* Returns props to create a `PopoverDismiss` component.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* const store = usePopoverStore();
* const props = usePopoverDismiss({ store });
* <Popover store={store}>
*   <Role {...props} />
* </Popover>
* ```
*/
const usePopoverDismiss = createHook(function usePopoverDismiss$1({ store,...props }) {
	const context = usePopoverScopedContext();
	store = store || context;
	props = useDialogDismiss({
		store,
		...props
	});
	return props;
});
/**
* Renders a button that hides a
* [`Popover`](https://ariakit.org/reference/popover) component when clicked.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {3}
* <PopoverProvider>
*   <Popover>
*     <PopoverDismiss />
*   </Popover>
* </PopoverProvider>
* ```
*/
const PopoverDismiss = forwardRef(function PopoverDismiss$1(props) {
	const htmlProps = usePopoverDismiss(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/popover/popover-heading.tsx
const TagName = "h1";
/**
* Returns props to create a `PopoverHeading` component. This hook must be used
* in a component that's wrapped with `Popover` so the `aria-labelledby` prop is
* properly set on the popover element.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* // This component must be wrapped with Popover
* const props = usePopoverHeading();
* <Role {...props}>Heading</Role>
* ```
*/
const usePopoverHeading = createHook(function usePopoverHeading$1(props) {
	props = useDialogHeading(props);
	return props;
});
/**
* Renders a heading in a popover. This component must be wrapped with
* [`Popover`](https://ariakit.org/reference/popover) so the `aria-labelledby`
* prop is properly set on the popover element.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {3}
* <PopoverProvider>
*   <Popover>
*     <PopoverHeading>Heading</PopoverHeading>
*   </Popover>
* </PopoverProvider>
* ```
*/
const PopoverHeading = forwardRef(function PopoverHeading$1(props) {
	const htmlProps = usePopoverHeading(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { usePopoverDismiss as i, usePopoverHeading as n, PopoverDismiss as r, PopoverHeading as t };