import React, { useState } from 'react'
import { newName } from '../utilities'

const spotifyRate = 0.006
const appleRate = 0.00735
const tidalRate = 0.012840
const inReverse = (a, b) => b < a ? -1 : b > a ? 1 : 0
const byId = (a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0
const splitId = id => [id.slice(0, id.indexOf('r')), id]
const DEFAULTS = {
    'Product': {cost: 0, price: 2, margin: 2, units: 0, total: 0},
    'Streams': {streams: 0, rate: 0.001, total: 0}
}
const logicFor = {
    'Product': (row) =>  {
        let {cost, price, margin, units, total} = row.values
        margin = price - cost
        total = units * margin
        Object.assign(row.values, {margin: margin, total: total})
    },
    'Streams': (row) =>  {
        let {streams, rate, total} = row.values
        total = streams * rate
        Object.assign(row.values, {streams: streams, total: total})
    }
}

const MonthlyContext = React.createContext({})


const MonthlyContextProvider = (props) => {
    const defaultTables = {tables: [
        {id: 'table0',
         name: 'Apparel',
         type: 'Product',
         rows: [
            {id: 'table0row0', name:'T-Shirts', values: {cost: 4, price: 18, margin: 14, units: 0, total: 0}},
            {id: 'table0row1', name:'Hoodies', values: {cost: 9, price: 25, margin: 16, units: 0, total: 0}},
            {id: 'table0row2', name:'Caps', values: {cost: 6, price: 12, margin: 6, units: 0, total: 0}}
        ]},
        {id: 'table1',
         name: 'Streaming',
         type: 'Streams',
         rows: [
            {id: 'table1row0', name:'Spotify', values: {streams: 1000, rate: spotifyRate, total: 6}},
            {id: 'table1row1', name:'Apple Music', values: {streams: 1000, rate: appleRate, total: 7.35}},
            {id: 'table1row2', name:'Tidal', values: {streams: 1000, rate: tidalRate, total: 12.84}}
        ]}
    ]}

    const [state, setState] = useState(defaultTables)

    const rowName = rows =>  newName(rows.map(r => r.name))
    const rowID = table => table.id + 'row' + (parseInt((table.rows.map(r => r.id).sort(inReverse)[0] || '0').slice(-1)) + 1)
    const tableName = state =>  newName(state.tables.map(t => t.name))
    const tableID = state => 'table' + (parseInt(state.tables.map(t => t.id).sort(inReverse)[0].slice(-1)) + 1)

    const addTable = (type) => {
        console.log(type)
        const newState = Object.assign({}, state)
        const newTable = {id: tableID(newState), name: tableName(newState), type: type, rows: []}
        newState.tables = [...newState.tables, newTable].sort(byId)
        setState(newState)
    }

    const changeTableName = (name, id) => {
        const newState = Object.assign({}, state)
        newState.tables.find(t => t.id === id).name = name
        setState(newState)
    }

    const removeTable = (id) => {
        if (!confirm('Are you sure you want to remove this table?')){
            return
        }
        const newState = Object.assign({}, state)

        newState.tables = newState.tables.filter(t => t.id !== id).sort(byId)
        setState(newState)
    }

    const changeRowName = (name, id) => {
        const [ tableId, rowId ] = splitId(id)
        const table = state.tables.find(t => t.id === tableId)
        const rows = table.rows
        const row = Object.assign({},  rows.find(r => r.id === rowId))

        row.name = name

        const newState = Object.assign({}, state)
        newState.tables.find(t => t.id === tableId).rows = [...rows.filter(r => r.id !== rowId), row].sort(byId)
        setState(newState)
    }

    const changeRowValue = (col, val, id) => {
        const [ tableId, rowId ] = splitId(id)
        const table = state.tables.find(t => t.id === tableId)
        const rows = table.rows
        const row = Object.assign({},  rows.find(r => r.id === rowId))
        row.values[col] = val

        logicFor[table.type](row)

        const newState = Object.assign({}, state)
        newState.tables.find(t => t.id === tableId).rows = [...rows.filter(r => r.id !== rowId), row].sort(byId)
        setState(newState)
    }

    const removeRow = (id) => {
        const [ tableId, rowId ] = splitId(id)
        const newState = Object.assign({}, state)
        const table = state.tables.find(t => t.id === tableId)

        table.rows = table.rows.filter(r => r.id !== rowId).sort(byId)

        setState(newState)
    }

    const addRow = (id, type) => {
        const newState = Object.assign({}, state)
        const table = state.tables.find(t => t.id === id)

        var row = {id: rowID(table), name: rowName(table.rows), values: Object.assign({}, DEFAULTS[type])}

        table.rows = [...table.rows, row].sort(byId)
        setState(newState)
    }

    return (
        <MonthlyContext.Provider value={[state, addTable, changeTableName, removeTable, changeRowName, addRow, removeRow, changeRowValue]}>
            {props.children}
        </MonthlyContext.Provider>
    )
}

export { MonthlyContext, MonthlyContextProvider }