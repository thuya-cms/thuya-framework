import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import frameworkVersionContentFieldDefinition from "./framework-version-content-field-definition";

class FrameworkSettingsContentDefinition extends ContentDefinitionDTO {
    constructor() {
        super("", "framework-settings");

        this.addContentField("frameworkVersion", frameworkVersionContentFieldDefinition, { isRequired: true });
    }
}

export default new FrameworkSettingsContentDefinition();