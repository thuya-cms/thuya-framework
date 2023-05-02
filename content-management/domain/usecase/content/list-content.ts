import { Result } from "../../../../common";
import factory from "../../factory";

class ListContent {
    execute(contentName: string): Result<any[]> {
        return Result.success(factory.getPersistency().listContent(contentName));
    }
}

export default new ListContent();