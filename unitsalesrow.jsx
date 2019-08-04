import React from 'react';
import { dollarString } from './utilities.js';


export class UnitSalesRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renaming: true
        };
        props.row.values = {cost: 0, price: 0, margin: 0, units: 0, total: 0}

        this.onRemove = this.onRemove.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onRename = this.onRename.bind(this);
        this.startRename = this.startRename.bind(this);
        this.finishRename = this.finishRename.bind(this);
    }

    onRemove(event) {
        event.preventDefault();
        this.props.removeRow(this.props.row.index);
    }

    onChange(col, event) {
        this.props.row.updateValue(col, event.target.value);
        
        var { price, cost, units } = this.props.row.values;
        var margin = Math.round(100 * (price - cost)) / 100;
        this.props.row.updateValue('total', margin * units);
        this.props.row.updateValue('margin', margin);

        this.props.onValueChange(this.props.row.index, this.props.row.values.total);
        this.setState();
    }
    
    onRename(event) {
        this.setState({item: event.target.value});
    }

    finishRename(event) {
        if (event.type === "keydown") {
            if (event.key !== "Enter") {
                return true;
            }
            event.preventDefault();
        }

        this.setState({item: event.target.value, renaming: false});
        return;
    }

    startRename() {
        this.setState({renaming: true});
    }

    render() {
        var item = this.props.row.name;
        var { cost, price, margin, units, total } = this.props.row.values;
        margin = dollarString(margin);
        cost = dollarString(cost);
        price = dollarString(price);
        total = dollarString(total);

        return (
        <tr key={item}>
            <th scope="col">
                <button type="button" className="close" aria-label="remove"><span onClick={this.onRemove} aria-hidden="true">&times;</span></button>
                {this.state.renaming 
                ?
                <input type="text" className="namefield" value={item} onChange={this.onRename} onBlur={this.finishRename} onKeyDown={this.finishRename} autoFocus></input>
                :
                <span onClick={this.startRename}>{item}</span>
                }
            </th>
            <td key={`${item}cost`}>
                $<input className="valuefield" type="number" name="cost" min="0" step="0.01" defaultValue={cost} onChange={e => this.onChange('cost', e)}>
                </input>
            </td>
            <td key={`${item}price`}>
                $<input className="valuefield" type="number" name="price" min="0" step="0.01" defaultValue={price} onChange={e => this.onChange('price', e)}>
                </input>
            </td>
            <td key={`${item}margin`}>${margin}</td>
            <td key={`${item}units`}>
                <input className="valuefield" type="number" name="units" min="0" step="1" defaultValue={units} onChange={e => this.onChange('units', e)}>
                </input>
            </td>
            <td key={`${item}total`}>${total}</td>
        </tr>
        );
    }
}