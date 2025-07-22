import React from "react";

const MovieCard = ({
  movie: { original_language, title, vote_average, release_date, poster_path },
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `http://image.tmdb.org/t/p/w500${poster_path}`
            : "No-Poster.png"
        }
        alt="movie-image"
      />
      <div className="mt-4">
        <p className="text-white">{title}</p>
        <div className="content">
          <div className="rating">
            <img src="Rating.svg" alt="rating" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span className="text-white">•</span>
          <p className="lang">{original_language}</p>
          <span className="text-white">•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
