import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const API_URL = "https://www.omdbapi.com/?apikey=fe2f6c44";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [explored, setExplored] = useState([]);
    const navigate = useNavigate();

    // Load explore section on mount
    useEffect(() => {
        fetchMovies().then(setExplored);
    }, []);

    // Debounced search — waits 500ms after user stops typing
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const timer = setTimeout(() => {
            searchMovies(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const fetchMovies = async (searchTerm) => {
        try {
            const response = await fetch(`${API_URL}&s=${searchTerm}`);
            const data = await response.json();
            return data.Search || [];
        } catch {
            return [];
        }
    };

    const searchMovies = async (searchTerm) => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch(`${API_URL}&s=${searchTerm}`);
            const data = await response.json();
            if (data.Response === "True") {
                setResults(data.Search);
            } else {
                setResults([]);
            }
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const isInitial = query.trim() === "";
    const displayMovies = isInitial ? explored : results;

    return (
        <Container>
            {/* Search Input */}
            <SearchBox>
                <SearchIcon>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="#f9f9f9" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" stroke="#f9f9f9" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </SearchIcon>
                <SearchInput
                    type="text"
                    placeholder="Search for movies or series..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                {query && <ClearButton onClick={() => setQuery("")}>✕</ClearButton>}
            </SearchBox>

            <Wrapper>
                {/* Loading */}
                {isLoading && <StatusText>Searching...</StatusText>}

                {/* Error */}
                {isError && <StatusText>Something went wrong. Try again.</StatusText>}

                {/* Title */}
                {!isLoading && (
                    <SectionTitle>
                        {isInitial
                            ? "Explore Everything"
                            : results.length > 0
                                ? `Search results for "${query}"`
                                : `No results for "${query}"`}
                    </SectionTitle>
                )}

                {/* Grid */}
                <Grid>
                    {displayMovies.map((movie) => (
                        <MovieCard
                            key={movie.imdbID}
                            onClick={() => navigate(`/detail/${movie.imdbID}`)}
                        >
                            <img
                                src={
                                    movie.Poster !== "N/A"
                                        ? movie.Poster
                                        : "/images/placeholder.jpg"
                                }
                                alt={movie.Title}
                            />
                            <MovieTitle>{movie.Title}</MovieTitle>
                            <MovieYear>{movie.Year}</MovieYear>
                        </MovieCard>
                    ))}
                </Grid>
            </Wrapper>
        </Container>
    );
};

export default Search;

const Container = styled.main`
  position: relative;
  min-height: 100vh;
  top: 72px;
  padding: 40px calc(3.5vw + 5px);

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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 14px 20px;
  margin-bottom: 40px;
  gap: 12px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  opacity: 0.7;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #f9f9f9;
  font-size: 18px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;

  &::placeholder {
    color: rgba(249, 249, 249, 0.4);
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: rgba(249, 249, 249, 0.5);
  font-size: 16px;
  cursor: pointer;
  padding: 4px;

  &:hover { color: #f9f9f9; }
`;

const Wrapper = styled.section`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #f9f9f9;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
`;

const StatusText = styled.p`
  color: rgba(249, 249, 249, 0.6);
  font-size: 16px;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  img: 40%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }
`;

const MovieCard = styled.div`
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  background: rgba(255,255,255,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    display: block;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  }

  &:hover > p { opacity: 1; }
`;

const MovieTitle = styled.p`
  position: absolute;
  bottom: 20px;
  left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  color: #f9f9f9;
  font-size: 12px;
  font-weight: 600;
  padding: 20px 8px 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const MovieYear = styled.p`
  position: absolute;
  bottom: 4px;
  left: 8px;
  color: rgba(249,249,249,0.6);
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;