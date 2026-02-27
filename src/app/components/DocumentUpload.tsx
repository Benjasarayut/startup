import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Image, Sparkles, Loader2 } from 'lucide-react';
import type { UploadedFile, TaxData } from './TaxCalculator';

interface DocumentUploadProps {
  uploadedFiles: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onAnalyze: (extractedData: TaxData) => Promise<void>;
  isProcessing: boolean;
}

export function DocumentUpload({ uploadedFiles, onFilesChange, onAnalyze, isProcessing }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    // Filter only image files
    const imageFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type);
    });

    if (imageFiles.length === 0) {
      alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP)');
      return;
    }

    // Check file size (max 10MB)
    const validSizeFiles = imageFiles.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validSizeFiles.length < imageFiles.length) {
      alert('ไฟล์บางไฟล์มีขนาดใหญ่เกิน 10MB');
    }

    const newFiles: UploadedFile[] = [];
    
    // Create preview URLs for images
    validSizeFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          previewUrl: reader.result as string,
        };
        newFiles.push(uploadedFile);
        
        // Update files after all are loaded
        if (newFiles.length === validSizeFiles.length) {
          onFilesChange([...uploadedFiles, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    onFilesChange(uploadedFiles.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Mock OCR function to simulate reading tax slip data
  const extractDataFromSlips = (): TaxData => {
    // Simulate OCR extraction with mock data
    const mockIncomes = [45000, 52000, 68000, 75000, 89000];
    const mockDeductions = [12000, 15000, 18000, 20000];
    const mockCredits = [1000, 2000, 3000];
    
    return {
      income: mockIncomes[Math.floor(Math.random() * mockIncomes.length)].toString(),
      deductions: mockDeductions[Math.floor(Math.random() * mockDeductions.length)].toString(),
      credits: mockCredits[Math.floor(Math.random() * mockCredits.length)].toString(),
      filingStatus: 'single',
    };
  };

  const handleAnalyzeClick = () => {
    if (uploadedFiles.length === 0) {
      alert('กรุณาอัปโหลดรูปสลิปอย่างน้อย 1 รูป');
      return;
    }
    
    const extractedData = extractDataFromSlips();
    onAnalyze(extractedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2 text-gray-900">อัปโหลดรูปสลิปภาษี</h2>
        <p className="text-gray-600">
          ระบบจะอ่านและคำนวณภาษีจากสลิปอัตโนมัติ
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center">
          <Image className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-700 mb-2">
            ลากและวางรูปสลิปที่นี่ หรือ{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              เลือกไฟล์
            </button>
          </p>
          <p className="text-sm text-gray-500">
            รองรับเฉพาะไฟล์รูปภาพ: JPG, PNG, WEBP (ไฟล์ละไม่เกิน 10MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp"
        />
      </div>

      {/* Uploaded Files List with Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm text-gray-700">
            รูปสลิปที่อัปโหลด ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map(file => (
              <div
                key={file.id}
                className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group"
              >
                {/* Image Preview */}
                {file.previewUrl && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* File Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                      disabled={isProcessing}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Alert */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 flex gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-900">
          <p className="mb-1">
            <strong>ระบบอ่านข้อมูลอัตโนมัติ:</strong> เมื่ออัปโหลดสลิป ระบบจะใช้ AI อ่านข้อมูลจากรูปภาพและคำนวณภาษีให้อัตโนมัติ
          </p>
          <ul className="list-disc list-inside space-y-1 text-indigo-800 mt-2">
            <li>อัปโหลดรูปสลิปเงินเดือน (Payslip)</li>
            <li>อัปโหลดรูป W-2, 1099 หรือเอกสารภาษีอื่นๆ</li>
            <li>อัปโหลดรูปใบเสร็จสำหรับการหักลดหย่อน</li>
          </ul>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyzeClick}
        disabled={uploadedFiles.length === 0 || isProcessing}
        className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            กำลังวิเคราะห์ข้อมูลจากสลิป...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            วิเคราะห์และคำนวณภาษีอัตโนมัติ
          </>
        )}
      </button>
    </div>
  );
}