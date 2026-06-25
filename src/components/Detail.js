import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import db from "../firebase";

const API_KEY = "fe2f6c44";


// AIzaSyAg8FALoXUCNkpKSA1PqambAigq5eYKd1M

const YOUTUBE_KEY = "AIzaSyAg8FALoXUCNkpKSA1PqambAigq5eYKd1M";

const Detail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  const [similar, setSimilar] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const isImdbId = id.startsWith("tt");
    const isTmdbId = id.startsWith("tmdb-");
    if (isTmdbId) {
      // Handle TMDB ID
      const tmdbId = id.replace("tmdb-", "");
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=1a9a4ec57754be0998904a3e0f27d19f`)
        .then((res) => res.json())
        .then((data) => {
          setMovie({
            titleImg: null,
            backgroundImg: data.backdrop_path
              ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
              : `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            cardImg: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            title: data.title,
            subTitle: `${data.release_date?.slice(0, 4)} • ${data.runtime} min • ${data.genres?.map(g => g.name).join(", ")}`,
            description: data.overview,
            type: "tmdb",
          });

          // Similar movies
          fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/similar?api_key=1a9a4ec57754be0998904a3e0f27d19f`)
            .then(r => r.json())
            .then(d => setSimilar(d.results?.slice(0, 6).map(m => ({
              imdbID: `tmdb-${m.id}`,
              Title: m.title,
              Poster: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : "N/A"
            })) || []));

          setLoading(false);
        });
    } else if (isImdbId) {
      fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
        .then((res) => res.json())
        .then((data) => {
          if (data.Response === "True") {
            setMovie({
              titleImg: data.Poster !== "N/A" ? data.Poster : null,
              backgroundImg: data.Poster,
              cardImg: data.Poster,
              title: data.Title,
              subTitle: `${data.Year} • ${data.Runtime} • ${data.Genre}`,
              description: data.Plot,
              type: "omdb",
            });

            // ✅ moved inside here so data.Genre is accessible
            if (data.Genre) {
              const genre = data.Genre.split(",")[0].trim();
              fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${genre}&type=movie`)
                .then((res) => res.json())
                .then((d) => setSimilar(d.Search?.slice(0, 6) || []));
            }
          }
          setLoading(false);
        });
    } else {
      db.collection("movies")
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setMovie({ id: doc.id, ...doc.data() });
          }
          setLoading(false);
        });
    }
  }, [id]);


  // Fetch YouTube trailer
  const handleTrailer = async () => {
    const title = movie?.title;
    if (!title) return;
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          title + " official trailer"
        )}&type=video&key=${YOUTUBE_KEY}&maxResults=1`
      );
      const data = await res.json();
      const videoId = data.items?.[0]?.id?.videoId;
      if (videoId) {
        setTrailerKey(videoId);
        setShowTrailer(true);
      }
    } catch {
      alert("Could not load trailer.");
    }
  };

  if (loading) return <LoadingScreen>Loading...</LoadingScreen>;
  if (!movie) return <LoadingScreen>Movie not found.</LoadingScreen>;

  return (
    <Container>
      <Background>
        <img src={movie.backgroundImg || movie.cardImg} alt={movie.title} />
      </Background>

      <ImageTitle>
        {movie.titleImg ? (
          <img src={movie.titleImg} alt={movie.title} />
        ) : (
          <PlainTitle>{movie.title}</PlainTitle>
        )}
      </ImageTitle>

      <Controls>
        <PlayButton>
          <span>▶</span> PLAY
        </PlayButton>
        <TrailerButton onClick={handleTrailer}>
          <span>▶</span> TRAILER
        </TrailerButton>
        <AddButton>+</AddButton>
        <GroupButton>👥</GroupButton>
      </Controls>

      <SubTitle>{movie.subTitle}</SubTitle>
      <Description>{movie.description}</Description>

      {similar.length > 0 && (
        <SimilarSection>
          <SimilarTitle>More Like This</SimilarTitle>
          <SimilarGrid>
            {similar.map((m) => (
              <SimilarCard
                key={m.imdbID}
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(`/detail/${m.imdbID}`);
                }}
              >
                <img
                  src={m.Poster !== "N/A" ? m.Poster : "/images/placeholder.jpg"}
                  alt={m.Title}
                />
                <span>{m.Title}</span>
              </SimilarCard>
            ))}
          </SimilarGrid>
        </SimilarSection>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <Modal onClick={() => setShowTrailer(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={() => setShowTrailer(false)}>✕</CloseBtn>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Detail;

const Container = styled.main`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.4;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageTitle = styled.div`
  width: 35vw;
  min-width: 200px;
  padding-top: 60px;

  img {
    width: 50%;
  }
`;

const PlainTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #f9f9f9;
  letter-spacing: 2px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-flow: row nowrap;
  margin: 24px 0 16px;
`;

const PlayButton = styled.button`
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgb(249, 249, 249);
  color: #000;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.5px;

  span { font-size: 18px; }
`;

const TrailerButton = styled(PlayButton)`
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);

  &:hover { background: rgba(249, 249, 249, 0.2); }
`;

const AddButton = styled.button`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  border: 2px solid #f9f9f9;
  background: transparent;
  color: #f9f9f9;
  font-size: 24px;
  cursor: pointer;

  &:hover { background: rgba(249, 249, 249, 0.2); }
`;

const GroupButton = styled(AddButton)`
  font-size: 18px;
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;
  margin-bottom: 16px;
`;

const Description = styled.div`
  line-height: 1.5;
  font-size: 20px;
  padding: 16px 0;
  color: rgb(249, 249, 249);
  max-width: 760px;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #f9f9f9;
`;

/* Trailer Modal */
const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  position: relative;
  width: 80vw;
  height: 45vw;
  max-width: 900px;
  max-height: 506px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(0,0,0,0.7);
  border: none;
  color: #fff;
  font-size: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;

  &:hover { background: rgba(255,255,255,0.2); }
`;


//----

const SimilarSection = styled.div`
  margin-top: 48px;
  padding-bottom: 60px;
`;

const SimilarTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #f9f9f9;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
`;

const SimilarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const SimilarCard = styled.div`
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease;

  img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    display: block;
  }

  span {
    position: absolute;
    bottom: 0;
    left: 0; right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    color: #f9f9f9;
    font-size: 12px;
    padding: 20px 8px 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    transform: scale(1.05);
    span { opacity: 1; }
  }
`;