import { cleanup, fireEvent, render } from "@testing-library/react";
import TestEvents from "./TestEvent";

afterEach(cleanup)

it('should 1', () => {
  const {getByTestId} = render(<TestEvents />)
  fireEvent.click(getByTestId('button-up'))

  expect(getByTestId('counter')).toHaveTextContent('1')
})

it('should 2', () => {
  const {getByTestId} = render(<TestEvents />)
  fireEvent.click(getByTestId('button-down'))

  expect(getByTestId('counter')).toHaveTextContent('-1')
})

