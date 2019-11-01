import React, { Component} from "react";
import { hot } from "react-hot-loader/root";
import "./App.css";
import PropTypes from 'prop-types';

class App extends Component{
  constructor(props) {
    super(props);

    this.state = {
      gridSize: '10',
      showForm: false,
      cellSize: {
        width: 58,
        height: 58,
      },
      currentColor: 'pink',
      clear: false,
    };
    this.showNewGridForm = this.showNewGridForm.bind(this);
    this.exitGridForm = this.exitGridForm.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.selectColorByButton = this.selectColorByButton.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.switchClearGrid = this.switchClearGrid.bind(this);

    this.newGridFormViev = <NewGridForm
      sizeChange={this.handleSizeChange}
      exitForm={this.exitGridForm}
      clearGrid={this.clearGrid}
      />;
  }

  showNewGridForm() {
    this.setState({showForm: true});
  }

  exitGridForm() {
    this.setState({showForm: false});
  }

  handleSizeChange(newSize) {
    const size = (600 / parseInt(newSize)) - 2;
    this.setState({
      gridSize: newSize,
      cellSize: {
        width: size,
        height: size,
      }
    });
  }

  selectColorByButton(color) {
    this.setState({currentColor: color});
  }

  clearGrid() {
    this.setState({clear: true});
  }

  switchClearGrid() {
    this.setState({clear: false});
  }

  render(){
    const size = parseInt(this.state.gridSize);
    return (
      <div className="App">
        <div className="titleContainer">
          <div className="title">
            ETCH-A-SKETCH
          </div>
        </div>
        <NavButtons
          newGrid={this.showNewGridForm}
          selectColor={this.selectColorByButton}
          clear={this.clearGrid}
        />
        <div className="gridContainer">
          <Grid
            gridSize={size}
            cellSize={this.state.cellSize}
            currentColor={this.state.currentColor}
            clearStatus={this.state.clear}
            switchClear={this.switchClearGrid}
          />
        </div>
        <div className='formContainer'>
          {(this.state.showForm) ?
          this.newGridFormViev : ''}
        </div>
      </div>
    );
  }
}

class NavButtons extends Component {

  onNewGrid() {
    this.props.newGrid();
  }

  onChangeColor(color) {
    this.props.selectColor(color);
  }

  onClear(){
    this.props.clear();
  }

  render() {
    return (
      <div className="NavButtons">
        <button className="pink" onClick={() => this.onChangeColor('pink')}>Pink</button>
        <button className="rainbow" onClick={() => this.onChangeColor('rainbow')}>Rainbow</button>
        <button className="clear" onClick={() => this.onClear()}>Clear</button>
        <button className="newGrid" onClick={() => this.onNewGrid()}>New Grid</button>
      </div>
    );
  }
}

NavButtons.propTypes = {
  newGrid: PropTypes.func,
  selectColor: PropTypes.func,
  clear: PropTypes.func,
}

function Grid(props) {
  const gridSize = props.gridSize;
  const rowsNumber = Array(gridSize).fill(1);
  const grid = rowsNumber.map((row, index) => {
    return <Row
      key={index}
      gridSize={gridSize}
      cellSize={props.cellSize}
      currentColor={props.currentColor}
      clearStatus={props.clearStatus}
      switchClear={props.switchClear}
    />;
  });

  return (
    <div className="grid">{grid}</div>
    );
}

Grid.propTypes = {
  gridSize: PropTypes.number,
  cellSize: PropTypes.object,
  currentColor: PropTypes.string,
  clearStatus: PropTypes.bool,
  switchClear: PropTypes.func,
}

function Row(props) {
  const cellsNumber = props.gridSize;
  const cells = Array(cellsNumber).fill(1);
  const row = cells.map((cell, index) =>
    <Cell
      key={index}
      cellSize={props.cellSize}
      currentColor={props.currentColor}
      clearStatus={props.clearStatus}
      switchClear={props.switchClear}
    />);

  return (
    <div className="row">{row}</div>
  );
}

Row.propTypes = {
  gridSize: PropTypes.number,
  cellSize: PropTypes.object,
  currentColor: PropTypes.string,
  clearStatus: PropTypes.bool,
  switchClear: PropTypes.func,
}

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'black',
    };
  }

  handleMouseOver() {
    let color = this.props.currentColor;

    if (color === 'rainbow') {
      color = rainbow();
    }
    this.setState({color: color});
  }

  componentDidUpdate(prevProps) {
    if(this.props.clearStatus !== prevProps.clearStatus) {
      this.setState({color: 'black'});
      this.props.switchClear();
    }
  }

  render() {
    const styleObj = {
      width: this.props.cellSize.width,
      height: this.props.cellSize.height,
      background: this.state.color,
    }
    return <div
      className='cell'
      style={styleObj}
      onMouseOver={() => this.handleMouseOver()}
      >
      </div>;
  }
}

Cell.propTypes = {
  currentColor: PropTypes.string,
  clearStatus: PropTypes.bool,
  switchClear: PropTypes.func,
  cellSize: PropTypes.object,
}

class NewGridForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: 'Enter a number',
      validationMsg: false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({input: e.target.value});
  }

  onSetButtonClick() {
    const newSize = this.state.input;

    if (isNaN(newSize) || newSize > 50 || newSize < 1) {
      this.setState({validationMsg: true});
    }else {
      this.props.sizeChange(newSize);
      this.props.clearGrid();
      this.props.exitForm();

      this.setState({input: 'Enter a number'});
    }
  }

  onInputFieldClick() {
    this.setState({input: ''});
  }

  render() {
    return(
      <div className='NewGridForm'>
        <div className='NewGridFormWindow'>
          <div className="instruction">
            <h2>Set new grid size</h2>
            <p>Enter the number between 1 and 50</p>
          </div>
          <input value={this.state.input} onChange={this.handleChange} onClick={() => this.onInputFieldClick()}/>
          <button onClick={() => this.onSetButtonClick()}>Set</button>
          <div className='ValidationContainer'>
            {(this.state.validationMsg) ?
            <p>Type number between 1 and 50</p> : ''}
          </div>
        </div>
      </div>
    );
  }
}

NewGridForm.propTypes = {
  sizeChange: PropTypes.func,
  clearGrid: PropTypes.func,
  exitForm: PropTypes.func,
}

const rainbow = () => {
  const colorBase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += colorBase[Math.floor(Math.random() * 16)];
  }
  return color;
}


export default hot(App);
