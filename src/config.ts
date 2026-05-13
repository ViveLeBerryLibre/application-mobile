import {ConfigInterface} from '@/common/types/Config.interface';
import {Capacitor} from '@capacitor/core';

declare global {
    interface Window {
        CONFIG: ConfigInterface
    }
}

let url = 'http://localhost';
if (Capacitor.getPlatform() === 'ios') {
    url = 'capacitor://localhost';
}

console.info('Chargement configuration : /config.json');
await fetch(`${url}/config.json`)
    .then((response) => response.json())
    .then((config) => {
        window.CONFIG = config;
    });