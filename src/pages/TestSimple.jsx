import { ThemeToggle } from '../components/common/ThemeToggle';

export const TestSimple = () => {
  return (
    <div className="min-h-screen bg-bg-primary transition-colors">
      <header className="p-6 flex justify-between items-center border-b border-text-primary/10">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          Theme Test - Simple
        </h1>
        <ThemeToggle />
      </header>

      <main className="container mx-auto px-6 py-12">
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
      </main>
    </div>
  );
};
