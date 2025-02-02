import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ExcelRow } from '../types';

interface DataTableProps {
  data: ExcelRow[];
  onDeleteRow: (id: string) => void;
  currentPage: number;
  itemsPerPage: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  onDeleteRow,
  currentPage,
  itemsPerPage
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const handleDeleteClick = (rowId: string) => {
    setRowToDelete(rowId);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete) {
      onDeleteRow(rowToDelete);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-500/20">
        <thead>
          <tr className="bg-blue-500/10">
            {['Name', 'Amount', 'Date', 'Verified', 'Actions'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-500/20">
          {currentData.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-blue-500/5 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-blue-300">{row.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-blue-300">
                {formatAmount(row.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-blue-300">
                {formatDate(row.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  row.verified
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {row.verified ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDeleteClick(row.id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleDeleteCancel}></div>
          <div className="relative">
            {/* Animated border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 animate-pulse"></div>
            
            <div className="relative bg-black/90 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 w-[400px]">
              <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-blue-300 mb-6">
                Are you sure you want to delete this row? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 rounded-lg border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};