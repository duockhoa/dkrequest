import { useState, useRef } from 'react';
import { Box, Typography, IconButton, Paper, Stack, LinearProgress, Alert } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useDispatch, useSelector } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';

function FileUpload({ fieldName, label, accept = '*/*', multiple = true, maxSize = 100 }) {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const fileInputRef = useRef();
    const [uploadProgress, setUploadProgress] = useState({});
    const [error, setError] = useState('');

    // Get current files from Redux
    const currentFiles = requestFormData?.files?.[fieldName] || [];

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setError('');

        // Validate file size (MB)
        const invalidFiles = selectedFiles.filter((file) => file.size > maxSize * 1024 * 1024);
        if (invalidFiles.length > 0) {
            setError(`File không được vượt quá ${maxSize}MB`);
            return;
        }

        // Process files and add to Redux
        const processedFiles = selectedFiles.map((file) => ({
            id: Date.now() + Math.random(),
            file: file,
            file_group: fieldName,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file), // For preview
            uploadStatus: 'pending',
        }));

        // Update Redux with new files
        const updatedFiles = multiple ? [...currentFiles, ...processedFiles] : processedFiles;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                files: {
                    ...requestFormData.files,
                    [fieldName]: updatedFiles,
                },
            }),
        );

        // Reset input
        event.target.value = '';
    };

    const handleRemoveFile = (fileId) => {
        const updatedFiles = currentFiles.filter((file) => file.id !== fileId);

        dispatch(
            setRequestFormData({
                ...requestFormData,
                files: {
                    ...requestFormData.files,
                    [fieldName]: updatedFiles,
                },
            }),
        );
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Stack spacing={2}>
            {/* Upload Button */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>{label}:</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        border: '1px solid #e0e0e0',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: 'grey.50',
                        },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple={multiple}
                        accept={accept}
                        style={{ display: 'none' }}
                    />
                    <IconButton
                        size="small"
                        sx={{
                            mx: 1,
                            transform: 'rotate(45deg)',
                        }}
                    >
                        <AttachFileIcon />
                    </IconButton>
                    <Typography sx={{ fontSize: '1.4rem', color: 'grey.600' }}>
                        {multiple ? 'Thêm files' : 'Thêm file'}
                    </Typography>
                </Box>
            </Stack>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ ml: 15 }}>
                    {error}
                </Alert>
            )}

            {/* Files Preview */}
            {currentFiles.length > 0 && (
                <Stack spacing={1} sx={{ ml: 15 }}>
                    {currentFiles.map((fileItem) => (
                        <Paper
                            key={fileItem.id}
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                            }}
                        >
                            <TextSnippetIcon sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />

                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '1.1rem',
                                        color: 'text.primary',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    title={fileItem.name}
                                >
                                    {fileItem.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                    {formatFileSize(fileItem.size)}
                                </Typography>

                                {/* Upload Progress */}
                                {uploadProgress[fileItem.id] && (
                                    <LinearProgress
                                        variant="determinate"
                                        value={uploadProgress[fileItem.id]}
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </Box>

                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveFile(fileItem.id)}
                                sx={{ ml: 2 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}

export default FileUpload;
