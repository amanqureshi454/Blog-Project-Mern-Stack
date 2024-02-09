import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import BlogPage from "./Pages/BlogPage";
import Signin from "./Pages/Sigin";
import Register from "./Pages/Register";
import BlogDetail from "./Pages/BlogDetail";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CreatePost from "./Pages/CreatePost";
import ProfilePage from "./Pages/ProfilePage";
import EditPost from "./Pages/EditPost";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BlogPage />} />
          <Route path="/blogdetail/:id" element={<BlogDetail />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/editpost/:id" element={<EditPost />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
