import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const TMDB_KEY = "1a9a4ec57754be0998904a3e0f27d19f";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const TMDBSection = ({ title, subtitle, endpoint }) => {
    const [movies, setMovies] = useState([]);
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${endpoint}?api_key=${TMDB_KEY}&language=en-US&page=1`)
            .then((res) => res.json())
            .then((data) => setMovies(data.results || []));
    }, [endpoint]);

    const slideLeft = () => {
        sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
    };

    const slideRight = () => {
        sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
    };

    return (
        <Section>
            <SectionHeader>
                <div>
                    <SectionTitle>{title}</SectionTitle>
                    {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
                </div>
            </SectionHeader>

            <SliderWrapper>
                <ArrowBtn direction="left" onClick={slideLeft}>&#8249;</ArrowBtn>

                <SliderTrack ref={sliderRef}>
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            onClick={() => navigate(`/detail/tmdb-${movie.id}`)}
                        >
                            <img
                                src={
                                    movie.poster_path
                                        ? `${TMDB_IMG}${movie.poster_path}`
                                        : "/images/placeholder.jpg"
                                }
                                alt={movie.title}
                            />
                            <CardOverlay>
                                <CardTitle>{movie.title}</CardTitle>
                                <CardRating>⭐ {movie.vote_average?.toFixed(1)}</CardRating>
                            </CardOverlay>
                        </MovieCard>
                    ))}
                </SliderTrack>

                <ArrowBtn direction="right" onClick={slideRight}>&#8250;</ArrowBtn>
            </SliderWrapper>
        </Section>
    );
};

export default TMDBSection;

const Section = styled.div`
  margin: 30px 0;
`;

const SectionHeader = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #f9f9f9;
  letter-spacing: 0.5px;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: rgba(249, 249, 249, 0.5);
  margin-top: 4px;
`;

const SliderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ArrowBtn = styled.button`
  position: absolute;
  ${(props) => (props.direction === "left" ? "left: -20px;" : "right: -20px;")}
  z-index: 5;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(249, 249, 249, 0.3);
  color: #f9f9f9;
  font-size: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;

  &:hover {
    background: rgba(249, 249, 249, 0.2);
    border-color: #f9f9f9;
  }
`;

const SliderTrack = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  padding: 10px 4px;

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MovieCard = styled.div`
  flex-shrink: 0;
  width: 150px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    display: block;
  }

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
  }

  &:hover > div {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 120px;
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.92));
  padding: 24px 8px 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const CardTitle = styled.p`
  color: #f9f9f9;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.3;
`;

const CardRating = styled.p`
  color: rgba(249, 249, 249, 0.8);
  font-size: 11px;
`;
