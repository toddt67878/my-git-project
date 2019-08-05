import React, { Component } from "react";
import Meme from "./meme.js";
import { navigate } from "hookrouter";

const App = () => {
  const [memes, setMemes] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:5000/memes")
      .then(response => response.json())
      .then(data => setMemes(data))
      .catch(error => console.log(error));
  }, []);

  const deleteMeme = id => {
    fetch(`http://localhost:5000/meme/${id}`, {
      method: "DELETE"
    })
      .then(setMemes(memes.filter(meme => meme.id !== id)))
      .catch(error => console.log("delete err", error));
  };

  const editMeme = id => {
    navigate(`/form/${id}`);
  };

  const renderMemes = () => {
    return memes.map(meme => {
      return (
        <Meme
          key={meme.id}
          id={meme.id}
          text={meme.text}
          image={meme.image}
          favorite={meme.favorite}
          deleteMeme={deleteMeme}
          editMeme={editMeme}
        />
      );
    });
  };

  return (
    <div className="app">
      <h1>MEMES!</h1>
      {renderMemes()}
      <Meme />
    </div>
  );
};

export default App;
