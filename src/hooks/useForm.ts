import { useState, useCallback } from "react";

interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

interface FormConfig {
  [key: string]: {
    required?: boolean;
    validate?: (value: string) => string | undefined;
  };
}

export const useForm = <T extends { [key: string]: string }>(
  initialValues: T,
  config: FormConfig
) => {
  const [fields, setFields] = useState<{ [K in keyof T]: FormField }>(() =>
    Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initialValues[key],
        touched: false,
      },
    }), {} as { [K in keyof T]: FormField })
  );

  const validateField = useCallback((name: keyof T, value: string) => {
    const fieldConfig = config[name as string];
    if (!fieldConfig) return undefined;

    if (fieldConfig.required && !value) {
      return "This field is required";
    }

    if (fieldConfig.validate) {
      return fieldConfig.validate(value);
    }

    return undefined;
  }, [config]);

  const setFieldValue = useCallback((name: keyof T, value: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        value,
        touched: true,
        error: validateField(name, value),
      },
    }));
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newFields = { ...fields };
    let isValid = true;

    Object.keys(fields).forEach(key => {
      const error = validateField(key as keyof T, fields[key].value);
      newFields[key] = {
        ...fields[key],
        touched: true,
        error,
      };
      if (error) isValid = false;
    });

    setFields(newFields);
    return isValid;
  }, [fields, validateField]);

  const resetForm = useCallback(() => {
    setFields(
      Object.keys(initialValues).reduce((acc, key) => ({
        ...acc,
        [key]: {
          value: initialValues[key],
          touched: false,
        },
      }), {} as { [K in keyof T]: FormField })
    );
  }, [initialValues]);

  return {
    fields,
    setFieldValue,
    validateForm,
    resetForm,
    values: Object.keys(fields).reduce((acc, key) => ({
      ...acc,
      [key]: fields[key].value,
    }), {} as T),
  };
};
