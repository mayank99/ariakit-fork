import { k as invariant, l as useMergeRefs, n as useBooleanEvent, r as useEvent, u as useMetadataProps } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { n as useButton } from "./button-CTf7d7DU.js";
import { g as useDisclosureProviderContext } from "./disclosure-store-DZ4wqMBt.js";
import { useEffect, useRef, useState } from "react";

//#region packages/ariakit-react-core/src/disclosure/disclosure.tsx
const TagName = "button";
const symbol = Symbol("disclosure");
/**
* Returns props to create a `Disclosure` component.
* @see https://ariakit.org/components/disclosure
* @example
* ```jsx
* const store = useDisclosureStore();
* const props = useDisclosure({ store });
* <Role {...props}>Disclosure</Role>
* <DisclosureContent store={store}>Content</DisclosureContent>
* ```
*/
const useDisclosure = createHook(function useDisclosure$1({ store, toggleOnClick = true,...props }) {
	const context = useDisclosureProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Disclosure must receive a `store` prop or be wrapped in a DisclosureProvider component.");
	const ref = useRef(null);
	const [expanded, setExpanded] = useState(false);
	const disclosureElement = store.useState("disclosureElement");
	const open = store.useState("open");
	useEffect(() => {
		let isCurrentDisclosure = disclosureElement === ref.current;
		if (!disclosureElement?.isConnected) {
			store?.setDisclosureElement(ref.current);
			isCurrentDisclosure = true;
		}
		setExpanded(open && isCurrentDisclosure);
	}, [
		disclosureElement,
		store,
		open
	]);
	const onClickProp = props.onClick;
	const toggleOnClickProp = useBooleanEvent(toggleOnClick);
	const [isDuplicate, metadataProps] = useMetadataProps(props, symbol, true);
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (isDuplicate) return;
		if (!toggleOnClickProp(event)) return;
		store?.setDisclosureElement(event.currentTarget);
		store?.toggle();
	});
	const contentElement = store.useState("contentElement");
	props = {
		"aria-expanded": expanded,
		"aria-controls": contentElement?.id,
		...metadataProps,
		...props,
		ref: useMergeRefs(ref, props.ref),
		onClick
	};
	props = useButton(props);
	return props;
});
/**
* Renders an element that controls the visibility of a
* [`DisclosureContent`](https://ariakit.org/reference/disclosure-content)
* element.
* @see https://ariakit.org/components/disclosure
* @example
* ```jsx {2}
* <DisclosureProvider>
*   <Disclosure>Disclosure</Disclosure>
*   <DisclosureContent>Content</DisclosureContent>
* </DisclosureProvider>
* ```
*/
const Disclosure = forwardRef(function Disclosure$1(props) {
	const htmlProps = useDisclosure(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useDisclosure as n, Disclosure as t };