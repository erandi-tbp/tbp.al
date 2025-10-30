import { useState, useEffect } from 'react';
import { SEO } from '../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../components/public/PrimaryFooter';
import { Link } from 'react-router-dom';
import { getAllSettings, SETTING_KEYS } from '../../helpers/settingsHelper';

export const ContactPage = () => {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await getAllSettings();
      setSettings(allSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission (you can implement actual email/API integration later)
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  const email = settings[SETTING_KEYS.EMAIL] || '';
  const phone = settings[SETTING_KEYS.PHONE] || '';
  const addressStreet = settings[SETTING_KEYS.ADDRESS_STREET] || '';
  const addressCity = settings[SETTING_KEYS.ADDRESS_CITY] || '';
  const addressCountry = settings[SETTING_KEYS.ADDRESS_COUNTRY] || '';
  const addressZip = settings[SETTING_KEYS.ADDRESS_ZIP] || '';

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Trusted Business Partners. We're here to answer your questions and discuss how we can help your business succeed."
        keywords="contact, get in touch, support, inquiry"
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
              <span className="text-text-primary font-bold">Contact Us</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="py-12 md:py-16 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-text-secondary font-body max-w-3xl">
              Have a question or ready to start a project? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="bg-bg-secondary border border-border rounded-lg p-8">
                <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">
                  Send us a Message
                </h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800 font-body">
                      Thank you for your message! We'll get back to you soon.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-text-primary mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-text-primary mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-text-primary mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-text-primary mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-text-primary mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent resize-none"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    {email && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-text-primary mb-1">Email</h3>
                          <a href={`mailto:${email}`} className="text-text-secondary font-body hover:text-accent transition-colors">
                            {email}
                          </a>
                        </div>
                      </div>
                    )}

                    {phone && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-text-primary mb-1">Phone</h3>
                          <a href={`tel:${phone}`} className="text-text-secondary font-body hover:text-accent transition-colors">
                            {phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {(addressStreet || addressCity || addressCountry) && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-text-primary mb-1">Address</h3>
                          <address className="not-italic text-text-secondary font-body">
                            {addressStreet && <div>{addressStreet}</div>}
                            {(addressCity || addressZip || addressCountry) && (
                              <div>
                                {addressCity}{addressZip && `, ${addressZip}`}
                                {addressCountry && <div>{addressCountry}</div>}
                              </div>
                            )}
                          </address>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-bg-secondary border border-border rounded-lg p-6">
                  <h3 className="font-heading font-bold text-text-primary mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-text-secondary font-body">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-semibold text-text-primary">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-semibold text-text-primary">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-semibold text-text-primary">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PrimaryFooter />
    </>
  );
};
