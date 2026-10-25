import { configureStore } from '@reduxjs/toolkit';
import requestReducer, { fetchRequests } from './requestSlice';
import detailReducer, { fetchRequestDetail } from './requestDetailSlice';
import typesReducer, { fetchRequestTypes } from './requestTypesSlice';
import departmentReducer, { fetchDepartments } from './departmentSlice';
import { getAllRequestService, getRequestByIdService } from '../../services/requestService';
import { getAllRequestTypeService } from '../../services/requestTypeService';
import { getDepartmentsServiceInclude } from '../../services/departmentService';

jest.mock('../../services/requestService', () => ({ getAllRequestService: jest.fn(), getRequestByIdService: jest.fn() }));
jest.mock('../../services/requestTypeService', () => ({ getAllRequestTypeService: jest.fn() }));
jest.mock('../../services/departmentService', () => ({ getDepartmentsServiceInclude: jest.fn() }));

const makeStore = () => configureStore({ reducer: { request: requestReducer, requestDetail: detailReducer, requestTypes: typesReducer, department: departmentReducer } });
const args = { requestTypeId: 3, user_id: 10, page: 1, pageSize: 100 };
const result = id => ({ result: [{ id }], pagination: { page: 1, total: 1, totalPages: 1 } });
const deferred = () => { let resolve; let reject; const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; }); return { promise, resolve, reject }; };
afterEach(() => jest.resetAllMocks());

test('late list response cannot replace the newest page or its pagination', async () => {
    const first = deferred();
    getAllRequestService.mockReturnValueOnce(first.promise).mockResolvedValueOnce(result(20));
    const store = makeStore();
    const old = store.dispatch(fetchRequests(args));
    await store.dispatch(fetchRequests({ ...args, requestTypeId: 4 }));
    first.resolve(result(10));
    await old;
    expect(store.getState().request.originalData).toEqual([{ id: 20 }]);
    expect(store.getState().request.listRequestTypeId).toBe(4);
    expect(store.getState().request.loading).toBe(false);
});

test('late failure cannot stop the loading state for a newer list', async () => {
    const first = deferred(); const second = deferred();
    getAllRequestService.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const store = makeStore();
    const old = store.dispatch(fetchRequests(args));
    const current = store.dispatch(fetchRequests({ ...args, page: 2 }));
    first.reject(new Error('old failure')); await old;
    expect(store.getState().request.loading).toBe(true);
    expect(store.getState().request.error).toBeNull();
    second.resolve(result(20)); await current;
});

test('aborting a list propagates its signal and does not display an API error', async () => {
    getAllRequestService.mockReturnValue(new Promise(() => {}));
    const store = makeStore();
    const pending = store.dispatch(fetchRequests(args));
    const signal = getAllRequestService.mock.calls[0][4];
    pending.abort(); await pending;
    expect(signal.aborted).toBe(true);
    expect(store.getState().request.error).toBeNull();
    expect(store.getState().request.loading).toBe(false);
});

test('late detail response cannot replace the newly opened request', async () => {
    const oldDetail = deferred();
    getRequestByIdService.mockReturnValueOnce(oldDetail.promise).mockResolvedValueOnce({ id: 2 });
    const store = makeStore();
    const old = store.dispatch(fetchRequestDetail(1));
    await store.dispatch(fetchRequestDetail(2));
    oldDetail.resolve({ id: 1 }); await old;
    expect(store.getState().requestDetail.requestDetailvalue.id).toBe(2);
});

test('clearing detail prevents an in-flight response from restoring a closed request', async () => {
    const detail = deferred();
    getRequestByIdService.mockReturnValueOnce(detail.promise);
    const store = makeStore();
    const pending = store.dispatch(fetchRequestDetail(1));
    store.dispatch({ type: 'requestDetail/clearRequestDetail' });
    detail.resolve({ id: 1 }); await pending;
    expect(store.getState().requestDetail.requestDetailvalue).toEqual({});
});

test('metadata shares in-flight requests and uses the five-minute cache', async () => {
    const types = deferred();
    getAllRequestTypeService.mockReturnValue(types.promise);
    const store = makeStore();
    const pending = store.dispatch(fetchRequestTypes());
    await store.dispatch(fetchRequestTypes());
    expect(getAllRequestTypeService).toHaveBeenCalledTimes(1);
    types.resolve([{ id: 3, path: '/leave-request' }]); await pending;
    await store.dispatch(fetchRequestTypes());
    expect(getAllRequestTypeService).toHaveBeenCalledTimes(1);
    const now = jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 5 * 60 * 1000 + 1);
    try { await store.dispatch(fetchRequestTypes()); }
    finally { now.mockRestore(); }
    expect(getAllRequestTypeService).toHaveBeenCalledTimes(2);
});

test('failed metadata requests can be retried immediately', async () => {
    getAllRequestTypeService.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([{ id: 3 }]);
    const store = makeStore();
    await store.dispatch(fetchRequestTypes());
    await store.dispatch(fetchRequestTypes());
    expect(store.getState().requestTypes.data).toEqual([{ id: 3 }]);
    expect(store.getState().requestTypes.error).toBeNull();
});

test('sidebar metadata is reused across remounts', async () => {
    getDepartmentsServiceInclude.mockResolvedValue([{ departmentName: 'HC', requestTypes: [] }]);
    const store = makeStore();
    await store.dispatch(fetchDepartments());
    await store.dispatch(fetchDepartments());
    expect(getDepartmentsServiceInclude).toHaveBeenCalledTimes(1);
});
