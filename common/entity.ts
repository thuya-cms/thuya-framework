/**
 * Represents an entity in the domain layer.
 */
abstract class Entity {
    constructor(private id: string) {}



    /**
     * Get the id of the {@link Entity}.
     * 
     * @returns the id of the {@link Entity}
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Check if this entity equals to another.
     * 
     * @param other the {@link Entity} to compare with
     * @returns true if the id of the two {@link Entity} matches
     */
    public equals(other: Entity): boolean {
        if (!other) return false;

        return other.id === this.id;
    }
}

export default Entity;