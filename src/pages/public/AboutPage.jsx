import { SEO } from '../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../components/public/PrimaryFooter';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn more about Trusted Business Partners - your partner in business success. Discover our mission, values, and commitment to excellence."
        keywords="about us, company, mission, values, team"
      />

      <DesktopHeader />
      <MobileHeader />

      <div className="min-h-screen bg-bg-primary">
        {/* Breadcrumbs */}
        <div className="bg-bg-secondary border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm font-body">
              <Link to="/" className="text-text-secondary hover:text-accent transition-colors">
                Home
              </Link>
              <span className="text-text-secondary">/</span>
              <span className="text-text-primary font-bold">About Us</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-6">
                About Trusted Business Partners
              </h1>
              <p className="text-xl text-text-secondary font-body">
                Your Success, Our Commitment!
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-text-secondary font-body text-lg">
                <p>
                  Welcome to Trusted Business Partners (TBP), where innovation meets reliability.
                  We are a team of dedicated professionals committed to delivering exceptional
                  business solutions that drive growth and success for our clients.
                </p>
                <p>
                  Founded with a vision to bridge the gap between technology and business needs,
                  we have grown into a trusted partner for businesses across various industries.
                  Our expertise spans web development, digital marketing, branding, and strategic
                  consulting.
                </p>
                <p>
                  What sets us apart is our unwavering commitment to understanding your unique
                  challenges and crafting tailored solutions that not only meet but exceed your
                  expectations. We believe in building long-term partnerships based on trust,
                  transparency, and tangible results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-20 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Mission */}
              <div className="bg-bg-primary border border-border rounded-lg p-8">
                <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-heading font-bold text-text-primary mb-4">
                  Our Mission
                </h3>
                <p className="text-text-secondary font-body">
                  To empower businesses with innovative solutions and strategic guidance,
                  enabling them to achieve sustainable growth and competitive advantage in
                  the digital age.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-bg-primary border border-border rounded-lg p-8">
                <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-heading font-bold text-text-primary mb-4">
                  Our Vision
                </h3>
                <p className="text-text-secondary font-body">
                  To be the leading trusted partner for businesses worldwide, recognized for
                  our excellence in delivering transformative solutions and exceptional value
                  that drive lasting success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-12 text-center">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Value 1 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-3">
                    Excellence
                  </h3>
                  <p className="text-text-secondary font-body">
                    We strive for excellence in everything we do, delivering quality solutions that exceed expectations.
                  </p>
                </div>

                {/* Value 2 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-3">
                    Integrity
                  </h3>
                  <p className="text-text-secondary font-body">
                    Honesty and transparency are at the core of our relationships with clients and partners.
                  </p>
                </div>

                {/* Value 3 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-3">
                    Innovation
                  </h3>
                  <p className="text-text-secondary font-body">
                    We embrace innovation and continuously explore new ways to solve challenges creatively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-20 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-12 text-center">
                Why Choose Us
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                      Proven Track Record
                    </h3>
                    <p className="text-text-secondary font-body">
                      Years of experience delivering successful projects across diverse industries.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                      Tailored Solutions
                    </h3>
                    <p className="text-text-secondary font-body">
                      Custom-built solutions designed specifically for your unique business needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                      Dedicated Support
                    </h3>
                    <p className="text-text-secondary font-body">
                      Ongoing support and partnership throughout your business journey.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                      Results-Driven Approach
                    </h3>
                    <p className="text-text-secondary font-body">
                      Focused on delivering measurable results that impact your bottom line.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business and achieve your goals together.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-accent font-body font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>

      <PrimaryFooter />
    </>
  );
};
