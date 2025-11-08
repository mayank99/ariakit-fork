import { G as isFocusEventOutside, _ as useWrapElement, b as setRef, f as useSafeLayoutEffect, l as useMergeRefs, rt as getDocument } from "./hooks-H6OmsigH.js";
import { c as getPreviousTabbable, f as restoreFocusIn, s as getNextTabbable, t as disableFocusIn } from "./focus-BzfNYadt.js";
import { i as forwardRef, n as createHook, t as createElement } from "./system-CMX9uFDP.js";
import { t as FocusTrap } from "./focus-trap-B0b8Zm2m.js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { createPortal } from "react-dom";

//#region packages/ariakit-react-core/src/portal/portal-context.tsx
/**
* Stores the element that will contain the portal. By default, it will be the
* body of the document.
* @example
* ```jsx
* const container = document.getElementById("container");
*
* function App() {
*   return (
*     <PortalContext.Provider value={container}>
*       <Portal />
*     </PortalContext.Provider>
*   );
* }
* ```
*/
const PortalContext = createContext(null);

//#endregion
//#region packages/ariakit-react-core/src/portal/portal.tsx
const TagName = "div";
function getRootElement(element) {
	return getDocument(element).body;
}
function getPortalElement(element, portalElement) {
	if (!portalElement) {
		return getDocument(element).createElement("div");
	}
	if (typeof portalElement === "function") {
		return portalElement(element);
	}
	return portalElement;
}
function getRandomId(prefix = "id") {
	return `${prefix ? `${prefix}-` : ""}${Math.random().toString(36).slice(2, 8)}`;
}
function queueFocus(element) {
	queueMicrotask(() => {
		element?.focus();
	});
}
/**
* Returns props to create a `Portal` component.
* @see https://ariakit.org/components/portal
* @example
* ```jsx
* const props = usePortal();
* <Role {...props}>Content</Role>
* ```
*/
const usePortal = createHook(function usePortal$1({ preserveTabOrder, preserveTabOrderAnchor, portalElement, portalRef, portal = true,...props }) {
	const ref = useRef(null);
	const refProp = useMergeRefs(ref, props.ref);
	const context = useContext(PortalContext);
	const [portalNode, setPortalNode] = useState(null);
	const [anchorPortalNode, setAnchorPortalNode] = useState(null);
	const outerBeforeRef = useRef(null);
	const innerBeforeRef = useRef(null);
	const innerAfterRef = useRef(null);
	const outerAfterRef = useRef(null);
	useSafeLayoutEffect(() => {
		const element = ref.current;
		if (!element || !portal) {
			setPortalNode(null);
			return;
		}
		const portalEl = getPortalElement(element, portalElement);
		if (!portalEl) {
			setPortalNode(null);
			return;
		}
		const isPortalInDocument = portalEl.isConnected;
		if (!isPortalInDocument) {
			const rootElement = context || getRootElement(element);
			rootElement.appendChild(portalEl);
		}
		if (!portalEl.id) {
			portalEl.id = element.id ? `portal/${element.id}` : getRandomId();
		}
		setPortalNode(portalEl);
		setRef(portalRef, portalEl);
		if (isPortalInDocument) return;
		return () => {
			portalEl.remove();
			setRef(portalRef, null);
		};
	}, [
		portal,
		portalElement,
		context,
		portalRef
	]);
	useSafeLayoutEffect(() => {
		if (!portal) return;
		if (!preserveTabOrder) return;
		if (!preserveTabOrderAnchor) return;
		const doc = getDocument(preserveTabOrderAnchor);
		const element = doc.createElement("span");
		element.style.position = "fixed";
		preserveTabOrderAnchor.insertAdjacentElement("afterend", element);
		setAnchorPortalNode(element);
		return () => {
			element.remove();
			setAnchorPortalNode(null);
		};
	}, [
		portal,
		preserveTabOrder,
		preserveTabOrderAnchor
	]);
	useEffect(() => {
		if (!portalNode) return;
		if (!preserveTabOrder) return;
		let raf = 0;
		const onFocus = (event) => {
			if (!isFocusEventOutside(event)) return;
			const focusing = event.type === "focusin";
			cancelAnimationFrame(raf);
			if (focusing) {
				return restoreFocusIn(portalNode);
			}
			raf = requestAnimationFrame(() => {
				disableFocusIn(portalNode, true);
			});
		};
		portalNode.addEventListener("focusin", onFocus, true);
		portalNode.addEventListener("focusout", onFocus, true);
		return () => {
			cancelAnimationFrame(raf);
			portalNode.removeEventListener("focusin", onFocus, true);
			portalNode.removeEventListener("focusout", onFocus, true);
		};
	}, [portalNode, preserveTabOrder]);
	props = useWrapElement(props, (element) => {
		element = /* @__PURE__ */ jsx(PortalContext.Provider, {
			value: portalNode || context,
			children: element
		});
		if (!portal) return element;
		if (!portalNode) {
			return /* @__PURE__ */ jsx("span", {
				ref: refProp,
				id: props.id,
				style: { position: "fixed" },
				hidden: true
			});
		}
		element = /* @__PURE__ */ jsxs(Fragment$1, { children: [
			preserveTabOrder && portalNode && /* @__PURE__ */ jsx(FocusTrap, {
				ref: innerBeforeRef,
				"data-focus-trap": props.id,
				className: "__focus-trap-inner-before",
				onFocus: (event) => {
					if (isFocusEventOutside(event, portalNode)) {
						queueFocus(getNextTabbable());
					} else {
						queueFocus(outerBeforeRef.current);
					}
				}
			}),
			element,
			preserveTabOrder && portalNode && /* @__PURE__ */ jsx(FocusTrap, {
				ref: innerAfterRef,
				"data-focus-trap": props.id,
				className: "__focus-trap-inner-after",
				onFocus: (event) => {
					if (isFocusEventOutside(event, portalNode)) {
						queueFocus(getPreviousTabbable());
					} else {
						queueFocus(outerAfterRef.current);
					}
				}
			})
		] });
		if (portalNode) {
			element = createPortal(element, portalNode);
		}
		let preserveTabOrderElement = /* @__PURE__ */ jsxs(Fragment$1, { children: [
			preserveTabOrder && portalNode && /* @__PURE__ */ jsx(FocusTrap, {
				ref: outerBeforeRef,
				"data-focus-trap": props.id,
				className: "__focus-trap-outer-before",
				onFocus: (event) => {
					const fromOuter = event.relatedTarget === outerAfterRef.current;
					if (!fromOuter && isFocusEventOutside(event, portalNode)) {
						queueFocus(innerBeforeRef.current);
					} else {
						queueFocus(getPreviousTabbable());
					}
				}
			}),
			preserveTabOrder && /* @__PURE__ */ jsx("span", {
				"aria-owns": portalNode?.id,
				style: { position: "fixed" }
			}),
			preserveTabOrder && portalNode && /* @__PURE__ */ jsx(FocusTrap, {
				ref: outerAfterRef,
				"data-focus-trap": props.id,
				className: "__focus-trap-outer-after",
				onFocus: (event) => {
					if (isFocusEventOutside(event, portalNode)) {
						queueFocus(innerAfterRef.current);
					} else {
						const nextTabbable = getNextTabbable();
						if (nextTabbable === innerBeforeRef.current) {
							requestAnimationFrame(() => getNextTabbable()?.focus());
							return;
						}
						queueFocus(nextTabbable);
					}
				}
			})
		] });
		if (anchorPortalNode && preserveTabOrder) {
			preserveTabOrderElement = createPortal(preserveTabOrderElement, anchorPortalNode);
		}
		return /* @__PURE__ */ jsxs(Fragment$1, { children: [preserveTabOrderElement, element] });
	}, [
		portalNode,
		context,
		portal,
		props.id,
		preserveTabOrder,
		anchorPortalNode
	]);
	props = {
		...props,
		ref: refProp
	};
	return props;
});
/**
* Renders an element using [React
* Portal](https://react.dev/reference/react-dom/createPortal).
*
* By default, the portal element is a `div` element appended to the
* `document.body` element. You can customize this with the
* [`portalElement`](https://ariakit.org/reference/portal#portalelement) prop.
*
* The
* [`preserveTabOrder`](https://ariakit.org/reference/portal#preservetaborder)
* prop allows this component to manage the tab order of the elements. It
* ensures the tab order remains consistent with the original location where the
* portal was rendered in the React tree, instead of the final location in the
* DOM. The
* [`preserveTabOrderAnchor`](https://ariakit.org/reference/portal#preservetaborderanchor)
* prop can specify a different location from which the tab order is preserved.
* @see https://ariakit.org/components/portal
* @example
* ```jsx
* <Portal>Content</Portal>
* ```
*/
const Portal = forwardRef(function Portal$1(props) {
	const htmlProps = usePortal(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { usePortal as n, PortalContext as r, Portal as t };