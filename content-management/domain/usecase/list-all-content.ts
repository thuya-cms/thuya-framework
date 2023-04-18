import factory from "../factory";

class ListAllContent {
    execute(contentName: string): any[] {
        return factory.getPersistency().listContent(contentName);
    }
}

export default new ListAllContent();