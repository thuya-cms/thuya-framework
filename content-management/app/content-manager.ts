import { Result } from "../../common";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import createContent from "../domain/usecase/content/create-content";
import readContent from "../domain/usecase/content/read-content";
import UnknownContent from "../domain/usecase/content/unknown-content.type";

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
        const createContentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (createContentDefinitionResult.getIsFailing())
            return Result.error(createContentDefinitionResult.getMessage());

        return await createContent.execute(createContentDefinitionResult.getResult()!, content);
    }
}

export default new ContentManager();