import { CheckIcon } from '@heroicons/react/24/outline';

/**
 * IconListBlock - Renders a list with check icons
 */
export const IconListBlock = ({ data }) => {
  const { title, items = [] } = data;

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-4xl">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-8">
            {title}
          </h2>
        )}

        {items.length > 0 ? (
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckIcon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-text-primary font-body text-lg">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary font-body">No items available</p>
        )}
      </div>
    </section>
  );
};
