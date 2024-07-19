
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded");

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');

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
            `;
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
});
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded");

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');

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
            `;
            movieList.appendChild(movieItem);
        });
    }
});

