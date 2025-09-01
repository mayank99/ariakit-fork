import { removeUndefinedValues, useWrapElement } from "./hooks-BNp9qiVx.js";
import { createElement, createHook, forwardRef } from "./system-BBb67kU9.js";
import { CollectionContextProvider, CollectionScopedContextProvider, useCollectionProviderContext, useCollectionStore } from "./collection-store-DU4ae2No.js";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/collection/collection.tsx
const TagName = "div";
/**
* Returns props to create a `Collection` component. It receives the collection
* store through the `store` prop and provides context for `CollectionItem`
* components.
* @see https://ariakit.org/components/collection
* @example
* ```jsx
* const collection = useCollectionStore();
* const props = useCollection({ store });
* <Role {...props}>
*   <CollectionItem>Item 1</CollectionItem>
*   <CollectionItem>Item 2</CollectionItem>
*   <CollectionItem>Item 3</CollectionItem>
* </Role>
* ```
*/
const useCollection = createHook(function useCollection$1({ store,...props }) {
	const context = useCollectionProviderContext();
	store = store || context;
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(CollectionScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	return removeUndefinedValues(props);
});
/**
* Renders a simple wrapper for collection items. It accepts a collection store
* through the [`store`](https://ariakit.org/reference/collection#store) prop
* and provides context for
* [`CollectionItem`](https://ariakit.org/reference/collection-item) components.
* @see https://ariakit.org/components/collection
* @example
* ```jsx
* const collection = useCollectionStore();
* <Collection store={collection}>
*   <CollectionItem>Item 1</CollectionItem>
*   <CollectionItem>Item 2</CollectionItem>
*   <CollectionItem>Item 3</CollectionItem>
* </Collection>
* ```
*/
const Collection = forwardRef(function Collection$1(props) {
	const htmlProps = useCollection(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/collection/collection-provider.tsx
function CollectionProvider(props = {}) {
	const store = useCollectionStore(props);
	return /* @__PURE__ */ jsx(CollectionContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
export { Collection, CollectionProvider };