import React, { useState } from 'react'
import{ auth, googleProvider } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword ,signInWithPopup, signOut } from 'firebase/auth'

function Auth() {
//get info about Users email
  console.log(auth?.currentUser?.email)

  //Email Login
  const signUp = async () =>{
    try{
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error(err)
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Google Login

  const signInwithGoogle = async () =>{
    try{
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error(err)
    }
  };

  //Logout A user
  const Logout = async () =>{
    try{
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  };

  //Sign in:
    const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };


  //gets the Photo of the Google Account if there is one
  console.log(auth?.currentUser?.photoURL)


  return (
    <div className='pt-80'>
        <input placeholder="email" type="text" onChange={(e)=> setEmail(e.target.value)} />
        <input placeholder='pw' type="password" onChange={(e)=> setPassword(e.target.value)}/>
        <button onClick={signUp}>Sign up</button>
        <button onClick={signIn}>Sign In</button> 
        <button onClick={signInwithGoogle}>Sing in with google</button>
        <button onClick={Logout}>Log out</button>
        <div>
          
        </div>
    </div>
  )
}

export default Auth