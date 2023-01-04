import contentItemManager from "./content-item-manager";
import contentTypeManager from "./content-type-manager";

class ContentManager {
    contentTypeManager;
    contentItemManager;



    constructor() {
        this.contentTypeManager = contentTypeManager;
        this.contentItemManager = contentItemManager;
    }
}

export default new ContentManager();
