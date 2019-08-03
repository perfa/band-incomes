import React from 'react';

import { UnitSalesRow } from './unitsalesrow.jsx';

import { newName } from './utilities.js';


export class CategoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            values: props.values,
            renaming: true
        };
        this.headings = ['Cost', 'Price', 'Margin', 'Units Sold', 'Earnings']
        this.addRow = this.addRow.bind(this);
        this.onRename = this.onRename.bind(this);
        this.rename = this.rename.bind(this);
        this.finishRename = this.finishRename.bind(this);
    }

    addRow(event) {
        event.preventDefault();
        this.state.values.push(newName(this.state.values));
        this.setState(this.state);
    }

    onRename(event) {
        this.setState({name: event.target.value});
    }

    finishRename(event) {
        if (event.type === "keydown") {
            if (event.key !== "Enter") {
                return true;
            }
            event.preventDefault();
        }

        this.setState({name: event.target.value, renaming: false});
        return;
    }

    rename() {
        this.setState({renaming: true});
    }

    render() {
        return (
            <div key={this.state.name} className="tablecontainer">
            <table className="table">
                <thead>
                    <tr>
                        <th className="tablename" scope="col">{
                            this.state.renaming
                            ?
                            <input type="text" value={this.state.name} onChange={this.onRename} onBlur={this.finishRename} onKeyDown={this.finishRename} autoFocus></input>
                            :
                            <span onClick={this.rename}>{this.state.name}</span>
                            }
                        </th>
                        {this.headings.map(hdg => <th key={hdg} scope="col">{hdg}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.state.values.map(item => {
                        return <UnitSalesRow key={item} item={item} onValueChange={(item, e) => this.props.onValueChange(this.state.name, item, e)}></UnitSalesRow>;
                    })}
                </tbody>
            </table>
            <div>
                <button onClick={this.addRow}>+</button>
            </div>
        </div>
        );
    }
}