import React from 'react';
import { dollarString } from './utilities.js';


export class UnitSalesRow extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onRename = this.onRename.bind(this);
        this.startRename = this.startRename.bind(this);
        this.finishRename = this.finishRename.bind(this);
        this.state = {
            renaming: true,
            item: props.item,
            values: {cost: 0, price: 0, margin: 0, units: 0, total: 0},
        };
    }

    onChange(col, event) {
        var newState = {values: Object.assign({}, this.state.values)};
        newState.values[col] = event.target.value;
        
        var { price, cost, units } = newState.values;
        var margin = Math.round(100 * (price - cost)) / 100;
        newState.values.total = margin * units;
        newState.values.margin = margin;

        this.props.onValueChange(this.state.item, newState.values.total);
        this.setState(newState);
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
        var item = this.state.item;
        var { cost, price, margin, units, total } = this.state.values;
        margin = dollarString(margin);
        cost = dollarString(cost);
        price = dollarString(price);
        total = dollarString(total);

        return (
        <tr key={item}>
            <th scope="col">
                {this.state.renaming 
                ?
                <input type="text" value={item} onChange={this.onRename} onBlur={this.finishRename} onKeyDown={this.finishRename} autoFocus></input>
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