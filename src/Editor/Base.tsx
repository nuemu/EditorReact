import React, { useState } from "react";
import './base.css'

function Base() {
  var [text, changeText] = useState('Sample Text');
  return (
    <div>
      <p>Input:{text}</p>
      <textarea
        value={text}
        onChange={(event) => changeText(text = event.target.value)}
      />
    </div>
  );
}

export default Base;
