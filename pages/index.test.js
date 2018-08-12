import { cleanup } from 'react-testing-library';
import renderWithRedux from '../lib/render-with-redux';
import { reducer } from '../lib/init-store';
import Index from '../pages';

describe('Index page tests', () => {
  afterEach(cleanup);

  it('should render', function() {
    const { getByText } = renderWithRedux(<Index />, {
      reducer,
      initialState: {
        auth: {
          user: { username: 'Test' }
        }
      }
    });
    expect(getByText('A dead simple, responsive boilerplate.')).not.toBe(null);
  });
});