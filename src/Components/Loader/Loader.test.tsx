import React from 'react';
import Loader from './Loader';
import { render } from '@testing-library/react';

describe('Loader Component', () => {
    it('Should render properly', () => {

       const {container} = render(<Loader />);
        
        expect(container.querySelector('svg')).toBeInTheDocument();
        
        });

});

