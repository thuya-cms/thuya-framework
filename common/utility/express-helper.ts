import { Request } from "express";
import logger from "./logger";
import contentHelper from "./content-helper";

class ExpressHelper {
    getContentName(request: Request) {
        return request.url.split("/")[1];
    }

    deleteNotExistingProperties(content: any, contentFieldNames: string[]) {
        for (const contentProperty in content) {
            if (!this.contentFieldExists(contentFieldNames, contentProperty)) {
                delete content[contentProperty];
                logger.debug(`Field "%s" is removed.`, contentProperty);
            }
        }
    }
    

    private contentFieldExists(contentFieldNames: string[], contentProperty: Extract<keyof any, string>) {
        return contentFieldNames.find(contentFieldName => contentFieldName === contentProperty);
    }
}

export default new ExpressHelper();