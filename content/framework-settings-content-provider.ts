import { ContentProvider } from "../content-management/app";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition/content-definition";
import { ContentFieldDefinitionDTO } from "../content-management/app/dto/content-field-definition/content-field-definition";
import frameworkVersionContentFieldDefinition from "./framework-version-content-field-definition";
import frameworkSettingsContentDefinition from "./framework-settings-content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";

/**
 * Content provider for framework settings.
 */
class SettingsContentProvider extends ContentProvider {
    /**
     * @inheritdoc
     */
    override getContentFieldDefinitions(): ContentFieldDefinitionDTO[] {
        return [frameworkVersionContentFieldDefinition, new TextContentFieldDefinitionDTO("", "id")];
    }

    /**
     * @inheritdoc
     */
    override getContentDefinitions(): ContentDefinitionDTO<any>[] {
        return [frameworkSettingsContentDefinition];
    }

    /**
     * @inheritdoc
     */
    override getInitialContent():{ contentDefinitionName: string, content: any }[] {
        return [{
            contentDefinitionName: frameworkSettingsContentDefinition.getName(),
            content: {
                frameworkVersion: 1
            }
        }];
    }
}

export default new SettingsContentProvider();