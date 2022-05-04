import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDY8OGn_Qvhvqj4w08wULUZyI2gL9mgBvM",
  authDomain: "pasamayito-ea48a.firebaseapp.com",
  projectId: "pasamayito-ea48a",
  storageBucket: "pasamayito-ea48a.appspot.com",
  messagingSenderId: "514335783711",
  appId: "1:514335783711:web:231f7c455fe7ea2f7dce2a",
});

const AuthContext = createContext();

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const sendSignInLinkToEmail = (email) => {
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        url: "http://localhost:3000/confirm",
        handleCodeInApp: true,
      })
      .then(() => {
        return true;
      });
  };

  const signInWithEmailLink = (email, code) => {
    return firebase
      .auth()
      .signInWithEmailLink(email, code)
      .then((result) => {
        setUser(result.user);
        return true;
      });
  };

  const signInWithEmailAndPassword = async (email, password) => {
    return await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        //console.log("user ", result.user.Aa);
        setUser(result.user);
        //saveToken(result.user.Aa);
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  const signInGoogle = () =>
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());

  const logout = async () => {
    return await firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        //deleteToken();
      });
  };

  const storage = () => {
    return firebase.storage();
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user);
      //saveToken(user.Aa);
      setIsAuthenticating(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const values = {
    user,
    setUser,
    isAuthenticating,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    signInWithEmailAndPassword,
    storage,
    signInGoogle,
    logout,
    checkout,
    cart,
    setCart,
    setCheckout,
  };

  return (
    <AuthContext.Provider value={values}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  );
};

export default firebase;
