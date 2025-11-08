import { dt as isFrame, mt as isVisible, nt as getActiveElement, tt as contains } from "./hooks-H6OmsigH.js";

//#region packages/ariakit-core/src/utils/focus.ts
const selector = "input:not([type='hidden']):not([disabled]), select:not([disabled]), " + "textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], " + "summary, iframe, object, embed, area[href], audio[controls], " + "video[controls], [contenteditable]:not([contenteditable='false'])";
function hasNegativeTabIndex(element) {
	const tabIndex = Number.parseInt(element.getAttribute("tabindex") || "0", 10);
	return tabIndex < 0;
}
/**
* Checks whether `element` is focusable or not.
* @example
* isFocusable(document.querySelector("input")); // true
* isFocusable(document.querySelector("input[tabindex='-1']")); // true
* isFocusable(document.querySelector("input[hidden]")); // false
* isFocusable(document.querySelector("input:disabled")); // false
*/
function isFocusable(element) {
	if (!element.matches(selector)) return false;
	if (!isVisible(element)) return false;
	if (element.closest("[inert]")) return false;
	return true;
}
/**
* Checks whether `element` is tabbable or not.
* @example
* isTabbable(document.querySelector("input")); // true
* isTabbable(document.querySelector("input[tabindex='-1']")); // false
* isTabbable(document.querySelector("input[hidden]")); // false
* isTabbable(document.querySelector("input:disabled")); // false
*/
function isTabbable(element) {
	if (!isFocusable(element)) return false;
	if (hasNegativeTabIndex(element)) return false;
	if (!("form" in element)) return true;
	if (!element.form) return true;
	if (element.checked) return true;
	if (element.type !== "radio") return true;
	const radioGroup = element.form.elements.namedItem(element.name);
	if (!radioGroup) return true;
	if (!("length" in radioGroup)) return true;
	const activeElement = getActiveElement(element);
	if (!activeElement) return true;
	if (activeElement === element) return true;
	if (!("form" in activeElement)) return true;
	if (activeElement.form !== element.form) return true;
	if (activeElement.name !== element.name) return true;
	return false;
}
/**
* Returns all the focusable elements in `container`.
*/
function getAllFocusableIn(container, includeContainer) {
	const elements = Array.from(container.querySelectorAll(selector));
	if (includeContainer) {
		elements.unshift(container);
	}
	const focusableElements = elements.filter(isFocusable);
	focusableElements.forEach((element, i) => {
		if (isFrame(element) && element.contentDocument) {
			const frameBody = element.contentDocument.body;
			focusableElements.splice(i, 1, ...getAllFocusableIn(frameBody));
		}
	});
	return focusableElements;
}
/**
* Returns all the focusable elements in the document.
*/
function getAllFocusable(includeBody) {
	return getAllFocusableIn(document.body, includeBody);
}
/**
* Returns the first focusable element in `container`.
*/
function getFirstFocusableIn(container, includeContainer) {
	const [first] = getAllFocusableIn(container, includeContainer);
	return first || null;
}
/**
* Returns the first focusable element in the document.
*/
function getFirstFocusable(includeBody) {
	return getFirstFocusableIn(document.body, includeBody);
}
/**
* Returns all the tabbable elements in `container`, including the container
* itself.
*/
function getAllTabbableIn(container, includeContainer, fallbackToFocusable) {
	const elements = Array.from(container.querySelectorAll(selector));
	const tabbableElements = elements.filter(isTabbable);
	if (includeContainer && isTabbable(container)) {
		tabbableElements.unshift(container);
	}
	tabbableElements.forEach((element, i) => {
		if (isFrame(element) && element.contentDocument) {
			const frameBody = element.contentDocument.body;
			const allFrameTabbable = getAllTabbableIn(frameBody, false, fallbackToFocusable);
			tabbableElements.splice(i, 1, ...allFrameTabbable);
		}
	});
	if (!tabbableElements.length && fallbackToFocusable) {
		return elements;
	}
	return tabbableElements;
}
/**
* Returns all the tabbable elements in the document.
*/
function getAllTabbable(fallbackToFocusable) {
	return getAllTabbableIn(document.body, false, fallbackToFocusable);
}
/**
* Returns the first tabbable element in `container`, including the container
* itself if it's tabbable.
*/
function getFirstTabbableIn(container, includeContainer, fallbackToFocusable) {
	const [first] = getAllTabbableIn(container, includeContainer, fallbackToFocusable);
	return first || null;
}
/**
* Returns the first tabbable element in the document.
*/
function getFirstTabbable(fallbackToFocusable) {
	return getFirstTabbableIn(document.body, false, fallbackToFocusable);
}
/**
* Returns the last tabbable element in `container`, including the container
* itself if it's tabbable.
*/
function getLastTabbableIn(container, includeContainer, fallbackToFocusable) {
	const allTabbable = getAllTabbableIn(container, includeContainer, fallbackToFocusable);
	return allTabbable[allTabbable.length - 1] || null;
}
/**
* Returns the last tabbable element in the document.
*/
function getLastTabbable(fallbackToFocusable) {
	return getLastTabbableIn(document.body, false, fallbackToFocusable);
}
/**
* Returns the next tabbable element in `container`.
*/
function getNextTabbableIn(container, includeContainer, fallbackToFirst, fallbackToFocusable) {
	const activeElement = getActiveElement(container);
	const allFocusable = getAllFocusableIn(container, includeContainer);
	const activeIndex = allFocusable.indexOf(activeElement);
	const nextFocusableElements = allFocusable.slice(activeIndex + 1);
	return nextFocusableElements.find(isTabbable) || (fallbackToFirst ? allFocusable.find(isTabbable) : null) || (fallbackToFocusable ? nextFocusableElements[0] : null) || null;
}
/**
* Returns the next tabbable element in the document.
*/
function getNextTabbable(fallbackToFirst, fallbackToFocusable) {
	return getNextTabbableIn(document.body, false, fallbackToFirst, fallbackToFocusable);
}
/**
* Returns the previous tabbable element in `container`.
*
*/
function getPreviousTabbableIn(container, includeContainer, fallbackToLast, fallbackToFocusable) {
	const activeElement = getActiveElement(container);
	const allFocusable = getAllFocusableIn(container, includeContainer).reverse();
	const activeIndex = allFocusable.indexOf(activeElement);
	const previousFocusableElements = allFocusable.slice(activeIndex + 1);
	return previousFocusableElements.find(isTabbable) || (fallbackToLast ? allFocusable.find(isTabbable) : null) || (fallbackToFocusable ? previousFocusableElements[0] : null) || null;
}
/**
* Returns the previous tabbable element in the document.
*/
function getPreviousTabbable(fallbackToFirst, fallbackToFocusable) {
	return getPreviousTabbableIn(document.body, false, fallbackToFirst, fallbackToFocusable);
}
/**
* Returns the closest focusable element.
*/
function getClosestFocusable(element) {
	while (element && !isFocusable(element)) {
		element = element.closest(selector);
	}
	return element || null;
}
/**
* Checks if `element` has focus. Elements that are referenced by
* `aria-activedescendant` are also considered.
* @example
* hasFocus(document.getElementById("id"));
*/
function hasFocus(element) {
	const activeElement = getActiveElement(element);
	if (!activeElement) return false;
	if (activeElement === element) return true;
	const activeDescendant = activeElement.getAttribute("aria-activedescendant");
	if (!activeDescendant) return false;
	return activeDescendant === element.id;
}
/**
* Checks if `element` has focus within. Elements that are referenced by
* `aria-activedescendant` are also considered.
* @example
* hasFocusWithin(document.getElementById("id"));
*/
function hasFocusWithin(element) {
	const activeElement = getActiveElement(element);
	if (!activeElement) return false;
	if (contains(element, activeElement)) return true;
	const activeDescendant = activeElement.getAttribute("aria-activedescendant");
	if (!activeDescendant) return false;
	if (!("id" in element)) return false;
	if (activeDescendant === element.id) return true;
	return !!element.querySelector(`#${CSS.escape(activeDescendant)}`);
}
/**
* Focus on an element only if it's not already focused.
*/
function focusIfNeeded(element) {
	if (!hasFocusWithin(element) && isFocusable(element)) {
		element.focus();
	}
}
/**
* Disable focus on `element`.
*/
function disableFocus(element) {
	const currentTabindex = element.getAttribute("tabindex") ?? "";
	element.setAttribute("data-tabindex", currentTabindex);
	element.setAttribute("tabindex", "-1");
}
/**
* Makes elements inside container not tabbable.
*/
function disableFocusIn(container, includeContainer) {
	const tabbableElements = getAllTabbableIn(container, includeContainer);
	for (const element of tabbableElements) {
		disableFocus(element);
	}
}
/**
* Restores tabbable elements inside container that were affected by
* disableFocusIn.
*/
function restoreFocusIn(container) {
	const elements = container.querySelectorAll("[data-tabindex]");
	const restoreTabIndex = (element) => {
		const tabindex = element.getAttribute("data-tabindex");
		element.removeAttribute("data-tabindex");
		if (tabindex) {
			element.setAttribute("tabindex", tabindex);
		} else {
			element.removeAttribute("tabindex");
		}
	};
	if (container.hasAttribute("data-tabindex")) {
		restoreTabIndex(container);
	}
	for (const element of elements) {
		restoreTabIndex(element);
	}
}
/**
* Focus on element and scroll into view.
*/
function focusIntoView(element, options) {
	if (!("scrollIntoView" in element)) {
		element.focus();
	} else {
		element.focus({ preventScroll: true });
		element.scrollIntoView({
			block: "nearest",
			inline: "nearest",
			...options
		});
	}
}

//#endregion
export { getClosestFocusable as a, getPreviousTabbable as c, isFocusable as d, restoreFocusIn as f, getAllTabbableIn as i, hasFocus as l, focusIfNeeded as n, getFirstTabbableIn as o, focusIntoView as r, getNextTabbable as s, disableFocusIn as t, hasFocusWithin as u };