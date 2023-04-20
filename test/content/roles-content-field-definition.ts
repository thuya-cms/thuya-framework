import { ContentFieldDefinition, ContentFieldType } from "../../content-management/domain/entity/content-field-definition";
import roleContentFieldDefinition from "./role-content-field-definition";

class RolesContentFieldDefinition extends ContentFieldDefinition {
    constructor() {
        super("", "roles", ContentFieldType.Text);

        this.setIsArrayOf(roleContentFieldDefinition);
    }
}

export default new RolesContentFieldDefinition();