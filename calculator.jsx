import React from 'react';

import { CategoryTable } from './categorytable.jsx';

import { dollarString, newName } from './utilities.js';


class RowData {
    constructor(index, name) {
        this.index = index;
        this.name = name;
        this.values = {}
    }

    rename(newName) {
        this.name = newName;
    }

    updateValue(name, value) {
        this.values[name] = value;
    }

    total() {
        if ('total' in this.values) {
            return this.values.total;
        }
        return 0;
    }
}

class TableData {
    constructor(index, name) {
        this.index = index;
        this.rowIndex = 0;
        this.name = name;
        this.rows = [];
    }

    rename(newName) {
        this.name = newName;
    }

    addRow() {
        var name = newName(this.rows.map(r => r.name));
        this.rows.push(new RowData(this.rowIndex++, name))
    }

    removeRow(index) {
        this.rows = this.rows.filter(r => r.index !== index);
    }

    total() {
        return this.rows.reduce((acc, val) => acc + val.total(), 0);
    }
}


export class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            categories: [new TableData(0, 'Apparel')],
            total: 0
        };
        this.onValueChange = this.onValueChange.bind(this);
        this.addTable = this.addTable.bind(this);
        this.removeTable = this.removeTable.bind(this);
        this.renameTable = this.renameTable.bind(this);
        this.addRow = this.addRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
    }

    addTable(event) {
        event.preventDefault();
        var index = this.state.index;
        var newState = {categories: [...this.state.categories]}
        var name = newName(newState.categories.map(t => t.name));
        newState.categories.push(new TableData(index, name));
        newState.index = ++index;
        this.setState(newState);
    }

    removeTable(index) {
        var newState = {categories: [...this.state.categories]}
        newState.categories = newState.categories.filter(t => t.index !== index)
        newState.total = newState.categories.reduce((acc, t) => acc + t.total(), 0);
        this.setState(newState);
    }

    renameTable(index, newName) {
        var newState = {categories: [...this.state.categories]}
        var table = newState.categories.find(t => t.index === index);
        table.rename(newName);
        this.setState(newState);
    }

    addRow(index) {
        var newState = {categories: [...this.state.categories]}
        var table = newState.categories.find(t => t.index === index);
        table.addRow()

        this.setState(newState);
    }

    removeRow(index, rowIndex) {
        var newState = {categories: [...this.state.categories]}
        var table = newState.categories.find(t => t.index === index);
        table.removeRow(rowIndex);
        newState.total = newState.categories.reduce((acc, t) => acc + t.total(), 0);

        this.setState(newState);
    }

    onValueChange(index, rowIndex, value) {
        var newState = {categories: [...this.state.categories]}
        var table = newState.categories.find(t => t.index === index);
        var row = table.rows.find(r => r.index === rowIndex);
        row.updateValue(value);

        newState.total = this.state.categories.reduce((acc, t) => acc + t.total(), 0);

        this.setState(newState);
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">{this.props.children}</div>
                <div className="card-body">
                        {this.state.categories.map( table => {
                            return <CategoryTable key={table.name} table={table} rowFuncs={{addRow: this.addRow, removeRow: this.removeRow}} tableFuncs={{removeTable: this.removeTable, renameTable: this.renameTable}} onValueChange={this.onValueChange}></CategoryTable>
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