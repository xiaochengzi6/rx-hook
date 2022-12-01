import { render, screen } from '@testing-library/react';
import GetLabelTextComponent from './GetLabelTextComponent';


beforeEach(()=> {
  render(<GetLabelTextComponent />)
})

  it('te:', () => {
   

    const value = screen.getByDisplayValue('Alaska')
    
    console.log('value: ', value.textContent)
  })

// console.log('value', value)
    // expect(value.textContent).toBe('Alaska')
    // console.log('value: ', value && value.textContent)