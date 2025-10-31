import { useState, useEffect } from 'react';
import { appwriteConfig } from '../../../config/appwrite';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { DataTable } from '../../../components/DataTable';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export const ServiceGroupsListPage = () => {
  usePageTitle('Service Groups');
  const navigate = useNavigate();

  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceGroups();
  }, []);

  const loadServiceGroups = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'serviceGroups',
        [Query.orderDesc('$createdAt')]
      );
      setServiceGroups(response.documents);
    } catch (error) {
      console.error('Error loading service groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        'serviceGroups',
        id
      );
      await loadServiceGroups();
    } catch (error) {
      console.error('Error deleting service group:', error);
      alert('Failed to delete service group');
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} service groups?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(id =>
          databases.deleteDocument(
            appwriteConfig.databaseId,
            'serviceGroups',
            id
          )
        )
      );
      await loadServiceGroups();
    } catch (error) {
      console.error('Error deleting service groups:', error);
      alert('Failed to delete some service groups');
    }
  };

  const handleBulkExport = (selectedIds) => {
    // Filter data to only selected rows
    const selectedData = serviceGroups.filter(group =>
      selectedIds.includes(group.$id)
    );

    // Get visible columns for export
    const exportColumns = columns.filter(col =>
      col.key !== 'actions' && col.visible !== false
    );

    // Create CSV content
    const headers = exportColumns.map(col => col.label).join(',');
    const rows = selectedData.map(row => {
      return exportColumns.map(col => {
        let value = row[col.key];
        // Handle special cases
        if (col.key === 'featuredImage' || col.key === 'featuredIcon') {
          value = value ? getImageUrl(value) : '';
        }
        if (col.key === '$createdAt') {
          value = new Date(value).toLocaleDateString();
        }
        if (value === null || value === undefined) return '';
        value = String(value);
        // Escape commas and quotes
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `service-groups-selected-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to get image URL
  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    const bucketId = appwriteConfig.bucketSettings;
    return `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  };

  // Define columns with featured image and name pinned to left
  const columns = [
    {
      key: 'featuredImage',
      label: 'Image',
      pinned: 'left',
      sortable: false,
      render: (value) => {
        const imageUrl = getImageUrl(value);
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Featured"
            className="w-12 h-12 object-cover rounded border border-border"
          />
        ) : (
          <div className="w-12 h-12 bg-bg-primary rounded border border-border flex items-center justify-center">
            <span className="text-xs text-text-secondary">No image</span>
          </div>
        );
      }
    },
    {
      key: 'name',
      label: 'Name',
      pinned: 'left',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'excerpt',
      label: 'Excerpt',
      render: (value) => (
        <div className="line-clamp-1 max-w-xs text-text-secondary text-sm">
          {value || '-'}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      visible: false,
      render: (value) => (
        <div className="line-clamp-2 max-w-md text-text-secondary">
          {value || '-'}
        </div>
      )
    },
    {
      key: 'seoTitle',
      label: 'SEO Title',
      visible: false,
      render: (value) => (
        <span className="text-text-secondary text-sm">{value || '-'}</span>
      )
    },
    {
      key: '$createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-text-secondary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/admin/service-groups/${row.$id}`}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
            title="View"
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
          <Link
            to={`/admin/service-groups/${row.$id}/edit`}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-5 h-5" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.$id, row.name);
            }}
            className="p-2 text-text-secondary hover:text-red-500 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const bulkActions = [
    {
      label: 'Export Selected',
      icon: ArrowDownTrayIcon,
      variant: 'primary',
      onClick: handleBulkExport
    },
    {
      label: 'Delete Selected',
      icon: TrashIcon,
      variant: 'danger',
      onClick: handleBulkDelete
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Service Groups
          </h1>
          <p className="text-text-secondary font-body">
            Manage your service categories and groups
          </p>
        </div>
        <Link
          to="/admin/service-groups/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-5 h-5" />
          Add Service Group
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        tableId="service-groups"
        columns={columns}
        data={serviceGroups}
        onRowClick={(row) => navigate(`/admin/service-groups/${row.$id}`)}
        enableBulkActions={true}
        bulkActions={bulkActions}
        enableSearch={true}
        enableExport={true}
        enableColumnManager={true}
        searchPlaceholder="Search service groups..."
        emptyMessage="No service groups yet. Create your first one!"
      />
    </div>
  );
};
