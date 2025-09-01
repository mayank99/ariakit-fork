import { applyState, cx, defaultValue, getDocument, invariant, isInteger, isObject, isTextField, useBooleanEvent, useEvent, useId, useInitialValue, useMergeRefs, useTagName, useUpdateEffect, useWrapElement } from "./hooks-BNp9qiVx.js";
import { getFirstTabbableIn } from "./focus-fCQxuv3j.js";
import { createElement, createHook, createStoreContext, forwardRef, memo } from "./system-BBb67kU9.js";
import { useFocusable } from "./focusable-COT5YOJE.js";
import { useButton } from "./button-COHRpVB7.js";
import { createStore, init, setup, sync, throwOnConflictingProps, useStore, useStoreProps } from "./store-Ddr50htY.js";
import { useCheckbox, useCheckboxStore } from "./checkbox-store-B8A7dhoB.js";
import { CollectionContextProvider, CollectionScopedContextProvider, createCollectionStore, useCollectionStoreProps } from "./collection-store-DU4ae2No.js";
import { useCollectionItem } from "./collection-item-Cay2EvFB.js";
import { useGroup, useGroupLabel } from "./group-label-D1EhJCOe.js";
import { useRadio } from "./radio-DgJP70O3.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";

//#region packages/ariakit-react-core/src/form/form-context.tsx
const ctx = createStoreContext([CollectionContextProvider], [CollectionScopedContextProvider]);
/**
* Returns the form store from the nearest form container.
* @example
* function FormInput() {
*   const store = useFormContext();
*
*   if (!store) {
*     throw new Error("FormInput must be wrapped in FormProvider");
*   }
*
*   // Use the store...
* }
*/
const useFormContext = ctx.useContext;
const useFormScopedContext = ctx.useScopedContext;
const useFormProviderContext = ctx.useProviderContext;
const FormContextProvider = ctx.ContextProvider;
const FormScopedContextProvider = ctx.ScopedContextProvider;

