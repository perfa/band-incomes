import React from 'react';
import { render } from 'react-dom';

import { Calculator } from './calculator.jsx'

import './styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <div>
            <h1>
                Hello World!
            </h1>
            <Calculator><h2>Merchandise</h2></Calculator>
        </div>
    );
};

const root = document.getElementById('root');

render(<App />, root);