import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";

class FrameworkVersionContentFieldDefinition extends NumericContentFieldDefinitionDTO {
    constructor() {
        super("", "framework-version");
    }
}

export default new FrameworkVersionContentFieldDefinition();