import { B as fireBlurEvent, J as isSelfTarget, U as fireKeyboardEvent, _ as useWrapElement, a as useId, f as useSafeLayoutEffect, ft as isTextField, k as invariant, l as useMergeRefs, m as useTransactionState, n as useBooleanEvent, nt as getActiveElement, r as useEvent, w as defaultValue } from "./hooks-H6OmsigH.js";
import { l as hasFocus, r as focusIntoView } from "./focus-BzfNYadt.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { r as useFocusable } from "./focusable-rBfookfw.js";
import { d as setup, n as useStoreProps, o as createStore, p as sync, t as useStore } from "./store-DLqhzR2r.js";
import { n as useCollectionStoreProps, r as createCollectionStore } from "./collection-store-5DV4OeOi.js";
import { a as groupItemsByRows$1, c as silentlyFocused, i as getEnabledItem, l as CompositeContextProvider, m as useCompositeProviderContext, o as isItem, t as findFirstEnabledItem$1 } from "./utils-CJtcgbaU.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-core/src/utils/array.ts
/**
* Transforms `arg` into an array if it's not already.
* @example
* toArray("a"); // ["a"]
* toArray(["a"]); // ["a"]
*/
function toArray(arg) {
	if (Array.isArray(arg)) {
		return arg;
	}
	return typeof arg !== "undefined" ? [arg] : [];
}
/**
* Immutably adds an index to an array.
* @example
* addItemToArray(["a", "b", "d"], "c", 2); // ["a", "b", "c", "d"]
* @returns {Array} A new array with the item in the passed array index.
*/
function addItemToArray(array, item, index = -1) {
	if (!(index in array)) {
		return [...array, item];
	}
	return [
		...array.slice(0, index),
		item,
		...array.slice(index)
	];
}
/**
* Flattens a 2D array into a one-dimensional array.
* @example
* flatten2DArray([["a"], ["b"], ["c"]]); // ["a", "b", "c"]
*
* @returns {Array} A one-dimensional array.
*/
function flatten2DArray(array) {
	const flattened = [];
	for (const row of array) {
		flattened.push(...row);
	}
	return flattened;
}
/**
* Immutably reverses an array.
* @example
* reverseArray(["a", "b", "c"]); // ["c", "b", "a"]
* @returns {Array} Reversed array.
*/
function reverseArray(array) {
	return array.slice().reverse();
}

