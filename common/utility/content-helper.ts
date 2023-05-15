class ContentHelper {
    getFieldValue(fieldName: string, content: any) {
        const propertyNameAsKey: keyof any = fieldName;

        return content[propertyNameAsKey];
    }
}

export default new ContentHelper();