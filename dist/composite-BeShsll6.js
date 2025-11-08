import { t as useCompositeStore } from "./composite-store-BRNkRGdm.js";
import { l as CompositeContextProvider } from "./utils-CJtcgbaU.js";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/composite/composite-provider.tsx
function CompositeProvider(props = {}) {
	const store = useCompositeStore(props);
	return /* @__PURE__ */ jsx(CompositeContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { CompositeProvider as t };