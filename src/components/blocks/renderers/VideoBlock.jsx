/**
 * VideoBlock - Renders an embedded video (YouTube/Vimeo)
 */
export const VideoBlock = ({ data }) => {
  const { title, videoUrl, description } = data;

  // Extract video ID and determine platform
  const getVideoEmbed = (url) => {
    if (!url) return null;

    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return {
        platform: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/);
    if (vimeoMatch) {
      return {
        platform: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[2]}`
      };
    }

    return null;
  };

  const videoEmbed = getVideoEmbed(videoUrl);

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-4xl">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6 text-center">
            {title}
          </h2>
        )}

        {videoEmbed ? (
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-6">
            <iframe
              src={videoEmbed.embedUrl}
              title={title || 'Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="aspect-video w-full rounded-lg bg-bg-secondary border border-border flex items-center justify-center mb-6">
            <p className="text-text-secondary font-body">Invalid video URL</p>
          </div>
        )}

        {description && (
          <p className="text-text-secondary font-body text-center">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};
