import { useEvent, useId, useSafeLayoutEffect } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { useButton } from "./button-COHRpVB7.js";
import { DialogHeadingContext, useDialogScopedContext } from "./disclosure-store-Czymr2mJ.js";
import { useHeading } from "./heading-DFT70ODV.js";
import { useContext, useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/dialog/dialog-dismiss.tsx
const TagName$1 = "button";
/**
* Returns props to create a `DialogDismiss` component.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx
* const store = useDialogStore();
* const props = useDialogDismiss({ store });
* <Dialog store={store}>
*   <Role {...props} />
* </Dialog>
* ```
*/
const useDialogDismiss = createHook(function useDialogDismiss$1({ store,...props }) {
	const context = useDialogScopedContext();
	store = store || context;
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		store?.hide();
	});
	const children = useMemo(() => /* @__PURE__ */ jsxs("svg", {
		"aria-label": "Dismiss popup",
		display: "block",
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		viewBox: "0 0 16 16",
		height: "1em",
		width: "1em",
		children: [/* @__PURE__ */ jsx("line", {
			x1: "4",
			y1: "4",
			x2: "12",
			y2: "12"
		}), /* @__PURE__ */ jsx("line", {
			x1: "4",
			y1: "12",
			x2: "12",
			y2: "4"
		})]
	}), []);
	props = {
		"data-dialog-dismiss": "",
		children,
		...props,
		onClick
	};
	props = useButton(props);
	return props;
});
/**
* Renders a button that hides a
* [`Dialog`](https://ariakit.org/reference/dialog) when clicked.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx {4}
* const [open, setOpen] = useState(false);
*
* <Dialog open={open} onClose={() => setOpen(false)}>
*   <DialogDismiss />
* </Dialog>
* ```
*/
const DialogDismiss = forwardRef(function DialogDismiss$1(props) {
	const htmlProps = useDialogDismiss(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/dialog/dialog-heading.tsx
const TagName = "h1";
/**
* Returns props to create a `DialogHeading` component. This hook must be used
* in a component that's wrapped with `Dialog` so the `aria-labelledby` prop is
* properly set on the dialog element.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx
* // This component must be wrapped with Dialog
* const props = useDialogHeading();
* <Role {...props}>Heading</Role>
* ```
*/
const useDialogHeading = createHook(function useDialogHeading$1({ store,...props }) {
	const setHeadingId = useContext(DialogHeadingContext);
	const id = useId(props.id);
	useSafeLayoutEffect(() => {
		setHeadingId?.(id);
		return () => setHeadingId?.(undefined);
	}, [setHeadingId, id]);
	props = {
		id,
		...props
	};
	props = useHeading(props);
	return props;
});
/**
* Renders a heading in a dialog. This component must be wrapped with
* [`Dialog`](https://ariakit.org/reference/dialog) so the `aria-labelledby`
* prop is properly set on the dialog element.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx {4}
* const [open, setOpen] = useState(false);
*
* <Dialog open={open} onClose={() => setOpen(false)}>
*   <DialogHeading>Heading</DialogHeading>
* </Dialog>
* ```
*/
const DialogHeading = forwardRef(function DialogHeading$1(props) {
	const htmlProps = useDialogHeading(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { DialogDismiss, DialogHeading, useDialogDismiss, useDialogHeading };