//#endregion
//#region packages/ariakit-react-core/src/composite/composite.tsx
const TagName = "div";
function isGrid(items) {
	return items.some((item) => !!item.rowId);
}
function isPrintableKey(event) {
	const target = event.target;
	if (target && !isTextField(target)) return false;
	return event.key.length === 1 && !event.ctrlKey && !event.metaKey;
}
function isModifierKey(event) {
	return event.key === "Shift" || event.key === "Control" || event.key === "Alt" || event.key === "Meta";
}
function useKeyboardEventProxy(store, onKeyboardEvent, previousElementRef) {
	return useEvent((event) => {
		onKeyboardEvent?.(event);
		if (event.defaultPrevented) return;
		if (event.isPropagationStopped()) return;
		if (!isSelfTarget(event)) return;
		if (isModifierKey(event)) return;
		if (isPrintableKey(event)) return;
		const state = store.getState();
		const activeElement = getEnabledItem(store, state.activeId)?.element;
		if (!activeElement) return;
		const previousElement = previousElementRef?.current;
		if (activeElement !== previousElement) {
			activeElement.focus();
		}
		if (!fireKeyboardEvent(activeElement, event.type, event)) {
			event.preventDefault();
		}
		if (event.currentTarget.contains(activeElement)) {
			event.stopPropagation();
		}
	});
}
function findFirstEnabledItemInTheLastRow(items) {
	return findFirstEnabledItem$1(flatten2DArray(reverseArray(groupItemsByRows$1(items))));
}
function useScheduleFocus(store) {
	const [scheduled, setScheduled] = useState(false);
	const schedule = useCallback(() => setScheduled(true), []);
	const activeItem = store.useState((state) => getEnabledItem(store, state.activeId));
	useEffect(() => {
		const activeElement = activeItem?.element;
		if (!scheduled) return;
		if (!activeElement) return;
		setScheduled(false);
		activeElement.focus({ preventScroll: true });
	}, [activeItem, scheduled]);
	return schedule;
}
/**
* Returns props to create a `Composite` component.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useComposite({ store });
* <Role {...props}>
*   <CompositeItem>Item 1</CompositeItem>
*   <CompositeItem>Item 2</CompositeItem>
* </Role>
* ```
*/
const useComposite = createHook(function useComposite$1({ store, composite = true, focusOnMove = composite, moveOnKeyPress = true,...props }) {
	const context = useCompositeProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Composite must receive a `store` prop or be wrapped in a CompositeProvider component.");
	const ref = useRef(null);
	const previousElementRef = useRef(null);
	const scheduleFocus = useScheduleFocus(store);
	const moves = store.useState("moves");
	const [, setBaseElement] = useTransactionState(composite ? store.setBaseElement : null);
	useEffect(() => {
		if (!store) return;
		if (!moves) return;
		if (!composite) return;
		if (!focusOnMove) return;
		const { activeId: activeId$1 } = store.getState();
		const itemElement = getEnabledItem(store, activeId$1)?.element;
		if (!itemElement) return;
		focusIntoView(itemElement);
	}, [
		store,
		moves,
		composite,
		focusOnMove
	]);
	useSafeLayoutEffect(() => {
		if (!store) return;
		if (!moves) return;
		if (!composite) return;
		const { baseElement, activeId: activeId$1 } = store.getState();
		const isSelfAcive = activeId$1 === null;
		if (!isSelfAcive) return;
		if (!baseElement) return;
		const previousElement = previousElementRef.current;
		previousElementRef.current = null;
		if (previousElement) {
			fireBlurEvent(previousElement, { relatedTarget: baseElement });
		}
		if (!hasFocus(baseElement)) {
			baseElement.focus();
		}
	}, [
		store,
		moves,
		composite
	]);
	const activeId = store.useState("activeId");
	const virtualFocus = store.useState("virtualFocus");
	useSafeLayoutEffect(() => {
		if (!store) return;
		if (!composite) return;
		if (!virtualFocus) return;
		const previousElement = previousElementRef.current;
		previousElementRef.current = null;
		if (!previousElement) return;
		const activeElement = getEnabledItem(store, activeId)?.element;
		const relatedTarget = activeElement || getActiveElement(previousElement);
		if (relatedTarget === previousElement) return;
		fireBlurEvent(previousElement, { relatedTarget });
	}, [
		store,
		activeId,
		virtualFocus,
		composite
	]);
	const onKeyDownCapture = useKeyboardEventProxy(store, props.onKeyDownCapture, previousElementRef);
	const onKeyUpCapture = useKeyboardEventProxy(store, props.onKeyUpCapture, previousElementRef);
	const onFocusCaptureProp = props.onFocusCapture;
	const onFocusCapture = useEvent((event) => {
		onFocusCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const { virtualFocus: virtualFocus$1 } = store.getState();
		if (!virtualFocus$1) return;
		const previousActiveElement = event.relatedTarget;
		const isSilentlyFocused = silentlyFocused(event.currentTarget);
		if (isSelfTarget(event) && isSilentlyFocused) {
			event.stopPropagation();
			previousElementRef.current = previousActiveElement;
		}
	});
	const onFocusProp = props.onFocus;
	const onFocus = useEvent((event) => {
		onFocusProp?.(event);
		if (event.defaultPrevented) return;
		if (!composite) return;
		if (!store) return;
		const { relatedTarget } = event;
		const { virtualFocus: virtualFocus$1 } = store.getState();
		if (virtualFocus$1) {
			if (isSelfTarget(event) && !isItem(store, relatedTarget)) {
				queueMicrotask(scheduleFocus);
			}
		} else if (isSelfTarget(event)) {
			store.setActiveId(null);
		}
	});
	const onBlurCaptureProp = props.onBlurCapture;
	const onBlurCapture = useEvent((event) => {
		onBlurCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const { virtualFocus: virtualFocus$1, activeId: activeId$1 } = store.getState();
		if (!virtualFocus$1) return;
		const activeElement = getEnabledItem(store, activeId$1)?.element;
		const nextActiveElement = event.relatedTarget;
		const nextActiveElementIsItem = isItem(store, nextActiveElement);
		const previousElement = previousElementRef.current;
		previousElementRef.current = null;
		if (isSelfTarget(event) && nextActiveElementIsItem) {
			if (nextActiveElement === activeElement) {
				if (previousElement && previousElement !== nextActiveElement) {
					fireBlurEvent(previousElement, event);
				}
			} else if (activeElement) {
				fireBlurEvent(activeElement, event);
			} else if (previousElement) {
				fireBlurEvent(previousElement, event);
			}
			event.stopPropagation();
		} else {
			const targetIsItem = isItem(store, event.target);
			if (!targetIsItem && activeElement) {
				fireBlurEvent(activeElement, event);
			}
		}
	});
	const onKeyDownProp = props.onKeyDown;
	const moveOnKeyPressProp = useBooleanEvent(moveOnKeyPress);
	const onKeyDown = useEvent((event) => {
		onKeyDownProp?.(event);
		if (event.nativeEvent.isComposing) return;
		if (event.defaultPrevented) return;
		if (!store) return;
		if (!isSelfTarget(event)) return;
		const { orientation, renderedItems, activeId: activeId$1 } = store.getState();
		const activeItem = getEnabledItem(store, activeId$1);
		if (activeItem?.element?.isConnected) return;
		const isVertical = orientation !== "horizontal";
		const isHorizontal = orientation !== "vertical";
		const grid = isGrid(renderedItems);
		const isHorizontalKey = event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End";
		if (isHorizontalKey && isTextField(event.currentTarget)) return;
		const up = () => {
			if (grid) {
				const item = findFirstEnabledItemInTheLastRow(renderedItems);
				return item?.id;
			}
			return store?.last();
		};
		const keyMap = {
			ArrowUp: (grid || isVertical) && up,
			ArrowRight: (grid || isHorizontal) && store.first,
			ArrowDown: (grid || isVertical) && store.first,
			ArrowLeft: (grid || isHorizontal) && store.last,
			Home: store.first,
			End: store.last,
			PageUp: store.first,
			PageDown: store.last
		};
		const action = keyMap[event.key];
		if (action) {
			const id = action();
			if (id !== undefined) {
				if (!moveOnKeyPressProp(event)) return;
				event.preventDefault();
				store.move(id);
			}
		}
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(CompositeContextProvider, {
		value: store,
		children: element
	}), [store]);
	const activeDescendant = store.useState((state) => {
		if (!store) return;
		if (!composite) return;
		if (!state.virtualFocus) return;
		return getEnabledItem(store, state.activeId)?.id;
	});
	props = {
		"aria-activedescendant": activeDescendant,
		...props,
		ref: useMergeRefs(ref, setBaseElement, props.ref),
		onKeyDownCapture,
		onKeyUpCapture,
		onFocusCapture,
		onFocus,
		onBlurCapture,
		onKeyDown
	};
	const focusable = store.useState((state) => composite && (state.virtualFocus || state.activeId === null));
	props = useFocusable({
		focusable,
		...props
	});
	return props;
});
/**
* Renders a composite widget.
* @see https://ariakit.org/components/composite
* @example
* ```jsx
* const composite = useCompositeStore();
* <Composite store={composite}>
*   <CompositeItem>Item 1</CompositeItem>
*   <CompositeItem>Item 2</CompositeItem>
* </Composite>
* ```
*/
const Composite = forwardRef(function Composite$1(props) {
	const htmlProps = useComposite(props);
	return createElement(TagName, htmlProps);
});

//#endregion
//#region packages/ariakit-core/src/composite/composite-store.ts
const NULL_ITEM = { id: null };
function findFirstEnabledItem(items, excludeId) {
	return items.find((item) => {
		if (excludeId) {
			return !item.disabled && item.id !== excludeId;
		}
		return !item.disabled;
	});
}
function getEnabledItems(items, excludeId) {
	return items.filter((item) => {
		if (excludeId) {
			return !item.disabled && item.id !== excludeId;
		}
		return !item.disabled;
	});
}
function getItemsInRow(items, rowId) {
	return items.filter((item) => item.rowId === rowId);
}
function flipItems(items, activeId, shouldInsertNullItem = false) {
	const index = items.findIndex((item) => item.id === activeId);
	return [
		...items.slice(index + 1),
		...shouldInsertNullItem ? [NULL_ITEM] : [],
		...items.slice(0, index)
	];
}
function groupItemsByRows(items) {
	const rows = [];
	for (const item of items) {
		const row = rows.find((currentRow) => currentRow[0]?.rowId === item.rowId);
		if (row) {
			row.push(item);
		} else {
			rows.push([item]);
		}
	}
	return rows;
}
function getMaxRowLength(array) {
	let maxLength = 0;
	for (const { length } of array) {
		if (length > maxLength) {
			maxLength = length;
		}
	}
	return maxLength;
}
function createEmptyItem(rowId) {
	return {
		id: "__EMPTY_ITEM__",
		disabled: true,
		rowId
	};
}
function normalizeRows(rows, activeId, focusShift) {
	const maxLength = getMaxRowLength(rows);
	for (const row of rows) {
		for (let i = 0; i < maxLength; i += 1) {
			const item = row[i];
			if (!item || focusShift && item.disabled) {
				const isFirst = i === 0;
				const previousItem = isFirst && focusShift ? findFirstEnabledItem(row) : row[i - 1];
				row[i] = previousItem && activeId !== previousItem.id && focusShift ? previousItem : createEmptyItem(previousItem?.rowId);
			}
		}
	}
	return rows;
}
function verticalizeItems(items) {
	const rows = groupItemsByRows(items);
	const maxLength = getMaxRowLength(rows);
	const verticalized = [];
	for (let i = 0; i < maxLength; i += 1) {
		for (const row of rows) {
			const item = row[i];
			if (item) {
				verticalized.push({
					...item,
					rowId: item.rowId ? `${i}` : undefined
				});
			}
		}
	}
	return verticalized;
}
/**
* Creates a composite store.
*/
function createCompositeStore(props = {}) {
	const syncState = props.store?.getState();
	const collection = createCollectionStore(props);
	const activeId = defaultValue(props.activeId, syncState?.activeId, props.defaultActiveId);
	const initialState = {
		...collection.getState(),
		id: defaultValue(props.id, syncState?.id, `id-${Math.random().toString(36).slice(2, 8)}`),
		activeId,
		baseElement: defaultValue(syncState?.baseElement, null),
		includesBaseElement: defaultValue(props.includesBaseElement, syncState?.includesBaseElement, activeId === null),
		moves: defaultValue(syncState?.moves, 0),
		orientation: defaultValue(props.orientation, syncState?.orientation, "both"),
		rtl: defaultValue(props.rtl, syncState?.rtl, false),
		virtualFocus: defaultValue(props.virtualFocus, syncState?.virtualFocus, false),
		focusLoop: defaultValue(props.focusLoop, syncState?.focusLoop, false),
		focusWrap: defaultValue(props.focusWrap, syncState?.focusWrap, false),
		focusShift: defaultValue(props.focusShift, syncState?.focusShift, false)
	};
	const composite = createStore(initialState, collection, props.store);
	setup(composite, () => sync(composite, ["renderedItems", "activeId"], (state) => {
		composite.setState("activeId", (activeId$1) => {
			if (activeId$1 !== undefined) return activeId$1;
			return findFirstEnabledItem(state.renderedItems)?.id;
		});
	}));
	const getNextId = (direction = "next", options = {}) => {
		const defaultState = composite.getState();
		const { skip = 0, activeId: activeId$1 = defaultState.activeId, focusShift = defaultState.focusShift, focusLoop = defaultState.focusLoop, focusWrap = defaultState.focusWrap, includesBaseElement = defaultState.includesBaseElement, renderedItems = defaultState.renderedItems, rtl = defaultState.rtl } = options;
		const isVerticalDirection = direction === "up" || direction === "down";
		const isNextDirection = direction === "next" || direction === "down";
		const canReverse = isNextDirection ? rtl && !isVerticalDirection : !rtl || isVerticalDirection;
		const canShift = focusShift && !skip;
		let items = !isVerticalDirection ? renderedItems : flatten2DArray(normalizeRows(groupItemsByRows(renderedItems), activeId$1, canShift));
		items = canReverse ? reverseArray(items) : items;
		items = isVerticalDirection ? verticalizeItems(items) : items;
		if (activeId$1 == null) {
			return findFirstEnabledItem(items)?.id;
		}
		const activeItem = items.find((item) => item.id === activeId$1);
		if (!activeItem) {
			return findFirstEnabledItem(items)?.id;
		}
		const isGrid$1 = items.some((item) => item.rowId);
		const activeIndex = items.indexOf(activeItem);
		const nextItems = items.slice(activeIndex + 1);
		const nextItemsInRow = getItemsInRow(nextItems, activeItem.rowId);
		if (skip) {
			const nextEnabledItemsInRow = getEnabledItems(nextItemsInRow, activeId$1);
			const nextItem$1 = nextEnabledItemsInRow.slice(skip)[0] || nextEnabledItemsInRow[nextEnabledItemsInRow.length - 1];
			return nextItem$1?.id;
		}
		const canLoop = focusLoop && (isVerticalDirection ? focusLoop !== "horizontal" : focusLoop !== "vertical");
		const canWrap = isGrid$1 && focusWrap && (isVerticalDirection ? focusWrap !== "horizontal" : focusWrap !== "vertical");
		const hasNullItem = isNextDirection ? (!isGrid$1 || isVerticalDirection) && canLoop && includesBaseElement : isVerticalDirection ? includesBaseElement : false;
		if (canLoop) {
			const loopItems = canWrap && !hasNullItem ? items : getItemsInRow(items, activeItem.rowId);
			const sortedItems = flipItems(loopItems, activeId$1, hasNullItem);
			const nextItem$1 = findFirstEnabledItem(sortedItems, activeId$1);
			return nextItem$1?.id;
		}
		if (canWrap) {
			const nextItem$1 = findFirstEnabledItem(hasNullItem ? nextItemsInRow : nextItems, activeId$1);
			const nextId = hasNullItem ? nextItem$1?.id || null : nextItem$1?.id;
			return nextId;
		}
		const nextItem = findFirstEnabledItem(nextItemsInRow, activeId$1);
		if (!nextItem && hasNullItem) {
			return null;
		}
		return nextItem?.id;
	};
	return {
		...collection,
		...composite,
		setBaseElement: (element) => composite.setState("baseElement", element),
		setActiveId: (id) => composite.setState("activeId", id),
		move: (id) => {
			if (id === undefined) return;
			composite.setState("activeId", id);
			composite.setState("moves", (moves) => moves + 1);
		},
		first: () => findFirstEnabledItem(composite.getState().renderedItems)?.id,
		last: () => findFirstEnabledItem(reverseArray(composite.getState().renderedItems))?.id,
		next: (options) => {
			if (options !== undefined && typeof options === "number") {
				options = { skip: options };
			}
			return getNextId("next", options);
		},
		previous: (options) => {
			if (options !== undefined && typeof options === "number") {
				options = { skip: options };
			}
			return getNextId("previous", options);
		},
		down: (options) => {
			if (options !== undefined && typeof options === "number") {
				options = { skip: options };
			}
			return getNextId("down", options);
		},
		up: (options) => {
			if (options !== undefined && typeof options === "number") {
				options = { skip: options };
			}
			return getNextId("up", options);
		}
	};
}

//#endregion
//#region packages/ariakit-react-core/src/composite/composite-store.ts
function useCompositeStoreOptions(props) {
	const id = useId(props.id);
	return {
		id,
		...props
	};
}
function useCompositeStoreProps(store, update, props) {
	store = useCollectionStoreProps(store, update, props);
	useStoreProps(store, props, "activeId", "setActiveId");
	useStoreProps(store, props, "includesBaseElement");
	useStoreProps(store, props, "virtualFocus");
	useStoreProps(store, props, "orientation");
	useStoreProps(store, props, "rtl");
	useStoreProps(store, props, "focusLoop");
	useStoreProps(store, props, "focusWrap");
	useStoreProps(store, props, "focusShift");
	return store;
}
function useCompositeStore(props = {}) {
	props = useCompositeStoreOptions(props);
	const [store, update] = useStore(createCompositeStore, props);
	return useCompositeStoreProps(store, update, props);
}

//#endregion
export { Composite as a, createCompositeStore as i, useCompositeStoreOptions as n, useComposite as o, useCompositeStoreProps as r, toArray as s, useCompositeStore as t };