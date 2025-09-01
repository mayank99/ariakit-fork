import { applyState, chain, getKeys, hasOwnProperty, identity, invariant, noop, omit, pick, useEvent, useLiveRef, useSafeLayoutEffect } from "./hooks-BNp9qiVx.js";
import * as React from "react";

//#region packages/ariakit-core/src/utils/store.ts
function getInternal(store, key) {
	const internals = store.__unstableInternals;
	invariant(internals, "Invalid store");
	return internals[key];
}
/**
* Creates a store.
* @param initialState Initial state.
* @param stores Stores to extend.
*/
function createStore(initialState, ...stores) {
	let state = initialState;
	let prevStateBatch = state;
	let lastUpdate = Symbol();
	let destroy = noop;
	const instances = new Set();
	const updatedKeys = new Set();
	const setups = new Set();
	const listeners = new Set();
	const batchListeners = new Set();
	const disposables = new WeakMap();
	const listenerKeys = new WeakMap();
	const storeSetup = (callback) => {
		setups.add(callback);
		return () => setups.delete(callback);
	};
	const storeInit = () => {
		const initialized = instances.size;
		const instance = Symbol();
		instances.add(instance);
		const maybeDestroy = () => {
			instances.delete(instance);
			if (instances.size) return;
			destroy();
		};
		if (initialized) return maybeDestroy;
		const desyncs = getKeys(state).map((key) => chain(...stores.map((store) => {
			const storeState = store?.getState?.();
			if (!storeState) return;
			if (!hasOwnProperty(storeState, key)) return;
			return sync(store, [key], (state$1) => {
				setState(key, state$1[key], true);
			});
		})));
		const teardowns = [];
		for (const setup$1 of setups) {
			teardowns.push(setup$1());
		}
		const cleanups = stores.map(init);
		destroy = chain(...desyncs, ...teardowns, ...cleanups);
		return maybeDestroy;
	};
	const sub = (keys, listener, set = listeners) => {
		set.add(listener);
		listenerKeys.set(listener, keys);
		return () => {
			disposables.get(listener)?.();
			disposables.delete(listener);
			listenerKeys.delete(listener);
			set.delete(listener);
		};
	};
	const storeSubscribe = (keys, listener) => sub(keys, listener);
	const storeSync = (keys, listener) => {
		disposables.set(listener, listener(state, state));
		return sub(keys, listener);
	};
	const storeBatch = (keys, listener) => {
		disposables.set(listener, listener(state, prevStateBatch));
		return sub(keys, listener, batchListeners);
	};
	const storePick = (keys) => createStore(pick(state, keys), finalStore);
	const storeOmit = (keys) => createStore(omit(state, keys), finalStore);
	const getState = () => state;
	const setState = (key, value, fromStores = false) => {
		if (!hasOwnProperty(state, key)) return;
		const nextValue = applyState(value, state[key]);
		if (nextValue === state[key]) return;
		if (!fromStores) {
			for (const store of stores) {
				store?.setState?.(key, nextValue);
			}
		}
		const prevState = state;
		state = {
			...state,
			[key]: nextValue
		};
		const thisUpdate = Symbol();
		lastUpdate = thisUpdate;
		updatedKeys.add(key);
		const run = (listener, prev, uKeys) => {
			const keys = listenerKeys.get(listener);
			const updated = (k) => uKeys ? uKeys.has(k) : k === key;
			if (!keys || keys.some(updated)) {
				disposables.get(listener)?.();
				disposables.set(listener, listener(state, prev));
			}
		};
		for (const listener of listeners) {
			run(listener, prevState);
		}
		queueMicrotask(() => {
			if (lastUpdate !== thisUpdate) return;
			const snapshot = state;
			for (const listener of batchListeners) {
				run(listener, prevStateBatch, updatedKeys);
			}
			prevStateBatch = snapshot;
			updatedKeys.clear();
		});
	};
	const finalStore = {
		getState,
		setState,
		__unstableInternals: {
			setup: storeSetup,
			init: storeInit,
			subscribe: storeSubscribe,
			sync: storeSync,
			batch: storeBatch,
			pick: storePick,
			omit: storeOmit
		}
	};
	return finalStore;
}
/**
* Register a callback function that's called when the store is initialized.
*/
function setup(store, ...args) {
	if (!store) return;
	return getInternal(store, "setup")(...args);
}
/**
* Function that should be called when the store is initialized.
*/
function init(store, ...args) {
	if (!store) return;
	return getInternal(store, "init")(...args);
}
/**
* Registers a listener function that's called after state changes in the store.
*/
function subscribe(store, ...args) {
	if (!store) return;
	return getInternal(store, "subscribe")(...args);
}
/**
* Registers a listener function that's called immediately and synchronously
* whenever the store state changes.
*/
function sync(store, ...args) {
	if (!store) return;
	return getInternal(store, "sync")(...args);
}
/**
* Registers a listener function that's called immediately and after a batch
* of state changes in the store.
*/
function batch(store, ...args) {
	if (!store) return;
	return getInternal(store, "batch")(...args);
}
/**
* Creates a new store with a subset of the current store state and keeps them
* in sync.
*/
function omit$1(store, ...args) {
	if (!store) return;
	return getInternal(store, "omit")(...args);
}
/**
* Creates a new store with a subset of the current store state and keeps them
* in sync.
*/
function pick$1(store, ...args) {
	if (!store) return;
	return getInternal(store, "pick")(...args);
}
/**
* Merges multiple stores into a single store.
*/
function mergeStore(...stores) {
	const initialState = {};
	for (const store$1 of stores) {
		const nextState = store$1?.getState?.();
		if (nextState) {
			Object.assign(initialState, nextState);
		}
	}
	const store = createStore(initialState, ...stores);
	return Object.assign({}, ...stores, store);
}
/**
* Throws when a store prop is passed in conjunction with a default state.
*/
function throwOnConflictingProps(props, store) {
	if (process.env.NODE_ENV === "production") return;
	if (!store) return;
	const defaultKeys = Object.entries(props).filter(([key, value]) => key.startsWith("default") && value !== undefined).map(([key]) => {
		const stateKey = key.replace("default", "");
		return `${stateKey[0]?.toLowerCase() || ""}${stateKey.slice(1)}`;
	});
	if (!defaultKeys.length) return;
	const storeState = store.getState();
	const conflictingProps = defaultKeys.filter((key) => hasOwnProperty(storeState, key));
	if (!conflictingProps.length) return;
	throw new Error(`Passing a store prop in conjunction with a default state is not supported.

const store = useSelectStore();
<SelectProvider store={store} defaultValue="Apple" />
                ^             ^

Instead, pass the default state to the topmost store:

const store = useSelectStore({ defaultValue: "Apple" });
<SelectProvider store={store} />

See https://github.com/ariakit/ariakit/pull/2745 for more details.

If there's a particular need for this, please submit a feature request at https://github.com/ariakit/ariakit
`);
}

