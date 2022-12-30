import IContentType from "./content-type";

class ContentManager {
    public list(contentType: IContentType): any[] {
        let dummyContentItem: any = {};
        let result: any[] = [];
        
        contentType.parts.forEach(contentPart => {
            dummyContentItem[contentPart.name] = `${contentPart.name} value`;
        });

        result.push(dummyContentItem);

        return result;
    }

    public get(contentType: IContentType, id: string): any {
        let result: any = {};
        
        contentType.parts.forEach(contentPart => {
            result[contentPart.name] = `${contentPart.name} value`;
        });

        return result;
    }
}

export default new ContentManager();
