import { Result } from "../../../../common";

type ContentFieldValidator<T> = (contentFieldData: T) => Result;
type ContentFieldDetermination<T> = (contentFieldData: T) => T;

/**
 * Interface to indicate that a content field provides handlers for validations and determinations.
 */
interface IContentFieldDefinitionHandlerProvider<T = any> {
    /**
     * @returns the validations of the content field definition
     */
    getValidators(): ContentFieldValidator<T>[];

    /**
     * @returns the determinations of the content field definition
     */
    getDeterminations(): ContentFieldDetermination<T>[];
}

export { ContentFieldValidator, ContentFieldDetermination };
export default IContentFieldDefinitionHandlerProvider;