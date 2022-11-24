import { cleanup, render } from "@testing-library/react";
import TestElement from './TestElement'
afterEach(cleanup)

it('should 1', () => {
  const { getByTestId } = render(<TestElement />)
  expect(getByTestId('counter')).toHaveTextContent('0')
})

it('should 2', () => {
  const {getByTestId} = render(<TestElement />)
  expect(getByTestId('button-up')).not.toHaveTextContent('disabled')
})

it('should 3', () => {
  const { getByTestId } = render(<TestElement />)
  expect(getByTestId('button-down')).toBeDisabled()
})