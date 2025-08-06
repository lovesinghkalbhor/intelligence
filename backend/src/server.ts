import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

const port = process.env.port || 5000;

app.use(cors({ origin: "*", credentials: true }));

app.use(express.json({ limit: "10mb" }));

import { chatRouter } from "./routes/chats.routes";
// import { asyncHandler } from "./utils/asyncHandler";
import { threadRouter } from "./routes/threads.routes";

app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/threads", threadRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("Error Caught by middleware", err);
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("connected to data base ");
  } catch (error) {
    console.log("failed to conned to database", error);
  }
};
