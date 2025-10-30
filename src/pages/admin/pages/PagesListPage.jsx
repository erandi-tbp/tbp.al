import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { DataTable } from '../../../components/DataTable/DataTable';
import { PlusIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const PagesListPage = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        'pages',
        [Query.orderDesc('$createdAt')]
      );
      setPages(response.documents);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ids) => {
    if (!confirm(`Delete ${ids.length} ${ids.length === 1 ? 'page' : 'pages'}?`)) {
      return;
    }

    try {
      await Promise.all(
        ids.map(id => databases.deleteDocument(DATABASE_ID, 'pages', id))
      );
      await loadPages();
    } catch (error) {
      console.error('Error deleting pages:', error);
      alert('Failed to delete pages');
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
      key: 'template',
      label: 'Template',
      sortable: true
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
      onClick: (row) => navigate(`/admin/pages/${row.$id}`)
    },
    {
      label: 'Edit',
      onClick: (row) => navigate(`/admin/pages/${row.$id}/edit`)
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
            Pages
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Manage your website pages
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/pages/new')}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Page
        </button>
      </div>

      <DataTable
        tableId="pages"
        data={pages}
        columns={columns}
        actions={actions}
        bulkActions={bulkActions}
        loading={loading}
        searchable
        searchPlaceholder="Search pages..."
      />
    </div>
  );
};
