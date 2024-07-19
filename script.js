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
