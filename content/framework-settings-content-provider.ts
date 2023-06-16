import { ContentProvider, contentManager } from "../content-management/app";
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
     * @returns the content fields required for a Thuya CMS app
     */
    override getContentFieldDefinitions(): ContentFieldDefinitionDTO[] {
        return [frameworkVersionContentFieldDefinition, new TextContentFieldDefinitionDTO("", "id")];
    }

    /**
     * @returns content definitions required or a Thuya CMS app
     */
    override getContentDefinitions(): ContentDefinitionDTO<any>[] {
        return [frameworkSettingsContentDefinition];
    }

    /** */
    override async createContent(): Promise<void> {
        await contentManager.createContent(frameworkSettingsContentDefinition.getName(), {
            frameworkVersion: 1
        });
    }
}

export default new SettingsContentProvider();