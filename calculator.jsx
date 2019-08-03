import React from 'react';

import { CategoryTable } from './categorytable.jsx';

import { dollarString, newName } from './utilities.js';


export class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: {
                'Apparel': []
            },
            values: {'Apparel': {}},
            total: 0
        };
        this.onValueChange = this.onValueChange.bind(this);
        this.addTable = this.addTable.bind(this);
    }

    addTable(event) {
        event.preventDefault();
        var newState = {
            categories: Object.assign({}, this.state.categories),
            values: Object.assign({}, this.state.values)
        }
        var name = newName(Object.keys(newState.categories));
        newState.categories[name] = [];
        newState.values[name] = {};
        this.setState(newState);
    }

    onValueChange(name, item, value) {
        var newState = {values: Object.assign({}, this.state.values)};
        newState.values[name][item] = value;
        newState.total = Object.values(newState.values).reduce(
            (a1, rowValues) => Object.values(rowValues).reduce(
                (a2, rowValue) => a2 + rowValue, 
                0) + a1, 
            0);
        this.setState(newState);
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">{this.props.children}</div>
                <div className="card-body">
                        {Object.entries(this.state.categories).map( keyval => {
                            var [ name, values ] = keyval;
                            return <CategoryTable key={name} name={name} values={values} onValueChange={this.onValueChange}></CategoryTable>
                        })}
                        <div className="calc-footer">
                            <hr/>
                            <button className="align-middle" onClick={this.addTable}>New Category</button>
                            <div className="float-right">
                                    <span>Total:</span>
                                    <h5>${dollarString(this.state.total)}</h5>
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}