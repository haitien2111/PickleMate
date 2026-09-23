/**
 * Utility to download an SVG element as a crisp PNG image
 */
export const downloadSvgAsPng = (
  svgElement: SVGSVGElement | null,
  fileName: string,
  options?: {
    title?: string;
    subtitle?: string;
    footerText?: string;
    extraDetails?: string[];
  }
) => {
  if (!svgElement) return;

  try {
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = window.URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const width = 640;
      const baseHeight = 720;
      const extraHeight = (options?.extraDetails?.length || 0) * 28;
      const height = baseHeight + extraHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Card Background with slight border
      ctx.fillStyle = '#ffffff';
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(0, 0, width, height, 32);
      } else {
        ctx.fillRect(0, 0, width, height);
      }
      ctx.fill();

      // Top banner
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, width, 110);

      // Title
      ctx.fillStyle = '#a3e635'; // lime-400
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PICKLEMATE VIETNAM', width / 2, 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
      ctx.fillText(options?.title || 'MÃ QR BOOKING & CHECK-IN', width / 2, 82);

      // Subtitle
      if (options?.subtitle) {
        ctx.fillStyle = '#475569';
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.fillText(options.subtitle, width / 2, 145);
      }

      // QR Code Container Box
      const qrBoxSize = 340;
      const qrBoxX = (width - qrBoxSize) / 2;
      const qrBoxY = 170;

      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
      } else {
        ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      }
      ctx.fill();
      ctx.stroke();

      // Draw the QR SVG
      const pad = 25;
      ctx.drawImage(img, qrBoxX + pad, qrBoxY + pad, qrBoxSize - pad * 2, qrBoxSize - pad * 2);

      // Extra Details
      let currentY = qrBoxY + qrBoxSize + 35;
      if (options?.extraDetails && options.extraDetails.length > 0) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 15px monospace';
        options.extraDetails.forEach((line) => {
          ctx.fillText(line, width / 2, currentY);
          currentY += 26;
        });
      }

      // Divider
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, currentY + 10);
      ctx.lineTo(width - 60, currentY + 10);
      ctx.stroke();

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        options?.footerText || 'Quét tại quầy lễ tân hoặc cổng tự động để vào sân',
        width / 2,
        currentY + 38
      );

      // Trigger download
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      window.URL.revokeObjectURL(blobURL);
    };

    img.onerror = () => {
      // Fallback: download directly as SVG if image rendering fails
      const downloadLink = document.createElement('a');
      downloadLink.href = blobURL;
      downloadLink.download = fileName.endsWith('.svg') ? fileName : `${fileName}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobURL);
    };

    img.src = blobURL;
  } catch (error) {
    console.error('Error downloading QR code:', error);
  }
};
