import { useState, useMemo, useEffect } from 'react';
import { TableSearch } from './TableSearch';
import { TableExport } from './TableExport';
import { BulkActions } from './BulkActions';
import { ColumnManager } from './ColumnManager';

/**
 * Advanced DataTable Component
 *
 * @param {Object} props
 * @param {String} props.tableId - Unique identifier for this table (for localStorage)
 * @param {Array} props.columns - Array of column definitions: [{ key, label, render?, pinned?, visible?, sortable? }]
 * @param {Array} props.data - Array of data objects
 * @param {Function} props.onRowClick - Optional row click handler
 * @param {Boolean} props.enableBulkActions - Enable bulk actions with checkboxes
 * @param {Array} props.bulkActions - Array of bulk action definitions: [{ label, onClick, icon? }]
 * @param {Boolean} props.enableSearch - Enable search functionality
 * @param {Boolean} props.enableExport - Enable export functionality
 * @param {Boolean} props.enableColumnManager - Enable column add/remove/pin
 * @param {String} props.searchPlaceholder - Placeholder for search input
 * @param {String} props.emptyMessage - Message when no data
 */
export const DataTable = ({
  tableId,
  columns: initialColumns = [],
  data = [],
  onRowClick,
  enableBulkActions = false,
  bulkActions = [],
  enableSearch = true,
  enableExport = true,
  enableColumnManager = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available'
}) => {
  // Load saved column configuration from localStorage
  const getInitialColumns = () => {
    if (!tableId) {
      return initialColumns.map(col => ({
        ...col,
        visible: col.visible !== undefined ? col.visible : true,
        pinned: col.pinned || null
      }));
    }

    const storageKey = `datatable_${tableId}_columns`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const savedConfig = JSON.parse(saved);
        // Merge saved config with initial columns (in case new columns were added)
        return initialColumns.map(col => {
          const savedCol = savedConfig.find(s => s.key === col.key);
          return {
            ...col,
            visible: savedCol?.visible !== undefined ? savedCol.visible : (col.visible !== undefined ? col.visible : true),
            pinned: savedCol?.pinned || col.pinned || null
          };
        });
      } catch (error) {
        console.error('Error loading saved column config:', error);
      }
    }

    return initialColumns.map(col => ({
      ...col,
      visible: col.visible !== undefined ? col.visible : true,
      pinned: col.pinned || null
    }));
  };

  const [columns, setColumns] = useState(getInitialColumns());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Save column configuration to localStorage whenever it changes
  useEffect(() => {
    if (!tableId) return;

    const storageKey = `datatable_${tableId}_columns`;
    const configToSave = columns.map(col => ({
      key: col.key,
      visible: col.visible,
      pinned: col.pinned
    }));

    try {
      localStorage.setItem(storageKey, JSON.stringify(configToSave));
    } catch (error) {
      console.error('Error saving column config:', error);
    }
  }, [columns, tableId]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row => {
      return columns.some(col => {
        if (!col.visible) return false;
        const value = row[col.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Handle column sorting
  const handleSort = (columnKey) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(sortedData.map(row => row.id || row.$id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle row selection
  const handleRowSelect = (rowId, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  // Group columns by pinning
  const { pinnedLeft, pinnedRight, unpinned } = useMemo(() => {
    const visible = columns.filter(col => col.visible);
    return {
      pinnedLeft: visible.filter(col => col.pinned === 'left'),
      pinnedRight: visible.filter(col => col.pinned === 'right'),
      unpinned: visible.filter(col => !col.pinned)
    };
  }, [columns]);

  const visibleColumns = [...pinnedLeft, ...unpinned, ...pinnedRight];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {enableSearch && (
            <TableSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={searchPlaceholder}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          {enableColumnManager && (
            <ColumnManager
              columns={columns}
              onChange={setColumns}
            />
          )}

          {enableExport && (
            <TableExport
              data={sortedData}
              columns={visibleColumns}
              filename="export"
            />
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {enableBulkActions && selectedRows.size > 0 && (
        <BulkActions
          selectedCount={selectedRows.size}
          actions={bulkActions}
          selectedRows={Array.from(selectedRows)}
          onClearSelection={() => setSelectedRows(new Set())}
        />
      )}

      {/* Table */}
      <div className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-border bg-bg-primary">
                {enableBulkActions && (
                  <th className="w-12 py-4 px-6 sticky left-0 z-20 bg-bg-primary" style={{
                    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.1)'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent cursor-pointer"
                    />
                  </th>
                )}
                {visibleColumns.map((col, colIndex) => {
                  const isPinnedLeft = col.pinned === 'left';
                  const isPinnedRight = col.pinned === 'right';
                  const isPinned = isPinnedLeft || isPinnedRight;

                  return (
                    <th
                      key={col.key}
                      className={`text-left py-4 px-6 font-body font-semibold text-text-primary ${col.sortable !== false ? 'cursor-pointer hover:text-accent transition-colors' : ''} ${
                        isPinned ? 'sticky z-10 bg-bg-primary' : ''
                      } ${isPinnedLeft ? 'left-0' : ''} ${isPinnedRight ? 'right-0' : ''}`}
                      style={isPinned ? {
                        boxShadow: isPinnedLeft ? '2px 0 4px -2px rgba(0,0,0,0.1)' : isPinnedRight ? '-2px 0 4px -2px rgba(0,0,0,0.1)' : undefined
                      } : undefined}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        {col.sortable !== false && sortConfig.key === col.key && (
                          <span className="text-accent">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (enableBulkActions ? 1 : 0)}
                    className="py-12 text-center"
                  >
                    <p className="text-text-secondary font-body">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                sortedData.map((row, index) => {
                  const rowId = row.id || row.$id;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={rowId || index}
                      className={`border-b border-border transition-colors ${
                        onRowClick ? 'cursor-pointer hover:bg-bg-primary' : ''
                      } ${isSelected ? 'bg-bg-primary' : ''}`}
                      onClick={() => onRowClick?.(row)}
                    >
                      {enableBulkActions && (
                        <td
                          className="py-4 px-6 sticky left-0 z-20 bg-bg-secondary"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            boxShadow: '2px 0 4px -2px rgba(0,0,0,0.1)'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent cursor-pointer"
                          />
                        </td>
                      )}
                      {visibleColumns.map(col => {
                        const isPinnedLeft = col.pinned === 'left';
                        const isPinnedRight = col.pinned === 'right';
                        const isPinned = isPinnedLeft || isPinnedRight;

                        return (
                          <td
                            key={col.key}
                            className={`py-4 px-6 font-body text-text-primary ${
                              isPinned ? 'sticky z-10 bg-bg-secondary' : ''
                            } ${isPinnedLeft ? 'left-0' : ''} ${isPinnedRight ? 'right-0' : ''}`}
                            style={isPinned ? {
                              boxShadow: isPinnedLeft ? '2px 0 4px -2px rgba(0,0,0,0.1)' :
                                         isPinnedRight ? '-2px 0 4px -2px rgba(0,0,0,0.1)' : undefined
                            } : undefined}
                          >
                            {col.render ? col.render(row[col.key], row) : row[col.key] || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      {sortedData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-text-secondary font-body">
          <span>
            Showing {sortedData.length} of {data.length} {sortedData.length === 1 ? 'entry' : 'entries'}
          </span>
          {selectedRows.size > 0 && (
            <span>
              {selectedRows.size} {selectedRows.size === 1 ? 'row' : 'rows'} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
};
