import { ContentFieldDefinition, ContentFieldType, ContentFieldTypes } from "../../content-management/domain/entity/content-field-definition";
import IdentifiableError from "../../identitfiable-error";

class EmailContentFieldDefinition extends ContentFieldDefinition {
    constructor() {
        super("", "email", ContentFieldType.Text);

        this.addHandler(this.validate);
    }


    validate(fieldValue: ContentFieldTypes) {
        if (fieldValue.toString().indexOf("@") === -1)
            throw new IdentifiableError("invalid-mail", "Invalid email address.");
    }
}

export default new EmailContentFieldDefinition();