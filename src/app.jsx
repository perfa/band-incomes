import React from 'react';
import { render } from 'react-dom';

import { Tables, AddTables, GrandTotal } from './components';
import { MonthlyContextProvider } from './contexts';

import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <div style={{margin:'15px', padding:'10px'}}>
            <h2>Monthly Incomes <small className="text-muted">Recurring sales and income streams</small></h2>
            <div>
                <MonthlyContextProvider>
                    <Tables/>
                    <hr/>
                    <AddTables/>
                    <GrandTotal/>
                </MonthlyContextProvider>
            </div>
        </div>
    );
}

const root = document.getElementById('root');
render(<App />, root);