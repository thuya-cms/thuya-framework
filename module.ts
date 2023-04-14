import { ContentType } from "./content-manager/domain/entity/content-type";
import IController from "./controller";

interface IModule {
    getContentTypes(): ContentType[];
    getControllers(): IController[];
}

export default IModule;