interface IContentType {
    id: string;
    fields: {
        name: string 
    }[],
    middlewares?: {
        event: string,
        function: Function
    }[]
}

export default IContentType;
