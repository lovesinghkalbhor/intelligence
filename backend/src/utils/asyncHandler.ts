import { Request, Response, NextFunction } from "express";

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (requestHandler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (err: any) {
      //   next(err);
      console.log("error occure and caught by asyncHandler");
      console.error("Error:", err.response ? err.response.data : err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

export { asyncHandler };
