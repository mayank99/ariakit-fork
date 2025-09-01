import { chain, defaultValue, getDocument, sortBasedOnDOMPosition, useUpdateEffect } from "./hooks-BNp9qiVx.js";
import { createStoreContext } from "./system-BBb67kU9.js";
import { batch, createStore, init, setup, throwOnConflictingProps, useStore, useStoreProps } from "./store-Ddr50htY.js";

//#region packages/ariakit-react-core/src/collection/collection-context.tsx
const ctx = createStoreContext();
/**
* Returns the collection store from the nearest collection container.
* @example
* function CollectionItem() {
*   const store = useCollectionContext();
*
*   if (!store) {
*     throw new Error("CollectionItem must be wrapped in CollectionProvider");
*   }
*
*   // Use the store...
* }
*/
const useCollectionContext = ctx.useContext;
const useCollectionScopedContext = ctx.useScopedContext;
const useCollectionProviderContext = ctx.useProviderContext;
const CollectionContextProvider = ctx.ContextProvider;
const CollectionScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-core/src/collection/collection-store.ts
function getCommonParent(items) {
	const firstItem = items.find((item) => !!item.element);
	const lastItem = [...items].reverse().find((item) => !!item.element);
	let parentElement = firstItem?.element?.parentElement;
	while (parentElement && lastItem?.element) {
		const parent = parentElement;
		if (lastItem && parent.contains(lastItem.element)) {
			return parentElement;
		}
		parentElement = parentElement.parentElement;
	}
	return getDocument(parentElement).body;
}
function getPrivateStore(store) {
	return store?.__unstablePrivateStore;
}
/**
* Creates a collection store.
*/
function createCollectionStore(props = {}) {
	throwOnConflictingProps(props, props.store);
	const syncState = props.store?.getState();
	const items = defaultValue(props.items, syncState?.items, props.defaultItems, []);
	const itemsMap = new Map(items.map((item) => [item.id, item]));
	const initialState = {
		items,
		renderedItems: defaultValue(syncState?.renderedItems, [])
	};
	const syncPrivateStore = getPrivateStore(props.store);
	const privateStore = createStore({
		items,
		renderedItems: initialState.renderedItems
	}, syncPrivateStore);
	const collection = createStore(initialState, props.store);
	const sortItems = (renderedItems) => {
		const sortedItems = sortBasedOnDOMPosition(renderedItems, (i) => i.element);
		privateStore.setState("renderedItems", sortedItems);
		collection.setState("renderedItems", sortedItems);
	};
	setup(collection, () => init(privateStore));
	setup(privateStore, () => {
		return batch(privateStore, ["items"], (state) => {
			collection.setState("items", state.items);
		});
	});
	setup(privateStore, () => {
		return batch(privateStore, ["renderedItems"], (state) => {
			let firstRun = true;
			let raf = requestAnimationFrame(() => {
				const { renderedItems } = collection.getState();
				if (state.renderedItems === renderedItems) return;
				sortItems(state.renderedItems);
			});
			if (typeof IntersectionObserver !== "function") {
				return () => cancelAnimationFrame(raf);
			}
			const ioCallback = () => {
				if (firstRun) {
					firstRun = false;
					return;
				}
				cancelAnimationFrame(raf);
				raf = requestAnimationFrame(() => sortItems(state.renderedItems));
			};
			const root = getCommonParent(state.renderedItems);
			const observer = new IntersectionObserver(ioCallback, { root });
			for (const item of state.renderedItems) {
				if (!item.element) continue;
				observer.observe(item.element);
			}
			return () => {
				cancelAnimationFrame(raf);
				observer.disconnect();
			};
		});
	});
	const mergeItem = (item, setItems, canDeleteFromMap = false) => {
		let prevItem;
		setItems((items$1) => {
			const index = items$1.findIndex(({ id }) => id === item.id);
			const nextItems = items$1.slice();
			if (index !== -1) {
				prevItem = items$1[index];
				const nextItem = {
					...prevItem,
					...item
				};
				nextItems[index] = nextItem;
				itemsMap.set(item.id, nextItem);
			} else {
				nextItems.push(item);
				itemsMap.set(item.id, item);
			}
			return nextItems;
		});
		const unmergeItem = () => {
			setItems((items$1) => {
				if (!prevItem) {
					if (canDeleteFromMap) {
						itemsMap.delete(item.id);
					}
					return items$1.filter(({ id }) => id !== item.id);
				}
				const index = items$1.findIndex(({ id }) => id === item.id);
				if (index === -1) return items$1;
				const nextItems = items$1.slice();
				nextItems[index] = prevItem;
				itemsMap.set(item.id, prevItem);
				return nextItems;
			});
		};
		return unmergeItem;
	};
	const registerItem = (item) => mergeItem(item, (getItems) => privateStore.setState("items", getItems), true);
	return {
		...collection,
		registerItem,
		renderItem: (item) => chain(registerItem(item), mergeItem(item, (getItems) => privateStore.setState("renderedItems", getItems))),
		item: (id) => {
			if (!id) return null;
			let item = itemsMap.get(id);
			if (!item) {
				const { items: items$1 } = privateStore.getState();
				item = items$1.find((item$1) => item$1.id === id);
				if (item) {
					itemsMap.set(id, item);
				}
			}
			return item || null;
		},
		__unstablePrivateStore: privateStore
	};
}

//#endregion
//#region packages/ariakit-react-core/src/collection/collection-store.ts
function useCollectionStoreProps(store, update, props) {
	useUpdateEffect(update, [props.store]);
	useStoreProps(store, props, "items", "setItems");
	return store;
}
function useCollectionStore(props = {}) {
	const [store, update] = useStore(createCollectionStore, props);
	return useCollectionStoreProps(store, update, props);
}

//#endregion
export { CollectionContextProvider, CollectionScopedContextProvider, createCollectionStore, useCollectionContext, useCollectionProviderContext, useCollectionStore, useCollectionStoreProps };