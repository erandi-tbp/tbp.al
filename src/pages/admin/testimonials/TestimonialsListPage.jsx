import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { DataTable } from '../../../components/DataTable/DataTable';
import { PlusIcon, StarIcon } from '@heroicons/react/24/outline';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const TestimonialsListPage = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        'testimonials',
        [Query.orderDesc('$createdAt')]
      );
      setTestimonials(response.documents);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ids) => {
    if (!confirm(`Delete ${ids.length} ${ids.length === 1 ? 'testimonial' : 'testimonials'}?`)) {
      return;
    }

    try {
      await Promise.all(
        ids.map(id => databases.deleteDocument(DATABASE_ID, 'testimonials', id))
      );
      await loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonials:', error);
      alert('Failed to delete testimonials');
    }
  };

  const columns = [
    {
      key: 'clientName',
      label: 'Client Name',
      sortable: true
    },
    {
      key: 'clientCompany',
      label: 'Company',
      sortable: true,
      render: (value) => value || 'N/A'
    },
    {
      key: 'clientPosition',
      label: 'Position',
      sortable: true,
      render: (value) => value || 'N/A'
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 ${
                i < value ? 'text-yellow-500 fill-yellow-500' : 'text-text-secondary'
              }`}
            />
          ))}
        </div>
      )
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
      onClick: (row) => navigate(`/admin/testimonials/${row.$id}`)
    },
    {
      label: 'Edit',
      onClick: (row) => navigate(`/admin/testimonials/${row.$id}/edit`)
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
            Testimonials
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Manage customer testimonials and reviews
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/testimonials/new')}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Testimonial
        </button>
      </div>

      <DataTable
        tableId="testimonials"
        data={testimonials}
        columns={columns}
        actions={actions}
        bulkActions={bulkActions}
        loading={loading}
        searchable
        searchPlaceholder="Search testimonials..."
      />
    </div>
  );
};
