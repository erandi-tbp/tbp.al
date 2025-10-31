import { useNavigate } from 'react-router-dom';
import { appwriteConfig } from '../../../config/appwrite';
import { databases } from '../../../lib/appwrite';
import { ID } from 'appwrite';
import { PageForm } from '../../../components/admin/PageForm';
import { META_COLLECTIONS, setMeta } from '../../../helpers/metaHelper';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = appwriteConfig.databaseId;

export const AddPagePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Separate entity data from meta data
      const { seoTitle, seoKeywords, metaDescription, ...entityData } = formData;

      // Create page document
      const newDocId = ID.unique();
      await databases.createDocument(
        DATABASE_ID,
        'pages',
        newDocId,
        entityData
      );

      // Save to meta tables
      await setMeta(META_COLLECTIONS.PAGES, newDocId, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.PAGES, newDocId, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.PAGES, newDocId, 'meta_description', metaDescription);

      alert('Page created successfully!');
      navigate('/admin/pages');
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page: ' + error.message);
    }
  };

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
            Add New Page
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Create a new page for your website
          </p>
        </div>
      </div>

      <PageForm
        onSubmit={handleSubmit}
        submitLabel="Create Page"
      />
    </div>
  );
};
