import React from "react";
import { NavBar } from "./index";
import { Switch, Route, Redirect } from "react-router-dom";

const Main = () => {
  return (
    <div className="main_container">
      <h1 className="main_title">
        Welcome to the hottest spot to search for movies
      </h1>
      <NavBar />
      <Switch>
        <Route
          path="/movies/:movieId"
          render={() => {
            return //component to render;
          }}
        />
        <Route
          path="/movies"
          render={() => {
            return //component to render;
          }}
        />
        <Redirect to="/movies" />
      </Switch>
    </div>
  );
};

export default Main;