//#endregion
//#region packages/ariakit-react-core/src/form/form.tsx
const TagName$15 = "form";
function isField(element, items) {
	return items.some((item) => item.type === "field" && item.element === element);
}
function getFirstInvalidField(items) {
	return items.find((item) => item.type === "field" && item.element?.getAttribute("aria-invalid") === "true");
}
/**
* Returns props to create a `Form` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore();
* const props = useForm({ store, render: <form /> });
* <Role {...props} />
* ```
*/
const useForm = createHook(function useForm$1({ store, validateOnChange = true, validateOnBlur = true, resetOnUnmount = false, resetOnSubmit = true, autoFocusOnSubmit = true,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "Form must receive a `store` prop or be wrapped in a FormProvider component.");
	const ref = useRef(null);
	const values = store.useState("values");
	const submitSucceed = store.useState("submitSucceed");
	const submitFailed = store.useState("submitFailed");
	const items = store.useState("items");
	const defaultValues = useInitialValue(values);
	useEffect(() => resetOnUnmount ? store?.reset : undefined, [resetOnUnmount, store]);
	useUpdateEffect(() => {
		if (!validateOnChange) return;
		if (values === defaultValues) return;
		store?.validate();
	}, [
		validateOnChange,
		values,
		defaultValues,
		store
	]);
	useEffect(() => {
		if (!resetOnSubmit) return;
		if (!submitSucceed) return;
		store?.reset();
	}, [
		resetOnSubmit,
		submitSucceed,
		store
	]);
	const [shouldFocusOnSubmit, setShouldFocusOnSubmit] = useState(false);
	useEffect(() => {
		if (!shouldFocusOnSubmit) return;
		if (!submitFailed) return;
		const field = getFirstInvalidField(items);
		const element = field?.element;
		if (!element) return;
		setShouldFocusOnSubmit(false);
		element.focus();
		if (isTextField(element)) {
			element.select();
		}
	}, [
		autoFocusOnSubmit,
		submitFailed,
		items
	]);
	const onSubmitProp = props.onSubmit;
	const onSubmit = useEvent((event) => {
		onSubmitProp?.(event);
		if (event.defaultPrevented) return;
		event.preventDefault();
		store?.submit();
		if (!autoFocusOnSubmit) return;
		setShouldFocusOnSubmit(true);
	});
	const onBlurProp = props.onBlur;
	const onBlur = useEvent((event) => {
		onBlurProp?.(event);
		if (event.defaultPrevented) return;
		if (!validateOnBlur) return;
		if (!store) return;
		if (!isField(event.target, store.getState().items)) return;
		store.validate();
	});
	const onResetProp = props.onReset;
	const onReset = useEvent((event) => {
		onResetProp?.(event);
		if (event.defaultPrevented) return;
		event.preventDefault();
		store?.reset();
	});
	props = useWrapElement(props, (element) => /* @__PURE__ */ jsx(FormScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	const tagName = useTagName(ref, TagName$15);
	props = {
		role: tagName !== "form" ? "form" : undefined,
		noValidate: true,
		...props,
		ref: useMergeRefs(ref, props.ref),
		onSubmit,
		onBlur,
		onReset
	};
	return props;
});
/**
* Renders a form element and provides a [form
* store](https://ariakit.org/reference/use-form-store) to its controls.
*
* The form is automatically validated on change and on blur. This behavior can
* be disabled with the
* [`validateOnChange`](https://ariakit.org/reference/form#validateonchange) and
* [`validateOnBlur`](https://ariakit.org/reference/form#validateonblur) props.
*
* When the form is submitted with errors, the first invalid field is
* automatically focused thanks to the
* [`autoFocusOnSubmit`](https://ariakit.org/reference/form#autofocusonsubmit)
* prop. If it's successful, the
* [`resetOnSubmit`](https://ariakit.org/reference/form#resetonsubmit) prop
* ensures the form is reset to its initial values as defined by the
* [`defaultValues`](https://ariakit.org/reference/use-form-store#defaultvalues)
* option on the [store](https://ariakit.org/reference/use-form-store).
* @see https://ariakit.org/components/form
* @example
* ```jsx {5-8}
* const form = useFormStore({
*   defaultValues: { username: "johndoe" },
* });
*
* <Form store={form}>
*   <FormLabel name={form.names.username}>Username</FormLabel>
*   <FormInput name={form.names.username} />
* </Form>
* ```
*/
const Form = forwardRef(function Form$1(props) {
	const htmlProps = useForm(props);
	return createElement(TagName$15, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/form/form-control.tsx
const TagName$14 = "input";
function getNamedElement(ref, name) {
	const element = ref.current;
	if (!element) return null;
	if (element.name === name) return element;
	if (element.form) {
		return element.form.elements.namedItem(name);
	}
	const document = getDocument(element);
	return document.getElementsByName(name)[0];
}
function useItem(store, name, type) {
	return store.useState((state) => state.items.find((item) => item.type === type && item.name === name));
}
/**
* Returns props to create a `FormControl` component. Unlike `useFormInput`,
* this hook doesn't automatically returns the `value` and `onChange` props.
* This is so we can use it not only for native form elements but also for
* custom components whose value is not controlled by the native `value` and
* `onChange` props.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { content: "" } });
* const props = useFormControl({ store, name: store.names.content });
* const value = store.useValue(store.names.content);
*
* <Form store={store}>
*   <FormLabel name={store.names.content}>Content</FormLabel>
*   <Role
*     {...props}
*     value={value}
*     onChange={(value) => store.setValue(store.names.content, value)}
*     render={<Editor />}
*   />
* </Form>
* ```
*/
const useFormControl = createHook(function useFormControl$1({ store, name: nameProp, getItem: getItemProp, touchOnBlur = true,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormControl must be wrapped in a Form component.");
	const name = `${nameProp}`;
	const id = useId(props.id);
	const ref = useRef(null);
	store.useValidate(async () => {
		const element = getNamedElement(ref, name);
		if (!element) return;
		await Promise.resolve();
		if ("validity" in element && !element.validity.valid) {
			store?.setError(name, element.validationMessage);
		}
	});
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			id: id || item.id,
			name,
			type: "field"
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [
		id,
		name,
		getItemProp
	]);
	const onBlurProp = props.onBlur;
	const touchOnBlurProp = useBooleanEvent(touchOnBlur);
	const onBlur = useEvent((event) => {
		onBlurProp?.(event);
		if (event.defaultPrevented) return;
		if (!touchOnBlurProp(event)) return;
		store?.setFieldTouched(name, true);
	});
	const label = useItem(store, name, "label");
	const error = useItem(store, name, "error");
	const description = useItem(store, name, "description");
	const describedBy = cx(error?.id, description?.id, props["aria-describedby"]);
	const invalid = store.useState(() => !!store?.getError(name) && store.getFieldTouched(name));
	props = {
		id,
		"aria-labelledby": label?.id,
		"aria-invalid": invalid,
		...props,
		"aria-describedby": describedBy || undefined,
		ref: useMergeRefs(ref, props.ref),
		onBlur
	};
	props = useCollectionItem({
		store,
		...props,
		name,
		getItem
	});
	return props;
});
/**
* Abstract component that renders a form control. Unlike
* [`FormInput`](https://ariakit.org/reference/form-input), this component
* doesn't automatically pass the `value` and `onChange` props down to the
* underlying element. This is so we can use it not only for native form
* elements but also for custom components whose value is not controlled by the
* native `value` and `onChange` props.
* @see https://ariakit.org/components/form
* @example
* ```jsx {11-19}
* const form = useFormStore({
*   defaultValues: {
*     content: "",
*   },
* });
*
* const value = form.useValue(form.names.content);
*
* <Form store={form}>
*   <FormLabel name={form.names.content}>Content</FormLabel>
*   <FormControl
*     name={form.names.content}
*     render={
*       <Editor
*         value={value}
*         onChange={(value) => form.setValue(form.names.content, value)}
*       />
*     }
*   />
* </Form>
* ```
*/
const FormControl = memo(forwardRef(function FormControl$1(props) {
	const htmlProps = useFormControl(props);
	return createElement(TagName$14, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/form/form-checkbox.tsx
const TagName$13 = "input";
/**
* Returns props to create a `FormCheckbox` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { acceptTerms: false } });
* const props = useFormCheckbox({ store, name: store.names.acceptTerms });
* <Form store={store}>
*   <label>
*     <Role {...props} />
*     Accept terms
*   </label>
* </Form>
* ```
*/
const useFormCheckbox = createHook(function useFormCheckbox$1({ store, name: nameProp, value, checked, defaultChecked,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormCheckbox must be wrapped in a Form component.");
	const name = `${nameProp}`;
	const checkboxStore = useCheckboxStore({
		value: store.useValue(name),
		setValue: (value$1) => store?.setValue(name, value$1)
	});
	props = useCheckbox({
		store: checkboxStore,
		value,
		checked,
		...props
	});
	props = useFormControl({
		store,
		name,
		"aria-labelledby": undefined,
		...props
	});
	return props;
});
/**
* Renders a checkbox input as a form control, representing a boolean, string,
* number, or array value.
* @see https://ariakit.org/components/form
* @example
* ```jsx {9}
* const form = useFormStore({
*   defaultValues: {
*     acceptTerms: false,
*   },
* });
*
* <Form store={form}>
*   <label>
*     <FormCheckbox name={form.names.acceptTerms} />
*     Accept terms
*   </label>
* </Form>
* ```
*/
const FormCheckbox = memo(forwardRef(function FormCheckbox$1(props) {
	const htmlProps = useFormCheckbox(props);
	return createElement(TagName$13, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/form/form-description.tsx
const TagName$12 = "div";
/**
* Returns props to create a `FormDescription` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { password: "" } });
* const props = useFormDescription({ store, name: store.names.password });
* <Form store={store}>
*   <FormLabel name={store.names.password}>Password</FormLabel>
*   <FormInput name={store.names.password} type="password" />
*   <Role {...props}>Password with at least 8 characters.</Role>
* </Form>
* ```
*/
const useFormDescription = createHook(function useFormDescription$1({ store, name: nameProp, getItem: getItemProp,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormDescription must be wrapped in a Form component.");
	const id = useId(props.id);
	const ref = useRef(null);
	const name = `${nameProp}`;
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			id: id || item.id,
			name,
			type: "description"
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [
		id,
		name,
		getItemProp
	]);
	props = {
		id,
		...props,
		ref: useMergeRefs(ref, props.ref)
	};
	props = useCollectionItem({
		store,
		...props,
		getItem
	});
	return props;
});
/**
* Renders a description element for a form field, which will automatically
* receive an `aria-describedby` attribute pointing to this element.
* @see https://ariakit.org/components/form
* @example
* ```jsx {10-12}
* const form = useFormStore({
*   defaultValues: {
*     password: "",
*   },
* });
*
* <Form store={form}>
*   <FormLabel name={form.names.password}>Password</FormLabel>
*   <FormInput name={form.names.password} type="password" />
*   <FormDescription name={form.names.password}>
*     Password with at least 8 characters.
*   </FormDescription>
* </Form>
* ```
*/
const FormDescription = memo(forwardRef(function FormDescription$1(props) {
	const htmlProps = useFormDescription(props);
	return createElement(TagName$12, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/form/form-error.tsx
const TagName$11 = "div";
/**
* Returns props to create a `FormDescription` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { email: "" } });
* const props = useFormError({ store, name: store.names.email });
*
* store.useValidate(() => {
*   if (!store.getValue(store.names.email)) {
*     store.setError(store.names.email, "Email is required!");
*   }
* });
*
* <Form store={store}>
*   <FormLabel name={store.names.email}>Email</FormLabel>
*   <FormInput name={store.names.email} />
*   <Role {...props} />
* </Form>
* ```
*/
const useFormError = createHook(function useFormError$1({ store, name: nameProp, getItem: getItemProp,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormError must be wrapped in a Form component.");
	const id = useId(props.id);
	const ref = useRef(null);
	const name = `${nameProp}`;
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			id: id || item.id,
			name,
			type: "error"
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [
		id,
		name,
		getItemProp
	]);
	const children = store.useState(() => {
		const error = store?.getError(name);
		if (error == null) return;
		if (!store?.getFieldTouched(name)) return;
		return error;
	});
	props = {
		id,
		role: "alert",
		children,
		...props,
		ref: useMergeRefs(ref, props.ref)
	};
	props = useCollectionItem({
		store,
		...props,
		getItem
	});
	return props;
});
/**
* Renders an element that shows an error message. The `children` will
* automatically display the error message defined in the store.
* @see https://ariakit.org/components/form
* @example
* ```jsx {16}
* const form = useFormStore({
*   defaultValues: {
*     email: "",
*   },
* });
*
* form.useValidate(() => {
*   if (!form.values.email) {
*     form.setError(form.names.email, "Email is required!");
*   }
* });
*
* <Form store={form}>
*   <FormLabel name={form.names.email}>Email</FormLabel>
*   <FormInput name={form.names.email} />
*   <FormError name={form.names.email} />
* </Form>
* ```
*/
const FormError = memo(forwardRef(function FormError$1(props) {
	const htmlProps = useFormError(props);
	return createElement(TagName$11, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/form/form-field.tsx
const TagName$10 = "input";
/**
* Returns props to create a `FormField` component. Unlike `useFormInput`, this
* hook doesn't automatically returns the `value` and `onChange` props. This is
* so we can use it not only for native form elements but also for custom
* components whose value is not controlled by the native `value` and `onChange`
* props.
* @deprecated Use `useFormControl` instead.
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { content: "" } });
* const props = useFormField({ store, name: store.names.content });
* const value = store.useValue(store.names.content);
*
* <Form store={store}>
*   <FormLabel name={store.names.content}>Content</FormLabel>
*   <Role
*     {...props}
*     value={value}
*     onChange={(value) => store.setValue(store.names.content, value)}
*     render={<Editor />}
*   />
* </Form>
* ```
*/
const useFormField = createHook(function useFormField$1(props) {
	return useFormControl(props);
});
/**
* Abstract component that renders a form field. Unlike
* [`FormInput`](https://ariakit.org/reference/form-input), this component
* doesn't automatically pass the `value` and `onChange` props down to the
* underlying element. This is so we can use it not only for native form
* elements but also for custom components whose value is not controlled by the
* native `value` and `onChange` props.
* @deprecated
* This component has been renamed to
* [`FormControl`](https://ariakit.org/reference/form-control). The API remains
* the same.
* @example
* ```jsx {11-19}
* const form = useFormStore({
*   defaultValues: {
*     content: "",
*   },
* });
*
* const value = form.useValue(form.names.content);
*
* <Form store={form}>
*   <FormLabel name={form.names.content}>Content</FormLabel>
*   <FormField
*     name={form.names.content}
*     render={
*       <Editor
*         value={value}
*         onChange={(value) => form.setValue(form.names.content, value)}
*       />
*     }
*   />
* </Form>
* ```
*/
const FormField = memo(forwardRef(function FormField$1(props) {
	const htmlProps = useFormField(props);
	return createElement(TagName$10, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/form/form-group.tsx
const TagName$9 = "div";
/**
* Returns props to create a `FormGroup` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore();
* const props = useFormGroup({ store });
* <Form store={store}>
*   <Role {...props}>
*     <FormGroupLabel>Label</FormGroupLabel>
*   </Role>
* </Form>
* ```
*/
const useFormGroup = createHook(function useFormGroup$1({ store,...props }) {
	props = useGroup(props);
	return props;
});
/**
* Renders a group element for form controls. The
* [`FormGroupLabel`](https://ariakit.org/reference/form-group-label) component
* can be used inside this component so the `aria-labelledby` prop is properly
* set on the group element.
* @see https://ariakit.org/components/form
* @example
* ```jsx {9-15}
* const form = useFormStore({
*   defaultValues: {
*     username: "",
*     email: "",
*   },
* });
*
* <Form store={form}>
*   <FormGroup>
*     <FormGroupLabel>Account</FormGroupLabel>
*     <FormLabel name={form.names.username}>Username</FormLabel>
*     <FormInput name={form.names.username} />
*     <FormLabel name={form.names.email}>Email</FormLabel>
*     <FormInput name={form.names.email} />
*   </FormGroup>
* </Form>
* ```
*/
const FormGroup = forwardRef(function FormGroup$1(props) {
	const htmlProps = useFormGroup(props);
	return createElement(TagName$9, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/form/form-group-label.tsx
const TagName$8 = "div";
/**
* Returns props to create a `FormGroupLabel` component. This hook must be used
* in a component that's wrapped with `FormGroup` so the `aria-labelledby` prop
* is properly set on the form group element.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* // This component must be wrapped with FormGroup
* const props = useFormGroupLabel();
* <Role {...props}>Label</Role>
* ```
*/
const useFormGroupLabel = createHook(function useFormGroupLabel$1({ store,...props }) {
	props = useGroupLabel(props);
	return props;
});
/**
* Renders a label in a form group. This component must be wrapped with the
* [`FormGroup`](https://ariakit.org/reference/form-group) or
* [`FormRadioGroup`](https://ariakit.org/reference/form-radio-group) components
* so the `aria-labelledby` prop is properly set on the form group element.
* @see https://ariakit.org/components/form
* @example
* ```jsx {10}
* const form = useFormStore({
*   defaultValues: {
*     username: "",
*     email: "",
*   },
* });
*
* <Form store={form}>
*   <FormGroup>
*     <FormGroupLabel>Account</FormGroupLabel>
*     <FormLabel name={form.names.username}>Username</FormLabel>
*     <FormInput name={form.names.username} />
*     <FormLabel name={form.names.email}>Email</FormLabel>
*     <FormInput name={form.names.email} />
*   </FormGroup>
* </Form>
* ```
*/
const FormGroupLabel = forwardRef(function FormGroupLabel$1(props) {
	const htmlProps = useFormGroupLabel(props);
	return createElement(TagName$8, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/form/form-input.tsx
const TagName$7 = "input";
/**
* Returns props to create a `FormInput` component. Unlike `useFormControl`, this
* hook returns the `value` and `onChange` props that can be passed to a native
* input, select or textarea elements.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { email: "" } });
* const props = useFormInput({ store, name: store.names.email });
* <Form store={store}>
*   <FormLabel name={store.names.email}>Email</FormLabel>
*   <Role {...props} render={<input />} />
* </Form>
* ```
*/
const useFormInput = createHook(function useFormInput$1({ store, name: nameProp,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormInput must be wrapped in a Form component.");
	const name = `${nameProp}`;
	const onChangeProp = props.onChange;
	const onChange = useEvent((event) => {
		onChangeProp?.(event);
		if (event.defaultPrevented) return;
		store?.setValue(name, event.target.value);
	});
	const value = store.useValue(name);
	props = {
		value,
		...props,
		onChange
	};
	props = useFocusable(props);
	props = useFormControl({
		store,
		name,
		...props
	});
	return props;
});
/**
* Renders a form input. Unlike
* [`FormControl`](https://ariakit.org/reference/form-control), this component
* passes the `value` and `onChange` props down to the underlying element that
* can be native input, select or textarea elements.
* @see https://ariakit.org/components/form
* @example
* ```jsx {9}
* const form = useFormStore({
*   defaultValues: {
*     email: "",
*   },
* });
*
* <Form store={form}>
*   <FormLabel name={form.names.email}>Email</FormLabel>
*   <FormInput name={form.names.email} />
* </Form>
* ```
*/
const FormInput = memo(forwardRef(function FormInput$1(props) {
	const htmlProps = useFormInput(props);
	return createElement(TagName$7, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/form/form-label.tsx
const TagName$6 = "label";
function supportsNativeLabel(tagName) {
	return tagName === "input" || tagName === "textarea" || tagName === "select" || tagName === "meter" || tagName === "progress";
}
/**
* Returns props to create a `FormLabel` component. If the field is not a native
* input, select or textarea element, the hook will return props to render a
* `span` element. Instead of relying on the `htmlFor` prop, it'll rely on the
* `aria-labelledby` attribute on the form field. Clicking on the label will
* move focus to the field even if it's not a native input.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { email: "" } });
* const props = useFormLabel({ store, name: store.names.email });
* <Form store={store}>
*   <Role {...props}>Email</Role>
*   <FormInput name={store.names.email} />
* </Form>
* ```
*/
const useFormLabel = createHook(function useFormLabel$1({ store, name: nameProp, getItem: getItemProp,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormLabel must be wrapped in a Form component.");
	const id = useId(props.id);
	const ref = useRef(null);
	const name = `${nameProp}`;
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			id: id || item.id,
			name,
			type: "label"
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [
		id,
		name,
		getItemProp
	]);
	const field = store.useState((state) => state.items.find((item) => item.type === "field" && item.name === name));
	const fieldTagName = useTagName(field?.element, "input");
	const isNativeLabel = supportsNativeLabel(fieldTagName);
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (isNativeLabel) return;
		const fieldElement = field?.element;
		if (!fieldElement) return;
		queueMicrotask(() => {
			const focusableElement = getFirstTabbableIn(fieldElement, true, true);
			focusableElement?.focus();
			const role = focusableElement?.getAttribute("role");
			if (role === "combobox") return;
			focusableElement?.click();
		});
	});
	props = {
		id,
		render: isNativeLabel ? /* @__PURE__ */ jsx("label", {}) : /* @__PURE__ */ jsx("span", {}),
		htmlFor: isNativeLabel ? field?.id : undefined,
		...props,
		ref: useMergeRefs(ref, props.ref),
		onClick
	};
	if (!isNativeLabel) {
		props = {
			...props,
			style: {
				cursor: "default",
				...props.style
			}
		};
	}
	props = useCollectionItem({
		store,
		...props,
		getItem
	});
	return props;
});
/**
* Renders a label associated with a form field, even if the field is not a
* native input.
*
* If the field is a native input, select or textarea element, this component
* will render a native `label` element and rely on its `htmlFor` prop.
* Otherwise, it'll render a `span` element and rely on the `aria-labelledby`
* attribute on the form field instead. Clicking on the label will move focus to
* the field even if it's not a native input.
* @see https://ariakit.org/components/form
* @example
* ```jsx {8}
* const form = useFormStore({
*   defaultValues: {
*     email: "",
*   },
* });
*
* <Form store={form}>
*   <FormLabel name={form.names.email}>Email</Role>
*   <FormInput name={form.names.email} />
* </Form>
* ```
*/
const FormLabel = memo(forwardRef(function FormLabel$1(props) {
	const htmlProps = useFormLabel(props);
	return createElement(TagName$6, htmlProps);
}));

//#endregion
//#region packages/ariakit-core/src/form/form-store.ts
function nextFrame() {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
function hasMessages(object) {
	return Object.keys(object).some((key) => {
		if (isObject(object[key])) {
			return hasMessages(object[key]);
		}
		return !!object[key];
	});
}
function get(values, path, defaultValue$1) {
	const [key, ...rest] = Array.isArray(path) ? path : `${path}`.split(".");
	if (key == null || !values) {
		return defaultValue$1;
	}
	if (!rest.length) {
		return values[key] ?? defaultValue$1;
	}
	return get(values[key], rest, defaultValue$1);
}
function set(values, path, value) {
	const [k, ...rest] = Array.isArray(path) ? path : `${path}`.split(".");
	if (k == null) return values;
	const key = k;
	const isIntegerKey = isInteger(key);
	const nextValues = isIntegerKey ? values || [] : values || {};
	const nestedValues = nextValues[key];
	const result = rest.length && (Array.isArray(nestedValues) || isObject(nestedValues)) ? set(nestedValues, rest, value) : value;
	if (isIntegerKey) {
		const index = Number(key);
		if (values && Array.isArray(values)) {
			return [
				...values.slice(0, index),
				result,
				...values.slice(index + 1)
			];
		}
		const nextValues$1 = [];
		nextValues$1[index] = result;
		return nextValues$1;
	}
	return {
		...values,
		[key]: result
	};
}
function setAll(values, value) {
	const result = {};
	const keys = Object.keys(values);
	for (const key of keys) {
		const currentValue = values[key];
		if (Array.isArray(currentValue)) {
			result[key] = currentValue.map((v) => {
				if (isObject(v)) {
					return setAll(v, value);
				}
				return value;
			});
		} else if (isObject(currentValue)) {
			result[key] = setAll(currentValue, value);
		} else {
			result[key] = value;
		}
	}
	return result;
}
function getNameHandler(cache, prevKeys = []) {
	const handler = { get(target, key) {
		if ([
			"toString",
			"valueOf",
			Symbol.toPrimitive
		].includes(key)) {
			return () => prevKeys.join(".");
		}
		const nextKeys = [...prevKeys, key];
		const nextKey = nextKeys.join(".");
		if (cache[nextKey]) {
			return cache[nextKey];
		}
		const nextProxy = new Proxy(target, getNameHandler(cache, nextKeys));
		cache[nextKey] = nextProxy;
		return nextProxy;
	} };
	return handler;
}
function getStoreCallbacks(store) {
	return store?.__unstableCallbacks;
}
function createNames() {
	const cache = Object.create(null);
	return new Proxy(Object.create(null), getNameHandler(cache));
}
function createFormStore(props = {}) {
	throwOnConflictingProps(props, props.store);
	const syncState = props.store?.getState();
	const collection = createCollectionStore(props);
	const values = defaultValue(props.values, syncState?.values, props.defaultValues, {});
	const errors = defaultValue(props.errors, syncState?.errors, props.defaultErrors, {});
	const touched = defaultValue(props.touched, syncState?.touched, props.defaultTouched, {});
	const initialState = {
		...collection.getState(),
		values,
		errors,
		touched,
		validating: defaultValue(syncState?.validating, false),
		submitting: defaultValue(syncState?.submitting, false),
		submitSucceed: defaultValue(syncState?.submitSucceed, 0),
		submitFailed: defaultValue(syncState?.submitFailed, 0),
		valid: !hasMessages(errors)
	};
	const form = createStore(initialState, collection, props.store);
	const syncCallbacks = getStoreCallbacks(props.store);
	const syncCallbacksState = syncCallbacks?.getState();
	const callbacksInitialState = {
		validate: syncCallbacksState?.validate || [],
		submit: syncCallbacksState?.submit || []
	};
	const callbacks = createStore(callbacksInitialState, syncCallbacks);
	setup(form, () => init(callbacks));
	setup(form, () => sync(form, ["validating", "errors"], (state) => {
		if (state.validating) return;
		form.setState("valid", !hasMessages(state.errors));
	}));
	const validate = async () => {
		form.setState("validating", true);
		form.setState("errors", {});
		const validateCallbacks = callbacks.getState().validate;
		try {
			for (const callback of validateCallbacks) {
				await callback(form.getState());
			}
			await nextFrame();
			return !hasMessages(form.getState().errors);
		} finally {
			form.setState("validating", false);
		}
	};
	return {
		...collection,
		...form,
		names: createNames(),
		setValues: (values$1) => form.setState("values", values$1),
		getValue: (name) => get(form.getState().values, name),
		setValue: (name, value) => form.setState("values", (values$1) => {
			const prevValue = get(values$1, name);
			const nextValue = applyState(value, prevValue);
			if (nextValue === prevValue) return values$1;
			return set(values$1, name, nextValue);
		}),
		pushValue: (name, value) => form.setState("values", (values$1) => {
			const array = get(values$1, name, []);
			return set(values$1, name, [...array, value]);
		}),
		removeValue: (name, index) => form.setState("values", (values$1) => {
			const array = get(values$1, name, []);
			return set(values$1, name, [
				...array.slice(0, index),
				null,
				...array.slice(index + 1)
			]);
		}),
		setErrors: (errors$1) => form.setState("errors", errors$1),
		getError: (name) => get(form.getState().errors, name),
		setError: (name, error) => form.setState("errors", (errors$1) => {
			const prevError = get(errors$1, name);
			const nextError = applyState(error, prevError);
			if (nextError === prevError) return errors$1;
			return set(errors$1, name, nextError);
		}),
		setTouched: (touched$1) => form.setState("touched", touched$1),
		getFieldTouched: (name) => !!get(form.getState().touched, name),
		setFieldTouched: (name, value) => form.setState("touched", (touched$1) => {
			const prevValue = get(touched$1, name);
			const nextValue = applyState(value, prevValue);
			if (nextValue === prevValue) return touched$1;
			return set(touched$1, name, nextValue);
		}),
		onValidate: (callback) => {
			callbacks.setState("validate", (callbacks$1) => [...callbacks$1, callback]);
			return () => {
				callbacks.setState("validate", (callbacks$1) => callbacks$1.filter((c) => c !== callback));
			};
		},
		validate,
		onSubmit: (callback) => {
			callbacks.setState("submit", (callbacks$1) => [...callbacks$1, callback]);
			return () => {
				callbacks.setState("submit", (callbacks$1) => callbacks$1.filter((c) => c !== callback));
			};
		},
		submit: async () => {
			form.setState("submitting", true);
			form.setState("touched", setAll(form.getState().values, true));
			try {
				if (await validate()) {
					const submitCallbacks = callbacks.getState().submit;
					for (const callback of submitCallbacks) {
						await callback(form.getState());
					}
					await nextFrame();
					if (!hasMessages(form.getState().errors)) {
						form.setState("submitSucceed", (count) => count + 1);
						return true;
					}
				}
				form.setState("submitFailed", (count) => count + 1);
				return false;
			} catch (error) {
				form.setState("submitFailed", (count) => count + 1);
				throw error;
			} finally {
				form.setState("submitting", false);
			}
		},
		reset: () => {
			form.setState("values", values);
			form.setState("errors", errors);
			form.setState("touched", touched);
			form.setState("validating", false);
			form.setState("submitting", false);
			form.setState("submitSucceed", 0);
			form.setState("submitFailed", 0);
			form.setState("valid", !hasMessages(errors));
		},
		__unstableCallbacks: callbacks
	};
}

//#endregion
//#region packages/ariakit-react-core/src/form/form-store.ts
function useFormStoreProps(store, update, props) {
	store = useCollectionStoreProps(store, update, props);
	useStoreProps(store, props, "values", "setValues");
	useStoreProps(store, props, "errors", "setErrors");
	useStoreProps(store, props, "touched", "setTouched");
	const useValue = useCallback((name) => store.useState(() => store.getValue(name)), [store]);
	const useValidate = useCallback((callback) => {
		callback = useEvent(callback);
		const items = store.useState("items");
		useEffect(() => store.onValidate(callback), [items, callback]);
	}, [store]);
	const useSubmit = useCallback((callback) => {
		callback = useEvent(callback);
		const items = store.useState("items");
		useEffect(() => store.onSubmit(callback), [items, callback]);
	}, [store]);
	return useMemo(() => ({
		...store,
		useValue,
		useValidate,
		useSubmit
	}), []);
}
function useFormStore(props = {}) {
	const [store, update] = useStore(createFormStore, props);
	return useFormStoreProps(store, update, props);
}

//#endregion
//#region packages/ariakit-react-core/src/form/form-provider.tsx
function FormProvider(props = {}) {
	const store = useFormStore(props);
	return /* @__PURE__ */ jsx(FormContextProvider, {
		value: store,
		children: props.children
	});
}

//#endregion
//#region packages/ariakit-react-core/src/form/form-push.tsx
const TagName$5 = "button";
function getFirstFieldsByName(items, name) {
	if (!items) return [];
	const fields = [];
	for (const item of items) {
		if (item.type !== "field") continue;
		if (!item.name.startsWith(name)) continue;
		const nameWithIndex = item.name.replace(/(\.\d+)\..+$/, "$1");
		const regex = new RegExp(`^${nameWithIndex}`);
		if (!fields.some((i) => regex.test(i.name))) {
			fields.push(item);
		}
	}
	return fields;
}
/**
* Returns props to create a `FormPush` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({
*   defaultValues: {
*     languages: ["JavaScript", "PHP"],
*   },
* });
* const props = useFormPush({
*   store,
*   name: store.names.languages,
*   value: "",
* });
* const values = useStoreState(store, "values");
*
* <Form store={store}>
*   {values.languages.map((_, i) => (
*     <FormInput key={i} name={store.names.languages[i]} />
*   ))}
*   <Role {...props}>Add new language</Role>
* </Form>
* ```
*/
const useFormPush = createHook(function useFormPush$1({ store, value, name: nameProp, getItem: getItemProp, autoFocusOnClick = true,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormPush must be wrapped in a Form component.");
	const name = `${nameProp}`;
	const [shouldFocus, setShouldFocus] = useState(false);
	useEffect(() => {
		if (!shouldFocus) return;
		const items = getFirstFieldsByName(store?.getState().items, name);
		const element = items?.[items.length - 1]?.element;
		if (!element) return;
		element.focus();
		setShouldFocus(false);
	}, [
		store,
		shouldFocus,
		name
	]);
	const getItem = useCallback((item) => {
		const nextItem = {
			...item,
			type: "button",
			name
		};
		if (getItemProp) {
			return getItemProp(nextItem);
		}
		return nextItem;
	}, [name, getItemProp]);
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		store?.pushValue(name, value);
		if (!autoFocusOnClick) return;
		setShouldFocus(true);
	});
	props = {
		...props,
		onClick
	};
	props = useButton(props);
	props = useCollectionItem({
		store,
		...props,
		getItem
	});
	return props;
});
/**
* Renders a button that will push items to an array value in the form store
* when clicked.
*
* The [`name`](https://ariakit.org/reference/form-push#name) prop needs to be
* provided to identify the array field. The
* [`value`](https://ariakit.org/reference/form-push#value) prop is required to
* define the value that will be added to the array.
*
* By default, the newly added input will be automatically focused when the
* button is clicked unless the
* [`autoFocusOnClick`](https://ariakit.org/reference/form-push#autofocusonclick)
* prop is set to `false`.
* @see https://ariakit.org/components/form
* @example
* ```jsx {13-15}
* const form = useFormStore({
*   defaultValues: {
*     languages: ["JavaScript", "PHP"],
*   },
* });
*
* const values = useStoreState(form, "values");
*
* <Form store={form}>
*   {values.languages.map((_, i) => (
*     <FormInput key={i} name={form.names.languages[i]} />
*   ))}
*   <FormPush name={form.names.languages} value="">
*     Add new language
*   </FormPush>
* </Form>
* ```
*/
const FormPush = forwardRef(function FormPush$1(props) {
	const htmlProps = useFormPush(props);
	return createElement(TagName$5, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/form/form-radio.tsx
const TagName$4 = "input";
/**
* Returns props to create a `FormRadio` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { char: "a" } });
* const a = useFormRadio({ store, name: store.names.char, value: "a" });
* const b = useFormRadio({ store, name: store.names.char, value: "b" });
* const c = useFormRadio({ store, name: store.names.char, value: "c" });
* <Form store={store}>
*   <FormRadioGroup>
*     <FormGroupLabel>Favorite character</FormGroupLabel>
*     <Role {...a} />
*     <Role {...b} />
*     <Role {...c} />
*   </FormRadioGroup>
* </Form>
* ```
*/
const useFormRadio = createHook(function useFormRadio$1({ store, name: nameProp, value,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormRadio must be wrapped in a Form component.");
	const name = `${nameProp}`;
	const onChangeProp = props.onChange;
	const onChange = useEvent((event) => {
		onChangeProp?.(event);
		if (event.defaultPrevented) return;
		store?.setValue(name, value);
	});
	const checkedProp = props.checked;
	const checked = store.useState(() => checkedProp ?? store?.getValue(name) === value);
	props = {
		...props,
		checked,
		onChange
	};
	props = useRadio({
		value,
		...props
	});
	props = useFormControl({
		store,
		name,
		"aria-labelledby": undefined,
		...props
	});
	return props;
});
/**
* Renders a radio button as a form control. This component must be wrapped in a
* [`FormRadioGroup`](https://ariakit.org/reference/form-radio-group) along with
* other radio buttons sharing the same
* [`name`](https://ariakit.org/reference/form-radio#name).
* @see https://ariakit.org/components/form
* @example
* ```jsx {10-12}
* const form = useFormStore({
*   defaultValues: {
*     char: "a",
*   },
* });
*
* <Form store={form}>
*   <FormRadioGroup>
*     <FormGroupLabel>Favorite character</FormGroupLabel>
*     <FormRadio name={form.names.char} value="a" />
*     <FormRadio name={form.names.char} value="b" />
*     <FormRadio name={form.names.char} value="c" />
*   </FormRadioGroup>
* </Form>
* ```
*/
const FormRadio = memo(forwardRef(function FormRadio$1(props) {
	const htmlProps = useFormRadio(props);
	return createElement(TagName$4, htmlProps);
}));

//#endregion
//#region packages/ariakit-react-core/src/form/form-radio-group.tsx
const TagName$3 = "div";
/**
* Returns props to create a `FormRadioGroup` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({ defaultValues: { color: "red" } });
* const props = useFormRadioGroup({ store });
* <Form store={store}>
*   <Role {...props}>
*     <FormGroupLabel>Favorite color</FormGroupLabel>
*     <FormRadio name={store.names.color} value="red" />
*     <FormRadio name={store.names.color} value="blue" />
*     <FormRadio name={store.names.color} value="green" />
*   </Role>
* </Form>
* ```
*/
const useFormRadioGroup = createHook(function useFormRadioGroup$1({ store,...props }) {
	props = {
		role: "radiogroup",
		...props
	};
	props = useFormGroup(props);
	return props;
});
/**
* Renders a group element for
* [`FormRadio`](https://ariakit.org/reference/form-radio) elements. The
* [`FormGroupLabel`](https://ariakit.org/reference/form-group-label) component
* can be used inside this component so the `aria-labelledby` prop is properly
* set on the group element.
* @see https://ariakit.org/components/form
* @example
* ```jsx {8-13}
* const form = useFormStore({
*   defaultValues: {
*     color: "red",
*   },
* });
*
* <Form store={form}>
*   <FormRadioGroup>
*     <FormGroupLabel>Favorite color</FormGroupLabel>
*     <FormRadio name={form.names.color} value="red" />
*     <FormRadio name={form.names.color} value="blue" />
*     <FormRadio name={form.names.color} value="green" />
*   </FormRadioGroup>
* </Form>
* ```
*/
const FormRadioGroup = forwardRef(function FormRadioGroup$1(props) {
	const htmlProps = useFormRadioGroup(props);
	return createElement(TagName$3, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/form/form-remove.tsx
const TagName$2 = "button";
function findNextOrPreviousField(items, name, index) {
	const fields = items?.filter((item) => item.type === "field" && item.name.startsWith(name));
	const regex = new RegExp(`^${name}\\.(\\d+)`);
	const nextField = fields?.find((field) => {
		const fieldIndex = field.name.replace(regex, "$1");
		return Number.parseInt(fieldIndex, 10) > index;
	});
	if (nextField) return nextField;
	return fields?.reverse().find((field) => {
		const fieldIndex = field.name.replace(regex, "$1");
		return Number.parseInt(fieldIndex, 10) < index;
	});
}
function findPushButton(items, name) {
	return items?.find((item) => item.type === "button" && item.name === name);
}
/**
* Returns props to create a `FormRemove` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore({
*   defaultValues: {
*     languages: ["JavaScript", "PHP"],
*   },
* });
* const props = useFormRemove({
*   store,
*   name: store.names.languages,
*   index: 0,
* });
* const values = useStoreState(store, "values");
*
* <Form store={store}>
*   {values.languages.map((_, i) => (
*     <FormInput key={i} name={store.names.languages[i]} />
*   ))}
*   <Role {...props}>Remove first language</Role>
* </Form>
* ```
*/
const useFormRemove = createHook(function useFormRemove$1({ store, name: nameProp, index, autoFocusOnClick = true,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormRemove must be wrapped in a Form component.");
	const name = `${nameProp}`;
	const onClickProp = props.onClick;
	const onClick = useEvent((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		store.removeValue(name, index);
		if (!autoFocusOnClick) return;
		const { items } = store.getState();
		const item = findNextOrPreviousField(items, name, index);
		const element = item?.element;
		if (element) {
			element.focus();
			if (isTextField(element)) {
				element.select();
			}
		} else {
			const pushButton = findPushButton(items, name);
			pushButton?.element?.focus();
		}
	});
	props = {
		...props,
		onClick
	};
	props = useButton(props);
	return props;
});
/**
* Renders a button that will remove an item from an array field in the form
* when clicked.
*
* The [`name`](https://ariakit.org/reference/form-remove#name) prop must be
* provided to identify the array field. Similarly, the
* [`index`](https://ariakit.org/reference/form-remove#index) prop is required
* to pinpoint the item to remove.
*
* By default, the button will automatically move focus to the next field in the
* form when clicked, or to the previous field if there isn't a next field. This
* behavior can be disabled by setting the
* [`autoFocusOnClick`](https://ariakit.org/reference/form-remove#autofocusonclick)
* prop to `false`.
* @see https://ariakit.org/components/form
* @example
* ```jsx {13}
* const form = useFormStore({
*   defaultValues: {
*     languages: ["JavaScript", "PHP"],
*   },
* });
*
* const values = useStoreState(form, "values");
*
* <Form store={form}>
*   {values.languages.map((_, i) => (
*     <div key={i}>
*       <FormInput name={form.names.languages[i]} />
*       <FormRemove name={form.names.languages} index={i} />
*     </div>
*   ))}
* </Form>
* ```
*/
const FormRemove = forwardRef(function FormRemove$1(props) {
	const htmlProps = useFormRemove(props);
	return createElement(TagName$2, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/form/form-reset.tsx
const TagName$1 = "button";
/**
* Returns props to create a `FormReset` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore();
* const props = useFormReset({ store });
* <Form store={store}>
*   <Role {...props}>Reset</Role>
* </Form>
* ```
*/
const useFormReset = createHook(function useFormReset$1({ store,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormReset must be wrapped in a Form component.");
	props = {
		type: "reset",
		disabled: store.useState("submitting"),
		...props
	};
	props = useButton(props);
	return props;
});
/**
* Renders a button that resets the form to its initial values, as defined by
* the
* [`defaultValues`](https://ariakit.org/reference/use-form-store#defaultvalues)
* prop given to the form store.
* @see https://ariakit.org/components/form
* @example
* ```jsx {4}
* const form = useFormStore();
*
* <Form store={form}>
*   <FormReset>Reset</FormReset>
* </Form>
* ```
*/
const FormReset = forwardRef(function FormReset$1(props) {
	const htmlProps = useFormReset(props);
	return createElement(TagName$1, htmlProps);
});

//#endregion
//#region packages/ariakit-react-core/src/form/form-submit.tsx
const TagName = "button";
/**
* Returns props to create a `FormReset` component.
* @see https://ariakit.org/components/form
* @example
* ```jsx
* const store = useFormStore();
* const props = useFormSubmit({ store });
* <Form store={store}>
*   <Role {...props}>Submit</Role>
* </Form>
* ```
*/
const useFormSubmit = createHook(function useFormSubmit$1({ store, accessibleWhenDisabled = true,...props }) {
	const context = useFormContext();
	store = store || context;
	invariant(store, process.env.NODE_ENV !== "production" && "FormSubmit must be wrapped in a Form component.");
	props = {
		type: "submit",
		disabled: store.useState("submitting"),
		...props
	};
	props = useButton({
		...props,
		accessibleWhenDisabled
	});
	return props;
});
/**
* Renders a native submit button inside a form. The button will be
* [`disabled`](https://ariakit.org/reference/form-submit#disabled) while the
* form is submitting, but it will remain accessible to keyboard and screen
* reader users thanks to the
* [`accessibleWhenDisabled`](https://ariakit.org/reference/form-submit#accessiblewhendisabled)
* prop that's enabled by default.
* @see https://ariakit.org/components/form
* @example
* ```jsx {4}
* const form = useFormStore();
*
* <Form store={form}>
*   <FormSubmit>Submit</FormSubmit>
* </Form>
* ```
*/
const FormSubmit = forwardRef(function FormSubmit$1(props) {
	const htmlProps = useFormSubmit(props);
	return createElement(TagName, htmlProps);
});

//#endregion
export { Form, FormCheckbox, FormControl, FormDescription, FormError, FormField, FormGroup, FormGroupLabel, FormInput, FormLabel, FormProvider, FormPush, FormRadio, FormRadioGroup, FormRemove, FormReset, FormSubmit, useFormContext, useFormStore };