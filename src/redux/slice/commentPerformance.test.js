import { configureStore } from '@reduxjs/toolkit';
import comments, { fetchComments, createComment, clearComments } from './commentSlice';
import users, { fetchUsers } from './usersSlice';
import { getCommentsByRequestIdService, createCommentService } from '../../services/commentService';
import { getAllUsersService } from '../../services/usersService';
jest.mock('../../services/commentService', () => ({ getCommentsByRequestIdService: jest.fn(), createCommentService: jest.fn() }));
jest.mock('../../services/usersService', () => ({ getAllUsersService: jest.fn() }));
const makeStore = () => configureStore({ reducer: { comment: comments, users } });
const deferred = () => { let resolve; let reject; const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; }); return { promise, resolve, reject }; };
const payload = id => { const data = new FormData(); data.append('request_id', id); return data; };
afterEach(() => jest.resetAllMocks());

test('switching requests ignores late comment reads', async () => {
    const first = deferred();
    getCommentsByRequestIdService.mockReturnValueOnce(first.promise).mockResolvedValueOnce([{ id: 2 }]);
    const store = makeStore(); const old = store.dispatch(fetchComments(1));
    await store.dispatch(fetchComments(2)); first.resolve([{ id: 1 }]); await old;
    expect(store.getState().comment.comments).toEqual([{ id: 2 }]);
});
test('canceling comment reads aborts HTTP and clears loading without an error', async () => {
    getCommentsByRequestIdService.mockReturnValue(new Promise(() => {}));
    const store = makeStore(); const pending = store.dispatch(fetchComments(1));
    const signal = getCommentsByRequestIdService.mock.calls[0][1];
    pending.abort(); await pending;
    expect(signal.aborted).toBe(true);
    expect(store.getState().comment.loading).toBe(false);
    expect(store.getState().comment.error).toBeNull();
});
test('posting uses a separate submitting flag and does not hide existing comments', async () => {
    getCommentsByRequestIdService.mockResolvedValue([{ id: 1, request_id: 1 }]);
    const post = deferred(); createCommentService.mockReturnValue(post.promise);
    const store = makeStore(); await store.dispatch(fetchComments(1));
    const pending = store.dispatch(createComment(payload(1)));
    expect(store.getState().comment.loading).toBe(false);
    expect(store.getState().comment.submitting).toBe(true);
    expect(store.getState().comment.comments).toHaveLength(1);
    post.resolve({ id: 2, request_id: 1 }); await pending;
    expect(store.getState().comment.comments).toHaveLength(2);
    expect(store.getState().comment.submitting).toBe(false);
});
test('late post responses do not appear in another request after navigation', async () => {
    getCommentsByRequestIdService.mockResolvedValue([]);
    const post = deferred(); createCommentService.mockReturnValue(post.promise);
    const store = makeStore(); await store.dispatch(fetchComments(1));
    const pending = store.dispatch(createComment(payload(1)));
    store.dispatch(clearComments()); await store.dispatch(fetchComments(2));
    post.resolve({ id: 1, request_id: 1 }); await pending;
    expect(store.getState().comment.requestId).toBe(2);
    expect(store.getState().comment.comments).toEqual([]);
});
test('a GET started before a successful POST does not erase or duplicate the newly posted comment', async () => {
    const get = deferred(); getCommentsByRequestIdService.mockReturnValue(get.promise);
    createCommentService.mockResolvedValue({ id: 2, request_id: 1 });
    const store = makeStore(); const pending = store.dispatch(fetchComments(1));
    await store.dispatch(createComment(payload(1)));
    get.resolve([{ id: 1, request_id: 1 }]); await pending;
    expect(store.getState().comment.comments.map(item => item.id)).toEqual([1, 2]);
    getCommentsByRequestIdService.mockResolvedValue([{ id: 1, request_id: 1 }, { id: 2, request_id: 1 }]);
    await store.dispatch(fetchComments(1)); await store.dispatch(createComment(payload(1)));
    expect(store.getState().comment.comments.map(item => item.id)).toEqual([1, 2]);
});
test('multiple forms share a pending user directory request and reuse the cached result', async () => {
    const get = deferred(); getAllUsersService.mockReturnValue(get.promise);
    const store = makeStore(); const pending = store.dispatch(fetchUsers());
    await store.dispatch(fetchUsers()); expect(getAllUsersService).toHaveBeenCalledTimes(1);
    get.resolve([{ id: 10 }]); await pending; await store.dispatch(fetchUsers());
    expect(getAllUsersService).toHaveBeenCalledTimes(1);
    expect(store.getState().users.users).toEqual([{ id: 10 }]);
});
test('user directory errors can be retried without waiting for cache expiration', async () => {
    getAllUsersService.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([]);
    const store = makeStore(); await store.dispatch(fetchUsers()); await store.dispatch(fetchUsers());
    expect(getAllUsersService).toHaveBeenCalledTimes(2);
    expect(store.getState().users.error).toBeNull();
});

test('the user directory refreshes when the five-minute cache expires', async () => {
    getAllUsersService.mockResolvedValue([]);
    const store = makeStore(); await store.dispatch(fetchUsers());
    const clock = jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 5 * 60 * 1000 + 1);
    try { await store.dispatch(fetchUsers()); } finally { clock.mockRestore(); }
    expect(getAllUsersService).toHaveBeenCalledTimes(2);
});
