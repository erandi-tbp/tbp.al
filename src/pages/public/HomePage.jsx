import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';

export const HomePage = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Trusted Business Partners - Your Success, Our Commitment! Professional business services in Albania including Website Design, Development, Branding, and Digital Marketing."
        keywords="business services albania, web design, web development, branding, digital marketing, tbp albania"
      />
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-heading font-bold text-text-primary mb-4">
            Trusted Business Partners
          </h1>
          <p className="text-xl text-text-secondary font-body mb-8">
            Your Success, Our Commitment!
          </p>
          <Link
            to="/admin/login"
            className="inline-block px-8 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </>
  );
};
