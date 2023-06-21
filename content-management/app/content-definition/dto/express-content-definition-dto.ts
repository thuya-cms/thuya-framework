type ExpressContentFieldDTO = {
    name: string,
    contentFieldDefinitionName: string,
    options: {
        isRequired: boolean,
        isUnique: boolean,
        isIndexed: boolean
    }
};

type ExpressContentDefinitionDTO = {
    id?: string,
    name: string,
    contentFields: ExpressContentFieldDTO[]
};

export default ExpressContentDefinitionDTO;