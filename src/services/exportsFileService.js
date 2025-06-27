import axios from './customize-axios';

async function exportsFileDocService(template, data) {
    try {
        const response = await axios.post(
            'file/exportdoc',
            {
                template,
                data,
            },
            {
                responseType: 'blob', // Set response type to blob for file download
            },
        );

        if (response.status === 200) {
            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${template}.doc`); // Set the file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            throw new Error('Failed to export file');
        }
    } catch (error) {
        console.error('Error exporting file:', error);
        throw error; // Re-throw the error for further handling if needed
    }
}

export { exportsFileDocService };
