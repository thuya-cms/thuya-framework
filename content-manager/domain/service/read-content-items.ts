class ReadContentItems {
    where(contentTypeId: string, filter: { field: string, value: any }[]): any[] {
        throw new Error();
    }
}

export default new ReadContentItems();