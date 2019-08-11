import React, { useState } from 'react'
import { dollarString, newName } from '../utilities'

const selectAll = e => e.target.select();
const inReverse = (a, b) => b < a ? -1 : b > a ? 1 : 0
const byId = (a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0
const spotifyRate = 0.006
const appleRate = 0.00735
const tidalRate = 0.012840


export const DollarInput = (props) => (
    <span className="dollarvalue">
    <input
            className='valuefield'
        type="number"
        name={props.name}
        min="0"
        step={props.fullValue ? ".00001" : "0.01"}
        defaultValue={props.fullValue ? props.value : dollarString(props.value)}
        onChange={e => props.onChange(e.target.name, e.target.value, props.id)}
        onFocus={selectAll}
        />
    </span>)

export const UnitInput = (props) => (
    <span>
    <input
        className="valuefield"
        type="number"
        name={props.name}
        min="0"
        step="1"
        defaultValue={props.value}
        onChange={e => props.onChange(e.target.name, e.target.value, props.id)}
        onFocus={selectAll}
        />
    </span>)

export const DollarOutput = (props) => <span className="dollarvalue">{dollarString(props.value)}</span>

export const EditableValue = (props) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(props.value)

    return (editing
            ?
            <span className="dollarvalue">
                <input
                    className="valuefield"
                    type="number"
                    name={props.name}
                    min="0"
                    step=".00001"
                    defaultValue={value}
                    onChange={e => setValue(e.target.value)}
                    onBlur={(e) => {props.onChange(e.target.name, e.target.value, props.id); setEditing(false)}}
                    onKeyDown={e => {if(e.key + e.type === 'Enterkeydown') { props.onChange(e.target.name, e.target.value, props.id); setEditing(false)}}}
                    onFocus={selectAll}
                />
            </span>
            :
            <span onClick={() => setEditing(true)}>${props.value}</span>
        )

}
export const EditableName = (props) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(props.name)

    return (editing
            ?
            <input
                type="text"
                className="namefield"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={(e) => {props.onChange(e.target.value, props.id); setEditing(false)}}
                onKeyDown={e => {if(e.key + e.type === 'Enterkeydown') { props.onChange(e.target.value, props.id); setEditing(false)}}}
                autoFocus
            ></input>
            :
            <span onClick={() => setEditing(true)}>{props.name}</span>
        )
}

export const Subtotal = (props) => (
    <div className="float-right">
        <span>Sub-Total:</span>
        <h5>${dollarString(props.total)}</h5>
    </div>)

export const AddButton = (props) => (<button className="add-button" onClick={() => props.onAdd(props.id)}>New Item</button>)

export const DeleteButton = (props) => {
    return (<button
            type="button"
            className="close"
            aria-label="remove"
        >
        <span
            onClick={() => props.onRemove(props.id)}
            aria-hidden="true"
        >
            &times;
        </span>
    </button>);
}

export const Row = (props) => {
    return (
        <tr>
            <th scope="row">
                {props.children[0]}
                <DeleteButton id={props.id} onRemove={props.onRemoveRow}/>
            </th>
            {props.children.slice(1).map(child =>
                <td key={props.name+child.props.name}>
                    {child}
                </td>
            )}
        </tr>
    )
}

