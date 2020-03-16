const $btns = document.getElementById('Button');
const $gifs = document.getElementById('container');
const $searchGiphy = document.getElementById('search_giphy');
const $nextButton = document.getElementById('NextButton');
const $trendingButton = document.getElementById('trendingBtn');

const MaxGifsOnPage = 12;

//declare the container for our gifs
const state = {
  gifs: [],
};

const api_key = 'dc6zaTOxFJmzC';
var currentOffset = 0;
//when we press next we need to see what type of api call we called last
var wasTrending = true;
//Keep track of the last search so we can search again with our offset
var lastSearch = '';

//builds url and then calls fetchGifs
const fetchTrending = () => {
    wasTrending = true;
    const giphyTrending = 'http://api.giphy.com/v1/gifs/trending'
    const url = `${giphyTrending}?api_key=${api_key}&limit=12&offset=${currentOffset}`;
    fetchGifs(url).then(onFetch);
}

//builds the url with the search term and calls the fetchGifs
const searchGifs = (q) => {
    wasTrending = false;
    lastSearch = q;
    const giphyApi = 'http://api.giphy.com/v1/gifs/search';
    const url = `${giphyApi}?q=${lastSearch}&api_key=${api_key}&limit=12&offset=${currentOffset}`;
    fetchGifs(url).then(onFetch);
}

//with the passed in url, 
const fetchGifs = (q) => {
  return fetch(q)
    .then(res => res.json())
    .then(res => res.data)
};

//set gifs to the container array
function setGifs(gifs, mapWith, cb) {
  this.gifs = gifs.map(mapWith);
  cb(this.gifs);
}

//adds gifs to grid layout
const renderGif = ({ index, playing}) => {
        return `
    <div class="grid-item">
      <img gif-index="${index}" src="${playing}" />
    </div>
  `;  
};

const renderGifs = function (gifs) {
  this.innerHTML = '';
  this.innerHTML = gifs.map(renderGif).join('');
}.bind($gifs);

const transformGif = (gif, index) => {
  const id = gif.id;
  const { fixed_width, fixed_width_still } = gif.images;
  const playing = fixed_width.url;
  const still = fixed_width_still.url;
  return Object.assign({}, { isPlaying: true, playing, still, index });
};

const onFetch = gifs => setGifs.call(state, gifs, transformGif, renderGifs)
function loadGifs(query) {
  fetchGifs(query)
  .then(onFetch);
}

//Run fetch trending on page load!
fetchTrending();

//Setup event listeners on all the buttons
$btns.addEventListener('click', () => {
    currentOffset = 0;
    var value = $searchGiphy.value;
    if (value === '') {
        fetchTrending(); 
    } else {
        searchGifs(value);
    }
}, false);

$searchGiphy.addEventListener('keyup', function (e) {
    currentOffset = 0;
    if (e.keyCode === 13) {
        var value = $searchGiphy.value;
        if (value === '') {
            fetchTrending();
        } else {
            searchGifs(value);
        }
    }
}, false);

$nextButton.addEventListener('click', () => {
    currentOffset += MaxGifsOnPage;
    if (wasTrending || lastSearch === '') {
        fetchTrending();
    } else {
        searchGifs(lastSearch);
    }
}, false);

$trendingButton.addEventListener('click', () => {
    currentOffset = 0;
    fetchTrending();
}, false);