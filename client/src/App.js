import { useEffect } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

import Login from './components/user/Login'
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

import ProtectedRoute from './components/route/ProtectedRoute';
import {loadUser} from './actions/userActions';
import { useDispatch } from "react-redux";


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={ <Home /> } exact />
            <Route path="/search/:keyword" element={ <Home /> }/>
            <Route path="/product/:id" element={ <ProductDetails /> } exact />

            <Route path="/login" element={ <Login /> } exact />
            <Route path="/register" element={ <Register /> } exact />
            <Route path="/password/forgot" element={ <ForgotPassword /> } exact />
            <Route path="/password/reset/:token" element={ <NewPassword /> } exact />
            <Route 
              path="/me" 
              element={ 
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute> 
              }
            />
            <Route 
              path="/me/update" 
              element={ 
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute> 
              }
            />
            <Route 
              path="/password/update" 
              element={ 
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute> 
              }
            />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
