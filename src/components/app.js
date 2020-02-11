// node_modules
import React, { useEffect, useState, useCallback } from 'react';

// app_modules
import { apikey } from '../config';

const App = () => {
  let [movies, setMovies] = useState([]);
  let [genres, setGenenres] = useState([]);
  let [loading, setLoading] = useState(true);
  let [selectedGenres, setSelectedGenres] = useState([]);
  let [rating, setRating] = useState(0);

  useEffect(() => {
    const moviesAPI = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}`;
    const genresAPI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}`;

    async function fetchMovies() {
      let moviesPromise = await fetch(moviesAPI).then(res => res.json());
      let genresPromise = await fetch(genresAPI).then(res => res.json());

      let [{ results: movies }, { genres }] = await Promise.all([
        moviesPromise,
        genresPromise
      ]);

      console.log({ movies, genres });

      setMovies(movies);
      setGenenres(genres);
      setLoading(false);
    }

    fetchMovies();
  }, []);

  function sorter(a, b) {
    return b.popularity - a.popularity;
  }

  const onToglleGenre = useCallback(
    ({ target }) => {
      target.checked
        ? setSelectedGenres([...selectedGenres, Number(target.value)])
        : setSelectedGenres(
            selectedGenres.filter(g => g !== Number(target.value))
          );
    },
    [selectedGenres]
  );

  const onChangeRating = useCallback(({ target }) => {
    setRating(Number(target.value));
  }, []);

  return (
    <main
      css={`
        width: 100%;
        width: 100%;
        max-width: 850px;
        margin: auto;
        overflow: hidden;
        position: relative;
      `}
    >
      <>
        <header
          css={`
            padding: 10px;
            background-color: #83b4b0;
            position: sticky;
            top: 0;
          `}
        >
          <form
            css={`
              display: flex;
            `}
            onSubmit={e => e.preventDefault()}
          >
            <div
              css={`
                flex: 0 0 85px;
              `}
            >
              Filter by:
            </div>
            <div
              css={`
                flex: auto;
                div {
                  font-weight: bold;
                  margin-bottom: 5px;
                  font-size: 14px;
                }
              `}
            >
              <div>Genre</div>
              {genres.map(g => (
                <label
                  key={g.id}
                  htmlFor={g.id}
                  css={`
                    margin: 5px 10px;
                    cursor: pointer;
                  `}
                >
                  <input
                    type="checkbox"
                    onChange={onToglleGenre}
                    checked={selectedGenres.includes(g.id)}
                    value={g.id}
                    name={g.name}
                    id={g.id}
                  />
                  {g.name}
                </label>
              ))}
              <div
                css={`
                  margin-top: 35px;
                `}
              >
                Rating
              </div>

              <select onChange={onChangeRating} value={rating}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(opt => (
                  <option value={opt} key={opt}>
                    {opt + 1} or higher
                  </option>
                ))}
              </select>
            </div>
          </form>
        </header>
        {loading ? (
          <div
            css={`
              text-align: center;
              padding: 50px;
            `}
          >
            Loading...
          </div>
        ) : (
          <ul
            css={`
              font-size: 14px;
              li {
                display: flex;
                padding: 16px 0;
                line-height: 1.4;
              }
            `}
          >
            {movies
              .filter(m => {
                // if there's selected genre that's not included in this movies' genres, don't show the movie
                if (!selectedGenres.length) return true;

                let result = selectedGenres.find(g => !m.genre_ids.includes(g));

                return result ? false : true;
              })
              .filter(m => m.vote_average >= rating + 1)
              .sort(sorter)
              .map(m => (
                <li key={m.id}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200/${m.poster_path}`}
                    alt={`poster of ${m.title}`}
                  />
                  <div>
                    <div>Title: {m.title}</div>
                    <div>
                      Genres:{' '}
                      {m.genre_ids.map(gId => (
                        <span key={gId}>
                          {genres.find(g => g.id == gId).name + ' '}
                        </span>
                      ))}
                    </div>
                    <div>Rating: {m.vote_average}</div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </>
    </main>
  );
};

export default App;
