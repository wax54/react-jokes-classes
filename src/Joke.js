import React from "react";
import "./Joke.css";

class Joke extends React.Component {
  constructor(props){
    super(props);

    this.upVote = this.props.vote.bind(this, this.props.id, +1);
    this.downVote = this.props.vote.bind(this, this.props.id, -1);

  }


  render(){
    const {votes, text} = this.props;

    return (
      <div className="Joke">
        <div className="Joke-votearea">
          <button onClick={this.upVote}>
            <i className="fas fa-thumbs-up" />
          </button>

          <button onClick={this.downVote}>
            <i className="fas fa-thumbs-down" />
          </button>

          {votes}
        </div>

        <div className="Joke-text">{text}</div>
      </div>
    );
  }
}

export default Joke;
