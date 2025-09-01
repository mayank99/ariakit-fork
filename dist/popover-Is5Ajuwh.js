import { PopoverContextProvider } from "./popover-context-BN0yoLp_.js";
import { usePopoverStore } from "./popover-store-agpDlTrh.js";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/popover/popover-provider.tsx
/**
* Provides a popover store to [Popover](https://ariakit.org/components/popover)
* components.
* @see https://ariakit.org/components/popover
* @example
* ```jsx
* <PopoverProvider>
*   <PopoverDisclosure />
*   <Popover />
* </PopoverProvider>
* ```
*/
function PopoverProvider(props = {}) {
	const store = usePopoverStore(props);
	return /* @__PURE__ */ jsx(PopoverContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { PopoverProvider };