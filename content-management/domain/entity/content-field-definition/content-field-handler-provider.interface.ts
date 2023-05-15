import { Result } from "../../../../common";

type ContentFieldValue = string | Date | number | string[] | Date[] | number[] | any; 
type ContentFieldValidator = (contentFieldData: ContentFieldValue) => Result;
type ContentFieldDetermination = (contentFieldData: ContentFieldValue) => ContentFieldValue;

interface IContentFieldHandlerProvider {
    getValidators(): ContentFieldValidator[];
    getDeterminations(): ContentFieldDetermination[];
}

export { ContentFieldValue, ContentFieldValidator, ContentFieldDetermination };
export default IContentFieldHandlerProvider;