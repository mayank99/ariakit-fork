import { identity, removeUndefinedValues, useId, useMergeRefs } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { useCollectionContext } from "./collection-store-DU4ae2No.js";
import { useEffect, useRef } from "react";

//#region packages/ariakit-react-core/src/collection/collection-item.tsx
const TagName = "div";
/**
* Returns props to create a `CollectionItem` component. This hook will register
* the item in the collection store. If this hook is used in a component that is
* wrapped by `Collection` or a component that implements `useCollection`,
* there's no need to explicitly pass the `store` prop.
* @see https://ariakit.org/components/collection
* @example
* ```jsx
* const store = useCollectionStore();
* const props = useCollectionItem({ store });
* <Role {...props}>Item</Role>
* ```
*/
const useCollectionItem = createHook(function useCollectionItem$1({ store, shouldRegisterItem = true, getItem = identity, element,...props }) {
	const context = useCollectionContext();
	store = store || context;
	const id = useId(props.id);
	const ref = useRef(element);
	useEffect(() => {
		const element$1 = ref.current;
		if (!id) return;
		if (!element$1) return;
		if (!shouldRegisterItem) return;
		const item = getItem({
			id,
			element: element$1
		});
		return store?.renderItem(item);
	}, [
		id,
		shouldRegisterItem,
		getItem,
		store
	]);
	props = {
		...props,
		ref: useMergeRefs(ref, props.ref)
	};
	return removeUndefinedValues(props);
});
/**
* Renders an item in a collection. The collection store can be passed
* explicitly through the
* [`store`](https://ariakit.org/reference/collection-item#store) prop or
* implicitly through the parent
* [`Collection`](https://ariakit.org/reference/collection) component.
* @see https://ariakit.org/components/collection
* @example
* ```jsx
* const store = useCollectionStore();
* <CollectionItem store={store}>Item 1</CollectionItem>
* <CollectionItem store={store}>Item 2</CollectionItem>
* <CollectionItem store={store}>Item 3</CollectionItem>
* ```
*/
const CollectionItem = forwardRef(function CollectionItem$1(props) {
	const htmlProps = useCollectionItem(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { CollectionItem, useCollectionItem };