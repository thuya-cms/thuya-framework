import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import createContent from "../domain/usecase/content/create-content";
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

    createContent(contentDefinitionName: string, content: any) {
        let contentDefinition = readContentDefinition.execute(contentDefinitionName);
        createContent.execute(contentDefinition, content);
    }
}

export default new ContentManager();