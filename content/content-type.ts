enum ContentTypeMiddlewareEvent {
    get,
    list,
    create
}

interface IContentType {
    id: string;
    fields: {
        name: string 
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
