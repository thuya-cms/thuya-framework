import { Result } from "../../common";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import createContent from "../domain/usecase/content/create-content";
import readContent from "../domain/usecase/content/read-content";

class ContentManager {
    readContent(contentDefinitionName: string, id: string,): Result<any> {
        const readContentDefinitionResult = readContentDefinition.execute(contentDefinitionName);
        if (readContentDefinitionResult.getIsFailing())
            return readContentDefinitionResult;

        return readContent.byId(readContentDefinitionResult.getResult()!, id);
    }

    readContentByFieldValue(contentDefinitionName: string, fieldValue: { name: string, value: any }): Result<any> {
        const readContentDefinitionResult = readContentDefinition.execute(contentDefinitionName);
        if (readContentDefinitionResult.getIsFailing())
            return readContentDefinitionResult;

        return readContent.byFieldValue(readContentDefinitionResult.getResult()!, fieldValue);
    }

    createContent(contentDefinitionName: string, content: any): Result<string> {
        const createContentDefinitionResult = readContentDefinition.execute(contentDefinitionName);
        if (createContentDefinitionResult.getIsFailing())
            return Result.error(createContentDefinitionResult.getMessage());

        return createContent.execute(createContentDefinitionResult.getResult()!, content);
    }
}

export default new ContentManager();