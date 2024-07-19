document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded");

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const favoriteList = document.getElementById('favorite-list');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            console.log(`Searching for: ${query}`);
            fetchMovies(query);
        }
    });

    async function fetchMovies(query) {
        const apiKey = '57b82531'; 
        const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                displayMovies(data.Search);
            } else {
                console.log(data.Error);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
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
                <button class="favorite-button">Add to Favorites</button>
            `;
            movieItem.querySelector('.favorite-button').addEventListener('click', () => {
                addToFavorites(movie);
            });
            movieItem.addEventListener('click', () => {
                fetchMovieDetails(movie.imdbID);
            });
            movieList.appendChild(movieItem);
        });
    }

    async function fetchMovieDetails(imdbID) {
        const apiKey = '57b82531'; 
        const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                displayMovieDetails(data);
            } else {
                console.log(data.Error);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
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
        `;
        document.getElementById('results').style.display = 'none';
        document.getElementById('details').style.display = 'block';
    }

    function addToFavorites(movie) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
            favorites.push(movie);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        }
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
            `;
            movieItem.addEventListener('click', () => {
                fetchMovieDetails(movie.imdbID);
            });
            favoriteList.appendChild(movieItem);
        });
    }

    displayFavorites();
});
