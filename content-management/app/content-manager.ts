import { Result } from "../../common";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import createContent from "../domain/usecase/content/create-content";
import deleteContent from "../domain/usecase/content/delete-content";
import listContent from "../domain/usecase/content/list-content";
import readContent from "../domain/usecase/content/read-content";
import UnknownContent from "../domain/usecase/content/unknown-content.type";
import updateContent from "../domain/usecase/content/update-content";

/**
 * Manager for content.
 */
class ContentManager {
    /**
     * Read a content by id.
     * 
     * @param contentDefinitionName name of the content definition 
     * @param id id of the content
     * @returns result containing the data of the content
     */
    async readContent<T = UnknownContent>(contentDefinitionName: string, id: string,): Promise<Result<T>> {
        return await readContent.byId(contentDefinitionName, id);
    }

    /**
     * Read a content by field value.
     * 
     * @param contentDefinitionName name of the content definition 
     * @param fieldValue key and value of the field that is used as a filter
     * @param fieldValue.name key of the field that is used as a filter
     * @param fieldValue.value value of the field that is used as a filter
     * @returns result containing the data of the content
     */
    async readContentByFieldValue<T = UnknownContent>(contentDefinitionName: string, fieldValue: { name: string, value: any }): Promise<Result<T>> {
        return await readContent.byFieldValue(contentDefinitionName, fieldValue);
    }

    /**
     * Create a content.
     * 
     * @param contentDefinitionName name of the content definition 
     * @param content data of the content
     * @returns result containing the id o the content
     */
    async createContent(contentDefinitionName: string, content: any): Promise<Result<string>> {
        const readContentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (readContentDefinitionResult.getIsFailing())
            return Result.error(readContentDefinitionResult.getMessage());

        return await createContent.execute(readContentDefinitionResult.getResult()!, content);
    }

    /**
     * Update a content.
     * 
     * @param contentDefinitionName name of the content definition
     * @param content data of the content
     * @returns result
     */
    async updateContent(contentDefinitionName: string, content: UnknownContent): Promise<Result> {
        const readContentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (readContentDefinitionResult.getIsFailing())
            return Result.error(readContentDefinitionResult.getMessage());

        return await updateContent.execute(readContentDefinitionResult.getResult()!, content);
    }

    /**
     * Delete a content.
     * 
     * @param contentDefinitionName name of the content definition
     * @param id id of the content
     * @returns result
     */
    async deleteContent(contentDefinitionName: string, id: string): Promise<Result> {
        return await deleteContent.execute(contentDefinitionName, id);
    }

    /**
     * List all content of a content definition.
     * 
     * @param contentDefinitionName name of the content definition
     * @returns result containing the content list
     */
    async listContent(contentDefinitionName: string): Promise<Result<UnknownContent>> {
        return await listContent.execute(contentDefinitionName);
    }
}

export default new ContentManager();