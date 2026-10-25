import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Requests from './index';
import requestReducer from '../../../redux/slice/requestSlice';
import formReducer from '../../../redux/slice/requestFormDataSlice';
import { getAllRequestService } from '../../../services/requestService';

let mockFormLoaded = false;
jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock('../../Form/AddRequestForm', () => {
    mockFormLoaded = true;
    return { __esModule: true, default: ({ onClose }) => <button onClick={onClose}>Đóng form thử nghiệm</button> };
});
jest.mock('../Button/ExportReport', () => ({ __esModule: true, default: () => null }));
jest.mock('../Button/StationeryItems', () => ({ __esModule: true, default: () => null }));
jest.mock('../../../services/requestService', () => ({ getAllRequestService: jest.fn(), createRequestService: jest.fn() }));
jest.mock('../../../hooks/useElementWidth', () => ({ useElementWidth: () => 650 }));

global.IS_REACT_ACT_ENVIRONMENT = true;
let root; let container; let store;
const theme = createTheme();
const render = async type => {
    await act(async () => root.render(<Provider store={store}><ThemeProvider theme={theme}>
        <Requests requestTypeId={type} />
    </ThemeProvider></Provider>));
};
beforeEach(() => {
    container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
    store = configureStore({ reducer: {
        request: requestReducer,
        requestFormData: formReducer,
        requestId: () => ({ requestTypeId: 3, requestId: null }),
        user: () => ({ userInfo: { id: 10, department: 'HC' } }),
    } });
    getAllRequestService.mockResolvedValue({ result: [], pagination: { page: 1, totalPages: 0, total: 0 } });
});
afterEach(() => {
    act(() => root.unmount()); container.remove(); jest.clearAllMocks();
});
test('the form module is not loaded until the user opens its dialog', async () => {
    await render(3);
    expect(mockFormLoaded).toBe(false);
    const add = Array.from(container.querySelectorAll('button')).find(button => button.textContent.includes('Thêm mới'));
    expect(add).toBeDefined();
    await act(async () => add.click());
    expect(mockFormLoaded).toBe(true);
    expect(document.body.textContent).toContain('Đóng form thử nghiệm');
    const close = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Đóng form thử nghiệm'));
    await act(async () => close.click());
    expect(store.getState().request.error).toBeNull();
});
test('switching request type from a later page fetches page one directly', async () => {
    getAllRequestService.mockResolvedValue({ result: [], pagination: { page: 5, totalPages: 5, total: 500 } });
    await render(3);
    getAllRequestService.mockClear();
    getAllRequestService.mockResolvedValue({ result: [], pagination: { page: 1, totalPages: 1, total: 1 } });
    await render(4);
    expect(getAllRequestService).toHaveBeenCalledTimes(1);
    expect(getAllRequestService.mock.calls[0].slice(0, 4)).toEqual([4, 10, 1, 100]);
});
test('unmounting cancels the pending list HTTP request', async () => {
    getAllRequestService.mockReturnValue(new Promise(() => {}));
    await render(3);
    const signal = getAllRequestService.mock.calls[0][4];
    act(() => root.unmount()); root = createRoot(container);
    expect(signal.aborted).toBe(true);
});
