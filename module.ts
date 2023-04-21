import express from 'express';
import ContentProvider from './content-provider';

abstract class Module {
    setupMiddlewares(expressApp: express.Application): void {
    }

    getContentProviders(): ContentProvider[] {
        return [];
    }
}

export default Module;