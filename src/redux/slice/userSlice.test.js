import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchReportPermissions, setUserInfo } from './userSlice';
import { getRequestReportPermissions } from '../../services/usersService';

jest.mock('../../services/usersService', () => ({
    getMe: jest.fn(),
    getRequestReportPermissions: jest.fn(),
}));

function createStore() {
    const store = configureStore({ reducer: { user: reducer } });
    store.dispatch(setUserInfo({ id: 10, name: 'Người đề nghị', department: 'HC' }));
    return store;
}

afterEach(() => jest.resetAllMocks());

test('loads explicit request backend permission without replacing the login profile', async () => {
    getRequestReportPermissions.mockResolvedValue({ exportFuelPaymentReport: true });
    const store = createStore();
    await store.dispatch(fetchReportPermissions(10));
    expect(store.getState().user.userInfo).toEqual({
        id: 10, name: 'Người đề nghị', department: 'HC', permissions: { exportFuelPaymentReport: true, devFullAccess: false },
    });
});

test('denies additional report access when the request backend rejects the session', async () => {
    getRequestReportPermissions.mockRejectedValue(new Error('Phiên đăng nhập không còn hiệu lực'));
    const store = createStore();
    await store.dispatch(fetchReportPermissions(10));
    expect(store.getState().user.userInfo.permissions.exportFuelPaymentReport).toBe(false);
    expect(store.getState().user.userInfo.name).toBe('Người đề nghị');
    expect(store.getState().user.error).toBeNull();
});

test('does not attach a late permission response to another logged-in user', async () => {
    let resolvePermissions;
    getRequestReportPermissions.mockImplementation(() => new Promise((resolve) => { resolvePermissions = resolve; }));
    const store = createStore();
    const pending = store.dispatch(fetchReportPermissions(10));
    store.dispatch(setUserInfo({ id: 20, name: 'Người khác' }));
    resolvePermissions({ exportFuelPaymentReport: true });
    await pending;
    expect(store.getState().user.userInfo).toEqual({ id: 20, name: 'Người khác' });
});

test('developer capability is loaded from the request backend and revoked on failed reload', async () => {
    getRequestReportPermissions.mockResolvedValue({ devFullAccess: true, exportFuelPaymentReport: true });
    const store = createStore();
    await store.dispatch(fetchReportPermissions(10));
    expect(store.getState().user.userInfo.permissions.devFullAccess).toBe(true);
    getRequestReportPermissions.mockRejectedValue(new Error('Không thể tải quyền'));
    await store.dispatch(fetchReportPermissions(10));
    expect(store.getState().user.userInfo.permissions.devFullAccess).toBe(false);
});
