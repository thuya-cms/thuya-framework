import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import readContent from "../domain/usecase/content/read-content";

class ContentManager {
    readContent(id: string, contentDefinitionName: string): any {
        let contentDefinition = readContentDefinition.execute(contentDefinitionName);
        return readContent.execute(contentDefinition, id);
    }
}

export default new ContentManager();