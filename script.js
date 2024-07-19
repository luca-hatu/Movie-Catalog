document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded");

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const favoriteList = document.getElementById('favorite-list');
    const submitReviewButton = document.getElementById('submit-review');

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
                <span class="material-icons favorite-button">favorite_border</span>
            `;
            const favoriteButton = movieItem.querySelector('.favorite-button');
            favoriteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleFavorite(movie, favoriteButton);
            });
            movieItem.addEventListener('click', () => {
                fetchMovieDetails(movie.imdbID);
            });
            movieList.appendChild(movieItem);
            if (isFavorite(movie.imdbID)) {
                favoriteButton.textContent = 'favorite';
            }
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
            <img src="${movie.Poster}" alt="${movie.Title}" data-imdbid="${movie.imdbID}">
            <h3>${movie.Title}</h3>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <h4>Ratings:</h4>
            <ul>
                ${movie.Ratings.map(rating => `<li><strong>${rating.Source}:</strong> ${rating.Value}</li>`).join('')}
            </ul>
        `;
        document.getElementById('results').style.display = 'none';
        document.getElementById('details').style.display = 'block';

        displayReviews(movie.imdbID);
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
                <span class="material-icons favorite-button">favorite</span>
            `;
            movieItem.querySelector('.favorite-button').addEventListener('click', (event) => {
                event.stopPropagation();
                toggleFavorite(movie, movieItem.querySelector('.favorite-button'));
            });
            movieItem.addEventListener('click', () => {
                fetchMovieDetails(movie.imdbID);
            });
            favoriteList.appendChild(movieItem);
        });
    }

    function displayReviews(imdbID) {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const movieReviews = reviews[imdbID] || [];
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';

        movieReviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            reviewItem.innerHTML = `
                <p class="review-rating">Rating: ${'★'.repeat(review.rating)}</p>
                <p>${review.text}</p>
            `;
            reviewList.appendChild(reviewItem);
        });
    }

    submitReviewButton.addEventListener('click', () => {
        const rating = document.getElementById('rating').value;
        const reviewText = document.getElementById('review-text').value;
        const imdbID = document.querySelector('#movie-details img').getAttribute('data-imdbid');

        if (rating && reviewText) {
            const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
            if (!reviews[imdbID]) {
                reviews[imdbID] = [];
            }
            reviews[imdbID].push({ rating, text: reviewText });
            localStorage.setItem('reviews', JSON.stringify(reviews));

            document.getElementById('rating').value = '1';
            document.getElementById('review-text').value = '';

            displayReviews(imdbID);
        }
    });
    displayFavorites();
});