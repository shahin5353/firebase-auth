import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import avatar from './images/avatar.png';

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: avatar
  })
  const signInHandler = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        setUser({
          isSignedIn: true,
          name: displayName,
          email: email,
          password: '',
          photo: photoURL,
        })
      })
      .catch(err => {
        document.getElementById('error').innerText = err;
      })
  }
  const signOutHandler = () => {
    firebase.auth().signOut()
      .then(res => {
        setUser({
          isSignedIn: false,
          name: '',
          email: '',
          password: '',
          photo: '',
        })
      })
      .catch(err => {
        document.getElementById('error').innerText = err;
      })
  }
  //check validation
  const is_valid_email = mail => /(.+)@(.+){2,}\.(.+){2,}/.test(mail);
  const hasNumber = pass => /\d/.test(pass);

  const changeHandler = (e) => {
    const newUser = {
      ...user
    }
    //perform validation
    let isValidMail = true;
    let isValidPass = true;
    if (e.target.name === 'email') {
      isValidMail = is_valid_email(e.target.value);
    }
    if (e.target.name === 'password') {
      isValidPass = e.target.value.length >= 8 && hasNumber(e.target.value);
    }
    newUser[e.target.name] = e.target.value;
    newUser.validEmail = isValidMail;
    newUser.validPass = isValidPass;
    setUser(newUser);
  }
  const createAccount = (e) => {
    if (user.validEmail && user.validPass) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })

    } 

    e.preventDefault();
    e.target.reset();
  }
  const login = e => {
    if (user.validEmail && user.validPass) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })

    } 
    e.preventDefault();
    e.target.reset();
  }
  return (
    <div className="App">
      <div className="col-4 mx-auto">
        <h1>Firebase Authentication</h1>
        {
          !user.isSignedIn &&
          <button className="btn" style={{ backgroundColor: '#92342e', color: '#fff' }} onClick={signInHandler}><i className="fa fa-google"></i> Continue with Gmail</button>
        }
        <p id="error">  </p>
        {
          user.isSignedIn &&
          /*logged In user card*/
          <div className="card text-center mx-auto bg-dark text-light" style={{ width: '250px', marginTop: '100px' }}>
            <img className="card-img-top rounded-circle mx-auto" src={user.photo} style={{ maxWidth: '170px', marginTop: '-80px' }} alt="" />

            <div className="card-header text-light">
              Welcome {user.name}
            </div>
            <div className="card-body">
              <p className="card-text">Email: {user.email}</p>
            </div>
            <div className="card-footer">
              <button className="btn btn-danger" onClick={signOutHandler}>Sign Out</button>
            </div>
          </div>
        }

        {!user.isSignedIn &&
          <div>
            <p className="divider-text my-4">
              <span className="bg-light px-5">OR</span>
            </p>
            {/* nav-tabs - login || create account */}
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Create Account</a>
                <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Log In</a>
              </div>
            </nav>
            {/*create account form */}
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <form onSubmit={createAccount}>
                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                    </div>
                    <input onBlur={changeHandler} className="form-control" placeholder="Name" type="text" name="name" required />
                  </div>
                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                    </div>
                    <input onBlur={changeHandler} className="form-control" placeholder="Email address" type="email" name="email" required />
                  </div>
                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                    </div>
                    <input onBlur={changeHandler} className="form-control" placeholder="Password - must be at least 8 characters and contains number" type="password" name="password" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block"> Create Account  </button>
                  </div>
                </form>
              </div>
             
              {/* login form */}
              <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <form onSubmit={login}>
                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                    </div>
                    <input onBlur={changeHandler} className="form-control" placeholder="Email address" type="email" name="email" required />
                  </div>
                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                    </div>
                    <input onBlur={changeHandler} className="form-control" placeholder="Password" type="password" name="password" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block"> Log In  </button>
                  </div>
                </form>
              </div>
              {
                user.error && <p style={{ color: 'red' }}> {user.error} </p>
              }
            </div>
          </div>
        }


      </div>
    </div>
  );
}

export default App;
