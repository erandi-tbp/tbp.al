import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { CaseStudyForm } from '../../../components/admin/CaseStudyForm';
import { META_COLLECTIONS, getAllMeta, setMeta } from '../../../helpers/metaHelper';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const EditCaseStudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudy();
  }, [id]);

  const loadCaseStudy = async () => {
    try {
      setLoading(true);
      const doc = await databases.getDocument(DATABASE_ID, 'caseStudies', id);

      // Load meta data
      const meta = await getAllMeta(META_COLLECTIONS.CASE_STUDIES, id);

      setCaseStudy({
        ...doc,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || '',
        projectId: meta.project_id || '',
        contentBlocks: meta.content_blocks || []
      });
    } catch (error) {
      console.error('Error loading case study:', error);
      alert('Failed to load case study');
      navigate('/admin/case-studies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Separate entity data from meta data
      const { seoTitle, seoKeywords, metaDescription, projectId, contentBlocks, ...entityData } = formData;

      // Update case study document
      await databases.updateDocument(
        DATABASE_ID,
        'caseStudies',
        id,
        entityData
      );

      // Update meta tables
      await setMeta(META_COLLECTIONS.CASE_STUDIES, id, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.CASE_STUDIES, id, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.CASE_STUDIES, id, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.CASE_STUDIES, id, 'project_id', projectId || '');
      await setMeta(META_COLLECTIONS.CASE_STUDIES, id, 'content_blocks', contentBlocks);

      alert('Case study updated successfully!');
      navigate('/admin/case-studies');
    } catch (error) {
      console.error('Error updating case study:', error);
      alert('Failed to update case study: ' + error.message);
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
          onClick={() => navigate('/admin/case-studies')}
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            Edit Case Study
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Update case study information
          </p>
        </div>
      </div>

      <CaseStudyForm
        initialData={caseStudy}
        onSubmit={handleSubmit}
        submitLabel="Update Case Study"
      />
    </div>
  );
};
