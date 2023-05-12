import { ContentProvider, contentManager } from "../content-management/app";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import { ContentFieldDefinitionDTO } from "../content-management/app/dto/content-field-definition/content-field-definition";
import frameworkVersionContentFieldDefinition from "./framework-version-content-field-definition";
import frameworkSettingsContentDefinition from "./framework-settings-content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";

class SettingsContentProvider extends ContentProvider {
    override getContentFieldDefinitions(): ContentFieldDefinitionDTO[] {
        return [frameworkVersionContentFieldDefinition, new TextContentFieldDefinitionDTO("", "id")];
    }

    override getContentDefinitions(): ContentDefinitionDTO<any>[] {
        return [frameworkSettingsContentDefinition];
    }

    override async createContent(): Promise<void> {
        await contentManager.createContent(frameworkSettingsContentDefinition.getName(), {
            frameworkVersion: 1
        });
    }
}

export default new SettingsContentProvider();