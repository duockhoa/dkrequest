import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RequestApprovers from './index';
import approverReducer, { fetchRequestApprovers } from '../../../redux/slice/requestApproverSlice';
import formReducer, { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { getRequestApprover } from '../../../services/requestApproverService';

jest.mock('../../../services/requestApproverService', () => ({ getRequestApprover: jest.fn() }));
jest.mock('../../../services/requestService', () => ({ createRequestService: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;
let container;
let root;
let store;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    store = configureStore({ reducer: {
        requestApprover: approverReducer,
        requestFormData: formReducer,
        requestId: () => ({ requestTypeId: 1 }),
        user: () => ({ userInfo: { id: 10 } }),
    } });
    store.dispatch(setRequestFormData({ payment_request: { fuel_liters: '1.05' }, approvers: [{ user_id: 999, step: 1 }] }));
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.resetAllMocks();
});

test('renders all four levels and updates only the approvers without overwriting in-progress form fields', async () => {
    let resolveApprovers;
    getRequestApprover.mockImplementation(() => new Promise(resolve => { resolveApprovers = resolve; }));
    act(() => root.render(<Provider store={store}><RequestApprovers /></Provider>));
    expect(container.textContent).toContain('Đang tải');
    act(() => store.dispatch(setRequestFormData({ payment_request: { fuel_liters: '40.25' }, approvers: [] })));
    await act(async () => resolveApprovers([
        { id: 63, level: 1, name: 'Phó phòng', approvalRole: 'technical_deputy' },
        { id: 20, level: 2, name: 'Trưởng phòng' },
        { id: 30, level: 3, name: 'Kế toán' },
        { id: 40, level: 4, name: 'BGĐ' },
    ]));
    expect(container.textContent).toContain('Phê duyệt cấp 1 (Phó phòng)');
    expect(container.textContent).toContain('Phê duyệt cấp 4');
    expect(store.getState().requestFormData.value.payment_request.fuel_liters).toBe('40.25');
    expect(store.getState().requestFormData.value.approvers).toEqual([
        { user_id: 63, step: 1 }, { user_id: 20, step: 2 }, { user_id: 30, step: 3 }, { user_id: 40, step: 4 },
    ]);
});

test('shows the backend configuration error and clears stale approvers', async () => {
    getRequestApprover.mockRejectedValue(new Error('Phó phòng 0637 không còn hoạt động'));
    await act(async () => root.render(<Provider store={store}><RequestApprovers /></Provider>));
    expect(container.querySelector('[role="alert"]').textContent).toContain('0637');
    expect(store.getState().requestFormData.value.approvers).toEqual([]);
    getRequestApprover.mockResolvedValueOnce([]);
    await act(async () => store.dispatch(fetchRequestApprovers({ requestTypeId: 1, userId: 10 })));
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(store.getState().requestApprover.loadedFor).toEqual({ requestTypeId: 1, userId: 10 });
});
