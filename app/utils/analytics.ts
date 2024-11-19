type UmamiEvent = {
  type: string;
  value?: string | number;
};

declare global {
  interface Window {
    umami?: {
      track: (event_name: string, event_data?: UmamiEvent) => void;
    };
  }
}

export const trackEvent = (eventName: string, eventData?: UmamiEvent) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Track event (dev):', eventName, eventData);
    return;
  }

  if (window.umami) {
    window.umami.track(eventName, eventData);
  }
}; 