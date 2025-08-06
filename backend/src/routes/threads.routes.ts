import { Router } from "express";
import {
  addThreads,
  getThreads,
  getThreadById,
  deleteThread,
  updateThread,
} from "../controllers/threads.controllers";

const threadRouter = Router();

threadRouter.route("/add").post(addThreads);
threadRouter.route("/get").get(getThreads);
threadRouter.route("/:id").get(getThreadById);
threadRouter.route("/:id").delete(deleteThread);
threadRouter.route("/:id").patch(updateThread); // Add this line

export { threadRouter };
