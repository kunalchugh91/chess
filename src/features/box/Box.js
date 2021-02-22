import React from 'react';
import propTypes from 'prop-types';
import './Box.css';

export default class Box extends React.Component {
    constructor(props) {
        super(props);
        this.allowDrop.bind(this);
        this.onDrop.bind(this);
        this.onDragStart.bind(this);
    }

    allowDrop(event) {
        event.preventDefault();
    }

    onDrop(event) {
        event.preventDefault();
        const sourcePiece = JSON.parse(event.dataTransfer.getData('draggedPiece'));
        const targetPiece = Object.assign({}, this.props);
        this.props.pieceMoved(sourcePiece, targetPiece);
    }

    onDragStart(event) {
        const draggedPiece = Object.assign({}, this.props);
        event.dataTransfer.setData('draggedPiece', JSON.stringify(draggedPiece));
    }

    render() {
        const { x, y, piece, color } = this.props;
        const background = {
            backgroundColor: (x + y) % 2 === 0 ? 'white' : 'black',
        };
        //const colorCSS = { color: this.props.color, fontSize: '24px', fontWeight: 'bold' };
        const pathToImg = `images/${piece}-${color}.svg`;
        return (
            <div className='innerbox' style={background}
                onDragOver={(e) => this.allowDrop(e)} onDrop={(e) => this.onDrop(e)}>
                {color && piece &&
                    <img src={pathToImg} alt={piece} draggable='true' onDragStart={(e) => this.onDragStart(e)} className='pic' />
                }
            </div>
        )
    }
}

Box.propTypes = {
    x: propTypes.number.isRequired,
    y: propTypes.number.isRequired,
    piece: propTypes.string,
    color: propTypes.string,
    pieceMoved: propTypes.func,
}