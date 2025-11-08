import { r as createStoreContext } from "./system-CMX9uFDP.js";
import { f as CompositeScopedContextProvider, l as CompositeContextProvider } from "./utils-CJtcgbaU.js";
import { n as PopoverScopedContextProvider, t as PopoverContextProvider } from "./popover-context-DedaNfGB.js";
import { createContext } from "react";

//#region packages/ariakit-react-core/src/select/select-context.tsx
const ctx = createStoreContext([PopoverContextProvider, CompositeContextProvider], [PopoverScopedContextProvider, CompositeScopedContextProvider]);
/**
* Returns the select store from the nearest select container.
* @example
* function Select() {
*   const store = useSelectContext();
*
*   if (!store) {
*     throw new Error("Select must be wrapped in SelectProvider");
*   }
*
*   // Use the store...
* }
*/
const useSelectContext = ctx.useContext;
const useSelectScopedContext = ctx.useScopedContext;
const useSelectProviderContext = ctx.useProviderContext;
const SelectContextProvider = ctx.ContextProvider;
const SelectScopedContextProvider = ctx.ScopedContextProvider;
const SelectItemCheckedContext = createContext(false);
const SelectHeadingContext = createContext(null);

//#endregion
export { useSelectContext as a, SelectScopedContextProvider as i, SelectHeadingContext as n, useSelectProviderContext as o, SelectItemCheckedContext as r, useSelectScopedContext as s, SelectContextProvider as t };