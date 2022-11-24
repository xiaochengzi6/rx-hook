import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

afterEach(cleanup)

test('renders learn react link', () => {
  const {debug,asFragment } = render(<App />);
  expect(debug).toMatchSnapshot()
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
