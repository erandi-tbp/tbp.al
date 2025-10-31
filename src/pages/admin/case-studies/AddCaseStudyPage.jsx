import { useNavigate } from 'react-router-dom';
import { appwriteConfig } from '../../../config/appwrite';
import { databases } from '../../../lib/appwrite';
import { ID } from 'appwrite';
import { CaseStudyForm } from '../../../components/admin/CaseStudyForm';
import { META_COLLECTIONS, setMeta } from '../../../helpers/metaHelper';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = appwriteConfig.databaseId;

export const AddCaseStudyPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Separate entity data from meta data
      const { seoTitle, seoKeywords, metaDescription, projectId, contentBlocks, ...entityData } = formData;

      // Create case study document
      const newDocId = ID.unique();
      await databases.createDocument(
        DATABASE_ID,
        'caseStudies',
        newDocId,
        entityData
      );

      // Save to meta tables
      await setMeta(META_COLLECTIONS.CASE_STUDIES, newDocId, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.CASE_STUDIES, newDocId, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.CASE_STUDIES, newDocId, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.CASE_STUDIES, newDocId, 'content_blocks', contentBlocks);

      if (projectId) {
        await setMeta(META_COLLECTIONS.CASE_STUDIES, newDocId, 'project_id', projectId);
      }

      alert('Case study created successfully!');
      navigate('/admin/case-studies');
    } catch (error) {
      console.error('Error creating case study:', error);
      alert('Failed to create case study: ' + error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/case-studies')}
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            Add New Case Study
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Create a new case study or success story
          </p>
        </div>
      </div>

      <CaseStudyForm
        onSubmit={handleSubmit}
        submitLabel="Create Case Study"
      />
    </div>
  );
};
