import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

class DateContentFieldDefinitionDTO extends ContentFieldDefinitionDTO<Date> {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Date);
    }
}

export default DateContentFieldDefinitionDTO;