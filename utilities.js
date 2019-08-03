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
