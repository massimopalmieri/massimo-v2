export {};

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
      render: (element: HTMLElement, options: { sitekey: string }) => void;
    };
  }
}
