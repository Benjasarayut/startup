import { useState } from 'react';
import { Building2, CreditCard, Check, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';

interface PaymentMethodProps {
  amount: number;
  onPaymentComplete: () => void;
  onBack: () => void;
}

export function PaymentMethod({ amount, onPaymentComplete, onBack }: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'card'>('bank');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '', // เอา routingNumber ออกแล้ว
  });
  const [processing, setProcessing] = useState(false);

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2 text-gray-900">รายละเอียดการชำระเงิน</h2>
        <p className="text-gray-600">
          เลือกวิธีการชำระเงินเพื่อยื่นภาษีให้เสร็จสมบูรณ์
        </p>
      </div>

      {/* Amount Due */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <p className="text-sm opacity-90 mb-1">ยอดที่ต้องชำระ</p>
        <p className="text-4xl">฿{amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
        <p className="text-sm opacity-90 mt-2">รวมค่าธรรมเนียมการยื่นและดำเนินการแล้ว</p>
      </div>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedMethod('bank')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedMethod === 'bank'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Building2 className={`w-8 h-8 ${selectedMethod === 'bank' ? 'text-indigo-600' : 'text-gray-600'}`} />
            <span className={selectedMethod === 'bank' ? 'text-indigo-600' : 'text-gray-900'}>
              โอนเงินผ่านธนาคาร
            </span>
            {selectedMethod === 'bank' && (
              <Check className="w-5 h-5 text-indigo-600" />
            )}
          </div>
        </button>

        <button
          onClick={() => setSelectedMethod('card')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedMethod === 'card'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <CreditCard className={`w-8 h-8 ${selectedMethod === 'card' ? 'text-indigo-600' : 'text-gray-600'}`} />
            <span className={selectedMethod === 'card' ? 'text-indigo-600' : 'text-gray-900'}>
              บัตรเครดิต/เดบิต
            </span>
            {selectedMethod === 'card' && (
              <Check className="w-5 h-5 text-indigo-600" />
            )}
          </div>
        </button>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmitPayment} className="space-y-4">
        {selectedMethod === 'bank' ? (
          <>
            <div>
              <label htmlFor="bankName" className="block text-sm mb-2 text-gray-700">
                ชื่อธนาคาร
              </label>
              <select
                id="bankName"
                name="bankName"
                value={bankDetails.bankName}
                onChange={handleBankChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              >
                <option value="" disabled>เลือกธนาคาร</option>
                <option value="KBANK">ธนาคารกสิกรไทย (KBANK)</option>
                <option value="SCB">ธนาคารไทยพาณิชย์ (SCB)</option>
                <option value="KTB">ธนาคารกรุงไทย (KTB)</option>
                <option value="BBL">ธนาคารกรุงเทพ (BBL)</option>
                <option value="BAY">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                <option value="TTB">ธนาคารทหารไทยธนชาต (TTB)</option>
                <option value="GSB">ธนาคารออมสิน (GSB)</option>
                <option value="BAAC">ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)</option>
              </select>
            </div>

            <div>
              <label htmlFor="accountName" className="block text-sm mb-2 text-gray-700">
                ชื่อเจ้าของบัญชี
              </label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={bankDetails.accountName}
                onChange={handleBankChange}
                placeholder="ชื่อ-นามสกุล ตามบัญชีธนาคาร"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* เอา Grid และช่องรหัสธนาคารออก ให้เลขบัญชีเต็มบรรทัด */}
            <div>
              <label htmlFor="accountNumber" className="block text-sm mb-2 text-gray-700">
                เลขที่บัญชี
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleBankChange}
                placeholder="เลขที่บัญชีธนาคาร"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <p>
                การชำระผ่านบัตรเครดิต/เดบิตจะดำเนินการผ่านระบบชำระเงินที่ปลอดภัย
                นี่เป็นเพียงตัวอย่าง - โปรดใช้การโอนเงินผ่านธนาคารสำหรับการชำระเงินจริง
              </p>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="mb-1">การประมวลผลการชำระเงินที่ปลอดภัย</p>
            <p className="text-gray-600">
              ข้อมูลการชำระเงินของคุณถูกเข้ารหัสและประมวลผลอย่างปลอดภัย เราไม่เก็บข้อมูลการชำระเงินแบบเต็มรูปแบบ
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={processing}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            ย้อนกลับ
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                กำลังประมวลผล...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                ยืนยันการชำระเงิน
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}