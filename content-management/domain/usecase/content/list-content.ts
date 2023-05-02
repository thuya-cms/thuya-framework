import { Result } from "../../../../common";
import factory from "../../factory";

class ListContent {
    execute(contentName: string): Result<any[]> {
        return Result.success(factory.getContentPersistency().listContent(contentName));
    }
}

export default new ListContent();