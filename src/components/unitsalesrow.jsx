import React, { useReducer } from 'react';


export function Row(props) {
    const { table, row, name, values, removeRow, onValueChange, onNameChange }  = props
    const selectAll = (e) => e.target.select();

    const [state, dispatch] = useReducer((state, action) => {
        switch(action.type) {
            case 'CHANGE':
                return {
                    ...state,
                    name: onValueChange(table.index, row.index, action.col, action.value),
                }
            case 'ENTER':
            case 'BLUR':
                return {
                    ...state,
                    renaming: false,
                    name: onNameChange(name, action.value),
                }
            case 'RENAME':
                return {
                    ...state,
                    name: onNameChange(name, action.value),
                }
            case 'CLICK':
                return {
                    ...state,
                    renaming: true,
                }
            default: return state;
        }
    }, {name: name, renaming: false})

    return (
         <tr key={name}>
            <th scope="col">
                <button
                    type="button"
                    className="close"
                    aria-label="remove"
                >
                    <span
                        onClick={(e) => { removeRow(table.index, row.index); }}
                        aria-hidden="true"
                    >
                        &times;
                    </span>
                </button>
                {state.renaming
                ?
                <input
                    type="text"
                    className="namefield"
                    value={name}
                    onChange={(e) => dispatch({type: 'RENAME', value: e.target.value})}
                    onBlur={(e) => dispatch({type: 'BLUR', value: e.target.value})}
                    onKeyDown={(e) => {if(e.key + e.type === 'Enterkeydown') dispatch({type: 'ENTER', value: e.target.value})}}
                    autoFocus
                ></input>
                :
                <span onClick={(e) => {dispatch({type: 'CLICK'})}}>{name}</span>
                }
            </th>
            {
                values.map(columnValue => {
                    const { editable, column, value } = columnValue;
                    return (
                        <td key={name + column}>
                            ${editable
                            ?
                            <input
                                className="valuefield"
                                type="number"
                                name="cost"
                                min="0"
                                step="0.01"
                                defaultValue={value}
                                onChange={(e) => dispatch({type: 'CHANGE', col: column, value: e.target.value})}
                                onFocus={selectAll}
                            />
                            :
                            <span>{value}</span>
                            }
                        </td>
                    )
                })
            }
        </tr>
    );
}