import { t as PopoverContextProvider } from "./popover-context-DedaNfGB.js";
import { t as usePopoverStore } from "./popover-store-DWE0Zrud.js";
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
export { PopoverProvider as t };