import { addPiece, removePiece, wrongMove } from './boardSlice';
import { Player, changeNextPlayer } from './nextPlayerSlice';

const invalidMoveMsg = `Invalid Move! Try again :)`;

/** Redux action creator thunks below **/
export const pieceMovedByUser = (sourcePiece, targetPiece) => (dispatch, getState) => {
    const nextPlayer = getState().nextPlayer.player;
    if ((nextPlayer === Player.Red && sourcePiece.color !== 'red') ||
        (nextPlayer === Player.Blue && sourcePiece.color !== 'blue')) {
            return dispatch(wrongMove({ message: `It's ${nextPlayer}'s turn!` }));
      }
    if (sourcePiece.color === targetPiece.color) {
        return dispatch(wrongMove({ message: invalidMoveMsg }));
    }

    switch (sourcePiece.piece) {
        case 'pawn':
            return dispatch(movePawn(sourcePiece, targetPiece, nextPlayer));
            break;
        case 'rook':
            return dispatch(moveRook(sourcePiece, targetPiece));
            break;
        case 'knight':
            return dispatch(moveKnight(sourcePiece, targetPiece));
            break;
        case 'bishop':
            return dispatch(moveBishop(sourcePiece, targetPiece));
            break;
        case 'queen':
            return dispatch(moveQueen(sourcePiece, targetPiece));
            break;
        case 'king':
            return dispatch(moveKing(sourcePiece, targetPiece));
            break;
    }

}

const movePawn = (sourcePiece, targetPiece, player) => dispatch => {
    const unitMove = (player === Player.Red ? 1 : -1);
    if (sourcePiece.x - unitMove === targetPiece.x && sourcePiece.y - unitMove === targetPiece.y && targetPiece.piece !== undefined) {
        return dispatch(movePiece(sourcePiece, targetPiece));
    } else if (sourcePiece.x === targetPiece.x && sourcePiece.y - unitMove === targetPiece.y && targetPiece.piece === undefined) {
        return dispatch(movePiece(sourcePiece, targetPiece));
    } else if (sourcePiece.x + unitMove === targetPiece.x && sourcePiece.y - unitMove === targetPiece.y && targetPiece.piece !== undefined) {
        return dispatch(movePiece(sourcePiece, targetPiece));
    } else {
        return dispatch(wrongMove({ message: invalidMoveMsg }));
    }
}

const moveRook = (sourcePiece, targetPiece) => (dispatch, getState) => {
    const valid = moveLaterally(sourcePiece, targetPiece, getState);
    return (valid ? dispatch(movePiece(sourcePiece, targetPiece)) : dispatch(wrongMove({ message: invalidMoveMsg })));
}

const moveBishop = (sourcePiece, targetPiece) => (dispatch, getState) => {
    const valid = moveSlant(sourcePiece, targetPiece, getState);
    return (valid ? dispatch(movePiece(sourcePiece, targetPiece)) : dispatch(wrongMove({ message: invalidMoveMsg })));
}

const moveKnight = (sourcePiece, targetPiece) => (dispatch, getState) => {

    if ((targetPiece.x === sourcePiece.x + 2 && targetPiece.y === sourcePiece.y + 1) ||
        (targetPiece.x === sourcePiece.x + 2 && targetPiece.y === sourcePiece.y - 1) ||
        (targetPiece.x === sourcePiece.x - 2 && targetPiece.y === sourcePiece.y + 1) ||
        (targetPiece.x === sourcePiece.x - 2 && targetPiece.y === sourcePiece.y - 1) ||
        (targetPiece.x === sourcePiece.x + 1 && targetPiece.y === sourcePiece.y + 2) ||
        (targetPiece.x === sourcePiece.x - 1 && targetPiece.y === sourcePiece.y + 2) ||
        (targetPiece.x === sourcePiece.x + 1 && targetPiece.y === sourcePiece.y - 2) ||
        (targetPiece.x === sourcePiece.x - 1 && targetPiece.y === sourcePiece.y - 2)) {
        dispatch(movePiece(sourcePiece, targetPiece));
    } else {
        dispatch(wrongMove({ message: invalidMoveMsg }));
    }
}

const moveQueen = (sourcePiece, targetPiece) => (dispatch, getState) => {
    let valid = moveLaterally(sourcePiece, targetPiece, getState);
    if (valid) {
        return dispatch(movePiece(sourcePiece, targetPiece))
    } else {
        valid = moveSlant(sourcePiece, targetPiece, getState);
        return (valid ? dispatch(movePiece(sourcePiece, targetPiece)) : dispatch(wrongMove({ message: invalidMoveMsg })));
    }
}

