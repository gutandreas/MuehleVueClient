function translateIndexToRingAndField(index){
    switch (index){
        case 1: return {ring: 0, field: 0};
        case 4: return {ring: 0, field: 1};
        case 7: return {ring: 0, field: 2};
        case 28: return {ring: 0, field: 3};
        case 49: return {ring: 0, field: 4};
        case 46: return {ring: 0, field: 5};
        case 43: return {ring: 0, field: 6};
        case 22: return {ring: 0, field: 7};

        case 9: return {ring: 1, field: 0};
        case 11: return {ring: 1, field: 1};
        case 13: return {ring: 1, field: 2};
        case 27: return {ring: 1, field: 3};
        case 41: return {ring: 1, field: 4};
        case 39: return {ring: 1, field: 5};
        case 37: return {ring: 1, field: 6};
        case 23: return {ring: 1, field: 7};

        case 17: return {ring: 2, field: 0};
        case 18: return {ring: 2, field: 1};
        case 19: return {ring: 2, field: 2};
        case 26: return {ring: 2, field: 3};
        case 33: return {ring: 2, field: 4};
        case 32: return {ring: 2, field: 5};
        case 31: return {ring: 2, field: 6};
        case 24: return {ring: 2, field: 7};
    }
}
function translateRingAndFieldToGridColumnAndRow(ring, field) {
    let factor = 0;
    let column = ring;
    let row = ring;
    switch (ring) {
        case 0:
            factor = 3;
            break;
        case 1:
            factor = 2;
            break;
        case 2:
            factor = 1;
            break;
    }

    switch (field) {
        case 0:
            row = ring;
            column = ring;
            break;
        case 1:
            column += 1 * factor;
            break;
        case 2:
            column += 2 * factor;
            break;
        case 3:
            row += + 1 * factor;
            column += 2 * factor;
            break;
        case 4:
            row += 2 * factor;
            column += 2 * factor;
            break;
        case 5:
            row += 2 * factor;
            column += 1 * factor;
            break;
        case 6:
            row += 2 * factor;
            break;
        case 7:
            row += 1 * factor;
            break;
    }

    return { row, column };
}
function tranlasteRingAndFieldToIndex(ring, field){
    const { row, column } = translateRingAndFieldToGridColumnAndRow(ring, field);
    const index = row * 7 + column;
    return index;
}

export { tranlasteRingAndFieldToIndex, translateRingAndFieldToGridColumnAndRow, translateIndexToRingAndField };