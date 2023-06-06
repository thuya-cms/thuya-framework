import ContentProvider from './content-management/app/content-provider';
import { IController } from './common';

abstract class Module {
    getMetadata(): { name: string } {
        return { 
            name: "Unknown"
        };
    }

    getContentProviders(): ContentProvider[] {
        return [];
    }

    getControllers(): IController[] {
        return [];
    }
}

export default Module;