import IContentType from "../../content/content-type";
import IModule from "../../module";
import ClientContentType from "./client-content-type";

class ClientModule implements IModule {
    id: string = "client-module";
    contentTypes: IContentType[] = [ClientContentType];
}

export default new ClientModule();
