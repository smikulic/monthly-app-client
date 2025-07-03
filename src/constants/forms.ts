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
