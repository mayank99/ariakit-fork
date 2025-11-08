import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { n as useDialogDescription } from "./dialog-description-BL4T9zfV.js";

//#region packages/ariakit-react-core/src/popover/popover-description.tsx
const TagName = "p";
/**
* Returns props to create a `PopoverDescription` component. This hook must be
* used in a component that's wrapped with `Popover` so the `aria-describedby`
* prop is properly set on the popover element.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* // This component must be wrapped with Popover
* const props = usePopoverDescription();
* <Role {...props}>Description</Role>
* ```
*/
const usePopoverDescription = createHook(function usePopoverDescription$1(props) {
	props = useDialogDescription(props);
	return props;
});
/**
* Renders a description in a popover. This component must be wrapped with
* [`Popover`](https://ariakit.org/reference/popover) so the `aria-describedby`
* prop is properly set on the popover element.
* @see https://ariakit.org/components/popover
* @example
* ```jsx {3}
* <PopoverProvider>
*   <Popover>
*     <PopoverDescription>Description</PopoverDescription>
*   </Popover>
* </PopoverProvider>
* ```
*/
const PopoverDescription = forwardRef(function PopoverDescription$1(props) {
	const htmlProps = usePopoverDescription(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { usePopoverDescription as n, PopoverDescription as t };