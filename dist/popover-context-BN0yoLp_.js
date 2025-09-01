import { createStoreContext } from "./system-BBb67kU9.js";
import { DialogContextProvider, DialogScopedContextProvider } from "./disclosure-store-Czymr2mJ.js";

//#region packages/ariakit-react-core/src/popover/popover-context.tsx
const ctx = createStoreContext([DialogContextProvider], [DialogScopedContextProvider]);
/**
* Returns the popover store from the nearest popover container.
* @example
* function Popover() {
*   const store = usePopoverContext();
*
*   if (!store) {
*     throw new Error("Popover must be wrapped in PopoverProvider");
*   }
*
*   // Use the store...
* }
*/
const usePopoverContext = ctx.useContext;
const usePopoverScopedContext = ctx.useScopedContext;
const usePopoverProviderContext = ctx.useProviderContext;
const PopoverContextProvider = ctx.ContextProvider;
const PopoverScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
export { PopoverContextProvider, PopoverScopedContextProvider, usePopoverContext, usePopoverProviderContext, usePopoverScopedContext };