import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import readContent from "../domain/usecase/content/read-content";

class ContentManager {
    readContent(id: string, contentDefinitionName: string): any {
        let contentDefinition = readContentDefinition.execute(contentDefinitionName);
        return readContent.byId(contentDefinition, id);
    }

    readContentByFieldValue(contentDefinitionName: string, fieldValue: { name: string, value: any }): any {
        let contentDefinition = readContentDefinition.execute(contentDefinitionName);
        return readContent.byFieldValue(contentDefinition, fieldValue);
    }
}

export default new ContentManager();