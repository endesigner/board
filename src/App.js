var React = require('react');
var ReactDOM = require('react-dom');

function Board(rows, columns) {
  this.tickets = [];
  this.rows = rows;
  this.columns = columns;

  this.state = this.buildState(rows, columns)
}
Board.prototype.addTicket = function(ticket){
  this.tickets.push(ticket);
  return this.tickets.length - 1;
};
Board.prototype.getTicket = function(ticket_id){
  return this.tickets[ticket_id];
};

Board.prototype.buildState = function(rows, colums){
  var arr = new Array(rows || 0),
      i = rows;

  while (i--) {
    arr[rows-1 - i] = new Array(colums || 0);

    var c = colums;
    while (c--) arr[rows-1 - i][c] = new Array();
  }

  return arr;
}

Board.prototype.move = function(ticket_id, row, column) {
  if (this.rows-1 < row || this.columns-1 < column) {
    throw 'Error, board state bounds exceeded';
  }

  var state = this.state;
  for(var r = 0; r < state.length; r++) {
    for(var c = 0; c < state[r].length; c++) {
      // Remove from old position
      var pos = state[r][c].indexOf(ticket_id);
      if (pos > -1) {
        state[r][c].splice(pos,1);
      }

      // Put into new position
      if(row === r && column === c) {
        state[r][c].push(ticket_id);
      }
    }
  }
}
Board.prototype.toString = function(){
  return this.state;
}

class Ticket {
  constructor (subject, body) {
    this.subject = subject || 'defsubject';
    this.body = body || 'defbody';
  }

  setBody (str) {
    this.body = str;
  }

  setSubject (str) {
    this.subject = str;
  }

  toString () {
    return this.subject + ':' +  this.body;
  }
}

var BoardColumn = React.createClass({
  componentWillMount: function(){
    this.setState(this.props);
  },

  render: function(){
    var col = this.state.col,
        board = this.state.board;
    var tickets = col.map(function(ticket_id){
      var t = board.getTicket(ticket_id);
      return (<span>{t.toString()}</span>);
    });
    return (<div>{tickets}</div>);
  }
});

var BoardRow = React.createClass({
  componentWillMount: function(){
    this.setState(this.props);
  },

  render: function(){
    var row = this.state.row,
        board = this.state.board;

    var cols = row.map(function(col){
      return (<BoardColumn board={board} col={col} />);
    });
    return (<div>{cols}</div>);
  }
});

var BoardComponent = React.createClass({
  componentWillMount: function(){
    this.setState(this.props);
  },
  render: function(){
    var board = this.state.board;
    var rows = board.state.map(function(row){
      return (<BoardRow board={this.state.board} row={row} />);
    }.bind(this));
    return (<div>{rows}</div>);
  }
});

// Controls to add tickets to the Board
class ControlsComponent extends React.Component {
  componentWillMount () {
    this.state = this.props;
  }

  render () {
    return (
      <form>
        <input type="text" />
      </form>
    );
  }
}

class App extends React.Component {
  componentWillMount () {
    this.setState({
      board: this.props.board,
    });
  }

  render () {
    return (
      <div>
        <ControlsComponent board={this.state.board} />
        <BoardComponent board={ this.state.board } />
      </div>
    );
  }
}

var root = document.createElement('div');
document.body.appendChild(root);

var board = new Board(2,1);
var ticket = new Ticket('subject', 'body');
var ticket_id = board.addTicket(ticket);
board.move(ticket_id, 0, 0);

ReactDOM.render(<App board={board} />, root);
