import './App.css';
import React, {useRef, useState} from 'react';
import 'firebase/auth';
import 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { collection, orderBy, query,limit, endAt, startAt } from "firebase/firestore"; 
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import {  useCollectionData } from 'react-firebase-hooks/firestore';



// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD8yTAIbyu9gsfzvIuWi45BeUxVrWEw8ks",

  authDomain: "chatbot-61cf7.firebaseapp.com",

  projectId: "chatbot-61cf7",

  storageBucket: "chatbot-61cf7.appspot.com",

  messagingSenderId: "872555914853",

  appId: "1:872555914853:web:7763ee5ebfe7ff34e2c88c",

  measurementId: "G-0LGJCT6T2E"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics();
const db = getFirestore();
const auth = getAuth();






function App() {
  const [user] = useAuthState(auth);
  return (
    <div className = "App">
      <header><SignOut/></header>
      <section>{user ? <ChatRoom/> : <SignIn/>}</section>
    </div>
  )
}
//SIGN IN PAGE
function SignIn(){
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }
  return (
    <div className = "App">
      <header>WELCOME TO THE CHAT</header>
      <button className = "sign-in"onClick = {signInWithGoogle}>Sign In With Google </button>
    </div>
  )
}
//CHATROOM PAGE
function ChatRoom(){
  const dummy = useRef();
  const messageRef = collection(db, 'messages');          //Firebase store of message data
  const q = query(messageRef, orderBy("createdAt"), limit(25));      //query idk
  const [messages] = useCollectionData(q, {idField: 'id'});  //useCollectionData reacts to changes in data real time
  const [formValue, setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefault();
    const{uid, photoURL} = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: db.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
  return(<div>
    <main>
      <span ref= {dummy}></span>
      {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg}/>)}  
    </main>
    <form onSubmit={sendMessage}>
      <input value = {formValue} onChange= {(e) => setFormValue(e.target.value)} placeholder ="say smoething nice"/>
      <button type = "submit" disabled = {!formValue}>Bird</button>
    </form>
    <div>Hello</div>
    </div>
  )
}
function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return(<div>
    <div className = {`message ${messageClass}`}>
      <img src={photoURL || 'https://www.freeiconspng.com/img/44668}'}/>
      <p>{text}</p>
    </div>
  </div>
  )
  }
//SIGN OUT FUNCTION CAN BE REFERENCED IN CHATROOM PAGE
function SignOut(){
  return auth.currentUser && (
    <button className = "sign-out" onClick={() => auth.signOut()}>SignOut</button>
  )
}
export default App;
