import React, { useRef, useState } from 'react';
import { QrCode, CheckCircle2, Copy, Download, Check } from 'lucide-react';
import { downloadSvgAsPng } from '../utils/qrDownload';

interface VietQRCodeProps {
  amount: number;
  transferMemo: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export const VietQRCode: React.FC<VietQRCodeProps> = ({
  amount,
  transferMemo,
  bankName = 'VietinBank (CTG)',
  accountNumber = '1088 2901 8888',
  accountName = 'PICKLEMATE TECH CORP',
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!svgRef.current) return;
    downloadSvgAsPng(
      svgRef.current,
      `VietQR-Booking-PickleMate-${amount}`,
      {
        title: 'THANH TOÁN CỌC VIETQR',
        subtitle: `${bankName} • ${amount.toLocaleString('vi-VN')} VNĐ`,
        extraDetails: [
          `STK: ${accountNumber} (${accountName})`,
          `Nội dung CK: ${transferMemo}`,
        ],
        footerText: 'Quét bằng ứng dụng Ngân hàng (Napas 247) để thanh toán',
      }
    );
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-xl max-w-sm mx-auto text-slate-900 font-sans">
      {/* Top Banner Napas247 + VietQR */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 px-1">
        <div className="flex items-center space-x-1.5">
          <span className="font-extrabold text-blue-800 tracking-tight text-lg">Viet<span className="text-red-600">QR</span></span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
            Napas 247
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Dynamic QR</span>
        </div>
      </div>

      {/* QR Code Presentation */}
      <div className="relative my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
        {/* Decorative corner markers */}
        <div className="relative w-52 h-52 bg-white p-2.5 rounded-lg shadow-inner flex items-center justify-center border border-slate-200">
          <svg ref={svgRef} className="w-full h-full text-slate-900" viewBox="0 0 200 200" fill="none">
            {/* Standard QR pattern recreation */}
            {/* Top-left marker */}
            <rect x="10" y="10" width="50" height="50" rx="6" fill="#0B132B" />
            <rect x="18" y="18" width="34" height="34" rx="3" fill="white" />
            <rect x="25" y="25" width="20" height="20" rx="2" fill="#84CC16" />
            
            {/* Top-right marker */}
            <rect x="140" y="10" width="50" height="50" rx="6" fill="#0B132B" />
            <rect x="148" y="18" width="34" height="34" rx="3" fill="white" />
            <rect x="155" y="25" width="20" height="20" rx="2" fill="#84CC16" />

            {/* Bottom-left marker */}
            <rect x="10" y="140" width="50" height="50" rx="6" fill="#0B132B" />
            <rect x="18" y="148" width="34" height="34" rx="3" fill="white" />
            <rect x="25" y="155" width="20" height="20" rx="2" fill="#84CC16" />

            {/* Pattern dots & matrix */}
            <circle cx="70" cy="20" r="4" fill="#0B132B" />
            <circle cx="85" cy="20" r="4" fill="#0B132B" />
            <circle cx="100" cy="20" r="4" fill="#0B132B" />
            <circle cx="115" cy="20" r="4" fill="#0B132B" />
            <circle cx="130" cy="20" r="4" fill="#0B132B" />
            
            <circle cx="70" cy="35" r="4" fill="#0B132B" />
            <circle cx="95" cy="35" r="4" fill="#0B132B" />
            <circle cx="125" cy="35" r="4" fill="#0B132B" />
            
            <circle cx="70" cy="50" r="4" fill="#0B132B" />
            <circle cx="85" cy="50" r="4" fill="#0B132B" />
            <circle cx="115" cy="50" r="4" fill="#0B132B" />

            {/* Middle bands */}
            <rect x="15" y="70" width="10" height="10" rx="2" fill="#0B132B" />
            <rect x="35" y="70" width="12" height="12" rx="2" fill="#0B132B" />
            <rect x="55" y="70" width="10" height="10" rx="2" fill="#0B132B" />
            <rect x="75" y="70" width="12" height="12" rx="2" fill="#0B132B" />
            <rect x="115" y="70" width="10" height="10" rx="2" fill="#0B132B" />
            <rect x="145" y="70" width="14" height="14" rx="2" fill="#0B132B" />
            <rect x="175" y="70" width="10" height="10" rx="2" fill="#0B132B" />

            {/* Center Logo badge */}
            <circle cx="100" cy="100" r="24" fill="#0B132B" stroke="#A3E635" strokeWidth="3" />
            <circle cx="100" cy="100" r="19" fill="#A3E635" />
            <circle cx="96" cy="96" r="2" fill="#0B132B" />
            <circle cx="104" cy="96" r="2" fill="#0B132B" />
            <circle cx="100" cy="103" r="2" fill="#0B132B" />
            <circle cx="95" cy="106" r="1.5" fill="#0B132B" />
            <circle cx="105" cy="106" r="1.5" fill="#0B132B" />
            
            {/* Bottom matrix patterns */}
            <rect x="70" y="140" width="12" height="12" rx="2" fill="#0B132B" />
            <rect x="90" y="145" width="15" height="15" rx="2" fill="#0B132B" />
            <rect x="115" y="140" width="12" height="12" rx="2" fill="#0B132B" />
            <rect x="135" y="150" width="14" height="14" rx="2" fill="#0B132B" />
            <rect x="160" y="140" width="25" height="12" rx="2" fill="#0B132B" />
            <rect x="70" y="170" width="20" height="12" rx="2" fill="#0B132B" />
            <rect x="100" y="170" width="15" height="15" rx="2" fill="#0B132B" />
            <rect x="130" y="175" width="12" height="12" rx="2" fill="#0B132B" />
            <rect x="155" y="165" width="25" height="20" rx="2" fill="#0B132B" />
          </svg>
        </div>

        <div className="flex items-center justify-between w-full px-1 mt-2.5">
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-lime-600" /> Quét bằng App ngân hàng
          </p>

          <button
            type="button"
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Tải mã QR thanh toán cọc"
          >
            {downloaded ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Đã tải về</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3 text-slate-600" />
                <span>Tải mã QR</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment details breakdown */}
      <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Số tiền cọc:</span>
          <span className="text-base font-extrabold text-lime-600">
            {amount.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Ngân hàng:</span>
          <span className="font-semibold text-slate-800">{bankName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Số tài khoản:</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
            <span>{accountNumber}</span>
            <button
              onClick={() => handleCopy(accountNumber.replace(/\s+/g, ''))}
              className="text-slate-400 hover:text-slate-700 p-0.5"
              title="Sao chép STK"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Chủ tài khoản:</span>
          <span className="font-semibold text-slate-800 uppercase">{accountName}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-200">
          <span className="text-slate-500 font-medium">Nội dung CK:</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            <span>{transferMemo}</span>
            <button
              onClick={() => handleCopy(transferMemo)}
              className="text-blue-500 hover:text-blue-800 p-0.5"
              title="Sao chép nội dung"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      {copied && (
        <p className="text-[11px] text-emerald-600 font-semibold text-center mt-2 animate-fade-in">
          ✓ Đã sao chép vào bộ nhớ tạm
        </p>
      )}
    </div>
  );
};
