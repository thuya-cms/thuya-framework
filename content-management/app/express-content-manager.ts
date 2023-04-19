import { NextFunction, Request, Response } from "express";
import listContent from "../domain/usecase/content/list-content";
import createContent from "../domain/usecase/content/create-content";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import readContent from "../domain/usecase/content/read-content";
import deleteContent from "../domain/usecase/content/delete-content";
import updateContent from "../domain/usecase/content/update-content";
import expressHelper from "../../common/utility/express-helper";

class ExpressContentManager {
    listContent(request: Request, response: Response, next: NextFunction) {
        let contentName = expressHelper.getContentName(request);
        let content = listContent.execute(contentName);

        response.json(content).status(200);

        next();
    }

    readContent(request: Request, response: Response, next: NextFunction) {
        let contentName = expressHelper.getContentName(request);
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
        let contentName = expressHelper.getContentName(request);
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

    deleteContent(request: Request, response: Response, next: NextFunction) {
        let contentName = expressHelper.getContentName(request);
        let id = request.params.id;

        try {
            let contentDefinition = readContentDefinition.execute(contentName);
            deleteContent.execute(contentDefinition, id);

            response.sendStatus(200);

            next();
        }

        catch (error: any) {
            response.json({
                code: error.code,
                message: error.message
            }).status(500);
        }
    }

    updateContent(request: Request, response: Response, next: NextFunction) {
        let contentName = expressHelper.getContentName(request);
        let content = request.body;

        try {
            let contentDefinition = readContentDefinition.execute(contentName);
            updateContent.execute(contentDefinition, content);

            response.sendStatus(200);

            next();
        }

        catch (error: any) {
            response.json({
                code: error.code,
                message: error.message
            }).status(500);
        }
    }
}

export default new ExpressContentManager();