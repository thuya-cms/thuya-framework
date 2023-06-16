import { Request } from "express";
import Logger from "./logger";

/**
 * Helper class to process express requests.
 */
class ExpressHelper {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ExpressHelper.name);
    }



    /**
     * Get the target content definition name from a request. 
     * Content definition name is always the first part after the host.
     * 
     * @param request the express request
     * @returns the name of the targeted content definition
     */
    getContentDefinitionName(request: Request): string {
        return request.url.split("/")[1];
    }

    /**
     * Delete properties from a content that are not included in the array of content field names.
     * 
     * @param content the content
     * @param contentFieldNames array of content field names
     */
    deleteNotExistingProperties(content: any, contentFieldNames: string[]): void {
        for (const contentProperty in content) {
            if (!this.contentFieldExists(contentFieldNames, contentProperty)) {
                delete content[contentProperty];
                this.logger.debug(`Field "%s" is removed.`, contentProperty);
            }
        }
    }
    

    private contentFieldExists(contentFieldNames: string[], contentProperty: Extract<keyof any, string>): boolean {
        return !contentFieldNames.find(contentFieldName => contentFieldName === contentProperty);
    }
}

export default new ExpressHelper();