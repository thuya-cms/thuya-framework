type ExpressContentFieldDefinitionDTO = {
    id?: string,
    name: string,
    type: string,
    arrayElementDefinitionName?: string,
    groupElements?: {
        contentDefinitionName: string,
        name: string,
        options: {
            isRequired: boolean
        }
    }[]
};

export default ExpressContentFieldDefinitionDTO;