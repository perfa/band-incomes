import React from 'react';
import { render } from 'react-dom';
import './styles/index.scss';

function App() {
    return (
        <div>
            <h1>
                Hello World!
            </h1>
        </div>
    );
};

const root = document.getElementById('root');

render(<App />, root);