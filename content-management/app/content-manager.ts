import { Result } from "../../common";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import createContent from "../domain/usecase/content/create-content";
import readContent from "../domain/usecase/content/read-content";
import UnknownContent from "../domain/usecase/content/unknown-content.type";

class ContentManager {
    async readContent(contentDefinitionName: string, id: string,): Promise<Result<UnknownContent>> {
        const readContentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (readContentDefinitionResult.getIsFailing())
            return readContentDefinitionResult;

        return await readContent.byId(readContentDefinitionResult.getResult()!, id);
    }

    async readContentByFieldValue(contentDefinitionName: string, fieldValue: { name: string, value: any }): Promise<Result<UnknownContent>> {
        const readContentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (readContentDefinitionResult.getIsFailing())
            return Result.error(readContentDefinitionResult.getMessage());

        return await readContent.byFieldValue(readContentDefinitionResult.getResult()!, fieldValue);
    }

    async createContent(contentDefinitionName: string, content: any): Promise<Result<string>> {
        const createContentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (createContentDefinitionResult.getIsFailing())
            return Result.error(createContentDefinitionResult.getMessage());

        return await createContent.execute(createContentDefinitionResult.getResult()!, content);
    }
}

export default new ContentManager();