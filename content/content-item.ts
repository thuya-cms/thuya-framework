interface IContentItem<T> {
    id: string;

    getData(): T;
}

class AnyContentItem implements IContentItem<any> {
    private data: any[];

    id: string;



    constructor() {
        this.id = "";
        this.data = [];
    }



    getData(): any[] {
        return this.data;
    }

    setData(data: any): void {
        this.data = data;
    }
}

function of(data: any): IContentItem<any> {
    const anyContentItem = new AnyContentItem();
    anyContentItem.id = data.id;
    anyContentItem.setData(data);
    
    return anyContentItem;
}

export default IContentItem;
export { of, AnyContentItem };
