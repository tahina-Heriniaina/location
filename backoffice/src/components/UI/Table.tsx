import React from 'react';

interface Column {
  key: string;
  title: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'Aucune donnée disponible' 
}) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 h-6 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};