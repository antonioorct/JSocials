import React, { Component } from "react";
import { getAllPosts, getPostsFromUserId } from "../services/postService";

import jwtDecode from "jwt-decode";
import http from "../services/httpService";

class Main extends Component {
  state = { user: {}, posts: [], post: {} };

  async componentDidMount() {
    const loggedUser = await this.getUser();

    this.setState({ user: loggedUser });

    getPostsFromUserId(this.state.user.id).then((data) => {
      console.log(data);
      this.setState({ posts: data });
    });
  }

  async getUser() {
    const token = localStorage.getItem("token");
    if (!token) return "Nobody";
    else return jwtDecode(token);
  }

  getPostsFromCurrentUser = async () => {};

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
