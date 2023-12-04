export interface Context {
  app_version?: string;
  immersive?: boolean;
  appearance?: 'light' | 'dark';
  currency?: string;
  locale?: string;
  platform?: 'iOS' | 'Android' | 'Desktop';
  conversation_id?: string;
}

export interface Messengers {
  getContext: (args?: string) => string;
  playlist: (audio: string[]) => any;
  reloadTheme: (args?: string) => void;
  close: (args?: string) => void;
  getAssets: (assets: string[], cb: (res: any[]) => void) => any;
}

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        MixinContext?: { postMessage: Messengers['getContext'] };
        playlist?: { postMessage: Messengers['playlist'] };
        reloadTheme?: { postMessage: Messengers['reloadTheme'] };
        close?: { postMessage: Messengers['close'] };
        getAssets?: { postMessage: Messengers['getAssets'] };
      };
    };
    MixinContext?: {
      getContext?: Messengers['getContext'];
      reloadTheme?: Messengers['reloadTheme'];
      playlist?: Messengers['playlist'];
      close?: Messengers['close'];
      getAssets?: Messengers['getAssets'];
    };
  }
}
