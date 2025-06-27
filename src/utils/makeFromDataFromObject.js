function objectToFormData(obj, form = new FormData(), namespace = '') {
    for (let property in obj) {
        if (!obj.hasOwnProperty(property) || obj[property] === undefined) continue;
        const formKey = namespace ? `${namespace}[${property}]` : property;
        if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
            objectToFormData(obj[property], form, formKey);
        } else {
            form.append(formKey, obj[property]);
        }
    }
    return form;
}
export default objectToFormData;
