import { L as removeUndefinedValues, _ as useWrapElement, a as useId, f as useSafeLayoutEffect, h as useUpdateEffect, k as invariant, l as useMergeRefs, w as defaultValue } from "./hooks-H6OmsigH.js";
import { i as forwardRef, n as createHook, r as createStoreContext, t as createElement } from "./system-CMX9uFDP.js";
import { c as mergeStore, d as setup, f as subscribe, l as omit, m as throwOnConflictingProps, n as useStoreProps, o as createStore, p as sync, r as useStoreState, t as useStore } from "./store-DLqhzR2r.js";
import { createContext, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
import { flushSync } from "react-dom";

//#region packages/ariakit-react-core/src/disclosure/disclosure-context.tsx
const ctx$1 = createStoreContext();
/**
* Returns the disclosure store from the nearest disclosure container.
* @example
* function Disclosure() {
*   const store = useDisclosureContext();
*
*   if (!store) {
*     throw new Error("Disclosure must be wrapped in DisclosureProvider");
*   }
*
*   // Use the store...
* }
*/
const useDisclosureContext = ctx$1.useContext;
const useDisclosureScopedContext = ctx$1.useScopedContext;
const useDisclosureProviderContext = ctx$1.useProviderContext;
const DisclosureContextProvider = ctx$1.ContextProvider;
const DisclosureScopedContextProvider = ctx$1.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/dialog/dialog-context.tsx
const ctx = createStoreContext([DisclosureContextProvider], [DisclosureScopedContextProvider]);
/**
* Returns the dialog store from the nearest dialog container.
* @example
* function Dialog() {
*   const store = useDialogContext();
*
*   if (!store) {
*     throw new Error("Dialog must be wrapped in DialogProvider");
*   }
*
*   // Use the store...
* }
*/
const useDialogContext = ctx.useContext;
const useDialogScopedContext = ctx.useScopedContext;
const useDialogProviderContext = ctx.useProviderContext;
const DialogContextProvider = ctx.ContextProvider;
const DialogScopedContextProvider = ctx.ScopedContextProvider;
const DialogHeadingContext = createContext(undefined);
const DialogDescriptionContext = createContext(undefined);

//#endregion
//#region packages/ariakit-react-core/src/disclosure/disclosure-content.tsx
const TagName = "div";
function afterTimeout(timeoutMs, cb) {
	const timeoutId = setTimeout(cb, timeoutMs);
	return () => clearTimeout(timeoutId);
}
function afterPaint(cb) {
	let raf = requestAnimationFrame(() => {
		raf = requestAnimationFrame(cb);
	});
	return () => cancelAnimationFrame(raf);
}
function parseCSSTime(...times) {
	return times.join(", ").split(", ").reduce((longestTime, currentTimeString) => {
		const multiplier = currentTimeString.endsWith("ms") ? 1 : 1e3;
		const currentTime = Number.parseFloat(currentTimeString || "0s") * multiplier;
		if (currentTime > longestTime) return currentTime;
		return longestTime;
	}, 0);
}
function isHidden(mounted, hidden, alwaysVisible) {
	return !alwaysVisible && hidden !== false && (!mounted || !!hidden);
}
/**
* Returns props to create a `DislosureContent` component.
* @see https://ariakit.org/components/disclosure
* @example
* ```jsx
* const store = useDisclosureStore();
* const props = useDisclosureContent({ store });
* <Disclosure store={store}>Disclosure</Disclosure>
* <Role {...props}>Content</Role>
* ```
*/
const useDisclosureContent = createHook(function useDisclosureContent$1({ store, alwaysVisible,...props }) {
	const context = useDisclosureProviderContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "DisclosureContent must receive a `store` prop or be wrapped in a DisclosureProvider component.");
	const ref = useRef(null);
	const id = useId(props.id);
	const [transition, setTransition] = useState(null);
	const open = store.useState("open");
	const mounted = store.useState("mounted");
	const animated = store.useState("animated");
	const contentElement = store.useState("contentElement");
	const otherElement = useStoreState(store.disclosure, "contentElement");
	useSafeLayoutEffect(() => {
		if (!ref.current) return;
		store?.setContentElement(ref.current);
	}, [store]);
	useSafeLayoutEffect(() => {
		let previousAnimated;
		store?.setState("animated", (animated$1) => {
			previousAnimated = animated$1;
			return true;
		});
		return () => {
			if (previousAnimated === undefined) return;
			store?.setState("animated", previousAnimated);
		};
	}, [store]);
	useSafeLayoutEffect(() => {
		if (!animated) return;
		if (!contentElement?.isConnected) {
			setTransition(null);
			return;
		}
		return afterPaint(() => {
			setTransition(open ? "enter" : mounted ? "leave" : null);
		});
	}, [
		animated,
		contentElement,
		open,
		mounted
	]);
	useSafeLayoutEffect(() => {
		if (!store) return;
		if (!animated) return;
		if (!transition) return;
		if (!contentElement) return;
		const stopAnimation = () => store?.setState("animating", false);
		const stopAnimationSync = () => flushSync(stopAnimation);
		if (transition === "leave" && open) return;
		if (transition === "enter" && !open) return;
		if (typeof animated === "number") {
			const timeout$1 = animated;
			return afterTimeout(timeout$1, stopAnimationSync);
		}
		const { transitionDuration, animationDuration, transitionDelay, animationDelay } = getComputedStyle(contentElement);
		const { transitionDuration: transitionDuration2 = "0", animationDuration: animationDuration2 = "0", transitionDelay: transitionDelay2 = "0", animationDelay: animationDelay2 = "0" } = otherElement ? getComputedStyle(otherElement) : {};
		const delay = parseCSSTime(transitionDelay, animationDelay, transitionDelay2, animationDelay2);
		const duration = parseCSSTime(transitionDuration, animationDuration, transitionDuration2, animationDuration2);
		const timeout = delay + duration;
		if (!timeout) {
			if (transition === "enter") {
				store.setState("animated", false);
			}
			stopAnimation();
			return;
		}
		const frameRate = 1e3 / 60;
		const maxTimeout = Math.max(timeout - frameRate, 0);
		return afterTimeout(maxTimeout, stopAnimationSync);
	}, [
		store,
		animated,
		contentElement,
		otherElement,
		open,
		transition
	]);
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(DialogScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	const hidden = isHidden(mounted, props.hidden, alwaysVisible);
	const styleProp = props.style;
	const style = useMemo(() => {
		if (hidden) {
			return {
				...styleProp,
				display: "none"
			};
		}
		return styleProp;
	}, [hidden, styleProp]);
	props = {
		id,
		"data-open": open || undefined,
		"data-enter": transition === "enter" || undefined,
		"data-leave": transition === "leave" || undefined,
		hidden,
		...props,
		ref: useMergeRefs(id ? store.setContentElement : null, ref, props.ref),
		style
	};
	return removeUndefinedValues(props);
});
const DisclosureContentImpl = forwardRef(function DisclosureContentImpl$1(props) {
	const htmlProps = useDisclosureContent(props);
	return createElement(TagName, htmlProps);
});
/**
* Renders an element that can be shown or hidden by a
* [`Disclosure`](https://ariakit.org/components/disclosure) component.
* @see https://ariakit.org/components/disclosure
* @example
* ```jsx {3}
* <DisclosureProvider>
*   <Disclosure>Disclosure</Disclosure>
*   <DisclosureContent>Content</DisclosureContent>
* </DisclosureProvider>
* ```
*/
const DisclosureContent = forwardRef(function DisclosureContent$1({ unmountOnHide,...props }) {
	const context = useDisclosureProviderContext();
	const store = props.store || context;
	const mounted = useStoreState(store, (state) => !unmountOnHide || state?.mounted);
	if (mounted === false) return null;
	return /* @__PURE__ */ jsx(DisclosureContentImpl, { ...props });
});

//#endregion
//#region packages/ariakit-core/src/disclosure/disclosure-store.ts
/**
* Creates a disclosure store.
*/
function createDisclosureStore(props = {}) {
	const store = mergeStore(props.store, omit(props.disclosure, ["contentElement", "disclosureElement"]));
	throwOnConflictingProps(props, store);
	const syncState = store?.getState();
	const open = defaultValue(props.open, syncState?.open, props.defaultOpen, false);
	const animated = defaultValue(props.animated, syncState?.animated, false);
	const initialState = {
		open,
		animated,
		animating: !!animated && open,
		mounted: open,
		contentElement: defaultValue(syncState?.contentElement, null),
		disclosureElement: defaultValue(syncState?.disclosureElement, null)
	};
	const disclosure = createStore(initialState, store);
	setup(disclosure, () => sync(disclosure, ["animated", "animating"], (state) => {
		if (state.animated) return;
		disclosure.setState("animating", false);
	}));
	setup(disclosure, () => subscribe(disclosure, ["open"], () => {
		if (!disclosure.getState().animated) return;
		disclosure.setState("animating", true);
	}));
	setup(disclosure, () => sync(disclosure, ["open", "animating"], (state) => {
		disclosure.setState("mounted", state.open || state.animating);
	}));
	return {
		...disclosure,
		disclosure: props.disclosure,
		setOpen: (value) => disclosure.setState("open", value),
		show: () => disclosure.setState("open", true),
		hide: () => disclosure.setState("open", false),
		toggle: () => disclosure.setState("open", (open$1) => !open$1),
		stopAnimation: () => disclosure.setState("animating", false),
		setContentElement: (value) => disclosure.setState("contentElement", value),
		setDisclosureElement: (value) => disclosure.setState("disclosureElement", value)
	};
}

//#endregion
//#region packages/ariakit-react-core/src/disclosure/disclosure-store.ts
function useDisclosureStoreProps(store, update, props) {
	useUpdateEffect(update, [props.store, props.disclosure]);
	useStoreProps(store, props, "open", "setOpen");
	useStoreProps(store, props, "mounted", "setMounted");
	useStoreProps(store, props, "animated");
	return Object.assign(store, { disclosure: props.disclosure });
}
/**
* Creates a disclosure store to control the state of
* [Disclosure](https://ariakit.org/components/disclosure) components.
* @see https://ariakit.org/components/disclosure
* @example
* ```jsx
* const disclosure = useDisclosureStore();
*
* <Disclosure store={disclosure}>Disclosure</Disclosure>
* <DisclosureContent store={disclosure}>Content</DisclosureContent>
* ```
*/
function useDisclosureStore(props = {}) {
	const [store, update] = useStore(createDisclosureStore, props);
	return useDisclosureStoreProps(store, update, props);
}

//#endregion
export { isHidden as a, DialogDescriptionContext as c, useDialogContext as d, useDialogProviderContext as f, useDisclosureProviderContext as g, useDisclosureContext as h, DisclosureContent as i, DialogHeadingContext as l, DisclosureContextProvider as m, useDisclosureStoreProps as n, useDisclosureContent as o, useDialogScopedContext as p, createDisclosureStore as r, DialogContextProvider as s, useDisclosureStore as t, DialogScopedContextProvider as u };