enum ContentTypeMiddlewareEvent {
    get,
    list,
    create
}

interface IContentType {
    id: string;
    fields: {
        name: string,
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
export { ContentTypeMiddlewareEvent };