const moveKing = (sourcePiece, targetPiece) => (dispatch, getState) => {

    if ((targetPiece.x === sourcePiece.x && targetPiece.y === sourcePiece.y + 1) ||
        (targetPiece.x === sourcePiece.x && targetPiece.y === sourcePiece.y - 1) ||
        (targetPiece.x === sourcePiece.x + 1 && targetPiece.y === sourcePiece.y) ||
        (targetPiece.x === sourcePiece.x - 1 && targetPiece.y === sourcePiece.y) ||
        (targetPiece.x === sourcePiece.x + 1 && targetPiece.y === sourcePiece.y + 1) ||
        (targetPiece.x === sourcePiece.x - 1 && targetPiece.y === sourcePiece.y - 1) ||
        (targetPiece.x === sourcePiece.x + 1 && targetPiece.y === sourcePiece.y - 1) ||
        (targetPiece.x === sourcePiece.x - 1 && targetPiece.y === sourcePiece.y + 1)) {
        dispatch(movePiece(sourcePiece, targetPiece));
    } else {
        dispatch(wrongMove({ message: invalidMoveMsg }));
    }
}

const movePiece = (sourcePiece, targetPiece) => (dispatch) => {
    dispatch(removePiece({ position: getPosition(sourcePiece.x, sourcePiece.y) }));
    dispatch(addPiece({
        piece: sourcePiece.piece, 
        position: getPosition(targetPiece.x, targetPiece.y), 
        color: sourcePiece.color,
    }));
    dispatch(changeNextPlayer());
}


/** Helper functions below **/
const getPosition = (x, y) => {
    const toDecimal = y * 8 + x;
    return toDecimal;
}

const moveLaterally = (sourcePiece, targetPiece, getState) => {
    let inc = 1;
    let xRight = true, xLeft = true, yUp = true, yDown = true;
    let valid = false;

    for (inc = 1; inc <= 7; inc++) {
        if (xRight) {
            if (targetPiece.x === sourcePiece.x + inc && targetPiece.y === sourcePiece.y) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x + inc, sourcePiece.y)] || getState().board[getPosition(sourcePiece.x + inc, sourcePiece.y)].piece) {
                xRight = false;
            }
        }

        if (xLeft) {
            if (targetPiece.x === sourcePiece.x - inc && targetPiece.y === sourcePiece.y) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x - inc, sourcePiece.y)] || getState().board[getPosition(sourcePiece.x - inc, sourcePiece.y)].piece) {
                xLeft = false;
            }
        }

        if (yUp) {
            if (targetPiece.x === sourcePiece.x && targetPiece.y === sourcePiece.y - inc) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x, sourcePiece.y - inc)] || getState().board[getPosition(sourcePiece.x, sourcePiece.y - inc)].piece) {
                yUp = false;
            }
        }

        if (yDown) {
            if (targetPiece.x === sourcePiece.x && targetPiece.y === sourcePiece.y + inc) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x, sourcePiece.y + inc)] || getState().board[getPosition(sourcePiece.x, sourcePiece.y + inc)].piece) {
                yDown = false;
            }
        }
    }
    return valid;
}

const moveSlant = (sourcePiece, targetPiece, getState) => {
    let inc = 1;
    let northEast = true, southEast = true, southWest = true, northWest = true;
    let valid = false;

    for (inc = 1; inc <= 7; inc++) {
        if (northEast) {
            if (targetPiece.x === sourcePiece.x + inc && targetPiece.y === sourcePiece.y - inc) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x + inc, sourcePiece.y - inc)] || getState().board[getPosition(sourcePiece.x + inc, sourcePiece.y - inc)].piece) {
                northEast = false;
            }
        }

        if (southEast) {
            if (targetPiece.x === sourcePiece.x + inc && targetPiece.y === sourcePiece.y + inc) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x + inc, sourcePiece.y + inc)] || getState().board[getPosition(sourcePiece.x + inc, sourcePiece.y + inc)].piece) {
                southEast = false;
            }
        }

        if (southWest) {
            if (targetPiece.x === sourcePiece.x - inc && targetPiece.y === sourcePiece.y + inc) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x - inc, sourcePiece.y + inc)] || getState().board[getPosition(sourcePiece.x - inc, sourcePiece.y + inc)].piece) {
                southWest = false;
            }
        }

        if (northWest) {
            if (targetPiece.x === sourcePiece.x - inc && targetPiece.y === sourcePiece.y - inc) {
                valid = true;
                break;
            } else if (!getState().board[getPosition(sourcePiece.x - inc, sourcePiece.y - inc)] || getState().board[getPosition(sourcePiece.x - inc, sourcePiece.y - inc)].piece) {
                northWest = false;
            }
        }
    }
    return valid;
}