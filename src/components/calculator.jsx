import React from 'react';
import Popup from 'reactjs-popup';

import { UnitSalesTable, StreamsTable } from '.';
import { dollarString, newName, TableData } from '../utilities';


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
        const newState = {categories: [...this.state.categories]}
        const name = newName(newState.categories.map(t => t.name));
        newState.categories.push(new TableData(index, name, type));
        newState.index = ++index;
        this.setState(newState);
    }

    removeTable(index) {
        const newState = {categories: [...this.state.categories]}
        newState.categories = newState.categories.filter(t => t.index !== index)
        newState.total = newState.categories.reduce((acc, t) => acc + t.total(), 0);
        this.setState(newState);
    }

    renameTable(index, newName) {
        const newState = {categories: [...this.state.categories]}
        const table = newState.categories.find(t => t.index === index);
        table.rename(newName);
        this.setState(newState);
    }

    addRow(index) {
        const newState = {categories: [...this.state.categories]}
        const table = newState.categories.find(t => t.index === index);
        table.addRow()

        this.setState(newState);
    }

    removeRow(index, rowIndex) {
        const newState = {categories: [...this.state.categories]}
        const table = newState.categories.find(t => t.index === index);
        table.removeRow(rowIndex);
        newState.total = newState.categories.reduce((acc, t) => acc + t.total(), 0);

        this.setState(newState);
    }

    onValueChange(index, rowIndex, value) {
        const newState = {categories: [...this.state.categories]}
        const table = newState.categories.find(t => t.index === index);
        const row = table.rows.find(r => r.index === rowIndex);
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
                                    <div className="menu-item" onClick={this.tableCreator(UnitSalesTable, close)}> Unit Sales</div>
                                    <div className="menu-item" onClick={this.tableCreator(StreamsTable, close)}> Streaming </div>
                                </div>
                                }
                                </Popup>
                            <div className="float-right">
                                    <span><em>Total:</em>
                                    <h5>${dollarString(this.state.total)}</h5></span>
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}