import factory from "../factory";
import IPersistency from "../persistency/persistency";
import IContentType from "./content-type";

class ContentManager {
    public list(contentType: IContentType): any[] {
        return factory.getPersistency().list(contentType);
    }

    public get(contentType: IContentType, id: string): any {
        let result: any = {};
        
        contentType.parts.forEach(contentPart => {
            result[contentPart.name] = `${contentPart.name} value`;
        });

        return result;
    }

    public create(contentType: IContentType, data: any): void {
        factory.getPersistency().create(contentType, data);
    }
}

export default new ContentManager();
