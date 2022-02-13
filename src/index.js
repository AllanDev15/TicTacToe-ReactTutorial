import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let classStyle = 'board__square';

  if (props.value === 'X') {
    classStyle += ' board__square--X';
  } else if (props.value === 'O') {
    classStyle += ' board__square--O';
  }

  if (props.current === props.last) {
    classStyle += ' current';
  }

  return (
    <button className={classStyle} onClick={props.onClick}>
      <span>{props.value}</span>
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let lastBtn;
    const last = this.props.current[this.props.current.length - 1];
    if (last) {
      lastBtn = getIndex(last);
    }

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        current={i}
        last={lastBtn}
      />
    );
  }

  render() {
    let board = [];
    let squareNum = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board.push(this.renderSquare(squareNum));
        squareNum++;
      }
    }

    return <div className="board">{board}</div>;
  }
}

class Status extends React.Component {
  render() {
    let res = '';

    if (this.props.value === 'X' || this.props.value === 'O') {
      res = (
        <p>
          Next Player:
          <span className={this.props.value}> {this.props.value}</span>
        </p>
      );
    } else {
      res = <p className="winner">{this.props.value}</p>;
    }
    return res;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      indices: [],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // Toma una copia de las coordenadas guardadas hasta ahora
    const indices = this.state.indices.slice(0, this.state.stepNumber);
    // Calcula las coordenadas del ultimo movimiento
    const coordinates = getCoordinates(i);
    // Las agrega a las coordenadas pasadas
    const id = indices.concat([coordinates]);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      indices: id,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0,
    });
  }
  restartGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const indices = this.state.indices;

    const moves = history.map((step, move) => {
      let desc;
      const turn = move % 2 === 0 ? 'O' : 'X';
      const btnClass =
        move === this.state.stepNumber
          ? 'game__btn-move game__btn-move--' + turn
          : 'game__btn-move';

      if (move) {
        const lastMove = indices[move - 1].join();
        desc = (
          <button className={btnClass} onClick={() => this.jumpTo(move)}>
            <span className={turn}>{move}</span> Go to {turn} in ({lastMove})
          </button>
        );
      } else {
        desc = (
          <button
            className="game__btn-move game__btn-move--start"
            onClick={() => this.restartGame(move)}
          >
            Go to game start
          </button>
        );
      }

      return (
        <li className="game__move" key={move}>
          {desc}
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = this.state.xIsNext ? 'X' : 'O';
    }

    return (
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <div className="game">
          <div className="game__status">
            <Status value={status} />
          </div>
          <div className="game__info">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              current={indices}
            />
            <ol className="game__moves">{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getCoordinates(i) {
  const coordinates = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [1, 3],
    [2, 3],
    [3, 3],
  ];

  return coordinates[i];
}

function getIndex(coordinate) {
  let index = 0;
  const coordinates = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [1, 3],
    [2, 3],
    [3, 3],
  ];

  for (let i = 0; i < coordinates.length; i++) {
    if (coordinates[i][0] === coordinate[0] && coordinates[i][1] === coordinate[1]) {
      index = i;
    }
  }

  return index;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
