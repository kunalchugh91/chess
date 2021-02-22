export default () => {
    let board = [];
    let i = 0;
    let j = 0;
    for(j = 0; j < 8; j++) {
      for(i = 0; i < 8; i++) {
        let box = {
          x: i,
          y: j,
          piece: undefined,
          color: undefined,
        };
  
        switch (j) {
          case 0:
          case 1:
            box.color = 'blue';
            break;
          case 6:
          case 7:
            box.color = 'red';
            break;
        }
  
        if (j === 1 || j === 6) {
          box.piece = 'pawn';
        }
  
        if (j===0 || j===7) {
          if (i===0 || i===7) box.piece = 'rook';
          if (i===1 || i===6) box.piece = 'knight';
          if (i===2 || i===5) box.piece = 'bishop';
          if (i===3) box.piece = 'queen';
          if (i===4) box.piece = 'king';
        }
        
        board.push(box);
      }
    }
  
    return board;
  }