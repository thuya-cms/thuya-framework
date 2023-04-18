import { NextFunction, Request, Response } from "express";
import listAllContent from "../domain/usecase/list-all-content";
import createContent from "../domain/usecase/create-content";
import readContentDefinition from "../domain/usecase/read-content-definition";
import readContent from "../domain/usecase/read-content";

class ExpressContentManager {
    listAllContent(request: Request, response: Response, next: NextFunction) {
        let contentName = this.getContentName(request);
        let content = listAllContent.execute(contentName);

        response.json(content).status(200);

        next();
    }

    readContent(request: Request, response: Response, next: NextFunction) {
        let contentName = this.getContentName(request);
        let id = request.params.id;

        try {
            let contentDefinition = readContentDefinition.execute(contentName);
            let content = readContent.execute(contentDefinition, id);

            response.json(content).status(200);

            next();
        }

        catch (error: any) {
            response.json({
                code: error.code,
                message: error.message
            }).status(500);
        }
    }
    
    createContent(request: Request, response: Response, next: NextFunction) {
        let contentName = this.getContentName(request);
        let content = request.body;

        try {
            let contentDefinition = readContentDefinition.execute(contentName);
            let id = createContent.execute(contentDefinition, content);
    
            response.json({id: id}).status(201);
    
            next();
        }

        catch (error: any) {
            response.json({
                code: error.code,
                message: error.message
            }).status(500);
        }
    }


    private getContentName(request: Request) {
        return request.url.split("/")[1];
    }
}

export default new ExpressContentManager();