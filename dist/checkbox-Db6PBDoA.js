import { i as CheckboxContextProvider, t as useCheckboxStore } from "./checkbox-store-GuuI_f-K.js";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/checkbox/checkbox-provider.tsx
function CheckboxProvider(props = {}) {
	const store = useCheckboxStore(props);
	return /* @__PURE__ */ jsx(CheckboxContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { CheckboxProvider as t };