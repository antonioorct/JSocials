import React, { Component } from "react";

class Forms extends Component {
  renderInput(name, label, type = "text") {
    console.log(this.props.value);
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <input
          label={label}
          type={type}
          value={this.props.value[name]}
          handleChange={this.handleChange}
          id={name}
        ></input>
        {this.state.errors[name] && (
          <div className="alert alert-danger">{this.state.errors[name]}</div>
        )}
      </div>
    );
  }

  renderButton(label) {
    return (
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    );
  }

  test(text) {
    return this.props.children.props;
  }
}

export default Forms;
