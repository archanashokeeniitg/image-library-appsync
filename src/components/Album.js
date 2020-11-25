import React, { Component } from 'react';
export default class Home extends Component {
  render() {
    const { user } = this.props;

    return (
      <React.Fragment>
        <h1>Home</h1>
        { user && <Lead>You are signed in as  <BSpan font="italic">{user.username}</BSpan>.</Lead> }
      </React.Fragment>
    )
  }
}