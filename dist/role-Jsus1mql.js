import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";

//#region packages/ariakit-react-core/src/role/role.tsx
const TagName = "div";
const elements = [
	"a",
	"button",
	"details",
	"dialog",
	"div",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"section",
	"select",
	"span",
	"summary",
	"textarea",
	"ul",
	"svg"
];
/**
* Returns props to create a `Role` component.
* @see https://ariakit.org/components/role
* @example
* ```jsx
* const props = useRole();
* <Role {...props} />
* ```
*/
const useRole = createHook(function useRole$1(props) {
	return props;
});
/**
* Renders an abstract element that supports the `render` prop and a
* `wrapElement` prop that can be used to wrap the underlying element with React
* Portal, Context or other component types.
* @see https://ariakit.org/components/role
* @example
* ```jsx
* <Role render={<div />} />
* ```
*/
const Role = forwardRef(function Role$1(props) {
	return createElement(TagName, props);
});
Object.assign(Role, elements.reduce((acc, element) => {
	acc[element] = forwardRef(function Role$1(props) {
		return createElement(element, props);
	});
	return acc;
}, {}));

//#endregion
export { Role };