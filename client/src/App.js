import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ForgotPass from "./pages/ForgotPass";
import CreatePost from "./pages/CreatePost";
import ResetPass from "./pages/ResetPass";
import Login from './pages/Login';
import Posts from './pages/Posts';
import Post from './pages/Post';
import EditPost from './pages/EditPost';
import AccountPosts from './pages/AccountPosts';
import CreateAccount from './pages/CreateAccount';
import { AuthContext } from './helpers/AuthContext';
import axios from 'axios';
import './App.css';

const App = () => {
  const [authState, setAuthState] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const fetchAuth = async () => {
    try {
    const response = await axios.get("/api/users/auth", { withCredentials: true })
    if (response.data.error) {
      setAuthState(false);
    } else {
      setAuthState(true);
    }
    setAuthLoading(true);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, authLoading }}>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/createAccount">
            <CreateAccount />
          </Route>
          <Route path="/forgotPass">
            <ForgotPass />
          </Route>
          <Route path="/password/:id">
            <ResetPass />
          </Route>
          <Route path="/post/:id">
            <Post />
          </Route>
          <Route path="/edit/:id">
            <EditPost />
          </Route>
          {/* <Route path="/posts">
            <Posts />
          </Route> */}
          <Route path="/account-posts">
            <AccountPosts />
          </Route>
          <Route path="/create-post">
            <CreatePost />
          </Route>
          <Route path="/">
          <Posts />
          </Route>
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;
