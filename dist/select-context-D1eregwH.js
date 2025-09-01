import { createStoreContext } from "./system-BBb67kU9.js";
import { CompositeContextProvider, CompositeScopedContextProvider } from "./utils-DgFD4-mq.js";
import { PopoverContextProvider, PopoverScopedContextProvider } from "./popover-context-BN0yoLp_.js";
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
export { SelectContextProvider, SelectHeadingContext, SelectItemCheckedContext, SelectScopedContextProvider, useSelectContext, useSelectProviderContext, useSelectScopedContext };