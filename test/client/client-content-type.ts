import { NextFunction, Request, Response } from 'express';
import IContentType from "../../content/content-type";

class ClientContentType implements IContentType {
    id: string = "client-content-type";
    fields = [{
        name: "title"
    }];
    middlewares: {
        event: string,
        function: Function
    }[];



    constructor() {
        this.middlewares = [{
            event: "get",
            function: this.fillCurrentDate
        }];
    }



    fillCurrentDate(body: any, req: Request, res: Response) {
        body.date = new Date();
        return body;
    }
}

export default new ClientContentType();
