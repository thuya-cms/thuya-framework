import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition that represents dates.
 */
class DateContentFieldDefinitionDTO extends ContentFieldDefinitionDTO<Date> {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Date);
    }
}

export default DateContentFieldDefinitionDTO;