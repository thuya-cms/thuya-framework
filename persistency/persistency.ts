import IContentType from "../content/content-type";
import IContentItemPersistency from "./content-item-persistency";
import IContentTypePersistency from "./content-type-persistency";

interface IPersistency {
    contentTypePersistency: IContentTypePersistency;
    contentItemPersistency: IContentItemPersistency;
}

export default IPersistency;
