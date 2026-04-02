"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        }
        catch (err) {
            //   next(err);
            console.log("error occure and caught by asyncHandler");
            console.error("Error:", err.response ? err.response.data : err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map