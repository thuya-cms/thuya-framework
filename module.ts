import express from 'express';
import ContentProvider from './content-management/app/content-provider';
import { IController } from './common';

abstract class Module {
    setupMiddlewares(expressApp: express.Application): void {
    }

    getContentProviders(): ContentProvider[] {
        return [];
    }

    getControllers(): IController[] {
        return [];
    }
}

export default Module;