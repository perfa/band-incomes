import React from 'react';

import { UnitSalesRow, StreamsRow } from './unitsalesrow.jsx';
import { dollarString } from './utilities.js';


export class CategoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renaming: props.table.renaming,
        };
        this.headings = ['Cost', 'Price', 'Margin', 'Units Sold', 'Earnings']
        this.addRow = this.addRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.rename = this.rename.bind(this);
        this.finishRename = this.finishRename.bind(this);
        this.rowFor = this.rowFor.bind(this);
    }

    addRow(event) {
        event.preventDefault();
        this.props.rowFuncs.addRow(this.props.table.index);
    }

    removeRow(index) {
        this.props.rowFuncs.removeRow(this.props.table.index, index);
        this.forceUpdate();
    }

    onRename(event) {
        this.setState({name: event.target.value});
        this.props.tableFuncs.renameTable(this.props.table.index, event.target.value);
    }

    onRemove(event) {
        event.preventDefault();
        this.props.tableFuncs.removeTable(this.props.table.index);
    }

    finishRename(event) {
        if (event.type === "keydown") {
            if (event.key !== "Enter") {
                return true;
            }
            event.preventDefault();
        }
        // Should effectively always be the same value, see onRename above
        var newName = event.target.value;
        this.setState({name: newName, renaming: false});
        this.props.tableFuncs.renameTable(this.props.table.index, newName);
    }

    rename() {
        this.setState({renaming: true});
    }

    rowFor(row) {
        return <UnitSalesRow key={row.name} row={row} removeRow={this.removeRow} onValueChange={(rowIndex, e) => this.props.onValueChange(this.props.table.index, rowIndex, e)}></UnitSalesRow>;
    }

    render() {
        return (
            <div key={this.props.table.name} className="tablecontainer">
            <table className="table">
                <thead>
                    <tr>
                        <th className="tablename" scope="col">
                            <button type="button" className="close" aria-label="remove"><span onClick={this.onRemove} aria-hidden="true">&times;</span></button>
                            {
                            this.state.renaming
                            ?
                            <input type="text" value={this.props.table.name} onChange={this.onRename} onBlur={this.finishRename} onKeyDown={this.finishRename} autoFocus></input>
                            :
                            <span onClick={this.rename}>{this.props.table.name}</span>
                            }
                        </th>
                        {this.headings.map(hdg => <th key={hdg} scope="col">{hdg}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.props.table.rows.map(row => {
                        return this.rowFor(row);
                    })}
                </tbody>
            </table>
            <div>
                <button className="add-button" onClick={this.addRow}>+</button>
                <div className="float-right">
                    <span>Sub-Total:</span>
                    <h5>${dollarString(this.props.table.total())}</h5>
                </div>
            </div>
        </div>
        );
    }
}


export class StreamsTable extends CategoryTable {
    constructor(props) {
        super(props);
        this.headings = ['Streams', 'Rate', 'Earnings'];
    }

    rowFor(row) {
        return <StreamsRow key={row.name} row={row} removeRow={this.removeRow} onValueChange={(rowIndex, e) => this.props.onValueChange(this.props.table.index, rowIndex, e)}></StreamsRow>;
    }
}