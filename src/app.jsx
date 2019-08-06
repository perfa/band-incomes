import React from 'react';
import { render } from 'react-dom';

import { Calculator, UnitSalesTable, StreamsTable } from './components';
import { TableData, RowData } from './utilities'

import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const defaults = [
        new TableData(0, 'Apparel', UnitSalesTable, false),
        new TableData(1, 'Music (Physical)', UnitSalesTable, false),
        new TableData(2, 'Music (Streaming)', StreamsTable, false)
    ]
    defaults[0].rows = [ new RowData(0, 'T-shirts', false), new RowData(0, 'Hoodies', false), new RowData(0, 'Trucker Caps', false) ]
    defaults[1].rows = [ new RowData(0, 'CDs', false), new RowData(0, 'Vinyl', false), new RowData(0, 'Cassette', false) ]
    defaults[2].rows = [ new RowData(0, 'Spotify', false), new RowData(0, 'Apple Music', false), new RowData(0, 'Tidal', false) ]
    defaults[2].rows[0].values.rate = 0.006
    defaults[2].rows[1].values.rate = 0.00735
    defaults[2].rows[2].values.rate = 0.01284

    return (
        <div>
            <Calculator categories={defaults}><h2>Merchandise</h2></Calculator>
        </div>
    );
}

const root = document.getElementById('root');

render(<App />, root);