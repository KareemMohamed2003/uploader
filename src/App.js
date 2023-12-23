
import './App.css';
import { initializeApp } from "firebase/app"

import { upload, storage } from "./firebase";

import { useRef } from 'react';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// Initialize Firebase


export const displayFileReader = (id) => {
  document.getElementById(id)?.click();
}
console.log("sd")
function App() {
  const fileRef = useRef(null);
  const priceRef = useRef(null);
  const productNameRef = useRef(null);


  const submitFile = (e) => {
    const file = fileRef.current.files[0]
    let price = priceRef.current.value
    let name = productNameRef.current.value
    console.log(name, price)
    e.preventDefault()
    console.log(e)
    upload(storage, { name, price }, file)
    price = ""
    name = ""

  }

  return (
    <div className="App">
      <form onSubmit={submitFile}>
        <input maxLength={40} type="text" ref={productNameRef} className="product-price-input" placeholder="enter product name" />
        <input maxLength={4}  type="number" ref={priceRef} className="product-price-input" placeholder="enter product price" />
        <input
          ref={fileRef}
          className="fileInput"
          type="file"
          name="upload"
          id="file"
        />
        <button type="button" className="panel-btn" onClick={() => displayFileReader("file")}>
          choose product image
        </button>
        <button type="submit" onClick={() => { console.log('dsd') }} className="submit-btn">submit product</button>
      </form>
    </div>
  );
}

export default App;
