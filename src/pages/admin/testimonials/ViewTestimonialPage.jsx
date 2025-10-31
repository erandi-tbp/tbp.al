import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { appwriteConfig } from '../../../config/appwrite';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const DATABASE_ID = appwriteConfig.databaseId;

export const ViewTestimonialPage = () => {
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      await databases.deleteDocument(DATABASE_ID, 'testimonials', id);
      alert('Testimonial deleted successfully!');
      navigate('/admin/testimonials');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  function getFileUrl(fileId) {
    if (!fileId) return null;
    const bucketId = appwriteConfig.bucketSettings;
    return `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  if (!testimonial) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/testimonials')}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              {testimonial.clientName}
            </h1>
            <p className="text-text-secondary font-body mt-2">
              Testimonial Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/testimonials/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-body font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Client Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary font-body">Name</p>
                <p className="text-text-primary font-body font-bold">{testimonial.clientName}</p>
              </div>
              {testimonial.clientPosition && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Position</p>
                  <p className="text-text-primary font-body">{testimonial.clientPosition}</p>
                </div>
              )}
              {testimonial.clientCompany && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Company</p>
                  <p className="text-text-primary font-body">{testimonial.clientCompany}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-text-secondary font-body">Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-text-secondary'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {testimonial.isPublished ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-green-500 font-body font-bold">Published</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                      <span className="text-red-500 font-body font-bold">Draft</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Client Photo */}
          {testimonial.featuredImage && (
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
                Client Photo
              </h2>
              <img
                src={getFileUrl(testimonial.featuredImage)}
                alt={testimonial.clientName}
                className="w-full h-64 object-cover rounded-lg border border-border"
              />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Testimonial Content */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Testimonial
            </h2>
            <blockquote className="text-text-primary font-body text-lg leading-relaxed italic">
              "{testimonial.testimonial}"
            </blockquote>
          </div>

          {/* Metadata */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Metadata
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary font-body">Created</p>
                <p className="text-text-primary font-body">
                  {new Date(testimonial.$createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Last Updated</p>
                <p className="text-text-primary font-body">
                  {new Date(testimonial.$updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">ID</p>
                <p className="text-text-primary font-body font-mono text-xs">{testimonial.$id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
