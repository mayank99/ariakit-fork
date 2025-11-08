import { createContext, useContext } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/heading/heading-context.tsx
const HeadingContext = createContext(0);

//#endregion
//#region packages/ariakit-react-core/src/heading/heading-level.tsx
/**
* A component that sets the heading level for its children. It doesn't render
* any HTML element, just sets the
* [`level`](https://ariakit.org/reference/heading-level#level) prop on the
* context.
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
function HeadingLevel({ level, children }) {
	const contextLevel = useContext(HeadingContext);
	const nextLevel = Math.max(Math.min(level || contextLevel + 1, 6), 1);
	return /* @__PURE__ */ jsx(HeadingContext.Provider, {
		value: nextLevel,
		children
	});
}

//#endregion
export { HeadingContext as n, HeadingLevel as t };