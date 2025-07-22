import React, { useState, useEffect } from "react";

import { useDebounce } from "react-use";

import Search from "./Components/Search.jsx";

import Spinner from "./Components/Spinner.jsx";

import MovieCard from "./Components/MovieCard.jsx";

import { getTrendingMovies, updateSearch } from "./appwrite.js";

const API_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchList, setSearchList] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [movieList, setmovieList] = useState([]);
  const [errorMsg, seterrorMsg] = useState("");
  const [trendingList, settrendingList] = useState([]);
  const [useDebounceTerm, setuseDebounceTerm] = useState("");

  useDebounce(() => setuseDebounceTerm(searchList), 500, [searchList]);

  const fetchMoviesData = async (query) => {
    setisLoading(false);
    seterrorMsg("");
    try {
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies data");
      }
      const data = await response.json();

      if (data.Response === "false") {
        seterrorMsg("No movies found");
        setmovieList([]);
        return;
      }
      setmovieList(data.results);
      setisLoading(true);
      seterrorMsg("");
      if (query && data.results.length > 0) {
        await updateSearch(query, data.results[0]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setisLoading(false);
    }
  };

  const getTrendingList = async () => {
    try {
      const movies = await getTrendingMovies();
      settrendingList(movies);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMoviesData(useDebounceTerm);
  }, [useDebounceTerm]);

  useEffect(() => {
    getTrendingList();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <div>
            <img src="logo.png" alt="logo" className="logo" />
          </div>
          <img src="hero-img.png" alt="logo" />
          <h1>
            Find <span className="text-gradient">Movies</span> You’ll Love
            Without the Hassle
          </h1>
          <Search searchList={searchList} setSearchList={setSearchList} />
        </header>
        <h2>Trending Movies</h2>
        {trendingList.length > 0 && (
          <section className="trending">
            <ul>
              {trendingList.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
