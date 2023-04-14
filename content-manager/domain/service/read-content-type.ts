import { ContentType } from "../entity/content-type";

class ReadContentType {
    byName(name: string): ContentType {
        throw new Error();
    }
}

export default new ReadContentType();