abstract class Entity {
    constructor(private id: string) {}



    public getId(): string {
        return this.id;
    }

    public equals(other: Entity): boolean {
        if (!other) return false;

        return other.id === this.id;
    }
}

export default Entity;