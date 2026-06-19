import { registerRootComponent } from 'expo';
import EntryPoint from './src/index';

// This safely links your native application framework straight to your custom source directory
registerRootComponent(EntryPoint);