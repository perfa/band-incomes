import React from 'react';
import Popup from 'reactjs-popup';

import { CategoryTable, StreamsTable } from './categorytable.jsx';

import { dollarString, newName } from './utilities.js';


export class RowData {
    constructor(index, name, renaming=true) {
        this.index = index;
        this.name = name;
        this.renaming = renaming;
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

export class TableData {
    constructor(index, name, type, renaming=true) {
        this.index = index;
        this.name = name;
        this.type = type;
        this.renaming = renaming;
        this.rowIndex = 0;
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
            categories: props.categories || [],
            index: 1,
            total: 0
        };
        this.onValueChange = this.onValueChange.bind(this);
        this.addTable = this.addTable.bind(this);
        this.removeTable = this.removeTable.bind(this);
        this.renameTable = this.renameTable.bind(this);
        this.addRow = this.addRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
    }

    addTable(event, type) {
        event.preventDefault();
        var index = this.state.index;
        var newState = {categories: [...this.state.categories]}
        var name = newName(newState.categories.map(t => t.name));
        newState.categories.push(new TableData(index, name, type));
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

    tableCreator(type, close) {
        return event => { this.addTable(event, type); close(); }
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">{this.props.children}</div>
                <div className="card-body">
                        {this.state.categories.map( table => {
                            return React.createElement(table.type, {key: table.name, table: table, rowFuncs: {addRow: this.addRow, removeRow: this.removeRow}, tableFuncs: {removeTable: this.removeTable, renameTable: this.renameTable}, onValueChange: this.onValueChange});
                        })}
                        <div className="calc-footer">
                            <hr/>
                            <Popup
                                trigger={<button className="align-middle">New Category</button>}
                                on="click"
                                position="right center"
                                closeOnDocumentClick
                                closeOnEscape
                                >
                                { close =>
                                <div className="menu">
                                    <div className="menu-item" onClick={this.tableCreator(CategoryTable, close)}> Unit Sales</div>
                                    <div className="menu-item" onClick={this.tableCreator(StreamsTable, close)}> Streaming </div>
                                </div>
                                }
                                </Popup>
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