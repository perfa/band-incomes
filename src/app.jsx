import React from 'react';
import { render } from 'react-dom';

import { Example, Example2 } from './components';

import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div style={{margin:'15px', padding:'10px'}}>
            <h2>Monthly Incomes <small className="text-muted">Recurring sales and income streams</small></h2>
            <div>
                <Example></Example>
                <Example2></Example2>
            </div>
        </div>
    );
}

const root = document.getElementById('root');

render(<App />, root);