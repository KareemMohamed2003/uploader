import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import { getDatabase, set, ref as databaseRef, push } from "firebase/database"
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import firebase from "firebase/app"
export const firebaseConfig = {
   apiKey: "AIzaSyDn2eOkqQNmcGLh0LVqtVes_sWxPazIpc8",
   authDomain: "electro-comm.firebaseapp.com",
   databaseURL: "https://electro-comm-default-rtdb.firebaseio.com",
   projectId: "electro-comm",
   storageBucket: "electro-comm.appspot.com",
   messagingSenderId: "235917589196",
   appId: "1:235917589196:web:fb810bbdcf43ac5a7a2069"
};
//  export const database = getDatabase(firebaseConfig)
// const productsRef = firebase.database().ref('products');
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const productsRef = databaseRef(getDatabase(app), '/products');
console.log(productsRef)
export const removeExtension = (imageTitle) => {
   // remove extension from the uploaded image file 
   console.log(imageTitle)
   let imageName = imageTitle
   console.log(imageName)
   if (imageTitle.includes(".png")) {

      console.log(imageTitle)
      imageName = imageTitle.replace(".png", "")
      return imageName

   }

   else if (imageTitle.includes(".jpg")) {
      imageName = imageTitle.replace(".jpg", "")
      return imageName

   }
   else if (imageTitle.includes(".jpeg")) {
      imageName = imageTitle.replace(".jpeg", "")
      return imageName
   }

   else {
      return imageName
   }
}
// firebase storage reference (upload path)



export const upload = async (storage, fields, file) => {
   // name: product name 
   // setImageUrl(URL.createObjectURL(file))
   const storageRef = ref(storage, "products/" + fields.name + ".jpg")
   // console.log(storageRef)
   const uploadTask = uploadBytesResumable(storageRef, file);

   uploadBytes(storageRef, file).then((snapshot) => {
      console.log(snapshot)
   });

   uploadTask.on('state_changed', (snapshot) => {

      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;


      switch (snapshot.state) {
         case 'paused':

            break;
         case 'running':

            break;

      }

   },
      (error) => {
         console.log(error)
      },
      async () => {

         getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            // console.log('File available at', downloadURL);

            // const locationRef = getLocationRef(userSelection, file.name, price)
            // console.log(locationRef)


            let product = {
               imageTitle: removeExtension(fields.name),
               price: fields.price, imageUrl: downloadURL,

            }

            // const newProductRef = productsRef.push();
            // newProductRef.set(product);
            // set(productsRef,product);
            const req = await fetch("https://electro-comm-default-rtdb.firebaseio.com/products.json")
            // console.log(await data.json() ) 
            const data = await req.json();
            if (data?.length>0) {

                  const newProducts = [...data]
                  newProducts.push(product)
                  console.log(newProducts)
               await    fetch("https://electro-comm-default-rtdb.firebaseio.com/products.json", {
                     method: "PUT",
                     body: JSON.stringify(newProducts)

                  }
                  )
               }
               else {
                  console.log([product])
                 await  fetch("https://electro-comm-default-rtdb.firebaseio.com/products.json", {
                     method: "PUT",
                     body: JSON.stringify([product])

                  })
               }
          
            // //  when we get the download url we need to sent to the products database 
            // writeToDB("/products", newProducts, eCommerceDB)

            // fetch("https://electro-comm-default-rtdb.firebaseio.com/products.json",
            //    { method: "PATCH", body: JSON.stringify(product) }).then(res => console.log(res))
            // perform a post request to the firebase database 
         });
      }
   );
   // set(ref(database, path), fields).then((res) => { }).catch((err) => console.log(err));
   // get refereence to write to 
}

