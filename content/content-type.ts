enum ContentTypeMiddlewareEvent {
    get,
    list,
    create
}

enum ContentTypeFieldType {
    string,
    number,
    date
}

interface IContentType {
    id: string;
    fields: {
        name: string,
        type: ContentTypeFieldType,
        required?: boolean
    }[],
    middlewares?: {
        before: {
            event: ContentTypeMiddlewareEvent,
            function: Function
        }[], 
        after: { 
            event: ContentTypeMiddlewareEvent,
            function: Function
        }[]
    }
}

export default IContentType;
export { ContentTypeMiddlewareEvent, ContentTypeFieldType };
