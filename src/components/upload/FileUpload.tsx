import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ValidationReport } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validation, setValidation] = useState<ValidationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadExcelFile = useDashboardStore((state) => state.loadExcelFile);
  const navigate = useNavigate();

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    // Validate file size (10 MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10 MB limit');
      return;
    }

    setIsUploading(true);
    setError(null);
    setValidation(null);

    try {
      const validationReport = await loadExcelFile(file);
      setValidation(validationReport);
      setIsUploading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleAccept = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deepsee-navy mb-2">Upload Dashboard Data</h1>
        <p className="text-gray-600">
          Upload the DeepSee prioritization dashboard Excel file to populate all views with your latest data.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardBody>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-deepsee-accent bg-deepsee-light-bg'
                : 'border-gray-300 hover:border-deepsee-accent'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-4">
                <div className="animate-spin mx-auto w-12 h-12 border-4 border-deepsee-accent border-t-transparent rounded-full"></div>
                <p className="text-deepsee-navy font-medium">Parsing Excel file...</p>
                <p className="text-sm text-gray-500">This may take a few seconds</p>
              </div>
            ) : (
              <div className="space-y-4">
                <FileSpreadsheet size={48} className="mx-auto text-deepsee-accent" />
                <div>
                  <p className="text-lg font-medium text-deepsee-navy mb-2">
                    Drop Excel file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .xlsx files up to 10 MB
                  </p>
                </div>
                <label className="inline-block cursor-pointer">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <span className="btn btn-primary inline-flex items-center">
                    <Upload size={20} className="inline mr-2" />
                    Select File
                  </span>
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Upload Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Validation Report */}
      {validation && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Report</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Success Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Features Loaded</p>
                <p className="text-2xl font-bold text-green-600">{validation.featuresLoaded}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">JIRA Tickets</p>
                <p className="text-2xl font-bold text-blue-600">{validation.jiraTicketsLoaded}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-purple-600">{validation.opportunitiesLoaded}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-indigo-600">{validation.clientsIdentified}</p>
              </div>
            </div>

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Warnings ({validation.warnings.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {validation.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-start gap-3 ${
                        warning.type === 'error'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <AlertCircle
                        size={18}
                        className={`flex-shrink-0 mt-0.5 ${
                          warning.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                        }`}
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          warning.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {warning.message}
                        </p>
                        {warning.featureId && (
                          <p className="text-xs text-gray-600 mt-1 font-mono">
                            Feature: {warning.featureId}
                          </p>
                        )}
                      </div>
                      <Badge variant={warning.type === 'error' ? 'danger' : 'warning'}>
                        {warning.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {validation.warnings.length === 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="font-medium text-green-800">All data loaded successfully!</p>
                  <p className="text-sm text-green-600">No warnings or errors found.</p>
                </div>
              </div>
            )}

            {/* Accept Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setValidation(null)}>
                Upload Another File
              </Button>
              <Button variant="primary" onClick={handleAccept}>
                <CheckCircle size={20} className="inline mr-2" />
                Accept & View Dashboard
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>File Requirements</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Expected Excel File Structure:</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Master_Data_Features (features and roadmap items)</li>
                <li>Master_Data_JIRA_Tickets (engineering backlog)</li>
                <li>Master_Data_Sales_Pipeline (sales opportunities)</li>
                <li>Master_Data_Client_Projects (active client engagements)</li>
                <li>Master_Data_Won_Deals (existing clients)</li>
                <li>Lookup_Tables (reference data)</li>
                <li>Change_Log (audit trail)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What Happens After Upload:</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Priority scores are calculated automatically</li>
                <li>Features are assigned to priority tiers (Tier 0-4)</li>
                <li>Data validation checks are performed</li>
                <li>All dashboard views are populated with your data</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-deepsee-primary">
                <strong>Note:</strong> Your data is processed entirely in your browser.
                No data is uploaded to any server.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
