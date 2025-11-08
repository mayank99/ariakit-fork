import { r as createStoreContext } from "./system-CMX9uFDP.js";
import { f as CompositeScopedContextProvider, l as CompositeContextProvider } from "./utils-CJtcgbaU.js";
import { n as PopoverScopedContextProvider, t as PopoverContextProvider } from "./popover-context-DedaNfGB.js";
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
export { ComboboxScopedContextProvider as a, useComboboxScopedContext as c, ComboboxListRoleContext as i, ComboboxItemCheckedContext as n, useComboboxContext as o, ComboboxItemValueContext as r, useComboboxProviderContext as s, ComboboxContextProvider as t };