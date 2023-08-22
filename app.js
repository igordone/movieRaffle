const searchBox = document.querySelector('.search-movie');
const searchList = document.querySelector('.search-list');

const divMovie = document.querySelector('.div-movies');
const movieList = document.querySelector('.movie-result');

const btnDraw = document.querySelector('.btn-draw');

btnDraw.addEventListener('click', () =>{
    
    const items = document.querySelectorAll('.movie');
    
    if(items.length > 1){
        const movieRaffle = Math.floor(Math.random() * items.length);

        items.forEach((item, index) => {
            if (index === movieRaffle) {
                movieList.style.display = 'flex';
                movieList.style.justifyContent = 'center';
                movieList.style.alignItems = 'center';
            } else {
                item.remove();
            }
        });
    } else{
        console.log('adicione pelo menos dois filmes à lista');
    }

    btnDraw.classList.add('hide');
});

async function loadSearchList(searchTitle){
    const URL = `https://www.omdbapi.com/?s=${searchTitle}&page=1&apikey=51a92a79`;
    const response = await fetch(`${URL}`);
    const data = await response.json();
    if(data.Response === "True") displaySearchList(data.Search);
}

function findMovies(){
    let searchTitle = (searchBox.value).trim();
    if(searchTitle.length > 0){
        searchList.classList.remove('search-list-hide');
        loadSearchList(searchTitle);
    }else{
        searchList.classList.add('search-list-hide');
    }
    console.log(searchTitle);
}

function displaySearchList(movies){
    searchList.innerHTML = "";
    for(let i = 0; i < movies.length; i++){
        let searchListItem = document.createElement('div');
        searchListItem.dataset.id = movies[i].imdbID;
        searchListItem.classList.add('search-list-item');
        if(movies[i].Poster !== "N/A"){
            itemPoster = movies[i].Poster;
        }else{
            itemPoster = "Poster_not_found.png";
        }

        searchListItem.innerHTML = `
        <div class="search-item-img">
            <a href="#"><img class="item-img img-hide" src="${itemPoster}"></a>
        </div>
        <div class="search-item-info">
            <h3 class="list-item-title">${movies[i].Title}</h3>
            <p class="list-item-year">${movies[i].Year}</p>
        </div>
        `;

        searchList.appendChild(searchListItem);
    }
    movieDetails();
}

function movieDetails(){
    const movieListItem = searchList.querySelectorAll('.search-list-item');
    movieListItem.forEach(movie => {
        movie.addEventListener('click', async() => {
            searchList.classList.add('search-list-hide');
            searchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=51a92a79`);
            const movieInfo = await result.json();
            console.log(movieInfo);

            displayMovieDetail(movieInfo);
            console.log(movieList);

        });
    });
}

function displayMovieDetail(infos){

    const movie = document.createElement('div');
    movie.classList.add('movie');

    //movie Poster
    const movieBanner = document.createElement('div');
    movieBanner.classList.add('movie-banner');
    const bannerImg = document.createElement('img');
    bannerImg.classList.add('poster-img');
    bannerImg.src = `${infos.Poster}`;
    movieBanner.appendChild(bannerImg);
    movie.appendChild(movieBanner);

    //Movie Infos
    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-infos');

    //movie title
    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('movie-title');
    movieTitle.innerHTML = `${infos.Title}`;
    movieInfo.appendChild(movieTitle);

    //movie Year - Rating - release
    const movieYear = document.createElement('p');
    movieYear.classList.add('movie-year-grade');
    movieYear.innerHTML = `<strong>Year: </strong>${infos.Year} <span class="ratingPG"><strong>Rated: </strong>${infos.Rated}</span> <strong>Released: </strong>${infos.Released}`
    movieInfo.appendChild(movieYear);
    movie.appendChild(movieInfo);

    //Movie Genre
    const movieGenre = document.createElement('p');
    movieGenre.classList.add('movie-genre');
    movieGenre.innerHTML = `<strong>Genre: </strong>${infos.Genre}`;
    movieInfo.appendChild(movieGenre);

    //Movie Writers
    const movieWriter = document.createElement('p');
    movieWriter.classList.add('movie-writer');
    movieWriter.innerHTML = `<strong>Writer: </strong>${infos.Writer}`;
    movieInfo.appendChild(movieWriter);

    //Movie Actors
    const movieActor = document.createElement('p');
    movieActor.classList.add('movie-actor');
    movieActor.innerHTML = `<strong>Actors: </strong>${infos.Actors}`
    movieInfo.appendChild(movieActor);

    //movie plot
    const moviePlot = document.createElement('p');
    moviePlot.classList.add('movie-plot');
    moviePlot.innerHTML = `<strong>Plot: </strong>${infos.Plot}`;
    movieInfo.appendChild(moviePlot);

    //movie Language
    const movieLanguage = document.createElement('p');
    movieLanguage.classList.add('movie-language');
    movieLanguage.innerHTML = `<strong>Language: </strong>${infos.Language}`
    movieInfo.appendChild(movieLanguage);

    //Imdb Rating
    const movieRating = document.createElement('p');
    movieRating.classList.add('movieImdb-rating');
    movieRating.innerHTML = `<strong>ImDB Rating: </strong>${infos.imdbRating}⭐`;
    movieInfo.appendChild(movieRating);

    //movie btn-delete
    const btnDell = document.createElement('button');
    btnDell.classList.add('btn-delete');
    btnDell.textContent = 'x';
    movieInfo.appendChild(btnDell);

    movieList.appendChild(movie);
    divMovie.appendChild(movieList);

    //btn-dell event
    btnDell.addEventListener('click', () => {
        movie.remove();
        
        if(movieList.childElementCount < 2){
            btnDraw.classList.add('hide');
            movieList.style.display = 'flex';
            movieList.style.alignItems = 'center';
            movieList.style.justifyContent = 'center';
        }
        if(movieList.childElementCount < 1){
            divMovie.classList.add('hide');
        }
    });
    if(movieList.childElementCount >= 2){
        btnDraw.classList.remove('hide');
        movieList.style.display = 'flex';
        movieList.style.alignItems = '';
        movieList.style.justifyContent = '';
    }

    if(movieList.childElementCount < 1){
        divMovie.classList.add('hide');
    }else{
        divMovie.classList.remove('hide');
    }
}