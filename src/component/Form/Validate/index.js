function validateForm(formData, requestTypeId) {
    const errors = {};

    for (const field in rules) {
        const value = formData[field];
        const fieldRules = rules[field];

        for (const rule of fieldRules) {
            if (rule.required && !value) {
                errors[field] = `${field} is required`;
                break;
            }
            if (rule.minLength && value.length < rule.minLength) {
                errors[field] = `${field} must be at least ${rule.minLength} characters long`;
                break;
            }
            if (rule.maxLength && value.length > rule.maxLength) {
                errors[field] = `${field} must be at most ${rule.maxLength} characters long`;
                break;
            }
        }
    }

    return Object.keys(errors).length ? errors : null;
}
