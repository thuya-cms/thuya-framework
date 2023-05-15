import { Result } from "../../../../common";

type ContentFieldValidator<T> = (contentFieldData: T) => Result;
type ContentFieldDetermination<T> = (contentFieldData: T) => T;

interface IContentFieldHandlerProvider<T = any> {
    getValidators(): ContentFieldValidator<T>[];
    getDeterminations(): ContentFieldDetermination<T>[];
}

export { ContentFieldValidator, ContentFieldDetermination };
export default IContentFieldHandlerProvider;