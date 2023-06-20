import ContentProvider from './content-management/app/content-provider';
import { IController } from './common';

/**
 * A module to extend a Thuya CMS application.
 */
abstract class Module {
    /**
     * @returns the metadata of the module
     */
    getMetadata(): { name: string } {
        return { 
            name: "Unknown"
        };
    }

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
}

export default Module;