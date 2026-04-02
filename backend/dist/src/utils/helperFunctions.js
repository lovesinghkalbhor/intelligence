"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatContentForGroq = void 0;
const formatContentForGroq = (content) => {
    if (Array.isArray(content)) {
        // If content is already an array, iterate through its parts
        // and ensure 'text' property is always present for 'text' type parts.
        return content.map((part) => {
            if (part.type === "text") {
                return {
                    type: "text",
                    text: String(part.text || ""), // Ensure 'text' is always a string, default to empty string if null/undefined
                };
            }
            return part; // Return other parts (like image_url) as is
        });
    }
    // If content is a string (or null/undefined, treat as empty string for text)
    // wrap it in the expected { type: "text", text: "..." } format.
    return [{ type: "text", text: String(content || "") }]; // Ensure content is string, default to empty string
};
exports.formatContentForGroq = formatContentForGroq;
//# sourceMappingURL=helperFunctions.js.map