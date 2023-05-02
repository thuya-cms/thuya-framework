class ContentHelper {
    getFieldValue(fieldName: string, content: any) {
        const propertyNameAsKey: keyof any = fieldName;

        return content[propertyNameAsKey];
    }

    adjustContentFieldName(contentFieldName: string): string {
        return contentFieldName
            .toLowerCase()
            .replace(/-/g, "");
    }

    getContentPropertyName(contentFieldName: string, content: any): keyof typeof content | undefined {
        const fieldNameLowerCase = this.adjustContentFieldName(contentFieldName);
        let propertyNameAsKey: keyof typeof content | undefined;

        for (const contentProperty in content) {
            if (this.adjustContentFieldName(contentProperty) === fieldNameLowerCase) {
                propertyNameAsKey = contentProperty;
                break;
            }
        }  

        return propertyNameAsKey;
    }
}

export default new ContentHelper();