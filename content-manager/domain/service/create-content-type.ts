import factory from "../../../factory";
import IdentifiableError from "../../../identitfiable-error";
import { ContentType } from "../entity/content-type";

enum ErrorCode {
    ContentTypeExists = "content-type-exists"
}

class CreateContentType {
    constructor(private contentTypePersistency: IContentTypePersistency) {
    }
    
    
    execute(contentType: ContentType) {
        let contentTypePersistency = factory.getContentTypePersistency();

        if (contentTypePersistency.exists(contentType.getName())) 
            throw new IdentifiableError(ErrorCode.ContentTypeExists, "Content type with the same name already exists.");

        
    }
}