import ContentDefinitionDTO from "../content-management/app/dto/content-definition/content-definition";
import moduleNameContentFieldDefinition from "./module-name-content-field-definition";
import moduleVersionContentFieldDefinition from "./module-version-content-field-definition";

/**
 * Content definition for module metadata.
 */
class ModuleMetadataContentDefinition extends ContentDefinitionDTO {
    constructor() {
        super("", "module-metadata");

        this.addContentField("module", moduleNameContentFieldDefinition, { isRequired: true, isUnique: true, isIndexed: true });
        this.addContentField("version", moduleVersionContentFieldDefinition, { isRequired: true });
    }
}

export default new ModuleMetadataContentDefinition();