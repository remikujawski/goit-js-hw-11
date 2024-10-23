import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const api = '6021301-359a47a130e708641e07d8eef';
const form = document.getElementById('search-form');
const searchbox = document.getElementById('searchbox');
const loader = document.querySelector('.loader');
let searchString = '';

searchbox.addEventListener('input', evt => {
  searchString = evt.target.value.trim();
});

const gallery = new SimpleLightbox('.list-item-sp a', {
  scrollZoom: false,
  captionsData: 'alt',
  captionDelay: 250,
});

const resetImages = () => {
  const imagesToRemove = document.querySelectorAll('.list-item-sp');
  if (imagesToRemove.length > 0) {
    imagesToRemove.forEach(imageToRemove => {
      imageToRemove.remove();
    });
  }
};

form.addEventListener('submit', evt => {
  evt.preventDefault();
  if (searchString.length > 1) {
    resetImages();
    loader.classList.remove('hidden');
    const searchStringProcessed = searchString.replaceAll(' ', '+');
    fetch(
      `https://pixabay.com/api/?key=${api}&q=${searchStringProcessed}&image_type=photo&orientation=horizontal&safesearch=true`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(images => {
        loader.classList.add('hidden');
        if (images.hits.length > 0) {
          const containerGallery = document.querySelector('.portfolio-list');
          const htmlString = images.hits
            .map(
              ({
                previewURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
              }) => {
                return `<li class="list-item-sp"><a class="link" href="${largeImageURL}"><div class="card-image"><img src="${previewURL}" alt="${tags}" width="360" height="300"/></div><div class="info-data"><ul class="list details-list"><li class="image-detail"><span>Likes</span><br><span>${likes}</span></li><li class="image-detail"><span>Comments</span><br><span>${comments}</span></li><li class="image-detail"><span>Views</span><br><span>${views}</span></li><li class="image-detail"><span>Downloads</span><br><span>${downloads}</span></div></li></ul></div></a></li>`;
              }
            )
            .join('');

          containerGallery.innerHTML = htmlString;
          gallery.refresh();
        } else {
          iziToast.error({
            title: 'Error',
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });
        }
      })
      .catch(error => {
        loader.classList.add('hidden');
        console.log(error);
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      });
  } else {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: 'Please, enter at least one word - real word!',
    });
  }
});
