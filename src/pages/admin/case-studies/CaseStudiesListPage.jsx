import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { DataTable } from '../../../components/DataTable/DataTable';
import { PlusIcon } from '@heroicons/react/24/outline';
import { META_COLLECTIONS, getAllMeta } from '../../../helpers/metaHelper';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const CaseStudiesListPage = () => {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        'caseStudies',
        [Query.orderDesc('$createdAt')]
      );

      // Load project names from meta relationships
      const projectIds = new Set();
      const caseStudiesWithProjectIds = await Promise.all(
        response.documents.map(async (caseStudy) => {
          const meta = await getAllMeta(META_COLLECTIONS.CASE_STUDIES, caseStudy.$id);
          if (meta.project_id) {
            projectIds.add(meta.project_id);
          }
          return {
            ...caseStudy,
            projectId: meta.project_id || null
          };
        })
      );

      // Load project names
      const projectsMap = {};
      if (projectIds.size > 0) {
        const projectsResponse = await databases.listDocuments(
          DATABASE_ID,
          'projects',
          [Query.equal('$id', Array.from(projectIds))]
        );
        projectsResponse.documents.forEach(project => {
          projectsMap[project.$id] = project.title;
        });
      }

      // Map project names to case studies
      const caseStudiesWithProjects = caseStudiesWithProjectIds.map(caseStudy => ({
        ...caseStudy,
        projectName: caseStudy.projectId ? projectsMap[caseStudy.projectId] || 'Unknown' : 'None'
      }));

      setCaseStudies(caseStudiesWithProjects);
    } catch (error) {
      console.error('Error loading case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ids) => {
    if (!confirm(`Delete ${ids.length} case ${ids.length === 1 ? 'study' : 'studies'}?`)) {
      return;
    }

    try {
      await Promise.all(
        ids.map(id => databases.deleteDocument(DATABASE_ID, 'caseStudies', id))
      );
      await loadCaseStudies();
    } catch (error) {
      console.error('Error deleting case studies:', error);
      alert('Failed to delete case studies');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true
    },
    {
      key: 'projectName',
      label: 'Related Project',
      sortable: true
    },
    {
      key: 'publishDate',
      label: 'Publish Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Not set'
    },
    {
      key: 'isPublished',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-body font-bold ${
          value ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
        }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      key: '$createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = [
    {
      label: 'View',
      onClick: (row) => navigate(`/admin/case-studies/${row.$id}`)
    },
    {
      label: 'Edit',
      onClick: (row) => navigate(`/admin/case-studies/${row.$id}/edit`)
    },
    {
      label: 'Delete',
      onClick: (row) => handleDelete([row.$id]),
      variant: 'danger'
    }
  ];

  const bulkActions = [
    {
      label: 'Delete Selected',
      onClick: handleDelete,
      variant: 'danger'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            Case Studies
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Manage your case studies and success stories
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/case-studies/new')}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Case Study
        </button>
      </div>

      <DataTable
        tableId="case-studies"
        data={caseStudies}
        columns={columns}
        actions={actions}
        bulkActions={bulkActions}
        loading={loading}
        searchable
        searchPlaceholder="Search case studies..."
      />
    </div>
  );
};
