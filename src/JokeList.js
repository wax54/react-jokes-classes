import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


class JokeList extends React.Component { 

  static defaultProps = { numJokesToGet: 10 };

  constructor (props) {
    super(props);

    this.state = {
      jokes: []
    };

    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote             = this.vote.bind(this); 
  }


  removeJokes() {
    const { jokes } = this.state;
    const { numJokesToGet } = this.props;
    let j = [...jokes];

    while (j.length > numJokesToGet) {
      j.pop();
    }
    this.setState({jokes : j});
  }


  async getJokes() {
    const { jokes } = this.state;
    const { numJokesToGet } = this.props;

    let j = [...jokes];
    let seenJokes = new Set();

    try {
      while (j.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({jokes : j});
    } catch (e) {
      console.log(e);
    }
  }

  /*If there aren't enough jokes, get enough jokes */
  componentDidMount() {
    this.getJokes();
  }
  /*If there aren't enough jokes, get enough jokes */
  componentDidUpdate(){
    const { jokes } = this.state;
    const { numJokesToGet } = this.props;
    
    if(jokes.length < numJokesToGet) this.getJokes();
    else if(jokes.length > numJokesToGet) this.removeJokes();
  }

  /* empty joke list and then call getJokes */

  generateNewJokes() {
    this.setState({ jokes : []});
  }

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    const updatedJokes = 
      this.state.jokes.map(j => (
        j.id === id ? 
          { ...j, votes: j.votes + delta } : 
          j
      ));
    this.setState({ jokes : updatedJokes });
  }

  /* render: either loading spinner or list of sorted jokes. */

  render() {
    const { jokes } = this.state
    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }

    return null;
  }

}

export default JokeList;
