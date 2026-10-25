import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CommentForm from './index';
import RequestFollowers from '../RequestFollowers';
import usersReducer from '../../../redux/slice/usersSlice';
import followerReducer from '../../../redux/slice/requestFollowerSlice';
import formReducer from '../../../redux/slice/requestFormDataSlice';
import { getAllUsersService } from '../../../services/usersService';
import { getRequestFollower } from '../../../services/requestFollowerService';
import comments, { fetchComments } from '../../../redux/slice/commentSlice';
import { getCommentsByRequestIdService, createCommentService } from '../../../services/commentService';
jest.mock('../../../services/commentService', () => ({ getCommentsByRequestIdService: jest.fn(), createCommentService: jest.fn() }));
jest.mock('../../../services/requestService', () => ({ createRequestService: jest.fn() }));
jest.mock('../../../services/usersService', () => ({ getAllUsersService: jest.fn() }));
jest.mock('../../../services/requestFollowerService', () => ({ getRequestFollower: jest.fn() }));
global.IS_REACT_ACT_ENVIRONMENT = true;
let container; let root; let store;
beforeEach(async () => {
    container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
    store = configureStore({ reducer: { comment: comments, requestId: () => ({ requestId: 1 }), user: () => ({ userInfo: { id: 10 } }) } });
    getCommentsByRequestIdService.mockResolvedValue([]); await store.dispatch(fetchComments(1));
    act(() => root.render(<Provider store={store}><CommentForm /></Provider>));
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.resetAllMocks(); });
test('the draft and attachments survive a failed submission and duplicate clicks issue one request', async () => {
    let reject;
    createCommentService.mockReturnValue(new Promise((resolve, fail) => { reject = fail; }));
    const textarea = container.querySelector('textarea');
    act(() => Simulate.change(textarea, { target: { value: 'Giữ nội dung này', selectionStart: 4 } }));
    act(() => Simulate.change(container.querySelector('input[type="file"]'), { target: { files: [new File(['test'], 'draft.txt')] } }));
    const send = container.querySelector('[aria-label="Gửi bình luận"]');
    await act(async () => { send.click(); send.click(); });
    expect(createCommentService).toHaveBeenCalledTimes(1);
    expect(textarea.value).toBe('Giữ nội dung này');
    expect(container.querySelector('[aria-label="Đang gửi bình luận"]').disabled).toBe(true);
    await act(async () => reject(new Error('Không thể kết nối')));
    expect(container.querySelector('textarea').value).toBe('Giữ nội dung này');
    expect(container.textContent).toContain('draft.txt');
    expect(container.querySelector('[aria-label="Gửi bình luận"]').disabled).toBe(false);
    createCommentService.mockResolvedValueOnce({ id: 1, request_id: 1 });
    await act(async () => container.querySelector('[aria-label="Gửi bình luận"]').click());
    expect(createCommentService.mock.calls[1][0].getAll('files')[0].name).toBe('draft.txt');
    expect(container.querySelector('textarea').value).toBe('');
    expect(container.textContent).not.toContain('draft.txt');
});

test('loading the user directory does not fetch default followers a second time', async () => {
    getAllUsersService.mockResolvedValue([{ id: 10, name: 'Test' }]);
    getRequestFollower.mockResolvedValue([]);
    const followerStore = configureStore({ reducer: {
        users: usersReducer, requestFollower: followerReducer, requestFormData: formReducer,
        requestId: () => ({ requestTypeId: 3 }), user: () => ({ userInfo: { id: 10 } }),
    } });
    await act(async () => root.render(<Provider store={followerStore}><RequestFollowers /></Provider>));
    expect(getAllUsersService).toHaveBeenCalledTimes(1);
    expect(getRequestFollower).toHaveBeenCalledTimes(1);
    expect(followerStore.getState().users.users).toHaveLength(1);
});
