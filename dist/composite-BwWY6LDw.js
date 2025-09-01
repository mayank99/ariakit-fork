import { useCompositeStore } from "./composite-store-Eq4wZZQ7.js";
import { CompositeContextProvider } from "./utils-DgFD4-mq.js";
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
export { CompositeProvider };