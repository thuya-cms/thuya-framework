import { Request, Response } from "express";
import listContent from "../domain/usecase/content/list-content";
import createContent from "../domain/usecase/content/create-content";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import readContent from "../domain/usecase/content/read-content";
import deleteContent from "../domain/usecase/content/delete-content";
import updateContent from "../domain/usecase/content/update-content";
import expressHelper from "../../common/utility/express-helper";

/**
 * Content manager based on express. 
 */
class ExpressContentManager {
    /**
     * List all content.
     * 
     * @param request express request
     * @param response express response
     * @async
     */
    async listContent(request: Request, response: Response): Promise<void> {
        const contentDefinitionName = expressHelper.getContentDefinitionName(request);
        
        try {
            const listContentResult = await listContent.execute(contentDefinitionName);
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

    /**
     * Read a content by id.
     * 
     * @param request express request
     * @param response express response
     * @async
     */
    async readContent(request: Request, response: Response): Promise<void> {
        const contentDefinitionName = expressHelper.getContentDefinitionName(request);
        const id = request.params.id;

        try {
            const readContentResult = await readContent.byId(contentDefinitionName, id);
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
    
    /**
     * Create a content.
     * 
     * @param request express request
     * @param response express result
     * @async
     */
    async createContent(request: Request, response: Response): Promise<void> {
        const contentDefinitionName = expressHelper.getContentDefinitionName(request);
        const content = request.body;

        try {    
            const readContentDefinitionResult = await readContentDefinition.byName(contentDefinitionName);
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

    /**
     * Delete a content.
     * 
     * @param request express request
     * @param response express response
     * @async
     */
    async deleteContent(request: Request, response: Response): Promise<void> {
        const contentDefinitionName = expressHelper.getContentDefinitionName(request);
        const id = request.params.id;

        try {
            const deleteContentResult = await deleteContent.execute(contentDefinitionName, id);
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

    /**
     * Update a content.
     * 
     * @param request express request
     * @param response express response
     * @async
     */
    async updateContent(request: Request, response: Response): Promise<void> {
        const contentName = expressHelper.getContentDefinitionName(request);
        const content = request.body;

        try {
            const readContentDefinitionResult = await readContentDefinition.byName(contentName);
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