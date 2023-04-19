import { Request } from "express";

class ExpressHelper {
    getContentName(request: Request) {
        return request.url.split("/")[1];
    }
}

export default new ExpressHelper();