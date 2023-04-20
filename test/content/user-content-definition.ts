import { ContentDefinition } from "../../content-management/domain/entity/content-definition";
import emailContentFieldDefinition from "./email-content-field-definition";
import rolesContentFieldDefinition from "./roles-content-field-definition";

class UserContentDefinition extends ContentDefinition<any> {
    constructor() {
        super("", "user");

        this.addContentField(emailContentFieldDefinition);
        this.addContentField(rolesContentFieldDefinition);
    }
}

export default new UserContentDefinition();