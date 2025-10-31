import { useState, useEffect } from 'react';
import { appwriteConfig } from '../../../config/appwrite';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { DataTable } from '../../../components/DataTable';
import { getAllMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export const ServicesListPage = () => {
  usePageTitle('Services');
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [serviceGroups, setServiceGroups] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load service groups for lookup
      const groupsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'serviceGroups'
      );
      const groupsMap = {};
      groupsResponse.documents.forEach(group => {
        groupsMap[group.$id] = group.name;
      });
      setServiceGroups(groupsMap);

      // Load services
      const servicesResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'services',
        [Query.orderDesc('$createdAt')]
      );

      // Load service group relationships from meta
      const servicesWithGroups = await Promise.all(
        servicesResponse.documents.map(async (service) => {
          const meta = await getAllMeta(META_COLLECTIONS.SERVICES, service.$id);
          return {
            ...service,
            serviceGroupName: groupsMap[meta.service_group_id] || 'None'
          };
        })
      );

      setServices(servicesWithGroups);
    } catch (error) {
      console.error('Error loading services:', error);
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
        'services',
        id
      );
      await loadData();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} services?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(id =>
          databases.deleteDocument(
            appwriteConfig.databaseId,
            'services',
            id
          )
        )
      );
      await loadData();
    } catch (error) {
      console.error('Error deleting services:', error);
      alert('Failed to delete some services');
    }
  };

  const handleBulkExport = (selectedIds) => {
    const selectedData = services.filter(service =>
      selectedIds.includes(service.$id)
    );

    const exportColumns = columns.filter(col =>
      col.key !== 'actions' && col.visible !== false
    );

    const headers = exportColumns.map(col => col.label).join(',');
    const rows = selectedData.map(row => {
      return exportColumns.map(col => {
        let value = row[col.key];
        if (col.key === '$createdAt') {
          value = new Date(value).toLocaleDateString();
        }
        if (value === null || value === undefined) return '';
        value = String(value);
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
    link.setAttribute('download', `services-selected-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    const bucketId = appwriteConfig.bucketSettings;
    return `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  };

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
      key: 'serviceGroupName',
      label: 'Service Group',
      render: (value) => (
        <span className="text-text-secondary text-sm">{value}</span>
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
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
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
            to={`/admin/services/${row.$id}`}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
            title="View"
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
          <Link
            to={`/admin/services/${row.$id}/edit`}
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
            Services
          </h1>
          <p className="text-text-secondary font-body">
            Manage your agency services
          </p>
        </div>
        <Link
          to="/admin/services/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-5 h-5" />
          Add Service
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        tableId="services"
        columns={columns}
        data={services}
        onRowClick={(row) => navigate(`/admin/services/${row.$id}`)}
        enableBulkActions={true}
        bulkActions={bulkActions}
        enableSearch={true}
        enableExport={true}
        enableColumnManager={true}
        searchPlaceholder="Search services..."
        emptyMessage="No services yet. Create your first one!"
      />
    </div>
  );
};
