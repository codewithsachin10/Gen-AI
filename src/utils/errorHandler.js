import { toast } from 'sonner';

/**
 * Centralized error handler for StudyGenius AI.
 * Categorizes errors and provides user-friendly feedback via toast notifications.
 */
export const handleError = (error, context = "Operation") => {
  console.error(`[Error in ${context}]:`, error);

  let message = "An unexpected error occurred.";
  let description = "Please try again later.";

  // 1. API Quota Errors (OpenAI, OpenRouter, Gemini)
  if (error.message?.includes('quota') || error.message?.includes('429')) {
    message = "API Quota Exceeded";
    description = "Your current AI balance is empty. Falling back to Demo Mode.";
  }
  
  // 2. Authentication Errors
  else if (error.message?.includes('auth') || error.message?.includes('401') || error.message?.includes('API key')) {
    message = "Authentication Failed";
    description = "There is an issue with the AI API Key configuration.";
  }

  // 3. Network Errors
  else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
    message = "Network Error";
    description = "Unable to connect to the AI servers. Check your connection.";
  }

  // 4. Supabase / Database Errors
  else if (error.code && error.details) {
    message = "Database Error";
    description = "Failed to synchronize your data with the cloud mesh.";
  }

  // 5. Custom Error Messages
  else if (typeof error === 'string') {
    message = error;
  } else if (error.message) {
    message = error.message;
  }

  toast.error(message, {
    description: description,
    duration: 5000,
  });

  return { message, description };
};

/**
 * Safe JSON parser with error logging
 */
export const safeJsonParse = (str, fallback = {}) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Failed to parse JSON content:", e);
    return fallback;
  }
};
