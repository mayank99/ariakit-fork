import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { f as useHovercardScopedContext } from "./hovercard-store-cnp0072W.js";
import { n as usePopoverDescription } from "./popover-description-Btiea8t4.js";
import { i as usePopoverDismiss, n as usePopoverHeading } from "./popover-heading-DWNXThmH.js";

//#region packages/ariakit-react-core/src/hovercard/hovercard-description.tsx
const TagName$2 = "p";
/**
* Returns props to create a `HovercardDescription` component. This hook must be
* used in a component that's wrapped with `Hovercard` so the `aria-describedby`
* prop is properly set on the hovercard element.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* // This component must be wrapped with Hovercard
* const props = useHovercardDescription();
* <Role {...props}>Description</Role>
* ```
*/
const useHovercardDescription = createHook(function useHovercardDescription$1(props) {
	props = usePopoverDescription(props);
	return props;
});
/**
* Renders a description in a hovercard. This component must be wrapped within
* [`Hovercard`](https://ariakit.org/reference/hovercard) so the
* `aria-describedby` prop is properly set on the content element.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx {3}
* <HovercardProvider>
*   <Hovercard>
*     <HovercardDescription>Description</HovercardDescription>
*   </Hovercard>
* </HovercardProvider>
* ```
*/
const HovercardDescription = forwardRef(function HovercardDescription$1(props) {
	const htmlProps = useHovercardDescription(props);
	return createElement(TagName$2, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/hovercard/hovercard-dismiss.tsx
const TagName$1 = "button";
/**
* Returns props to create a `HovercardDismiss` component.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* const store = useHovercardStore();
* const props = useHovercardDismiss({ store });
* <Hovercard store={store}>
*   <Role {...props} />
* </Hovercard>
* ```
*/
const useHovercardDismiss = createHook(function useHovercardDismiss$1({ store,...props }) {
	const context = useHovercardScopedContext();
	store = store || context;
	props = usePopoverDismiss({
		store,
		...props
	});
	return props;
});
/**
* Renders a button that hides a
* [`Hovercard`](https://ariakit.org/reference/hovercard) when clicked.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx {3}
* <HovercardProvider>
*   <Hovercard>
*     <HovercardDismiss />
*   </Hovercard>
* </HovercardProvider>
* ```
*/
const HovercardDismiss = forwardRef(function HovercardDismiss$1(props) {
	const htmlProps = useHovercardDismiss(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/hovercard/hovercard-heading.tsx
const TagName = "h1";
/**
* Returns props to create a `HovercardHeading` component. This hook must be
* used in a component that's wrapped with `Hovercard` so the `aria-labelledby`
* prop is properly set on the hovercard element.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx
* // This component must be wrapped with Hovercard
* const props = useHovercardHeading();
* <Role {...props}>Heading</Role>
* ```
*/
const useHovercardHeading = createHook(function useHovercardHeading$1(props) {
	props = usePopoverHeading(props);
	return props;
});
/**
* Renders a heading in a hovercard. This component must be wrapped within
* [`Hovercard`](https://ariakit.org/reference/hovercard) so the
* `aria-labelledby` prop is properly set on the content element.
* @see https://ariakit.org/components/hovercard
* @example
* ```jsx {3}
* <HovercardProvider>
*   <Hovercard>
*     <HovercardHeading>Heading</HovercardHeading>
*   </Hovercard>
* </HovercardProvider>
* ```
*/
const HovercardHeading = forwardRef(function HovercardHeading$1(props) {
	const htmlProps = useHovercardHeading(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { HovercardDescription as a, useHovercardDismiss as i, useHovercardHeading as n, useHovercardDescription as o, HovercardDismiss as r, HovercardHeading as t };