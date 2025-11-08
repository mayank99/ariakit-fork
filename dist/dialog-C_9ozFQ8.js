import { s as DialogContextProvider } from "./disclosure-store-DZ4wqMBt.js";
import { i as useDialogStore } from "./dialog-BY8Na6S7.js";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/dialog/dialog-provider.tsx
/**
* Provides a dialog store to [Dialog](https://ariakit.org/components/dialog)
* components.
* @see https://ariakit.org/components/dialog
* @example
* ```jsx
* <DialogProvider>
*   <Dialog />
* </DialogProvider>
* ```
*/
function DialogProvider(props = {}) {
	const store = useDialogStore(props);
	return /* @__PURE__ */ jsx(DialogContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { DialogProvider as t };