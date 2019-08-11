import React, { useState, useContext } from 'react'
import Popup from 'reactjs-popup';

import { MonthlyContext } from '../contexts'
import { dollarString } from '../utilities'

const selectAll = e => e.target.select();


export const DollarInput = (props) => (
    <span className="dollarvalue">
    <input
        className='valuefield'
        type="number"
        name={props.name}
        min="0"
        step={props.fullValue ? ".00001" : "0.01"}
        defaultValue={props.fullValue ? props.value : dollarString(props.value)}
        onChange={e => props.onChange(e.target.name, parseInt(e.target.value), props.id)}
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
        onChange={e => props.onChange(e.target.name, parseInt(e.target.value), props.id)}
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

export const AddButton = (props) => (<button className="add-button" onClick={() => props.onAdd(props.id, props.type)}>New Item</button>)

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
export const Tables = (props) => {
    const [state, , changeTableName, removeTable, changeRowName, addRow, removeRow, changeRowValue] = useContext(MonthlyContext);
    const headings = {
        'Product': ['Cost', 'Price', 'Margin', 'Units', 'Earnings'],
        'Streams': ['Streams', 'Rate', 'Earnings'],
    };

    return state.tables.map(t => (<div key={t.name} className="card">
            <div className="card-header">
                <DeleteButton id={t.id} onRemove={removeTable}/>
                <h2 style={{marginLeft: "2rem"}}><EditableName id={t.id} name={t.name} onChange={changeTableName}/></h2>
            </div>
            <div className="card-body scrolling-wrapper-flexbox">
                <table className="table" style={{clear: "both"}}>
                    <thead>
                        <tr>
                            <th className="tablename" scope="col">
                            &nbsp;
                            </th>
                            {headings[t.type].map(heading => (
                                <th key={heading} scope='col'>{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {t.rows.map(row => {
                            if (t.type === 'Product') {
                                return (
                                    <Row {...props} onRemoveRow={removeRow} id={row.id} key={row.id} name={row.name}>
                                        <EditableName id={row.id} name={row.name} onChange={changeRowName}/>
                                        <DollarInput {...props} onChange={changeRowValue} name='cost' value={row.values.cost} id={row.id} />
                                        <DollarInput {...props} onChange={changeRowValue}  name='price' value={row.values.price} id={row.id}/>
                                        <DollarOutput {...props} name='margin' value={row.values.margin} id={row.id}/>
                                        <UnitInput {...props} onChange={changeRowValue} name='units' value={row.values.units} id={row.id}/>
                                        <DollarOutput {...props} name='total' value={row.values.total} id={row.id}/>
                                    </Row>
                                )
                            } else /* Stream Value Row */ {
                                return (
                                    <Row {...props} id={row.id} key={row.id} name={row.name}>
                                        <EditableName id={row.id} name={row.name} onChange={changeRowName}/>
                                        <UnitInput {...props} onChange={changeRowValue} name='streams' value={row.values.streams} id={row.id}/>
                                        <EditableValue {...props} onChange={changeRowValue} name='rate' value={row.values.rate} id={row.id}/>
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
                    <AddButton id={t.id} type={t.type} onAdd={addRow} />
                </div>
                <div style={{float: "right"}}>
                    <Subtotal total={t.rows.reduce((a, r) => a + r.values.total, 0)}/>
                </div>
            </div>
        </div>))
}

export const AddTables = () => {
    const [, addTable] = useContext(MonthlyContext)

    return (<Popup
        trigger={<button className="align-middle">New Category</button>}
        on="click"
        position="right center"
        closeOnDocumentClick
        closeOnEscape
        >
        { close =>
        <div className="menu">
            <div className="menu-item" onClick={() => {addTable('Product'); close()}}> Unit Sales</div>
            <div className="menu-item" onClick={() => {addTable('Streams'); close()}}> Streaming </div>
        </div>
        }
    </Popup>)
}

export const GrandTotal = () => {
    const [ state ] = useContext(MonthlyContext)
    const total = state.tables.reduce((acc, table) =>
        acc + table.rows.reduce((racc, row) =>
        racc + row.values.total, 0), 0)
    return (
    <div className="float-right">
        <span><em>Total:</em>
        <h5>${dollarString(total)}</h5></span>
    </div>
    )
}