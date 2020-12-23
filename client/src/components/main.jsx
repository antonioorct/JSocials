import React, { Component } from "react";

class Main extends Component {
  state = { user: {}, posts: [], post: {} };

  render() {
    return (
      <div>
        <h1>Welcome {this.state.user.email}</h1>
        {this.state.posts.map((value) => {
          return <p key={value.id}>{value.content}</p>;
        })}
      </div>
    );
  }
}

export default Main;
