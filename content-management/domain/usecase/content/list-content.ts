import factory from "../../factory";

class ListContent {
    execute(contentName: string): any[] {
        return factory.getPersistency().listContent(contentName);
    }
}

export default new ListContent();