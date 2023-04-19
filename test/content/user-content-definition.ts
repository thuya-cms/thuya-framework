import { ContentDefinition } from "../../content-management/domain/entity/content-definition";
import emailContentFieldDefinition from "./email-content-field-definition";

class UserContentDefinition extends ContentDefinition<any> {
    constructor() {
        super("", "user");

        this.addContentField(emailContentFieldDefinition);
    }
}

export default new UserContentDefinition();