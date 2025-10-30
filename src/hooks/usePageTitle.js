import { useEffect } from 'react';

// Site configuration
const SITE_NAME = 'Trusted Business Partners';
const SITE_TAGLINE = 'Your Success, Our Commitment!';

/**
 * Custom hook for setting page titles (WordPress-style)
 * @param {string} pageTitle - The title of the current page
 * @param {boolean} isHomePage - Whether this is the home page
 */
export const usePageTitle = (pageTitle = '', isHomePage = false) => {
  useEffect(() => {
    if (isHomePage) {
      // Home page: "Trusted Business Partners - Your Success, Our Commitment!"
      document.title = `${SITE_NAME} - ${SITE_TAGLINE}`;
    } else if (pageTitle) {
      // Other pages: "{Page Name} - Trusted Business Partners"
      document.title = `${pageTitle} - ${SITE_NAME}`;
    } else {
      // Fallback
      document.title = SITE_NAME;
    }
  }, [pageTitle, isHomePage]);
};

// Export constants for reuse
export { SITE_NAME, SITE_TAGLINE };
