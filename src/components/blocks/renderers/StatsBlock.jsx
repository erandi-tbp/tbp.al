/**
 * StatsBlock - Renders statistics/numbers
 */
export const StatsBlock = ({ data }) => {
  const { title, stats = [] } = data;

  return (
    <section className="py-12 md:py-16 bg-accent text-white">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            {title}
          </h2>
        )}

        {stats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold mb-2">
                  {stat.number}{stat.suffix || ''}
                </div>
                <div className="text-lg font-body opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center font-body opacity-90">No statistics available</p>
        )}
      </div>
    </section>
  );
};
