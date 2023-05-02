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
        try {
            let contentName = expressHelper.getContentName(request);

            let listContentResult = listContent.execute(contentName);
            if (listContentResult.getIsFailing())
                throw new Error(listContentResult.getMessage());
    
            response.status(200).json(listContentResult);
            
            next();
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }

    readContent(request: Request, response: Response, next: NextFunction) {
        try {
            let contentName = expressHelper.getContentName(request);
            let id = request.params.id;

            let readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            let readContentResult = readContent.byId(readContentDefinitionResult.getResult()!, id);
            if (readContentResult.getIsFailing())
                throw new Error(readContentResult.getMessage());

            response.status(200).json(readContentResult.getResult());

            next();
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }
    
    createContent(request: Request, response: Response, next: NextFunction) {
        try {
            let contentName = expressHelper.getContentName(request);
            let content = request.body;
            
            let readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());
            
            let createContentResult = createContent.execute(readContentDefinitionResult.getResult()!, content);
            if (createContentResult.getIsFailing())
                throw new Error(createContentResult.getMessage());
    
            response.status(201).json({ id: createContentResult.getResult() });
    
            next();
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }

    deleteContent(request: Request, response: Response, next: NextFunction) {
        let contentName = expressHelper.getContentName(request);
        let id = request.params.id;

        try {
            let readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            let deleteContentResult = deleteContent.execute(readContentDefinitionResult.getResult()!, id);
            if (deleteContentResult.getIsFailing())
                throw new Error(deleteContentResult.getMessage());

            response.sendStatus(200);

            next();
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }

    updateContent(request: Request, response: Response, next: NextFunction) {
        let contentName = expressHelper.getContentName(request);
        let content = request.body;

        try {
            let readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            let updateContentResult = updateContent.execute(readContentDefinitionResult.getResult()!, content);
            if (updateContentResult.getIsFailing())
                throw new Error(updateContentResult.getMessage());

            response.sendStatus(200);

            next();
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }
}

export default new ExpressContentManager();