import DOMPurify from "dompurify";

export const sanitizeInput = (value) => {
  if (!value) return "";
  return DOMPurify.sanitize(value.trim()); // remove malicious HTML & trim spaces
};
