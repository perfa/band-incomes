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
    constructor(index, name, renaming=true, valueupdate) {
        this.index = index;
        this.name = name;
        this.renaming = renaming;
        this.values = {};
        this.valueupdate = valueupdate;
    }

    rename(newName) {
        this.name = newName;
        return this;
    }

    updateValue(name, value) {
        if(this.valueupdate){
            this.valueupdate(this, name, value);
        }

        this.values[name] = value;
    }

    total() {
        if (!this.values.total || isNaN(this.values.total)) {
            return 0;
        }
        return this.values.total;
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