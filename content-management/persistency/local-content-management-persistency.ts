import logger from "../../util/logger";
import { ContentDefinition } from "../domain/entity/content-definition";
import IContentManagementPersistency from "../domain/usecase/persistency.interface";
import {v4 as uuidv4} from 'uuid';

class LocalContentManagementPersistency implements IContentManagementPersistency {
    private contentDefinitions: ContentDefinition<any>[] = [];
    private content: { contentName: string, content: any[] }[] = [];
    
    
    
    createContentDefinition(contentDefinition: ContentDefinition<any>): void {
        this.contentDefinitions.push(contentDefinition);
    }
    
    createContent(contentName: string, content: any): string {
        let existingContent = this.content.find(existingContent => existingContent.contentName === contentName);

        if (!existingContent) {
            existingContent = {
                contentName: contentName,
                content: []
            };

            this.content.push(existingContent);
        }

        content.id = uuidv4();
        existingContent.content.push(content);

        return content.id;
    }

    readContentDefinition(contentName: string): ContentDefinition<any> | undefined {
        logger.debug(`Reading '${ contentName }' content definition from local store.`);
        return this.contentDefinitions.find(contentDefinition => contentDefinition.getName() === contentName);
    }

    listContent(contentName: string): any[] {
        let list = this.content.find(content => content.contentName === contentName);

        return list ? list.content : [];
    }

    readContent(contentName: string, id: string) {
        let contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        let content = contentList.content.find(content => content["id"] === id);

        if (!content)
            throw new Error("Content not found.");

        return content;
    }
}

export default new LocalContentManagementPersistency();