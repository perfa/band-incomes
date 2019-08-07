import React from 'react';

import { Row } from '.';
import { dollarString } from '../utilities';


export class CategoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renaming: props.table.renaming,
        };
        this.headings = ['To', 'Be', 'Done']
        this.onRename = this.onRename.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.rename = this.rename.bind(this);
        this.finishRename = this.finishRename.bind(this);
        this.rowFor = this.rowFor.bind(this);
    }

    onRename(event) {
        this.setState({name: event.target.value});
        this.props.renameTable(this.props.table.index, event.target.value);
    }

    onRemove(event) {
        event.preventDefault();
        this.props.removeTable(this.props.table.index);
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
        this.props.renameTable(this.props.table.index, newName);
    }

    rename() {
        this.setState({renaming: true});
    }

    rowFor(row) {
        return <tr><td>{row.name}</td><td>-</td><td>-</td></tr>;
    }

    render() {
        const { table } = this.props;
        return (
            <div key={table.name} className="tablecontainer">
            <table className="table">
                <thead>
                    <tr>
                        <th className="tablename" scope="col">
                            <button type="button" className="close" aria-label="remove"><span onClick={e => this.props.removeTable(this.props.table.index)} aria-hidden="true">&times;</span></button>
                            {
                            this.state.renaming
                            ?
                            <input type="text" value={table.name} onChange={this.onRename} onBlur={this.finishRename} onKeyDown={this.finishRename} autoFocus></input>
                            :
                            <span onClick={this.rename}>{table.name}</span>
                            }
                        </th>
                        {this.headings.map(hdg => <th key={hdg} scope="col">{hdg}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map(row => {
                        return this.rowFor(row);
                    })}
                </tbody>
            </table>
            <div>
                <button className="add-button" onClick={e => this.props.addRow(this.props.table.index)}>&#65291;</button>
                <div className="float-right">
                    <span>Sub-Total:</span>
                    <h5>${dollarString(table.total())}</h5>
                </div>
            </div>
        </div>
        );
    }
}


export class UnitSalesTable extends CategoryTable {
    constructor(props) {
        super(props);
        this.headings = ['Cost', 'Price', 'Margin', 'Units Sold', 'Earnings']
        this.onValue = this.onValue.bind(this);
    }

    onValue(name, col, value) {
        const row = this.props.table.rows.filter((r) => r.name === name)[0];
        this.props.onValueChange(row, col, value);
    }

    rowFor(row) {
        if(Object.keys(row.values).length == 0 )
            row.values = {cost:0, price: 0, margin: NaN, units:0, total:NaN}
        const values = Object.entries(row.values).reduce((list, obj) => {
            const [col, val] = obj;
            list.push({column: col, value: isNaN(val) ? 0 : val, editable: col !== "margin" && col !== "total"})
            return list;
        }, [])

        return <Row
                key={row.name}
                name={row.name}
                values={values}
                row={row}
                {...this.props}
               />;
    }
}

export class StreamsTable extends CategoryTable {
    constructor(props) {
        super(props);
        this.headings = ['Streams', 'Rate', 'Earnings'];
    }

    rowFor(row) {
        if(Object.keys(row.values).length == 1 )
            row.values = {streams: 0, ...row.values, total: NaN}
        const values = Object.entries(row.values).reduce((list, obj) => {
            const [col, val] = obj;
            list.push({column: col, value: isNaN(val) ? 0 : val, editable: col !== "rate" && col !== "total"})
            return list;
        }, [])

        return <Row
                key={row.name}
                name={row.name}
                values={values}
                row={row}
                {...this.props}
                />;
    }
}