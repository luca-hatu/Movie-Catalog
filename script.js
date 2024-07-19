document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded");

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const trendingList = document.getElementById('trending-list');
    const favoriteList = document.getElementById('favorite-list');
    const watchlistList = document.getElementById('watchlist-list');
    const apiKey = 'cde8a23dec2b79e02c74f516c214114b'; 

    const searchPopup = document.getElementById('search-popup');
    const favoritesPopup = document.getElementById('favorites-popup');
    const watchlistPopup = document.getElementById('watchlist-popup');
    const detailsPopup = document.getElementById('details-popup');
    const searchPopupClose = document.getElementById('search-popup-close');
    const favoritesPopupClose = document.getElementById('favorites-popup-close');
    const watchlistPopupClose = document.getElementById('watchlist-popup-close');
    const detailsPopupClose = document.getElementById('details-popup-close');

    const searchIcon = document.getElementById('search-icon');
    const favoritesIcon = document.getElementById('favorites-icon');
    const watchlistIcon = document.getElementById('watchlist-icon');

    searchIcon.addEventListener('click', () => {
        searchPopup.style.display = 'flex';
    });

    favoritesIcon.addEventListener('click', () => {
        favoritesPopup.style.display = 'flex';
    });

    watchlistIcon.addEventListener('click', () => {
        watchlistPopup.style.display = 'flex';
    });

    searchPopupClose.addEventListener('click', () => {
        searchPopup.style.display = 'none';
    });

    favoritesPopupClose.addEventListener('click', () => {
        favoritesPopup.style.display = 'none';
    });

    watchlistPopupClose.addEventListener('click', () => {
        watchlistPopup.style.display = 'none';
    });

    detailsPopupClose.addEventListener('click', () => {
        detailsPopup.style.display = 'none';
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            console.log(`Searching for: ${query}`);
            fetchMovies(query);
        }
    });

    async function fetchMovies(query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched movies:', data);
            if (data.results.length > 0) {
                displayMovies(data.results, movieList);
            } else {
                console.log('No movies found');
                movieList.innerHTML = `<p>No movies found</p>`;
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            movieList.innerHTML = `<p>Error fetching data</p>`;
        }
    }

    function displayMovies(movies, container) {
        container.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p class="ratings">Rating: ${movie.vote_average}</p>
                <button class="details-button" data-movie-id="${movie.id}">Details</button>
                <span class="material-icons favorite-button" data-movie-id="${movie.id}">favorite_border</span>
                <span class="material-icons watchlist-button" data-movie-id="${movie.id}">bookmark_border</span>
            `;
            container.appendChild(movieItem);

            const detailsButton = movieItem.querySelector('.details-button');
            const favoriteButton = movieItem.querySelector('.favorite-button');
            const watchlistButton = movieItem.querySelector('.watchlist-button');

            detailsButton.addEventListener('click', () => {
                showDetails(movie.id);
            });

            favoriteButton.addEventListener('click', () => {
                addToFavorites(movie);
                favoriteButton.textContent = 'favorite';
            });

            watchlistButton.addEventListener('click', () => {
                addToWatchlist(movie);
                watchlistButton.textContent = 'bookmark';
            });
        });
    }

    async function showDetails(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const movie = await response.json();
            console.log('Fetched movie details:', movie);
            displayMovieDetails(movie);
        } catch (error) {
            console.error("Error fetching movie details: ", error);
        }
    }

    function displayMovieDetails(movie) {
        const movieDetails = document.getElementById('movie-details');
        movieDetails.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
            <p>Rating: ${movie.vote_average}</p>
            <p>Release Date: ${movie.release_date}</p>
        `;
        detailsPopup.style.display = 'flex';
    }

    function addToFavorites(movie) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.id === movie.id)) {
            favorites.push(movie);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        }
    }

    function addToWatchlist(movie) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        if (!watchlist.some(watch => watch.id === movie.id)) {
            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            displayWatchlist();
        }
    }

    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoriteList.innerHTML = '';
        favorites.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
            `;
            movieItem.addEventListener('click', () => {
                showDetails(movie.id);
            });
            favoriteList.appendChild(movieItem);
        });
    }

    function displayWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlistList.innerHTML = '';
        watchlist.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
            `;
            movieItem.addEventListener('click', () => {
                showDetails(movie.id);
            });
            watchlistList.appendChild(movieItem);
        });
    }
    displayFavorites();
    displayWatchlist();

    async function fetchTrendingMovies() {
        const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched trending movies:', data);
            if (data.results.length > 0) {
                displayMovies(data.results, trendingList);
            }
        } catch (error) {
            console.error("Error fetching trending movies: ", error);
        }
    }

    fetchTrendingMovies();
});