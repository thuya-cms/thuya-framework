/**
 * Helper class for content maintenance.
 */
class ContentHelper {
    /**
     * Get the value of a field from an object.
     * 
     * @param fieldName name of the field
     * @param content the content
     * @returns the value of the field from content
     */
    getFieldValue(fieldName: string, content: any): any {
        const propertyNameAsKey: keyof any = fieldName;

        return content[propertyNameAsKey];
    }
}

export default new ContentHelper();