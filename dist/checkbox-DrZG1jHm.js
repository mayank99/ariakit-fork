import { CheckboxContextProvider, useCheckboxStore } from "./checkbox-store-B8A7dhoB.js";
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
export { CheckboxProvider };