// Form action text constants
export const FORM_ACTIONS = {
  CREATE: "Create",
  SAVE: "Save",
  UPDATE: "Update",
  DELETE: "Delete",
  CANCEL: "Cancel",
} as const;

// Currency options for investment forms and other financial forms
export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "JPY", label: "JPY" },
] as const;

// Toast message templates
export const TOAST_MESSAGES = {
  // Success messages
  SUCCESS: {
    CREATE: (entityName: string, itemName?: string) =>
      `You have successfully created ${
        itemName ? `${itemName} ` : ""
      }${entityName}!`,
    UPDATE: (entityName: string, itemName?: string) =>
      `You have successfully updated ${
        itemName ? `${itemName} ` : ""
      }${entityName}!`,
    DELETE: (entityName: string, itemName?: string) =>
      `You have successfully removed ${
        itemName ? `${itemName} ` : ""
      }${entityName}!`,
    GENERIC: (action: string) => `${action} completed successfully!`,
  },

  // Error messages
  ERROR: {
    CREATE: (entityName: string) =>
      `There was an error creating the ${entityName}. Please try again.`,
    UPDATE: (entityName: string) =>
      `There was an error updating the ${entityName}. Please try again.`,
    DELETE: (entityName: string) =>
      `There was an error deleting the ${entityName}. Please try again.`,
    GENERIC: (action: string) =>
      `There was an error ${action}. Please try again.`,

    // Specific validation errors
    DUPLICATE_NAME: (entityName: string) =>
      `A ${entityName} with this name already exists. Please choose a different name.`,
    POSITIVE_AMOUNT:
      "Amount must be positive. Please enter a value greater than 0.",
    REQUIRED_FIELD: (fieldName: string) => `${fieldName} is required.`,
    INVALID_EMAIL: "Please enter a valid email address.",

    // Business logic errors
    CATEGORY_HAS_SUBCATEGORIES:
      "You need to remove all subcategories before removing its category!",
    SUBCATEGORY_HAS_EXPENSES:
      "You need to remove all subcategory expenses before removing its subcategory!",
    EMAIL_NOT_CONFIRMED: "Please confirm your email first. Check your inbox.",
  },
} as const;

// Form validation rules
export const VALIDATION_RULES = {
  REQUIRED: (value: string | number | boolean | null | undefined) =>
    !!value && value !== "",
  POSITIVE_NUMBER: (value: number) => value > 0,
  EMAIL: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  MIN_LENGTH: (minLength: number) => (value: string) =>
    value.length >= minLength,
  MAX_LENGTH: (maxLength: number) => (value: string) =>
    value.length <= maxLength,
} as const;

// Common form field configurations
export const FORM_FIELD_CONFIGS = {
  NAME: {
    label: "Name",
    placeholder: "Enter name",
    required: true,
    type: "text" as const,
  },
  EMAIL: {
    label: "Email",
    placeholder: "Enter email address",
    required: true,
    type: "email" as const,
  },
  PASSWORD: {
    label: "Password",
    placeholder: "Enter password",
    required: true,
    type: "password" as const,
  },
  AMOUNT: {
    label: "Amount",
    placeholder: "Enter amount",
    required: true,
    type: "number" as const,
  },
  DESCRIPTION: {
    label: "Description",
    placeholder: "Enter description",
    required: false,
    type: "text" as const,
  },
  DATE: {
    label: "Date",
    required: true,
    type: "date" as const,
  },
  CURRENCY: {
    label: "Currency",
    required: true,
    type: "select" as const,
    options: CURRENCY_OPTIONS,
  },
} as const;

// Entity names for consistent messaging
export const ENTITY_NAMES = {
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  EXPENSE: "expense",
  INVESTMENT: "investment",
  SAVING_GOAL: "saving goal",
  USER: "user",
  PROFILE: "profile",
} as const;

// Form dialog sizes
export const DIALOG_SIZES = {
  SMALL: "400px",
  MEDIUM: "600px",
  LARGE: "800px",
} as const;

// Common spacing and sizing values
export const FORM_SPACING = {
  FIELD_MARGIN: "16px",
  SECTION_MARGIN: "24px",
  BUTTON_MARGIN: "8px",
} as const;

export const FORM_SIZES = {
  FIELD_HEIGHT: "56px",
  BUTTON_HEIGHT: "42px",
  ICON_SIZE: "24px",
} as const;
