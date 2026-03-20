import PDFDocument from 'pdfkit';

/**
 * Generates a certificate PDF buffer using ES Module exports
 * @param {Object} data - { studentName, courseName, date, certificateId }
 */
export const generateCertificateBuffer = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 50
            });

            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // --- Design Elements ---
            
            // Outer Border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
               .lineWidth(3)
               .stroke('#4A90E2');

            // Branding Header
            doc.fillColor('#444')
               .fontSize(25)
               .text('UpSkillr', { align: 'center' });
            
            doc.moveDown();

            // Main Title
            doc.fillColor('#000')
               .fontSize(40)
               .text('CERTIFICATE OF COMPLETION', {
                    align: 'center',
                });

            doc.moveDown(2);

            // Recipient Text
            doc.fontSize(20)
               .text('This is to certify that', { align: 'center' });
            
            doc.moveDown();
            
            // Student Name
            doc.fillColor('#4A90E2')
               .fontSize(35)
               .text(data.studentName.toUpperCase(), {
                    align: 'center',
                });
            
            doc.fillColor('#000').moveDown();
            
            // Course Info
            doc.fontSize(20)
               .text('has successfully completed the course', { align: 'center' });
            
            doc.moveDown();
            
            doc.fontSize(25)
               .text(`"${data.courseName}"`, {
                    align: 'center',
                });

            doc.moveDown(2);

            // Footer Details
            const footerY = 450;
            doc.fontSize(12).text(`Date Issued: ${data.date}`, 70, footerY);
            doc.text(`Verify ID: ${data.certificateId}`, 70, footerY + 20);
            
            doc.text('Authorized by UpSkillr Learning', 550, footerY, { align: 'right' });

            // Finalize the PDF
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};