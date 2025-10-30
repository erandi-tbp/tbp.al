/**
 * FeaturesGridBlock - Renders a grid of features
 */
export const FeaturesGridBlock = ({ data }) => {
  const { title, subtitle, features = [], columns = '3' } = data;

  const columnClass = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-12 md:py-16 bg-bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-text-secondary font-body max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Features Grid */}
        {features.length > 0 ? (
          <div className={`grid ${columnClass} gap-8`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-bg-primary border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {feature.icon && (
                  <div className="text-4xl mb-4">
                    {feature.icon}
                  </div>
                )}

                {feature.title && (
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                )}

                {feature.description && (
                  <p className="text-text-secondary font-body">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-text-secondary font-body">No features available</p>
        )}
      </div>
    </section>
  );
};
