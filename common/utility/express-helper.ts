import { Request } from "express";

/**
 * Helper class to process express requests.
 */
class ExpressHelper {
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
}

export default new ExpressHelper();