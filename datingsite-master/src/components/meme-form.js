import React from "react";
import DropzoneComponent from "react-dropzone-component";
import request from "superagent";
import { navigate } from "hookrouter";

import "../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../node_modules/dropzone/dist/min/dropzone.min.css";

const MemeForm = () => {
  const [text, setText] = React.useState("");
  const [favorite, setFavorite] = React.useState(false);
  const [image, setImage] = React.useState("");
  const imageRef = React.useRef(null);

  React.useEffect(() => {
    if (props.id && props.editMode) {
      fetch(`http://localhost:5000/meme/${props.id}`)
        .then(response => response.json())
        .then(data => {
          setInput(data.text);
          setFavorite(data.favorite);
        });
    }
  }, []);

  const componentConfig = () => {
    return {
      iconFiletypes: [".jpg", ".png"],
      showFiletypeIcon: true,
      postUrl: "https://httpbin.org/post"
    };
  };

  const djsConfig = () => {
    return {
      addRemoveLinks: true,
      maxFiles: 1
    };
  };

  const handleDrop = () => {
    return {
      addedfile: file => {
        let upload = request
          .post("https://api.cloudinary.com/v1_1/jhdeans/image/upload")
          .field("upload_preset", "meme-image")
          .field("file", file);

        upload.end((err, response) => {
          if (err) {
            console.log("Cloudinary Error", err);
          }
          if (response.body.secure_url !== "") {
            setImage(response.body.secure_url);
          }
        });
      }
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (props.editMode) {
      await fetch(`localhost:5000/meme/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          text: input,
          favorite: favorite
        })
      })
        .then(imageRef.current.dropzone.removeAllFiles())
        .catch(error => console.log("Put Error", error));

      navigate("/");
    } else {
    }
    await fetch("http://localhost:5000/add-meme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        text: text,
        image: image,
        favorite: favorite
      })
    })
      .then(result => result.json())
      .then(setText(""))
      .then(setImage(""))
      .then(setFavorite(false))
      .then(imageRef.current.dropzone.removeAllFiles())

      .catch(err => console.log("form submit", err));

    navigate("/");
  };

  return (
    <div className="meme-form">
      <h1>Add a Meme</h1>

      <form onSubmit={handleSubmit}>
        <DropzoneComponent
          ref={imageRef}
          config={componentConfig()}
          djsConfig={djsConfig()}
          eventHandlers={handleDrop()}
        >
          Drop Your Meme
        </DropzoneComponent>
        <input
          type="text"
          placeholder="caption"
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <div className="checkbox">
          <input
            type="checkbox"
            checked={favorite}
            onChange={() => setFavorite(!favorite)}
          />
          <span>Favorite?</span>
        </div>
        <button type="submit">POST MEME</button>
      </form>
    </div>
  );
};
export default MemeForm;
