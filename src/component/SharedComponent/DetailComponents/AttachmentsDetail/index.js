import { Stack, Typography, Paper, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FolderIcon from '@mui/icons-material/Folder';
import { format } from 'date-fns';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 150,
                color: 'text.secondary',
                fontSize: '1.4rem',
            }}
        >
            {label}:
        </Typography>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 500 }}>{value}</Typography>
    </Stack>
);

const FileItem = ({ file }) => (
    <Paper
        elevation={0}
        sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'grey.50',
            mb: 1,
        }}
    >
        <TextSnippetIcon sx={{ color: 'primary.main', fontSize: 32, mr: 2 }} />
        <Typography
            variant="body1"
            sx={{
                flex: 1,
                fontWeight: 500,
                color: 'primary.main',
                fontSize: '1.2rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                    color: 'primary.dark',
                },
            }}
            title={file.file_name}
            onClick={() =>
                window.open(
                    `https://mysql.dkpharma.io.vn/api/v1/file/get?filepath=${encodeURIComponent(file.file_path)}`,
                    '_blank',
                )
            }
        >
            {file.file_name}
        </Typography>
    </Paper>
);

const FileGroupSection = ({ groupName, files }) => {
    const getGroupLabel = (group) => {
        switch (group) {
            case 'invoices':
                return 'Hóa đơn';
            case 'receipts':
                return 'Bảng kê vật tư';
            case 'contracts':
                return 'Hợp đồng';
            case 'documents':
                return 'Tài liệu';
            case 'others':
                return 'Khác';
            default:
                return group || 'Không xác định';
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <FolderIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.4rem',
                        fontWeight: 600,
                        color: 'text.primary',
                    }}
                >
                    {getGroupLabel(groupName)} ({files.length} tệp)
                </Typography>
            </Stack>

            <Box sx={{ ml: 4 }}>
                {files.map((file) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </Box>
        </Box>
    );
};

export default function AttachmentsDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Safe access to payment registration data
    const paymentData = requestDetail?.attachments;

    // Format functions
    const formatCurrency = (amount) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    const getPaymentTypeLabel = (type) => {
        switch (type) {
            case 'invoice':
                return 'Có hóa đơn';
            case 'no_invoice':
                return 'Không hóa đơn';
            default:
                return type || '-';
        }
    };

    // Safe access to attachments data
    const attachments = requestDetail?.attachments;

    // Group attachments by file_group
    const groupedAttachments = attachments?.reduce((groups, file) => {
        const group = file.file_group || 'others';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(file);
        return groups;
    }, {});

    if (!attachments || attachments.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có tệp đính kèm</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h5"
                sx={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    mb: 3,
                    color: 'text.primary',
                }}
            >
                Tệp đính kèm ({attachments.length})
            </Typography>

            <Stack spacing={2}>
                {Object.entries(groupedAttachments).map(([groupName, files]) => (
                    <FileGroupSection key={groupName} groupName={groupName} files={files} />
                ))}
            </Stack>
        </Box>
    );
}
