import { l as useMergeRefs, p as useTagName } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { n as HeadingContext } from "./heading-level-DcfYVbfS.js";
import { useContext, useMemo, useRef } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/heading/heading.tsx
const TagName = "h1";
/**
* Returns props to create a `Heading` component. The element type (or the
* `aria-level` prop, if the element type is not a native heading) is determined
* by the context level provided by the parent `HeadingLevel` component.
* @see https://ariakit.org/components/heading
* @example
* ```jsx
* const props = useHeading();
* <Role {...props}>Heading</Role>
* ```
*/
const useHeading = createHook(function useHeading$1(props) {
	const ref = useRef(null);
	const level = useContext(HeadingContext) || 1;
	const Element = `h${level}`;
	const tagName = useTagName(ref, Element);
	const isNativeHeading = useMemo(() => !!tagName && /^h\d$/.test(tagName), [tagName]);
	props = {
		render: /* @__PURE__ */ jsx(Element, {}),
		role: !isNativeHeading ? "heading" : undefined,
		"aria-level": !isNativeHeading ? level : undefined,
		...props,
		ref: useMergeRefs(ref, props.ref)
	};
	return props;
});
/**
* Renders a heading element. The element type (or the `aria-level` attribute,
* if the element type is not a native heading) is determined by the context
* level provided by the closest
* [`HeadingLevel`](https://ariakit.org/reference/heading-level) ancestor.
* @see https://ariakit.org/components/heading
* @example
* ```jsx
* <HeadingLevel>
*   <Heading>Heading 1</Heading>
*   <HeadingLevel>
*     <Heading>Heading 2</Heading>
*   </HeadingLevel>
* </HeadingLevel>
* ```
*/
const Heading = forwardRef(function Heading$1(props) {
	const htmlProps = useHeading(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { useHeading as n, Heading as t };