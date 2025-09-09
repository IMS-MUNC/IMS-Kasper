import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToExcel(data, columns, filename = 'ExpiredProducts.xlsx') {
    const wsData = [columns, ...data.map(row => columns.map(col => row[col]))];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ExpiredProducts');
    XLSX.writeFile(wb, filename);
}

export function exportToPDF(data, columns, filename = 'ExpiredProducts.pdf') {
    const doc = new jsPDF();
    doc.autoTable({ head: [columns], body: data.map(row => columns.map(col => row[col])) });
    doc.save(filename);
}
