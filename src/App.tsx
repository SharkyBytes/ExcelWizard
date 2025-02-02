import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { ErrorModal } from './components/ErrorModal';
import { SheetData } from './types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, Upload, Table2, ArrowLeft, ArrowRight, Import } from 'lucide-react';

function App() {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSheets(response.data.sheets);
      setSelectedSheet(response.data.sheets[0]?.name || '');
      
      if (response.data.hasErrors) {
        setShowErrors(true);
      }
    } catch (error) {
      toast.error('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRow = (id: string) => {
    setSheets(sheets.map(sheet => {
      if (sheet.name === selectedSheet) {
        return {
          ...sheet,
          data: sheet.data.filter(row => row.id !== id)
        };
      }
      return sheet;
    }));
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const currentSheet = sheets.find(s => s.name === selectedSheet);
      if (!currentSheet) return;

      await axios.post('http://localhost:3000/api/import', {
        sheetName: selectedSheet,
        data: currentSheet.data
      });

      toast.success('Data imported successfully');
    } catch (error) {
      toast.error('Error importing data');
    } finally {
      setIsLoading(false);
    }
  };

  const currentSheet = sheets.find(s => s.name === selectedSheet);
  const totalPages = currentSheet
    ? Math.ceil(currentSheet.data.length / itemsPerPage)
    : 0;

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342')] bg-cover opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] animate-pulse opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-700 rounded-full filter blur-[128px] animate-pulse opacity-20 animation-delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header with animated border */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-10 blur-xl animate-pulse"></div>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="w-10 h-10 text-blue-500 animate-pulse" />
              <h1 className="text-5xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                Excel Wizard
              </h1>
            </div>
            <p className="text-blue-400/80 text-lg font-light tracking-wide">
              Transform your data into digital magic ⚡
            </p>
          </div>

          {/* Upload section with neon effect */}
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
            <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20 shadow-[0_0_15px_rgba(0,0,255,0.1)]">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </div>

          {sheets.length > 0 && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20 shadow-[0_0_15px_rgba(0,0,255,0.1)]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <select
                      value={selectedSheet}
                      onChange={(e) => setSelectedSheet(e.target.value)}
                      className="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                    >
                      {sheets.map((sheet) => (
                        <option key={sheet.name} value={sheet.name} className="bg-gray-900 text-blue-400">
                          {sheet.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleImport}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,255,0.2)] disabled:opacity-50"
                    >
                      <Import className="w-4 h-4" />
                      <span>{isLoading ? 'Processing...' : 'Import'}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(0,0,255,0.2)]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-blue-400/90 font-mono">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(0,0,255,0.2)]"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {currentSheet && (
                  <div className="rounded-xl overflow-hidden bg-black/50 border border-blue-500/20">
                    <DataTable
                      data={currentSheet.data}
                      onDeleteRow={handleDeleteRow}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <ErrorModal
            isOpen={showErrors}
            onClose={() => setShowErrors(false)}
            errors={sheets.flatMap(sheet => sheet.errors)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;