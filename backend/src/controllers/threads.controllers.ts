import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Thread from "../../models/threads";

const addThreads = asyncHandler(async (req: Request, res: Response) => {
  const responseThread = req.body.title;
  const thread = new Thread({ title: responseThread });
  const response = await thread.save();
  res.send(response);
});

const getThreads = asyncHandler(async (req: Request, res: Response) => {
  const threads = await Thread.find().sort({ updatedAt: -1 }); // -1 for descending order
  res.status(200).json({
    success: true,
    data: threads,
    message: "Threads fetched successfully",
  });
});

const getThreadById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // Get ID from URL parameters

  const thread = await Thread.findById(id);

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

const deleteThread = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // Get ID from URL parameters

  const deletedThread = await Thread.findByIdAndDelete(id);

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
const updateThread = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required for update." });
  }

  const updatedThread = await Thread.findByIdAndUpdate(
    id,
    { title, updatedAt: new Date() }, // Update title and updatedAt
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

export { addThreads, getThreads, getThreadById, deleteThread, updateThread }; //
