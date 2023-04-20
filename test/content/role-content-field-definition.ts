import { ContentFieldDefinition, ContentFieldType } from "../../content-management/domain/entity/content-field-definition";

class RoleContentFieldDefinition extends ContentFieldDefinition {
    constructor() {
        super("", "role", ContentFieldType.Text);

        this.setIsRequired(true);
    }
}

export default new RoleContentFieldDefinition();