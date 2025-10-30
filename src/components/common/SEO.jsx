import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Manages meta tags for pages
 *
 * Usage:
 * <SEO
 *   title="Page Title"
 *   description="Page description"
 *   keywords="keyword1, keyword2"
 *   ogImage="/path/to/image.jpg"
 *   noIndex={false}
 * />
 */
export const SEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false,
  noFollow = false
}) => {
  const siteName = 'Trusted Business Partners';
  const fullTitle = title ? `${title} - ${siteName}` : siteName;
  const defaultDescription = 'Professional business services in Albania - Website Design, Development, Branding, and Digital Marketing';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description || defaultDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description || defaultDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Robots */}
      {(noIndex || noFollow) && (
        <meta
          name="robots"
          content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`}
        />
      )}
    </Helmet>
  );
};
