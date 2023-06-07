import TextContentFieldDefinitionDTO from "../../../../content-management/app/dto/content-field-definition/text-content-field-definition";

class FieldWithDetermination extends TextContentFieldDefinitionDTO {
    protected filePath: string = __filename;
    

    
    constructor() {
        super("", "determination-field");

        this.addDetermination((data) => {
            return "Updated " + data;
        });
    }
}

export default new FieldWithDetermination();