import { removeUndefinedValues, useId, useSafeLayoutEffect, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { createContext, useContext, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/group/group-label-context.tsx
const GroupLabelContext = createContext(undefined);

//#endregion
//#region packages/ariakit-react-core/src/group/group.tsx
const TagName$1 = "div";
/**
* Returns props to create a `Group` component.
* @see https://ariakit.org/components/group
* @example
* ```jsx
* const props = useGroup();
* <Role {...props}>Group</Role>
* ```
*/
const useGroup = createHook(function useGroup$1(props) {
	const [labelId, setLabelId] = useState();
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(GroupLabelContext.Provider, {
		value: setLabelId,
		children: element
	}), []);
	props = {
		role: "group",
		"aria-labelledby": labelId,
		...props
	};
	return removeUndefinedValues(props);
});
/**
* Renders a group element. Optionally, a
* [`GroupLabel`](https://ariakit.org/reference/group-label) can be rendered as
* a child to provide a label for the group.
* @see https://ariakit.org/components/group
* @example
* ```jsx
* <Group>Group</Group>
* ```
*/
const Group = forwardRef(function Group$1(props) {
	const htmlProps = useGroup(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/group/group-label.tsx
const TagName = "div";
/**
* Returns props to create a `GroupLabel` component. This hook must be used in a
* component that's wrapped with `Group` so the `aria-labelledby` prop is
* properly set on the group element.
* @see https://ariakit.org/components/group
* @example
* ```jsx
* // This component must be wrapped with Group
* const props = useGroupLabel();
* <Role {...props}>Label</Role>
* ```
*/
const useGroupLabel = createHook(function useGroupLabel$1(props) {
	const setLabelId = useContext(GroupLabelContext);
	const id = useId(props.id);
	useSafeLayoutEffect(() => {
		setLabelId?.(id);
		return () => setLabelId?.(undefined);
	}, [setLabelId, id]);
	props = {
		id,
		"aria-hidden": true,
		...props
	};
	return removeUndefinedValues(props);
});
/**
* Renders a label in a group. This component should be wrapped with a
* [`Group`](https://ariakit.org/reference/group) so the `aria-labelledby`
* prop is correctly set on the group element.
* @see https://ariakit.org/components/group
* @example
* ```jsx
* <Group>
*   <GroupLabel>Label</GroupLabel>
* </Group>
* ```
*/
const GroupLabel = forwardRef(function GroupLabel$1(props) {
	const htmlProps = useGroupLabel(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { Group, GroupLabel, useGroup, useGroupLabel };