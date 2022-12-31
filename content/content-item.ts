interface IContentItem {
    id: string;

    getData(): any;
    setData(data: any): void;
}

function of(data: any): IContentItem {
    return {
        id: data.id,
        getData() {
            let dataWithoutId = { ...data };
            delete dataWithoutId["id"];

            return dataWithoutId;
        },
        setData(data) {
            throw new Error("Method not implemented.");
        },
    };
}

export default IContentItem;
export { of };
