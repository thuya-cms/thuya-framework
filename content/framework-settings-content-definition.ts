import ContentDefinitionDTO from "../content-management/app/dto/content-definition/content-definition";
import frameworkVersionContentFieldDefinition from "./framework-version-content-field-definition";

/**
 * Content definition for framework settings.
 */
class FrameworkSettingsContentDefinition extends ContentDefinitionDTO {
    constructor() {
        super("", "framework-settings");

        this.addContentField("frameworkVersion", frameworkVersionContentFieldDefinition, { isRequired: true });
    }
}

export default new FrameworkSettingsContentDefinition();