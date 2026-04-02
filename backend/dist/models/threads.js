"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: {
        type: String,
        required: true,
    },
    timestamp: { type: Date, default: Date.now() },
});
const ThreadSchema = new mongoose_1.default.Schema({
    // threadId: { type: String, required: true, unique: true },
    title: {
        type: String,
        default: true,
    },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.default = mongoose_1.default.model("Thread", ThreadSchema);
//# sourceMappingURL=threads.js.map