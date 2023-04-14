import IPersistency from "./persistency/persistency.interface";

class Factory {
    private _persistency?: IPersistency;



    /**
     * Set a persistency implementation.
     * 
     * @param persistency the persistency implementation
     * @throws will throw an exception of there is already a persistency implementation set
     */
    public setPersistency(persistency: IPersistency): void {
        if (this._persistency)
            throw new Error("Not allowed to change persistency implementation.");

        this._persistency = persistency;
    }

    /**
     * Returns the persistency instance.
     * 
     * @throws will throw an exception if there is no persistency implementation injected
     */
    public getContentTypePersistency(): IPersistency {
        if (!this._persistency)
            throw new Error("No persistency implementation injected.");

        return this._persistency;
    }
}

export default new Factory();
