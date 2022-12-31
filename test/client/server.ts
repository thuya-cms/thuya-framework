import thuya from '../../index';
import clientModule from './client-module';
import localPersistency from './local-persistency';

thuya.usePersistency(localPersistency);
thuya.useModule(clientModule);
thuya.start();
