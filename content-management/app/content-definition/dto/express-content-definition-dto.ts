type ExpressContentFieldDTO = {
    name: string,
    contentFieldDefinitionName: string,
    options: {
        isRequired: boolean,
        isUnique: boolean,
        IsIndex: boolean
    }
};

type ExpressContentDefinitionDTO = {
    id?: string,
    name: string,
    contentFields: ExpressContentFieldDTO[]
};

export default ExpressContentDefinitionDTO;