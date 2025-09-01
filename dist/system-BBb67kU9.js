import { getRefProperty, mergeProps, useMergeRefs } from "./hooks-BNp9qiVx.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/utils/system.tsx
/**
* The same as `React.forwardRef` but passes the `ref` as a prop and returns a
* component with the same generic type.
*/
function forwardRef(render) {
	const Role = React.forwardRef((props, ref) => render({
		...props,
		ref
	}));
	Role.displayName = render.displayName || render.name;
	return Role;
}
/**
* The same as `React.memo` but returns a component with the same generic type.
*/
function memo(Component, propsAreEqual) {
	return React.memo(Component, propsAreEqual);
}
/**
* Creates a React element that supports the `render` and `wrapElement` props.
*/
function createElement(Type, props) {
	const { wrapElement, render,...rest } = props;
	const mergedRef = useMergeRefs(props.ref, getRefProperty(render));
	let element;
	if (React.isValidElement(render)) {
		const renderProps = {
			...render.props,
			ref: mergedRef
		};
		element = React.cloneElement(render, mergeProps(rest, renderProps));
	} else if (render) {
		element = render(rest);
	} else {
		element = /* @__PURE__ */ jsx(Type, { ...rest });
	}
	if (wrapElement) {
		return wrapElement(element);
	}
	return element;
}
/**
* Creates a component hook that accepts props and returns props so they can be
* passed to a React element.
*/
function createHook(useProps) {
	const useRole = (props = {}) => {
		return useProps(props);
	};
	useRole.displayName = useProps.name;
	return useRole;
}
/**
* Creates an Ariakit store context with hooks and provider components.
*/
function createStoreContext(providers = [], scopedProviders = []) {
	const context = React.createContext(undefined);
	const scopedContext = React.createContext(undefined);
	const useContext$1 = () => React.useContext(context);
	const useScopedContext = (onlyScoped = false) => {
		const scoped = React.useContext(scopedContext);
		const store = useContext$1();
		if (onlyScoped) return scoped;
		return scoped || store;
	};
	const useProviderContext = () => {
		const scoped = React.useContext(scopedContext);
		const store = useContext$1();
		if (scoped && scoped === store) return;
		return store;
	};
	const ContextProvider = (props) => {
		return providers.reduceRight((children, Provider) => /* @__PURE__ */ jsx(Provider, {
			...props,
			children
		}), /* @__PURE__ */ jsx(context.Provider, { ...props }));
	};
	const ScopedContextProvider = (props) => {
		return /* @__PURE__ */ jsx(ContextProvider, {
			...props,
			children: scopedProviders.reduceRight((children, Provider) => /* @__PURE__ */ jsx(Provider, {
				...props,
				children
			}), /* @__PURE__ */ jsx(scopedContext.Provider, { ...props }))
		});
	};
	return {
		context,
		scopedContext,
		useContext: useContext$1,
		useScopedContext,
		useProviderContext,
		ContextProvider,
		ScopedContextProvider
	};
}

//#endregion
export { createElement, createHook, createStoreContext, forwardRef, memo };