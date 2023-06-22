import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";

/**
 * Version of a Thuya CMS module.
 */
class ModuleVersionContentFieldDefinition extends NumericContentFieldDefinitionDTO {
    constructor() {
        super("", "module-version");
    }
}

export default new ModuleVersionContentFieldDefinition();