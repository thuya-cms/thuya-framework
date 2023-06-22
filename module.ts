import ContentProvider from './content-management/app/content-provider';
import { IController } from './common';

type ModuleMetadata = { name: string, version: number };

/**
 * A module to extend a Thuya CMS application.
 */
abstract class Module {
    /**
     * @returns the content providers of the module
     */
    getContentProviders(): ContentProvider[] {
        return [];
    }

    /**
     * @returns the controllers of the module
     */
    getControllers(): IController[] {
        return [];
    }

    /**
     * @returns the metadata of the module
     */
    abstract getMetadata(): ModuleMetadata
}

export { ModuleMetadata };
export default Module;