export const Table = (props) => {
    const headings = {
        'Product': ['Cost', 'Price', 'Margin', 'Units', 'Earnings'],
        'Streams': ['Streams', 'Rate', 'Earnings'],
    };

    return (
        <div key={props.name} className="card">
            <div className="card-header">
                <DeleteButton id={props.id} onRemove={props.onRemoveTable}/>
                <h2 style={{marginLeft: "2rem"}}><EditableName id={props.id} name={props.name} onChange={props.onTableNameChange}/></h2>
            </div>
            <div className="card-body scrolling-wrapper-flexbox">
                <table className="table" style={{clear: "both"}}>
                    <thead>
                        <tr>
                            <th className="tablename" scope="col">
                            &nbsp;
                            </th>
                            {headings[props.type].map(heading => (
                                <th key={heading} scope='col'>{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.rows.map(row => {
                            if (props.type === 'Product') {
                                return (
                                    <Row {...props} id={row.id} key={row.id} name={row.name}>
                                        <EditableName id={row.id} name={row.name} onChange={props.onRowNameChange}/>
                                        <DollarInput {...props} name='cost' value={row.values.cost} id={row.id} />
                                        <DollarInput {...props} name='price' value={row.values.price} id={row.id}/>
                                        <DollarOutput {...props} name='margin' value={row.values.margin} id={row.id}/>
                                        <UnitInput {...props} name='units' value={row.values.units} id={row.id}/>
                                        <DollarOutput {...props} name='total' value={row.values.total} id={row.id}/>
                                    </Row>
                                )
                            } else /* Stream Value Row */ {
                                return (
                                    <Row {...props} id={row.id} key={row.id} name={row.name}>
                                        <EditableName id={row.id} name={row.name} onChange={props.onRowNameChange}/>
                                        <UnitInput {...props} name='streams' value={row.values.streams} id={row.id}/>
                                        <EditableValue {...props} name='rate' value={row.values.rate} id={row.id}/>
                                        <DollarOutput {...props} name='total' value={row.values.total} id={row.id}/>
                                    </Row>
                                )
                            }
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{display: "block", width:"100%", padding: "5px"}}>
                <div style={{float: "left"}}>
                    <AddButton id={props.id} onAdd={props.onAddRow} />
                </div>
                <div style={{float: "right"}}>
                    <Subtotal total={props.rows.reduce((a, r) => a + r.values.total, 0)}/>
                </div>
            </div>
        </div>
    )
}

export const Example = () => {
    const [tableName, setTableName] = useState('Apparel')
    const [rows, setRows] = useState([
        {id: 'table0row0', name:'T-Shirts', values: {cost: 4, price: 18, margin: 14, units: 0, total: 0}},
        {id: 'table0row1', name:'Hoodies', values: {cost: 9, price: 25, margin: 16, units: 0, total: 0}},
        {id: 'table0row2', name:'Caps', values: {cost: 6, price: 12, margin: 6, units: 0, total: 0}}
    ])

    const rowName = rows =>  newName(rows.map(r => r.name))
    const rowID = rows => 'row' + (parseInt(rows.map(r => r.id).sort(inReverse)[0].slice(-1)) + 1)
    const changeRowName = (name, id) => {
        const row = Object.assign({},  rows.filter(r => r.id === id)[0])
        row.name = name
        setRows([...rows.filter(r => r.id !== id), row].sort(byId))
    }
    const changeRowValue = (col, val, id) => {
        const row = Object.assign({},  rows.filter(r => r.id === id)[0])
        row.values[col] = val

        var {cost, price, margin, units, total} = row.values
        margin = price - cost
        total = units * margin

        Object.assign(row.values, {margin: margin, total: total})

        setRows([...rows.filter(r => r.id !== id), row].sort(byId))
    }

    return (
        <Table
        id='table0'
        name={tableName}
        type='Product'
        onRemoveTable={(...args) => console.log('onRemoveTable', args)}
        onTableNameChange={(name) => setTableName(name)}
        onAddRow={() => setRows([...rows, {id: rowID(rows), name: rowName(rows), values: {cost: 0, price:2, margin:2, units:0, total:0}}])}
        onRemoveRow={(rowID) => setRows(rows.filter(r => r.id !== rowID))}
        onRowNameChange={(name, rowID) => changeRowName(name, rowID)}
        onChange={(col, val, id) => changeRowValue(col, val, id)}
        rows={rows}
    />
    )
}

export const Example2 = () => {
    const [tableName, setTableName] = useState('Streaming')
    const [rows, setRows] = useState([
        {id: 'table1row0', name:'Spotify', values: {streams: 1000, rate: spotifyRate, total: 6}},
        {id: 'table1row1', name:'Apple Music', values: {streams: 1000, rate: appleRate, total: 7.35}},
        {id: 'table1row2', name:'Tidal', values: {streams: 1000, rate: tidalRate, total: 12.84}}
    ])

    const rowName = rows =>  newName(rows.map(r => r.name))
    const rowID = rows => 'row' + (parseInt(rows.map(r => r.id).sort(inReverse)[0].slice(-1)) + 1)
    const changeRowName = (name, id) => {
        const row = Object.assign({},  rows.filter(r => r.id === id)[0])
        row.name = name
        setRows([...rows.filter(r => r.id !== id), row].sort(byId))
    }
    const changeRowValue = (col, val, id) => {
        console.log(col, val, id)
        const row = Object.assign({},  rows.filter(r => r.id === id)[0])
        row.values[col] = val

        var {streams, rate, total} = row.values
        total = streams * rate

        Object.assign(row.values, {streams: streams, total: total})

        setRows([...rows.filter(r => r.id !== id), row].sort(byId))
    }

    return (
    <Table
        id='table1'
        name={tableName}
        type='Streams'
        onRemoveTable={(...args) => console.log('onRemoveTable', args)}
        onTableNameChange={(name) => setTableName(name)}
        onAddRow={() => setRows([...rows, {id: rowID(rows), name: rowName(rows), values: {cost: 0, price:2, margin:2, units:0, total:0}}])}
        onRemoveRow={(rowID) => setRows(rows.filter(r => r.id !== rowID))}
        onRowNameChange={(name, rowID) => changeRowName(name, rowID)}
        onChange={(col, val, id) => changeRowValue(col, val, id)}
        rows={rows}
    />
    )
}
