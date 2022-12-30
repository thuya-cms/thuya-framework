import IContentType from "../../content/content-type";

class ClientContentType implements IContentType {
    id: string = "client-content-type";
}

export default new ClientContentType();
