import { NextFunction, Request, Response } from "express";
import expressHelper from "../common/utility/express-helper";
import logger from "../util/logger";

class AuthGuard {
    protect(request: Request, response: Response, next: NextFunction) {
        let contentName = expressHelper.getContentName(request);

        if (contentName === "user2") {
            logger.error("Unauthorized.");
            logger.info(request.method);
            response.sendStatus(401);
        }
        else 
            next();
    }
}

export default new AuthGuard();