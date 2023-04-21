import IdentifiableError from "../../../../identifiable-error";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

enum ErrorCode {
    NotFound = "not-found",
}

class ReadContentDefinition {
    execute(contentName: string): ContentDefinition<any> {
        let contentDefinition = factory.getPersistency().readContentDefinition(contentName);

        if (!contentDefinition)
            throw new IdentifiableError(ErrorCode.NotFound, "Content definition not found.");

        return contentDefinition;
    }
}

export default new ReadContentDefinition();