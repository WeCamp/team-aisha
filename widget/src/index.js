class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.initialCount || 0,
      names: [],
      newName: ""
    };
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <h1>
        Hello WeCamp!
        <div style={{ backgroundColor: "red" }}>
          You clicked the button {this.state.count} times!
        </div>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
        {this.state.names.map(name => (
          <UserName key={name} name={name} />
        ))}
        <input
          type="text"
          value={this.state.newName}
          onChange={e => this.inputChanged(e)}
        />
        <button onClick={e => this.addNewUser(e)}>
          Add {this.state.newName}
        </button>
      </h1>
    );
  }

  inputChanged(e) {
    this.setState({
      newName: e.target.value
    });
  }

  addNewUser() {
    this.setState({
      names: [...this.state.names, this.state.newName],
      newName: ""
    });
  }
}

const UserName = ({ name = "Voorbeeld", clicked }) => (
  <div>Hello {name}! Welcome to WeCamp 2018! </div>
);

// const Component = () => <div className="test">Hello WeCamp!</div>;

const documentContainer = document.getElementById("reactor-container");
if (!documentContainer) {
  throw new Error(
    'Reactor container not found: Reactor needs an element with the ID "reactor-container"'
  );
}
ReactDOM.render(<Component />, documentContainer);
