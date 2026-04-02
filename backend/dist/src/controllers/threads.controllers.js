"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateThread = exports.deleteThread = exports.getThreadById = exports.getThreads = exports.addThreads = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const threads_1 = __importDefault(require("../../models/threads"));
const addThreads = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const responseThread = req.body.title;
    const thread = new threads_1.default({ title: responseThread });
    const response = await thread.save();
    res.send(response);
});
exports.addThreads = addThreads;
const getThreads = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const threads = await threads_1.default.find().sort({ updatedAt: -1 }); // -1 for descending order
    res.status(200).json({
        success: true,
        data: threads,
        message: "Threads fetched successfully",
    });
});
exports.getThreads = getThreads;
const getThreadById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params; // Get ID from URL parameters
    const thread = await threads_1.default.findById(id);
    if (!thread) {
        return res.status(404).json({
            success: false,
            message: "Thread not found",
        });
    }
    res.status(200).json({
        success: true,
        data: thread,
        message: "Thread fetched successfully",
    });
});
exports.getThreadById = getThreadById;
const deleteThread = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params; // Get ID from URL parameters
    const deletedThread = await threads_1.default.findByIdAndDelete(id);
    if (!deletedThread) {
        return res.status(404).json({
            success: false,
            message: "Thread not found",
        });
    }
    res.status(200).json({
        success: true,
        data: deletedThread,
        message: "Thread deleted successfully",
    });
});
exports.deleteThread = deleteThread;
const updateThread = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) {
        return res
            .status(400)
            .json({ success: false, message: "Title is required for update." });
    }
    const updatedThread = await threads_1.default.findByIdAndUpdate(id, { title, updatedAt: new Date() }, // Update title and updatedAt
    { new: true, runValidators: true } // Return the updated document and run schema validators
    );
    if (!updatedThread) {
        return res
            .status(404)
            .json({ success: false, message: "Thread not found." });
    }
    res.status(200).json({
        success: true,
        data: updatedThread,
        message: "Thread updated successfully.",
    });
});
exports.updateThread = updateThread;
//# sourceMappingURL=threads.controllers.js.map