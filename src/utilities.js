export function dollarString(value) {
    return Number(value).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}


export function newName(names) {
    var newName = 'New';
    var unnamedRows = names.filter(a => a.startsWith('New'));
    if (unnamedRows) {
        var largestNew = unnamedRows.sort().reverse()[0]
        if (largestNew) {
            var suffix = 1;
            var val = Number.parseInt(largestNew.split(' ')[1]) + 1 || suffix;
            newName = `New ${val}`;
        }
    }
    return newName;
}

export class RowData {
    constructor(index, name, renaming=true) {
        this.index = index;
        this.name = name;
        this.renaming = renaming;
        this.values = {}
    }

    rename(newName) {
        this.name = newName;
    }

    updateValue(name, value) {
        this.values[name] = value;
    }

    total() {
        if ('total' in this.values) {
            return this.values.total;
        }
        return 0;
    }
}

export class TableData {
    constructor(index, name, type, renaming=true) {
        this.index = index;
        this.name = name;
        this.type = type;
        this.renaming = renaming;
        this.rowIndex = 0;
        this.rows = [];
    }

    rename(newName) {
        this.name = newName;
    }

    addRow() {
        var name = newName(this.rows.map(r => r.name));
        this.rows.push(new RowData(this.rowIndex++, name))
    }

    removeRow(index) {
        this.rows = this.rows.filter(r => r.index !== index);
    }

    total() {
        return this.rows.reduce((acc, val) => acc + val.total(), 0);
    }
}