import { L as removeUndefinedValues, a as useId, f as useSafeLayoutEffect } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { c as DialogDescriptionContext } from "./disclosure-store-DZ4wqMBt.js";
import { useContext } from "react";

//#region packages/ariakit-react-core/src/dialog/dialog-description.tsx
const TagName = "p";
/**
* Returns props to create a `DialogDescription` component. This hook must be
* used in a component that's wrapped with `Dialog` so the `aria-describedby`
* prop is properly set on the dialog element.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx
* // This component must be wrapped with Dialog
* const props = useDialogDescription();
* <Role {...props}>Description</Role>
* ```
*/
const useDialogDescription = createHook(function useDialogDescription$1({ store,...props }) {
	const setDescriptionId = useContext(DialogDescriptionContext);
	const id = useId(props.id);
	useSafeLayoutEffect(() => {
		setDescriptionId?.(id);
		return () => setDescriptionId?.(undefined);
	}, [setDescriptionId, id]);
	props = {
		id,
		...props
	};
	return removeUndefinedValues(props);
});
/**
* Renders a description in a dialog. This component must be wrapped with
* [`Dialog`](https://ariakit.org/reference/dialog) so the `aria-describedby`
* prop is properly set on the dialog element.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx {4}
* const [open, setOpen] = useState(false);
*
* <Dialog open={open} onClose={() => setOpen(false)}>
*   <DialogDescription>Description</DialogDescription>
* </Dialog>
* ```
*/
const DialogDescription = forwardRef(function DialogDescription$1(props) {
	const htmlProps = useDialogDescription(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useDialogDescription as n, DialogDescription as t };