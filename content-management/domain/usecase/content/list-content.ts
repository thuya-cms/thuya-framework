import { Result } from "../../../../common";
import factory from "../../factory";
import UnknownContent from "./unknown-content.type";

class ListContent {
    async execute(contentName: string): Promise<Result<UnknownContent[]>> {
        return Result.success(await factory.getContentPersistency().listContent(contentName));
    }
}

export default new ListContent();