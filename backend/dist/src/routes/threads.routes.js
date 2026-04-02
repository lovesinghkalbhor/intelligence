"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadRouter = void 0;
const express_1 = require("express");
const threads_controllers_1 = require("../controllers/threads.controllers");
const threadRouter = (0, express_1.Router)();
exports.threadRouter = threadRouter;
threadRouter.route("/add").post(threads_controllers_1.addThreads);
threadRouter.route("/get").get(threads_controllers_1.getThreads);
threadRouter.route("/:id").get(threads_controllers_1.getThreadById);
threadRouter.route("/:id").delete(threads_controllers_1.deleteThread);
threadRouter.route("/:id").patch(threads_controllers_1.updateThread); // Add this line
//# sourceMappingURL=threads.routes.js.map