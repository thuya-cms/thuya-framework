import { ContentDefinition } from "../../content-management/domain/entity/content-definition";
import ContentProvider from "../../content-provider";
import userContentDefinition from "./user-content-definition";

class UserContentProvider extends ContentProvider {
    getContentDefinitions(): ContentDefinition<any>[] {
        return [userContentDefinition];
    }
}

export default new UserContentProvider();