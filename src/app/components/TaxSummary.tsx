import { CheckCircle, FileText, Download, RotateCcw } from 'lucide-react';
import type { TaxData, UploadedFile } from './TaxCalculator';

interface TaxSummaryProps {
  taxData: TaxData;
  calculation: {
    taxableIncome: number;
    taxBeforeCredits: number;
    finalTax: number;
  };
  uploadedFiles: UploadedFile[];
  onReset: () => void;
}

export function TaxSummary({ taxData, calculation, uploadedFiles, onReset }: TaxSummaryProps) {
  const filingStatusLabels: Record<string, string> = {
    single: 'โสด',
    married: 'สมรสยื่นร่วม',
    'married-separate': 'สมรสยื่นแยก',
    head: 'หัวหน้าครอบครัว',
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl mb-2 text-gray-900">ชำระเงินสำเร็จ!</h2>
        <p className="text-gray-600">
          การยื่นภาษีของคุณเสร็จสมบูรณ์และส่งเรียบร้อยแล้ว
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg mb-4 text-gray-900">สรุปการคำนวณภาษี</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">สถานะการยื่น:</span>
            <span className="text-gray-900">{filingStatusLabels[taxData.filingStatus]}</span>
          </div>
          
          <div className="border-t border-green-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">รายได้รวม:</span>
              <span className="text-gray-900">
                ฿{parseFloat(taxData.income).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          {taxData.deductions && parseFloat(taxData.deductions) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">หักลดหย่อน:</span>
              <span className="text-red-600">
                -฿{parseFloat(taxData.deductions).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t border-green-200">
            <span className="text-gray-600">รายได้ที่ต้องเสียภาษี:</span>
            <span className="text-gray-900">
              ฿{calculation.taxableIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ภาษีก่อนหักเครดิต:</span>
            <span className="text-gray-900">
              ฿{calculation.taxBeforeCredits.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {taxData.credits && parseFloat(taxData.credits) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">เครดิตภาษี:</span>
              <span className="text-green-600">
                -฿{parseFloat(taxData.credits).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-3 border-t-2 border-green-300">
            <span className="text-lg text-gray-900">ภาษีที่ต้องชำระทั้งหมด:</span>
            <span className="text-2xl text-green-600">
              ฿{calculation.finalTax.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg mb-4 text-gray-900">เอกสารสนับสนุน</h3>
          <div className="grid grid-cols-3 gap-2">
            {uploadedFiles.slice(0, 6).map((file) => (
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
          {uploadedFiles.length > 6 && (
            <p className="text-sm text-gray-500 mt-3">และอีก {uploadedFiles.length - 6} รูป</p>
          )}
        </div>
      )}

      {/* Confirmation Details */}
      <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg mb-3 text-gray-900">รายละเอียดการยืนยัน</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">หมายเลขยืนยัน:</span>
            <span className="text-gray-900 font-mono">TX-{Date.now().toString(36).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">วันที่ส่ง:</span>
            <span className="text-gray-900">{new Date().toLocaleDateString('th-TH', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">สถานะการชำระเงิน:</span>
            <span className="inline-flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              เสร็จสมบูรณ์
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          คำนวณใหม่
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          ดาวน์โหลดใบเสร็จ
        </button>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm mb-2 text-blue-900">ขั้นตอนถัดไป</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>อีเมลยืนยันได้ถูกส่งไปยังอีเมลที่ลงทะเบียนไว้แล้ว</li>
          <li>การยื่นภาษีของคุณจะได้รับการประมวลผลภายใน 3-5 วันทำการ</li>
          <li>คุณจะได้รับการอัปเดตสถานะการยื่นผ่านอีเมล</li>
          <li>โปรดเก็บหมายเลขยืนยันไว้เพื่ออ้างอิง</li>
        </ul>
      </div>
    </div>
  );
}