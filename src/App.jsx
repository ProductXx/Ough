import React from "react";
import { Route, Routes } from "react-router-dom";
import Table from "./components/Table";
import Card from "./components/Card";
import AddMember from "./components/AddMember";
import "./App.css";
import Nav from "./components/Nav";

const App = () => {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/print" element={<Card />} />
        <Route path="/create" element={<AddMember />} />
      </Routes>
    </>
  );
};

export default App;
