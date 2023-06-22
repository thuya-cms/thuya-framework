import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";

/**
 * Name of a Thuya CMS module.
 */
class ModuleNameContentFieldDefinition extends TextContentFieldDefinitionDTO {
    constructor() {
        super("", "module-name");
    }
}

export default new ModuleNameContentFieldDefinition();