document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded");

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const trendingList = document.getElementById('trending-list');
    const topChartsList = document.getElementById('top-charts-list');
    const favoriteList = document.getElementById('favorite-list');
    const watchlistList = document.getElementById('watchlist-list');
    const apiKey = '57b82531'; 

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            console.log(`Searching for: ${query}`);
            fetchMovies(query);
        }
    });

    async function fetchMovies(query) {
        const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                displayMovies(data.Search, movieList);
            } else {
                console.log(`Error: ${data.Error}`);
                movieList.innerHTML = `<p>${data.Error}</p>`;
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    async function fetchTrendingMovies() {
        const currentYear = new Date().getFullYear();
        const url = `http://www.omdbapi.com/?s=&y=${currentYear}&apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                const sortedMovies = data.Search.sort((a, b) => b.Year - a.Year);
                displayMovies(sortedMovies, trendingList);
            } else {
                console.log(`Error: ${data.Error}`);
                trendingList.innerHTML = `<p>${data.Error}</p>`;
            }
        } catch (error) {
            console.error("Error fetching trending movies: ", error);
        }
    }

    async function fetchTopChartsMovies() {
        const url = `http://www.omdbapi.com/?s=&apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                const sortedMovies = data.Search.sort((a, b) => b.imdbRating - a.imdbRating);
                displayMovies(sortedMovies.slice(0, 10), topChartsList);
            } else {
                console.log(`Error: ${data.Error}`);
                topChartsList.innerHTML = `<p>${data.Error}</p>`;
            }
        } catch (error) {
            console.error("Error fetching top charts movies: ", error);
        }
    }

    function displayMovies(movies, container) {
        container.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <div class="ratings">IMDB Rating: ${movie.imdbRating || 'N/A'}</div>
                <span class="material-icons favorite-button">${isFavorite(movie.imdbID) ? 'favorite' : 'favorite_border'}</span>
                <span class="material-icons watchlist-button">${isInWatchlist(movie.imdbID) ? 'bookmark' : 'bookmark_border'}</span>
            `;
            const favoriteButton = movieItem.querySelector('.favorite-button');
            favoriteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleFavorite(movie, favoriteButton);
            });
            const watchlistButton = movieItem.querySelector('.watchlist-button');
            watchlistButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleWatchlist(movie, watchlistButton);
            });
            movieItem.addEventListener('click', () => {
                fetchMovieDetails(movie.imdbID);
            });
            container.appendChild(movieItem);
        });
    }

    async function fetchMovieDetails(imdbID) {
        const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                displayMovieDetails(data);
            } else {
                console.log(`Error: ${data.Error}`);
                document.getElementById('movie-details').innerHTML = `<p>${data.Error}</p>`;
            }
        } catch (error) {
            console.error("Error fetching movie details: ", error);
        }
    }

    function displayMovieDetails(movie) {
        const movieDetails = document.getElementById('movie-details');
        movieDetails.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>IMDB Rating:</strong> ${movie.imdbRating || 'N/A'}</p>
        `;
        document.getElementById('results').style.display = 'none';
        document.getElementById('details').style.display = 'block';
    }

    function toggleFavorite(movie, button) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const movieIndex = favorites.findIndex(fav => fav.imdbID === movie.imdbID);
        if (movieIndex > -1) {
            favorites.splice(movieIndex, 1);
            button.textContent = 'favorite_border';
        } else {
            favorites.push(movie);
            button.textContent = 'favorite';
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }

    function toggleWatchlist(movie, button) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const movieIndex = watchlist.findIndex(watch => watch.imdbID === movie.imdbID);
        if (movieIndex > -1) {
            watchlist.splice(movieIndex, 1);
            button.textContent = 'bookmark_border';
        } else {
            watchlist.push(movie);
            button.textContent = 'bookmark';
        }
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        displayWatchlist();
    }

    function isFavorite(movieID) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(fav => fav.imdbID === movieID);
    }

    function isInWatchlist(movieID) {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        return watchlist.some(watch => watch.imdbID === movieID);
    }

    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        displayMovies(favorites, favoriteList);
    }

    function displayWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        displayMovies(watchlist, watchlistList);
    }

    // Fetch data on load
    fetchTrendingMovies();
    fetchTopChartsMovies();
    displayFavorites();
    displayWatchlist();
});