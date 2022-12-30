import IContentType from "./content/content-type";

interface IModule {
    id: string,
    contentTypes?: IContentType[]
}

export default IModule;
