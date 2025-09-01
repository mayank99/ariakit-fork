import { createStoreContext } from "./system-BBb67kU9.js";
import { CompositeContextProvider, CompositeScopedContextProvider } from "./utils-DgFD4-mq.js";
import { PopoverContextProvider, PopoverScopedContextProvider } from "./popover-context-BN0yoLp_.js";
import { createContext } from "react";

//#region packages/ariakit-react-core/src/combobox/combobox-context.tsx
const ComboboxListRoleContext = createContext(undefined);
const ctx = createStoreContext([PopoverContextProvider, CompositeContextProvider], [PopoverScopedContextProvider, CompositeScopedContextProvider]);
/**
* Returns the combobox store from the nearest combobox container.
* @example
* function Combobox() {
*   const store = useComboboxContext();
*
*   if (!store) {
*     throw new Error("Combobox must be wrapped in ComboboxProvider");
*   }
*
*   // Use the store...
* }
*/
const useComboboxContext = ctx.useContext;
const useComboboxScopedContext = ctx.useScopedContext;
const useComboboxProviderContext = ctx.useProviderContext;
const ComboboxContextProvider = ctx.ContextProvider;
const ComboboxScopedContextProvider = ctx.ScopedContextProvider;
const ComboboxItemValueContext = createContext(undefined);
const ComboboxItemCheckedContext = createContext(false);

//#endregion
export { ComboboxContextProvider, ComboboxItemCheckedContext, ComboboxItemValueContext, ComboboxListRoleContext, ComboboxScopedContextProvider, useComboboxContext, useComboboxProviderContext, useComboboxScopedContext };