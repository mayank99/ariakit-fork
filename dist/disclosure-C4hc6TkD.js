import { m as DisclosureContextProvider, t as useDisclosureStore } from "./disclosure-store-DZ4wqMBt.js";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/disclosure/disclosure-provider.tsx
/**
* Provides a disclosure store to
* [Disclosure](https://ariakit.org/components/disclosure) components.
* @see https://ariakit.org/components/disclosure
* @example
* ```jsx
* <DisclosureProvider>
*   <Disclosure />
*   <DisclosureContent />
* </DisclosureProvider>
* ```
*/
function DisclosureProvider(props = {}) {
	const store = useDisclosureStore(props);
	return /* @__PURE__ */ jsx(DisclosureContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { DisclosureProvider as t };