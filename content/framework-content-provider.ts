import { ContentProvider } from "../content-management/app";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition/content-definition";
import { ContentFieldDefinitionDTO } from "../content-management/app/dto/content-field-definition/content-field-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import moduleNameContentFieldDefinition from "./module-name-content-field-definition";
import moduleVersionContentFieldDefinition from "./module-version-content-field-definition";
import moduleMetadataContentDefinition from "./module-metadata-content-definition";

/**
 * Content provider for framework.
 */
class FrameworkContentProvider extends ContentProvider {
    /**
     * @inheritdoc
     */
    override getContentFieldDefinitions(): ContentFieldDefinitionDTO[] {
        return [moduleNameContentFieldDefinition, moduleVersionContentFieldDefinition, new TextContentFieldDefinitionDTO("", "id")];
    }

    /**
     * @inheritdoc
     */
    override getContentDefinitions(): ContentDefinitionDTO<any>[] {
        return [moduleMetadataContentDefinition];
    }
}

export default new FrameworkContentProvider();