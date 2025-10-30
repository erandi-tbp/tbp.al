import { useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';

export const FaviconUpdater = () => {
  const { getFaviconUrl } = useSettings();

  useEffect(() => {
    const faviconUrl = getFaviconUrl();

    if (faviconUrl) {
      // Update or create favicon link
      let link = document.querySelector("link[rel~='icon']");

      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }

      link.href = faviconUrl;

      // Also update apple-touch-icon if exists
      let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleTouchIcon);
      }
      appleTouchIcon.href = faviconUrl;
    }
  }, [getFaviconUrl]);

  return null; // This component doesn't render anything
};
