import React from 'react';
import { render } from 'react-dom';

import { Calculator, UnitSalesTable, StreamsTable } from './components';
import { TableData, RowData } from './utilities'

import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const unitValues = (row, col, val) => {
        row.values[col] = val;
        const { price, cost, units } = row.values;
        const  margin = Math.round(100 * (price - cost)) / 100;

        row.values.margin = margin;
        row.values.total = margin * units;
    }
    const streamValues = (row, col, val) => {
        row.values[col] = val;
        const { streams, rate } = row.values;
        const total = Math.round(100 * (streams * rate)) / 100;

        row.values.total = total
    }
    const defaults = [
        new TableData(0, 'Apparel', UnitSalesTable, false),
        new TableData(1, 'Music (Physical)', UnitSalesTable, false),
        new TableData(2, 'Music (Streaming)', StreamsTable, false)
    ]
    defaults[0].rows = [ new RowData(0, 'T-shirts', false, unitValues), new RowData(1, 'Hoodies', false, unitValues), new RowData(2, 'Trucker Caps', false, unitValues) ]
    defaults[1].rows = [ new RowData(0, 'CDs', false, unitValues), new RowData(1, 'Vinyl', false, unitValues), new RowData(2, 'Cassette', false, unitValues) ]
    defaults[2].rows = [ new RowData(0, 'Spotify', false, streamValues), new RowData(1, 'Apple Music', false, streamValues), new RowData(2, 'Tidal', false, streamValues) ]
    defaults[0].index = 2
    defaults[1].index = 2
    defaults[2].index = 2
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