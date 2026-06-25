import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MovieRow = ({ title, subtitle, movies }) => {
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    const slideLeft = () => sliderRef.current.scrollBy({ left: -600, behavior: "smooth" });
    const slideRight = () => sliderRef.current.scrollBy({ left: 600, behavior: "smooth" });

    if (!movies || movies.length === 0) return null;

    return (
        <Section>
            <SectionHeader>
                <SectionTitle>{title}</SectionTitle>
                {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
            </SectionHeader>

            <SliderWrapper>
                <ArrowBtn direction="left" onClick={slideLeft}>&#8249;</ArrowBtn>

                <SliderTrack ref={sliderRef}>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} onClick={() => navigate(movie.link)}>
                            <ImgWrapper>
                                <img
                                    src={movie.image}
                                    alt={movie.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/placeholder.jpg";
                                    }}
                                />
                            </ImgWrapper>
                            <CardOverlay>
                                <CardTitle>{movie.title}</CardTitle>
                                {movie.rating && <CardRating>⭐ {movie.rating}</CardRating>}
                            </CardOverlay>
                        </MovieCard>
                    ))}
                </SliderTrack>

                <ArrowBtn direction="right" onClick={slideRight}>&#8250;</ArrowBtn>
            </SliderWrapper>
        </Section>
    );
};

export default MovieRow;

const Section = styled.div`
  margin: 36px 0;
`;

const SectionHeader = styled.div`
  margin-bottom: 14px;
  padding-left: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #f9f9f9;
  letter-spacing: 0.5px;
  font-family: 'Inter', sans-serif;
`;

const SectionSubtitle = styled.p`
  font-size: 12px;
  color: rgba(249, 249, 249, 0.45);
  margin-top: 3px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
`;

const SliderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ArrowBtn = styled.button`
  position: absolute;
  ${(p) => (p.direction === "left" ? "left: -22px;" : "right: -22px;")}
  z-index: 5;
  background: rgba(9, 11, 19, 0.9);
  border: 1.5px solid rgba(249, 249, 249, 0.25);
  color: #f9f9f9;
  font-size: 30px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  line-height: 1;

  &:hover {
    background: rgba(249, 249, 249, 0.15);
    border-color: rgba(249, 249, 249, 0.7);
    transform: scale(1.1);
  }
`;

const SliderTrack = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  padding: 8px 2px 12px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* ✅ Portrait card — works for OMDB posters, Firebase cards, TMDB posters */
const MovieCard = styled.div`
  flex-shrink: 0;
  width: 160px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: #1a1d29;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: scale(1.07);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.75);
  }

  &:hover > div {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 120px;
  }
`;

const ImgWrapper = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;   /* ✅ portrait ratio — same for all sources */
  overflow: hidden;
  background: #1a1d29;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    transition: transform 0.3s ease;
  }

  ${MovieCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.95));
  padding: 28px 10px 10px;
  opacity: 0;
  transition: opacity 0.25s ease;
`;

const CardTitle = styled.p`
  color: #f9f9f9;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 3px;
  line-height: 1.3;
  font-family: 'Inter', sans-serif;
`;

const CardRating = styled.p`
  color: rgba(249, 249, 249, 0.7);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
`;