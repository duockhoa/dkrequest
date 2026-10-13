import reducer, { fetchRequestApprovers } from './requestApproverSlice';

jest.mock('../../services/requestApproverService', () => ({ getRequestApprover: jest.fn() }));

test('a changed request clears the previous chain and ignores late success and failure', () => {
    const first = { requestTypeId: 1, userId: 10 };
    const second = { requestTypeId: 3, userId: 10 };
    let state = reducer(undefined, fetchRequestApprovers.pending('first', first));
    state = reducer(state, fetchRequestApprovers.fulfilled([{ id: 20, level: 1 }], 'first', first));
    expect(state.loadedFor).toEqual(first);
    state = reducer(state, fetchRequestApprovers.pending('second', second));
    expect(state.approverData).toEqual([]);
    expect(state.loadedFor).toBeNull();
    state = reducer(state, fetchRequestApprovers.fulfilled([{ id: 20, level: 1 }], 'first', first));
    state = reducer(state, fetchRequestApprovers.rejected(new Error('Late failure'), 'first', first));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    state = reducer(state, fetchRequestApprovers.fulfilled([{ id: 63, level: 1 }, { id: 20, level: 2 }], 'second', second));
    expect(state.approverData.map(a => a.id)).toEqual([63, 20]);
    expect(state.loadedFor).toEqual(second);
    expect(state.loading).toBe(false);
});

test('an empty legacy flow is a completed preview rather than a loading failure', () => {
    const args = { requestTypeId: 3, userId: 20 };
    let state = reducer(undefined, fetchRequestApprovers.pending('request', args));
    state = reducer(state, fetchRequestApprovers.fulfilled([], 'request', args));
    expect(state.loadedFor).toEqual(args);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
});
