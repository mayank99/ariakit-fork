import { r as createStoreContext } from "./system-CMX9uFDP.js";
import { s as DialogContextProvider, u as DialogScopedContextProvider } from "./disclosure-store-DZ4wqMBt.js";

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
export { usePopoverScopedContext as a, usePopoverProviderContext as i, PopoverScopedContextProvider as n, usePopoverContext as r, PopoverContextProvider as t };