import React from 'react';
import { render } from 'react-dom';

import { Example, Example2 } from './components';

import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <div style={{margin:'auto', padding:'10px'}}>
            <Example></Example>
            <Example2></Example2>
        </div>
    );
}

const root = document.getElementById('root');

render(<App />, root);