import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '../box/Box';
import { selectBoard } from './boardSlice';
import { pieceMovedByUser } from './boardAction';
import './Board.css';

export function Board() {
    const board = useSelector(selectBoard);
    const dispatch = useDispatch();

    return (
        <div className="board">
            {
                board.map((box, index) => (

                    <Box {...box} key={index} pieceMoved={(s, t) => dispatch(pieceMovedByUser(s, t))} />

                ))
            }
        </div>
    );
}