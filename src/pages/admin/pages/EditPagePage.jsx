import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { PageForm } from '../../../components/admin/PageForm';
import { META_COLLECTIONS, getAllMeta, setMeta } from '../../../helpers/metaHelper';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const EditPagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);
      const doc = await databases.getDocument(DATABASE_ID, 'pages', id);

      // Load meta data
      const meta = await getAllMeta(META_COLLECTIONS.PAGES, id);

      setPage({
        ...doc,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || ''
      });
    } catch (error) {
      console.error('Error loading page:', error);
      alert('Failed to load page');
      navigate('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Separate entity data from meta data
      const { seoTitle, seoKeywords, metaDescription, ...entityData } = formData;

      // Update page document
      await databases.updateDocument(
        DATABASE_ID,
        'pages',
        id,
        entityData
      );

      // Update meta tables
      await setMeta(META_COLLECTIONS.PAGES, id, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.PAGES, id, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.PAGES, id, 'meta_description', metaDescription);

      alert('Page updated successfully!');
      navigate('/admin/pages');
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page: ' + error.message);
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
          onClick={() => navigate('/admin/pages')}
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            Edit Page
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Update page information
          </p>
        </div>
      </div>

      <PageForm
        initialData={page}
        onSubmit={handleSubmit}
        submitLabel="Update Page"
      />
    </div>
  );
};
