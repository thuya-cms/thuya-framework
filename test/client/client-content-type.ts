import IContentType from "../../content/content-type";

class ClientContentType implements IContentType {
    id: string = "client-content-type";
    fields = [{
        name: "title"
    }];
}

export default new ClientContentType();
