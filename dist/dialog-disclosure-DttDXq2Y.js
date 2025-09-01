import { getPopupRole, invariant } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { useDialogProviderContext } from "./disclosure-store-Czymr2mJ.js";
import { useDisclosure } from "./disclosure-DbQTJacb.js";

//#region packages/ariakit-react-core/src/dialog/dialog-disclosure.tsx
const TagName = "button";
/**
* Returns props to create a `DialogDisclosure` component.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx
* const store = useDialogStore();
* const props = useDialogDisclosure({ store });
* <Role {...props}>Disclosure</Role>
* <Dialog store={store}>Content</Dialog>
* ```
*/
const useDialogDisclosure = createHook(function useDialogDisclosure$1({ store,...props }) {
	const context = useDialogProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "DialogDisclosure must receive a `store` prop or be wrapped in a DialogProvider component.");
	const contentElement = store.useState("contentElement");
	props = {
		"aria-haspopup": getPopupRole(contentElement, "dialog"),
		...props
	};
	props = useDisclosure({
		store,
		...props
	});
	return props;
});
/**
* Renders a button that toggles the visibility of a
* [`Dialog`](https://ariakit.org/reference/dialog) component when clicked.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx {2}
* <DialogProvider>
*   <DialogDisclosure>Disclosure</DialogDisclosure>
*   <Dialog>Content</Dialog>
* </DialogProvider>
* ```
*/
const DialogDisclosure = forwardRef(function DialogDisclosure$1(props) {
	const htmlProps = useDialogDisclosure(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { DialogDisclosure, useDialogDisclosure };