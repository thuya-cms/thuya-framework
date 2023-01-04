import { NextFunction, Request, Response } from 'express';
import IContentType, { ContentTypeMiddlewareEvent, ContentTypeFieldType } from "../../content/content-type";

class ClientContentType implements IContentType {
    id: string = "client-content-type";
    
    fields = [{
        name: "title",
        type: ContentTypeFieldType.string,
        required: true
    }, {
        name: "numValue",
        type: ContentTypeFieldType.number
    }];

    middlewares = {
        before: [{
            event: ContentTypeMiddlewareEvent.create,
            function: this.validateContent
        }],
        after: [{
            event: ContentTypeMiddlewareEvent.get,
            function: this.fillCurrentDate
        }, {
            event: ContentTypeMiddlewareEvent.list,
            function: this.fillCurrentDateList
        }]
    };


    validateContent(req: Request, res: Response, next: NextFunction) {
        if (req.body.title && req.body.title.toString().startsWith("A"))
            res.status(500).send("Cannot strat with A.");
        else
            next();
    }

    fillCurrentDate(body: any, req: Request, res: Response) {
        body.date = new Date();
        return body;
    }
    
    fillCurrentDateList(body: any, req: Request, res: Response) {
        if (!Array.isArray(body)) return;
        
        body.forEach(data => {
            data.date = new Date();
        });

        return body;
    }
}

export default new ClientContentType();
