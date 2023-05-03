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
            const contentName = expressHelper.getContentName(request);

            const listContentResult = listContent.execute(contentName);
            if (listContentResult.getIsFailing())
                throw new Error(listContentResult.getMessage());
    
            response.status(200).json(listContentResult.getResult());
            
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
            const contentName = expressHelper.getContentName(request);
            const id = request.params.id;

            const readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            const readContentResult = readContent.byId(readContentDefinitionResult.getResult()!, id);
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
            const contentName = expressHelper.getContentName(request);
            const content = request.body;
            
            const readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());
            
            const createContentResult = createContent.execute(readContentDefinitionResult.getResult()!, content);
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
        const contentName = expressHelper.getContentName(request);
        const id = request.params.id;

        try {
            const readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            const deleteContentResult = deleteContent.execute(readContentDefinitionResult.getResult()!, id);
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
        const contentName = expressHelper.getContentName(request);
        const content = request.body;

        try {
            const readContentDefinitionResult = readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            const updateContentResult = updateContent.execute(readContentDefinitionResult.getResult()!, content);
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