export const findDisappear = (matrixA: any, matrixB: any) => {
    const disappearances = [];

    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixA[i].length; j++) {
            const cellA = matrixA[i][j];
            const cellB = matrixB[i][j];

            if (cellA === '2' && !cellB.includes('2')) {
                disappearances.push({ i, j });
            }
        }
    }

    return disappearances;
}

export const detectMovement = (oldPosition: any, newPosition: any) => {
    if (oldPosition[0] === newPosition[0] && oldPosition[1] === newPosition[1]) {
        return 'No movement';
    }

    if (oldPosition[0] < newPosition[0]) {
        return 'RIGHT';
    } else if (oldPosition[0] > newPosition[0]) {
        return 'LEFT';
    }

    if (oldPosition[1] < newPosition[1]) {
        return 'DOWN';
    } else if (oldPosition[1] > newPosition[1]) {
        return 'UP';
    }
}