import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
import ImgSlider from "./ImgSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
import Viewers from "./Viewers";
import MovieRow from "./MovieRow";
// import { selectRecommend, selectNewDisney, selectOriginal, selectTrending } from "../features/movie/movieSlice";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice"
import { selectUserName } from "../features/user/userSlice"
import Footer from "./Footer";

import Recommends from "./Recommends";
import Originals from "./Originals";
import Trending from "./Trending";
// import Search from "./Search";

// import TMDBSection from "./TMDBSection";

const TMDB_KEY = "1a9a4ec57754be0998904a3e0f27d19f";
const OMDB_KEY = "fe2f6c44";
// const TMDB_IMG = "https://image.tmdb.org/t/p/w500";


const Home = (props) => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  // Firebase data from Redux
  // const recommend = useSelector(selectRecommend);
  // const newDisney = useSelector(selectNewDisney);
  // const original = useSelector(selectOriginal);
  // const trending = useSelector(selectTrending);

  // TMDB state
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  // OMDB state
  const [omdbAction, setOmdbAction] = useState([]);
  const [omdbFamily, setOmdbFamily] = useState([]);

  useEffect(() => {
    db.collection("movies").onSnapshot((snapshot) => {
      // ✅ declare inside useEffect so they're truly local
      const recommends = [];
      const newDisneys = [];
      const originals = [];
      const trending = [];

      snapshot.docs.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        switch (doc.data().type) {
          case "recommend":
            recommends.push(data);
            break;
          case "new":
            newDisneys.push(data);
            break;
          case "original":
            originals.push(data);
            break;
          case "trending":
            trending.push(data);
            break;
          default:                        // add default case
            break;
        }
      });

      dispatch(
        setMovies({
          recommend: recommends,
          newDisney: newDisneys,
          original: originals,
          trending: trending,
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName])


  // Load TMDB
  useEffect(() => {
    // In your fetchTMDB function, change image to use poster_path:
    const fetchTMDB = async (endpoint, setter) => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${endpoint}?api_key=${TMDB_KEY}`);
      const data = await res.json();
      setter(
        (data.results || []).map((m) => ({
          id: `tmdb-${m.id}`,
          title: m.title,
          // ✅ use poster_path for portrait cards, not backdrop_path
          image: m.poster_path
            ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
            : "/images/placeholder.jpg",
          link: `/detail/tmdb-${m.id}`,
          rating: m.vote_average?.toFixed(1),
        }))
      );
    };
    fetchTMDB("popular", setPopularMovies);
    fetchTMDB("top_rated", setTopRated);
    fetchTMDB("upcoming", setUpcoming);
  }, []);


  // Load OMDB
  useEffect(() => {
    const fetchOMDB = async (query, setter) => {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${query}&type=movie`);
      const data = await res.json();
      setter(
        (data.Search || []).map((m) => ({
          id: m.imdbID,
          title: m.Title,
          image: m.Poster !== "N/A" ? m.Poster : "/images/placeholder.jpg",
          link: `/detail/${m.imdbID}`,
          rating: null,
        }))
      );
    };
    fetchOMDB("marvel", setOmdbAction);
    fetchOMDB("disney", setOmdbFamily);
  }, []);

  // Convert Firebase data to unified format
  // const toMovieFormat = (list) =>
  //   (list || []).map((m) => ({
  //     id: m.id,
  //     title: m.title || "",
  //     image: m.cardImg || m.backgroundImg || "/images/placeholder.jpg",
  //     link: `/detail/${m.id}`,
  //     rating: null,
  //   }));


  return (
    <>
      <Container>
        <ImgSlider />
        <Viewers />

        {/* Firebase Sections — all now sliders */}
        {/* <MovieRow title="Recommends for You" movies={toMovieFormat(recommend)} />
        <MovieRow title="New to Disney+" movies={toMovieFormat(newDisney)} />
        <MovieRow title="Originals" movies={toMovieFormat(original)} />
        <MovieRow title="Trending" movies={toMovieFormat(trending)} /> */}

        <Recommends />
        <newDisney />
        <Originals />
        <Trending />

        {/* TMDB Sections */}
        <MovieRow
          title="Recommended Movies"
          subtitle="Most popular right now"
          movies={popularMovies}
        />
        <MovieRow
          title="Top Rated"
          subtitle="Highest rated of all time"
          movies={topRated}
        />
        <MovieRow
          title="Online Streaming Events"
          subtitle="New releases coming soon"
          movies={upcoming}
        />

        {/* OMDB Sections */}
        <MovieRow
          title="Marvel & Action"
          subtitle="Search powered by OMDB"
          movies={omdbAction}
        />
        <MovieRow
          title="Disney"
          subtitle="Search powered by OMDB"
          movies={omdbFamily}
        />

      </Container>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </>


  )
}

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

const FooterWrapper = styled.div`
  position: relative;
  top: 72px;   /* same as Container top, so it lines up */
  // margin-top: 20px;
`;



export default Home;