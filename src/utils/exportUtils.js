import jsPDF from 'jspdf';
import { toCanvas } from 'html-to-image';

export const exportToTxt = (result) => {
  try {
    const text = `STUDYGENIUS AI - INTELLIGENCE REPORT\n\nSUMMARY:\n${result.summary}\n\nKEY POINTS:\n${result.key_points.map(p => `- ${p}`).join('\n')}\n\nGenerated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genius_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('TXT Export Error:', error);
    return false;
  }
};

export const exportToPdf = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Export target not found');

    // Save original styles
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    const originalMaxHeight = element.style.maxHeight;

    // FORCE EXPANSION for capture
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const canvas = await toCanvas(element, {
      backgroundColor: '#10131a',
      pixelRatio: 2,
      fontEmbedCSS: '', // Avoid CORS issues
      filter: (node) => {
        // Optional: filter out specific nodes if needed
        return true;
      }
    });

    // Restore original styles immediately
    element.style.height = originalHeight;
    element.style.maxHeight = originalMaxHeight;
    element.style.overflow = originalOverflow;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = totalImgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalImgHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages if content is too long
    while (heightLeft >= 0) {
      position = heightLeft - totalImgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalImgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`genius_report_${Date.now()}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    return false;
  }
};

export const exportToPng = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Export target not found');

    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    const originalMaxHeight = element.style.maxHeight;

    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const canvas = await toCanvas(element, {
      backgroundColor: '#10131a',
      pixelRatio: 2,
      fontEmbedCSS: '',
    });

    element.style.height = originalHeight;
    element.style.maxHeight = originalMaxHeight;
    element.style.overflow = originalOverflow;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `genius_report_${Date.now()}.png`;
    a.click();
    return true;
  } catch (error) {
    console.error('PNG Export Error:', error);
    return false;
  }
};
