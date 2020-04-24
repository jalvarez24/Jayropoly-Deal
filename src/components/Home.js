import React from 'react';
import '../App.css';

const Home = () => {
  return (
    <div>
        <h1>Welcome to the Game</h1>

        <div>
          <span>Join a friend, enter their lobby code: </span>
          <input id="join_friend" type="text"/>
        </div>
        <div>
          <span>Join a random game: <button id="random-game-button">Join Random</button></span>
        </div>
        <div>
          <span>Create a new lobby and invite friends: <button id="create-lobby-button">Join Random</button></span>
        </div>
    </div>
  );
}

export default Home;