//#endregion
//#region packages/ariakit-react-core/src/utils/store.tsx
const noopSubscribe = () => () => {};
function useStoreState(store, keyOrSelector = identity) {
	const storeSubscribe = React.useCallback((callback) => {
		if (!store) return noopSubscribe();
		return subscribe(store, null, callback);
	}, [store]);
	const getSnapshot = () => {
		const key = typeof keyOrSelector === "string" ? keyOrSelector : null;
		const selector = typeof keyOrSelector === "function" ? keyOrSelector : null;
		const state = store?.getState();
		if (selector) return selector(state);
		if (!state) return;
		if (!key) return;
		if (!hasOwnProperty(state, key)) return;
		return state[key];
	};
	return React.useSyncExternalStore(storeSubscribe, getSnapshot, getSnapshot);
}
function useStoreStateObject(store, object) {
	const objRef = React.useRef({});
	const storeSubscribe = React.useCallback((callback) => {
		if (!store) return noopSubscribe();
		return subscribe(store, null, callback);
	}, [store]);
	const getSnapshot = () => {
		const state = store?.getState();
		let updated = false;
		const obj = objRef.current;
		for (const prop in object) {
			const keyOrSelector = object[prop];
			if (typeof keyOrSelector === "function") {
				const value = keyOrSelector(state);
				if (value !== obj[prop]) {
					obj[prop] = value;
					updated = true;
				}
			}
			if (typeof keyOrSelector === "string") {
				if (!state) continue;
				if (!hasOwnProperty(state, keyOrSelector)) continue;
				const value = state[keyOrSelector];
				if (value !== obj[prop]) {
					obj[prop] = value;
					updated = true;
				}
			}
		}
		if (updated) {
			objRef.current = { ...obj };
		}
		return objRef.current;
	};
	return React.useSyncExternalStore(storeSubscribe, getSnapshot, getSnapshot);
}
/**
* Synchronizes the store with the props, including parent store props.
* @param store The store to synchronize.
* @param props The props to synchronize with.
* @param key The key of the value prop.
* @param setKey The key of the setValue prop.
*/
function useStoreProps(store, props, key, setKey) {
	const value = hasOwnProperty(props, key) ? props[key] : undefined;
	const setValue = setKey ? props[setKey] : undefined;
	const propsRef = useLiveRef({
		value,
		setValue
	});
	useSafeLayoutEffect(() => {
		return sync(store, [key], (state, prev) => {
			const { value: value$1, setValue: setValue$1 } = propsRef.current;
			if (!setValue$1) return;
			if (state[key] === prev[key]) return;
			if (state[key] === value$1) return;
			setValue$1(state[key]);
		});
	}, [store, key]);
	useSafeLayoutEffect(() => {
		if (value === undefined) return;
		store.setState(key, value);
		return batch(store, [key], () => {
			if (value === undefined) return;
			store.setState(key, value);
		});
	});
}
/**
* Creates a React store from a core store object and returns a tuple with the
* store and a function to update the store.
* @param createStore A function that receives the props and returns a core
* store object.
* @param props The props to pass to the createStore function.
*/
function useStore(createStore$1, props) {
	const [store, setStore] = React.useState(() => createStore$1(props));
	useSafeLayoutEffect(() => init(store), [store]);
	const useState$1 = React.useCallback((keyOrSelector) => useStoreState(store, keyOrSelector), [store]);
	const memoizedStore = React.useMemo(() => ({
		...store,
		useState: useState$1
	}), [store, useState$1]);
	const updateStore = useEvent(() => {
		setStore((store$1) => createStore$1({
			...props,
			...store$1.getState()
		}));
	});
	return [memoizedStore, updateStore];
}

//#endregion
export { batch, createStore, init, mergeStore, omit$1 as omit, pick$1 as pick, setup, subscribe, sync, throwOnConflictingProps, useStore, useStoreProps, useStoreState, useStoreStateObject };