document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded");

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    const directorFilter = document.getElementById('director-filter');
    const actorFilter = document.getElementById('actor-filter');
    const sortBy = document.getElementById('sort-by');
    const movieList = document.getElementById('movie-list');
    const favoriteList = document.getElementById('favorite-list');
    const watchlistList = document.getElementById('watchlist-list');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        const genre = genreFilter.value;
        const year = yearFilter.value;
        const director = directorFilter.value;
        const actor = actorFilter.value;
        const sort = sortBy.value;

        if (query) {
            console.log(`Searching for: ${query}`);
            fetchMovies(query, genre, year, director, actor, sort);
        }
    });

    async function fetchMovies(query, genre, year, director, actor, sort) {
        const apiKey = '57b82531'; 
        let url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
        
        if (genre) url += `&genre=${genre}`;
        if (year) url += `&y=${year}`;
        if (director) url += `&director=${director}`;
        if (actor) url += `&actor=${actor}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                const sortedMovies = sortMovies(data.Search, sort);
                displayMovies(sortedMovies);
            } else {
                console.log(data.Error);
                movieList.innerHTML = `<p>${data.Error}</p>`;
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    function sortMovies(movies, sortBy) {
        if (sortBy === 'rating') {
            return movies.sort((a, b) => getAverageRating(b) - getAverageRating(a));
        } else if (sortBy === 'year') {
            return movies.sort((a, b) => b.Year - a.Year);
        } else if (sortBy === 'popularity') {
            return movies.sort((a, b) => getPopularity(b) - getPopularity(a));
        } else {
            return movies;
        }
    }

    function getAverageRating(movie) {
        const ratings = movie.Ratings || [];
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + parseFloat(rating.Value), 0);
        return sum / ratings.length;
    }

    function displayMovies(movies) {
        movieList.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <div class="ratings">${getRatingsHTML(movie.Ratings)}</div>
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
            movieList.appendChild(movieItem);
        });
    }

    function getRatingsHTML(ratings) {
        if (!ratings) return '';
        return ratings.map(rating => `
            <span>${rating.Source}: ${rating.Value}</span>
        `).join('');
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

    function isFavorite(imdbID) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(fav => fav.imdbID === imdbID);
    }

    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoriteList.innerHTML = '';
        favorites.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <div class="ratings">${getRatingsHTML(movie.Ratings)}</div>
                <span class="material-icons favorite-button">favorite</span>
                <span class="material-icons watchlist-button">${isInWatchlist(movie.imdbID) ? 'bookmark' : 'bookmark_border'}</span>
            `;
            const watchlistButton = movieItem.querySelector('.watchlist-button');
            watchlistButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleWatchlist(movie, watchlistButton);
            });
            movieItem.addEventListener('click', () => {
                fetchMovieDetails(movie.imdbID);
            });
            favoriteList.appendChild(movieItem);
        });
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

    function isInWatchlist(imdbID) {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        return watchlist.some(watch => watch.imdbID === imdbID);
    }

    function displayWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlistList.innerHTML = '';
        watchlist.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <div class="ratings">${getRatingsHTML(movie.Ratings)}</div>
                <span class="material-icons favorite-button">${isFavorite(movie.imdbID) ? 'favorite' : 'favorite_border'}</span>
                <span class="material-icons watchlist-button">bookmark</span>
            `;
            const favoriteButton = movieItem.querySelector('.favorite-button');
            favoriteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleFavorite(movie, favoriteButton);
            });
            movieItem.addEventListener('click', () => {
                fetchMovieDetails(movie.imdbID);
            });
            watchlistList.appendChild(movieItem);
        });
    }

    displayFavorites();
    displayWatchlist();
});


