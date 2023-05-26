import { Request, Response } from "express";
import listContent from "../domain/usecase/content/list-content";
import createContent from "../domain/usecase/content/create-content";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import readContent from "../domain/usecase/content/read-content";
import deleteContent from "../domain/usecase/content/delete-content";
import updateContent from "../domain/usecase/content/update-content";
import expressHelper from "../../common/utility/express-helper";

class ExpressContentManager {
    async listContent(request: Request, response: Response) {
        try {
            const contentName = expressHelper.getContentName(request);

            const listContentResult = await listContent.execute(contentName);
            if (listContentResult.getIsFailing())
                throw new Error(listContentResult.getMessage());
    
            response.status(200).json(listContentResult.getResult());
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }

    async readContent(request: Request, response: Response) {
        try {
            const contentName = expressHelper.getContentName(request);
            const id = request.params.id;

            const readContentDefinitionResult = await readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            const readContentResult = await readContent.byId(readContentDefinitionResult.getResult()!, id);
            if (readContentResult.getIsFailing())
                throw new Error(readContentResult.getMessage());

            response.status(200).json(readContentResult.getResult());
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }
    
    async createContent(request: Request, response: Response) {
        try {
            const contentName = expressHelper.getContentName(request);
            const content = request.body;
            
            const readContentDefinitionResult = await readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());
            
            const createContentResult = await createContent.execute(readContentDefinitionResult.getResult()!, content);
            if (createContentResult.getIsFailing())
                throw new Error(createContentResult.getMessage());
    
            response.status(201).json({ id: createContentResult.getResult() });
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }

    async deleteContent(request: Request, response: Response) {
        const contentName = expressHelper.getContentName(request);
        const id = request.params.id;

        try {
            const readContentDefinitionResult = await readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            const deleteContentResult = await deleteContent.execute(readContentDefinitionResult.getResult()!, id);
            if (deleteContentResult.getIsFailing())
                throw new Error(deleteContentResult.getMessage());

            response.status(200).send();
        }

        catch (error: any) {
            response
                .status(500)
                .json({
                    message: error.message
                });
        }
    }

    async updateContent(request: Request, response: Response) {
        const contentName = expressHelper.getContentName(request);
        const content = request.body;

        try {
            const readContentDefinitionResult = await readContentDefinition.execute(contentName);
            if (readContentDefinitionResult.getIsFailing())
                throw new Error(readContentDefinitionResult.getMessage());

            const updateContentResult = await updateContent.execute(readContentDefinitionResult.getResult()!, content);
            if (updateContentResult.getIsFailing())
                throw new Error(updateContentResult.getMessage());

            response.status(200).send();
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