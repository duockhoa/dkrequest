import { useState, useEffect } from 'react';
import { Stack, Typography, TextField, Select, MenuItem, InputAdornment } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { numberToVietnameseWords, formatNumberWithCommas, parseFormattedNumber } from '../../../utils/numberToWords';

function RecruitmentForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;

        // Special handling for salary fields
        if (name === 'probation_salary_text' || name === 'official_salary_text') {
            // Format the input value with commas
            const formattedValue = formatNumberWithCommas(value);
            // Convert to number for storage
            const numericValue = parseFormattedNumber(formattedValue);

            const salaryField = name === 'probation_salary_text' ? 'probation_salary' : 'official_salary';

            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    recruitment_request: {
                        ...requestFormData.recruitment_request,
                        [name]: formattedValue,
                        [salaryField]: numericValue,
                    },
                }),
            );
            return;
        }

        dispatch(
            setRequestFormData({
                ...requestFormData,
                recruitment_request: {
                    ...requestFormData.recruitment_request,
                    [name]: value,
                },
            }),
        );
    };

    // Get amount in words for helper text
    const probationSalaryInWords = () => {
        const amount = requestFormData?.recruitment_request?.probation_salary;
        if (!amount || amount === 0) return '';
        return numberToVietnameseWords(amount);
    };

    const officialSalaryInWords = () => {
        const amount = requestFormData?.recruitment_request?.official_salary;
        if (!amount || amount === 0) return '';
        return numberToVietnameseWords(amount);
    };

    // Options cho các dropdown
    const educationLevels = [
        'Tốt nghiệp THCS',
        'Tốt nghiệp THPT',
        'Trung cấp',
        'Cao đẳng',
        'Đại học',
        'Thạc sĩ',
        'Tiến sĩ',
    ];

    const contractTypes = ['HĐ Lao động', 'HĐ thuê khoán', 'HĐ thời vụ'];

    const genderOptions = ['Nam', 'Nữ', 'Không yêu cầu'];

    const recruitmentReasons = ['Thay thế', 'Bổ sung', 'Thêm mới'];

    const workingHoursOptions = ['Hành chính', 'Theo Ca', 'Thoả thuận'];

    const foreignLanguages = [
        'Không yêu cầu',
        'Tiếng Anh cơ bản',
        'Tiếng Anh giao tiếp',
        'Tiếng Anh thành thạo',
        'Tiếng Trung',
        'Tiếng Nhật',
        'Tiếng Hàn',
    ];

    const computerSkills = ['Không yêu cầu', 'Tin học cơ bản', 'Lập trình'];

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Vị trí tuyển dụng: (*)</Typography>
                <TextField
                    fullWidth
                    name="position"
                    value={requestFormData?.recruitment_request?.position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.position}
                    helperText={errors?.position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số lượng: (*)</Typography>
                <TextField
                    fullWidth
                    name="quantity"
                    type="number"
                    value={requestFormData?.recruitment_request?.quantity || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        min: 1,
                        max: 100,
                    }}
                    error={!!errors?.quantity}
                    helperText={errors?.quantity || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Ngày dự kiến thử việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="probation_start_date"
                    type="date"
                    value={requestFormData?.recruitment_request?.probation_start_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.probation_start_date}
                    helperText={errors?.probation_start_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lương thử việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="probation_salary_text"
                    value={requestFormData?.recruitment_request?.probation_salary_text || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>vnđ</Typography>
                            </InputAdornment>
                        ),
                    }}
                    error={!!errors?.probation_salary_text}
                    helperText={errors?.probation_salary_text || probationSalaryInWords() || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lương chính thức: (*)</Typography>
                <TextField
                    fullWidth
                    name="official_salary_text"
                    value={requestFormData?.recruitment_request?.official_salary_text || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>vnđ</Typography>
                            </InputAdornment>
                        ),
                    }}
                    error={!!errors?.official_salary_text}
                    helperText={errors?.official_salary_text || officialSalaryInWords() || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lý do tuyển dụng: (*)</Typography>
                <Select
                    fullWidth
                    name="recruitment_reason"
                    value={requestFormData?.recruitment_request?.recruitment_reason || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.recruitment_reason}
                >
                    {recruitmentReasons.map((reason) => (
                        <MenuItem key={reason} value={reason} sx={{ fontSize: '1.4rem' }}>
                            {reason}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Trình độ học vấn: (*)</Typography>
                <Select
                    fullWidth
                    name="education_level"
                    value={requestFormData?.recruitment_request?.education_level || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.education_level}
                >
                    {educationLevels.map((level) => (
                        <MenuItem key={level} value={level} sx={{ fontSize: '1.4rem' }}>
                            {level}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Chuyên ngành(*):</Typography>
                <TextField
                    fullWidth
                    name="major"
                    value={requestFormData?.recruitment_request?.major || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.major}
                    helperText={errors?.major || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Ngoại ngữ(*):</Typography>
                <Select
                    fullWidth
                    name="foreign_language"
                    value={requestFormData?.recruitment_request?.foreign_language || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.foreign_language}
                >
                    {foreignLanguages.map((lang) => (
                        <MenuItem key={lang} value={lang} sx={{ fontSize: '1.4rem' }}>
                            {lang}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tin học(*):</Typography>
                <Select
                    fullWidth
                    name="computer_skill"
                    value={requestFormData?.recruitment_request?.computer_skill || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.computer_skill}
                >
                    {computerSkills.map((skill) => (
                        <MenuItem key={skill} value={skill} sx={{ fontSize: '1.4rem' }}>
                            {skill}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Kinh nghiệm(*):</Typography>
                <TextField
                    fullWidth
                    name="experience"
                    value={requestFormData?.recruitment_request?.experience || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.experience}
                    helperText={errors?.experience || ''}
                    placeholder="Ví dụ: 2-3 năm vị trí tương đương"
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Loại hợp đồng: (*)</Typography>
                <Select
                    fullWidth
                    name="contract_type"
                    value={requestFormData?.recruitment_request?.contract_type || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.contract_type}
                >
                    {contractTypes.map((type) => (
                        <MenuItem key={type} value={type} sx={{ fontSize: '1.4rem' }}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Giới tính(*):</Typography>
                <Select
                    fullWidth
                    name="gender"
                    value={requestFormData?.recruitment_request?.gender || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.gender}
                >
                    {genderOptions.map((gender) => (
                        <MenuItem key={gender} value={gender} sx={{ fontSize: '1.4rem' }}>
                            {gender}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Độ tuổi(*):</Typography>
                <TextField
                    fullWidth
                    name="age_range"
                    value={requestFormData?.recruitment_request?.age_range || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.age_range}
                    helperText={errors?.age_range || ''}
                    placeholder="Ví dụ: 22-35 tuổi"
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Địa điểm làm việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="work_location"
                    value={requestFormData?.recruitment_request?.work_location || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.work_location}
                    helperText={errors?.work_location || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian làm việc: (*)</Typography>
                <Select
                    fullWidth
                    name="working_hours"
                    value={requestFormData?.recruitment_request?.working_hours || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.working_hours}
                >
                    {workingHoursOptions.map((hours) => (
                        <MenuItem key={hours} value={hours} sx={{ fontSize: '1.4rem' }}>
                            {hours}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Mô tả công việc:</Typography>
                <TextField
                    fullWidth
                    name="job_description"
                    multiline
                    minRows={3}
                    maxRows={6}
                    value={requestFormData?.recruitment_request?.job_description || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.job_description}
                    helperText={errors?.job_description || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Yêu cầu khác:</Typography>
                <TextField
                    fullWidth
                    name="other_requirements"
                    multiline
                    minRows={2}
                    maxRows={4}
                    value={requestFormData?.recruitment_request?.other_requirements || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.other_requirements}
                    helperText={errors?.other_requirements || ''}
                />
            </Stack>
        </Stack>
    );
}

export default RecruitmentForm;
