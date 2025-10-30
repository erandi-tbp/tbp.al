import { ThemeToggle } from '../components/common/ThemeToggle';
import { SERVICE_GROUPS } from '../lib/config';

export const TestTheme = () => {
  return (
    <div className="min-h-screen bg-bg-primary transition-colors">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-text-primary/10">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          TBP.AL Theme Test
        </h1>
        <ThemeToggle />
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Typography Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
            Typography
          </h2>
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">
            Heading 1 - Rubik Bold
          </h1>
          <h2 className="text-3xl font-heading font-medium text-text-primary mb-2">
            Heading 2 - Rubik Medium
          </h2>
          <p className="text-base font-body text-text-secondary mb-2">
            Body text - Outfit Regular. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p className="text-base font-body font-bold text-text-secondary">
            Body Bold - Outfit Bold. This is bold body text for emphasis.
          </p>
        </section>

        {/* Colors Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
            Colors
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 rounded-lg bg-accent text-white">
              <p className="font-body font-bold">Accent Color</p>
              <p className="text-sm">#d95240</p>
            </div>
            <div className="p-6 rounded-lg bg-bg-secondary">
              <p className="font-body font-bold text-text-primary">Secondary BG</p>
            </div>
            <div className="p-6 rounded-lg border-2 border-text-primary/20">
              <p className="font-body font-bold text-text-primary">With Border</p>
            </div>
          </div>
        </section>

        {/* Service Groups Test */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
            Service Groups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_GROUPS.map(group => (
              <div
                key={group.id}
                className="p-6 rounded-lg bg-bg-secondary hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                  {group.name}
                </h3>
                <p className="text-sm font-body text-text-secondary">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
