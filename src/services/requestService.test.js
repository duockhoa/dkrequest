import axios from './customize-axios';
import { getAllRequestService, getRequestByIdService } from './requestService';
jest.mock('./customize-axios', () => ({ get: jest.fn() }));
afterEach(() => jest.resetAllMocks());
test('list forwards the cancellation signal to Axios', async () => {
    axios.get.mockResolvedValue({ status: 200, data: { result: [] } });
    const signal = new AbortController().signal;
    await getAllRequestService(3, 10, 2, 100, signal);
    expect(axios.get).toHaveBeenCalledWith('/request/getall?requesttypeid=3&userid=10&page=2&pageSize=100', { signal });
});
test('detail forwards the cancellation signal to Axios', async () => {
    axios.get.mockResolvedValue({ status: 200, data: { result: { id: 42 } } });
    const signal = new AbortController().signal;
    expect(await getRequestByIdService(42, signal)).toEqual({ id: 42 });
    expect(axios.get).toHaveBeenCalledWith('/request/getbyid/42', { signal });
});
