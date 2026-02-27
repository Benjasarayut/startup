import { useState } from 'react';
import { DollarSign, Receipt, Award, ArrowRight, ArrowLeft, Edit2, CheckCircle } from 'lucide-react';
import type { TaxData, UploadedFile } from './TaxCalculator';

interface TaxReviewProps {
  taxData: TaxData;
  uploadedFiles: UploadedFile[];
  calculation: {
    taxableIncome: number;
    taxBeforeCredits: number;
    finalTax: number;
  };
  onConfirm: (data: TaxData) => void;
  onBack: () => void;
  onDataChange: (data: TaxData) => void;
}

export function TaxReview({ taxData, uploadedFiles, calculation, onConfirm, onBack, onDataChange }: TaxReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<TaxData>(taxData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    onDataChange(editedData);
    setIsEditing(false);
  };

  const handleConfirm = () => {
    if (isEditing) {
      handleSaveEdit();
    }
    onConfirm(isEditing ? editedData : taxData);
  };

  const currentData = isEditing ? editedData : taxData;

  const filingStatusLabels: Record<string, string> = {
    single: 'โสด',
    married: 'สมรสยื่นร่วม',
    'married-separate': 'สมรสยื่นแยก',
    head: 'หัวหน้าครอบครัว',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2 text-gray-900">ตรวจสอบข้อมูลภาษี</h2>
          <p className="text-gray-600">
            ระบบได้อ่านข้อมูลจากสลิปแล้ว กรุณาตรวจสอบความถูกต้อง
          </p>
        </div>
        <button
          onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          {isEditing ? (
            <>
              <CheckCircle className="w-5 h-5" />
              บันทึก
            </>
          ) : (
            <>
              <Edit2 className="w-5 h-5" />
              แก้ไข
            </>
          )}
        </button>
      </div>

      {/* Success Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-green-900">
            วิเคราะห์สลิปสำเร็จ! ระบบได้อ่านข้อมูลจาก {uploadedFiles.length} รูปภาพ
          </p>
        </div>
      </div>

      {/* Tax Data Form */}
      <div className="space-y-4">
        {/* Filing Status */}
        <div>
          <label htmlFor="filingStatus" className="block text-sm mb-2 text-gray-700">
            สถานะการยื่นภาษี
          </label>
          <select
            id="filingStatus"
            name="filingStatus"
            value={currentData.filingStatus}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="single">โสด</option>
            <option value="married">สมรสยื่นร่วม</option>
            <option value="married-separate">สมรสยื่นแยก</option>
            <option value="head">หัวหน้าครอบครัว</option>
          </select>
        </div>

        {/* Annual Income */}
        <div>
          <label htmlFor="income" className="block text-sm mb-2 text-gray-700">
            รายได้ต่อปี
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <input
              type="number"
              id="income"
              name="income"
              value={currentData.income}
              onChange={handleChange}
              disabled={!isEditing}
              step="0.01"
              min="0"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Deductions */}
        <div>
          <label htmlFor="deductions" className="block text-sm mb-2 text-gray-700">
            รายการหักลดหย่อน
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Receipt className="w-5 h-5" />
            </div>
            <input
              type="number"
              id="deductions"
              name="deductions"
              value={currentData.deductions}
              onChange={handleChange}
              disabled={!isEditing}
              step="0.01"
              min="0"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Tax Credits */}
        <div>
          <label htmlFor="credits" className="block text-sm mb-2 text-gray-700">
            เครดิตภาษี
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Award className="w-5 h-5" />
            </div>
            <input
              type="number"
              id="credits"
              name="credits"
              value={currentData.credits}
              onChange={handleChange}
              disabled={!isEditing}
              step="0.01"
              min="0"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Tax Calculation Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg mb-4 text-gray-900">สรุปการคำนวณภาษี</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">รายได้รวม:</span>
            <span className="text-gray-900 text-lg">
              ฿{parseFloat(currentData.income || '0').toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">หักลดหย่อน:</span>
            <span className="text-red-600 text-lg">
              -฿{parseFloat(currentData.deductions || '0').toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-indigo-200">
            <span className="text-gray-600">รายได้ที่ต้องเสียภาษี:</span>
            <span className="text-gray-900 text-lg">
              ฿{calculation.taxableIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ภาษีก่อนหักเครดิต:</span>
            <span className="text-gray-900 text-lg">
              ฿{calculation.taxBeforeCredits.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">เครดิตภาษี:</span>
            <span className="text-green-600 text-lg">
              -฿{parseFloat(currentData.credits || '0').toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t-2 border-indigo-300">
            <span className="text-xl text-gray-900">ภาษีที่ต้องชำระ:</span>
            <span className="text-3xl text-indigo-600">
              ฿{calculation.finalTax.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Uploaded Slips Preview */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm mb-3 text-gray-700">สลิปที่อัปโหลด ({uploadedFiles.length})</h3>
        <div className="grid grid-cols-3 gap-2">
          {uploadedFiles.slice(0, 3).map((file) => (
            <div key={file.id} className="aspect-video bg-gray-200 rounded overflow-hidden">
              {file.previewUrl && (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
        {uploadedFiles.length > 3 && (
          <p className="text-xs text-gray-500 mt-2">และอีก {uploadedFiles.length - 3} รูป</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          อัปโหลดสลิปใหม่
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          ยืนยันและดำเนินการชำระเงิน
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
