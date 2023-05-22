import IContentPersistency from "./content-persistency.interface";

interface IContentCache extends IContentPersistency {
    setTimeToLive(timeToLiveSeconds: number): void;
}

export default IContentCache;