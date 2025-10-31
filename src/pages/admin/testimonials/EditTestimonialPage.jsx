import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { appwriteConfig } from '../../../config/appwrite';
import { TestimonialForm } from '../../../components/admin/TestimonialForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = appwriteConfig.databaseId;

export const EditTestimonialPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonial();
  }, [id]);

  const loadTestimonial = async () => {
    try {
      setLoading(true);
      const doc = await databases.getDocument(DATABASE_ID, 'testimonials', id);
      setTestimonial(doc);
    } catch (error) {
      console.error('Error loading testimonial:', error);
      alert('Failed to load testimonial');
      navigate('/admin/testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Update testimonial document
      await databases.updateDocument(
        DATABASE_ID,
        'testimonials',
        id,
        formData
      );

      alert('Testimonial updated successfully!');
      navigate('/admin/testimonials');
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Failed to update testimonial: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

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
            Edit Testimonial
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Update testimonial information
          </p>
        </div>
      </div>

      <TestimonialForm
        initialData={testimonial}
        onSubmit={handleSubmit}
        submitLabel="Update Testimonial"
      />
    </div>
  );
};
