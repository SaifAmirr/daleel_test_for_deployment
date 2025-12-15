/**
 * Utility function to export invoice data to CSV format
 * @param {Array} invoices - Array of invoice objects
 * @param {String} filename - Name of the CSV file to download
 */
export const exportInvoicesToCSV = (invoices, filename = 'invoices.csv') => {
  if (!invoices || invoices.length === 0) {
    alert('No invoices to export');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Invoice Number', 'Issuer Name', 'Receiver Name', 'Amount (EGP)'];
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to escape CSV values (handle commas, quotes, newlines)
  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Create CSV rows
  const rows = invoices.map((invoice) => [
    formatDate(invoice.invoiceDate || invoice.timestamp || invoice.createdAt),
    invoice.invoiceNumber || 'N/A',
    invoice.issuerName || 'N/A',
    invoice.receiverName || 'N/A',
    invoice.totalAmount ? Number(invoice.totalAmount).toLocaleString() : 'N/A'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(','))
  ].join('\n');

  // Add total row
  const totalAmount = invoices.reduce((sum, invoice) => sum + (Number(invoice.totalAmount) || 0), 0);
  const totalRow = `"TOTAL","","","","${totalAmount.toLocaleString()}"`;
  const csvContentWithTotal = csvContent + '\n' + totalRow;

  // Create blob and download
  const blob = new Blob([csvContentWithTotal], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
