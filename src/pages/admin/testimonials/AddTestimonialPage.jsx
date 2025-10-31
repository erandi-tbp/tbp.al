import { useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { appwriteConfig } from '../../../config/appwrite';
import { ID } from 'appwrite';
import { TestimonialForm } from '../../../components/admin/TestimonialForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = appwriteConfig.databaseId;

export const AddTestimonialPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Create testimonial document
      const newDocId = ID.unique();
      await databases.createDocument(
        DATABASE_ID,
        'testimonials',
        newDocId,
        formData
      );

      alert('Testimonial created successfully!');
      navigate('/admin/testimonials');
    } catch (error) {
      console.error('Error creating testimonial:', error);
      alert('Failed to create testimonial: ' + error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/testimonials')}
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            Add New Testimonial
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Add a customer testimonial or review
          </p>
        </div>
      </div>

      <TestimonialForm
        onSubmit={handleSubmit}
        submitLabel="Create Testimonial"
      />
    </div>
  );
};
