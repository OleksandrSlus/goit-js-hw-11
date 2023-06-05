import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { galleryMarkup } from './js/gallerymarkup';
import { fetchPics } from './js/fetch';

export const refs = {
  formEl: document.querySelector('.search-form'),
  submitEl: document.querySelector('.submit'),
  galleryEl: document.querySelector('.gallery'),
  inputEl: document.querySelector('input[name="searchQuery"]'),
  observer: document.querySelector('.observer'),
  loadBtn: document.querySelector('.load-more'),
};

let currentPage = 1;
let currentValue = '';
let isNextPageLoad = false;
let isLastBatchLoaded = false;
let totalHits = 0;

const onFormSubmit = e => {
  e.preventDefault();
  const inputValue = refs.inputEl.value.trim();
  if (inputValue === '') {
    return;
  }
  observer.unobserve(refs.observer);
  currentPage = 1;
  refs.galleryEl.innerHTML = '';
  currentValue = inputValue;
  isNextPageLoad = false;
  isLastBatchLoaded = false;

  performSearch(currentValue);

  e.currentTarget.reset();
};

const performSearch = async inputValue => {
  try {
    const data = await fetchPics(inputValue, currentPage);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Вибачте, немає зображень, що відповідають вашому запиту. Будь ласка, спробуйте ще раз.'
      );
      return;
    }
    galleryMarkup(data);
    if (!isNextPageLoad && currentPage === 1) {
      totalHits = data.totalHits;
      Notiflix.Notify.info(`Ура! Ми знайшли ${totalHits} зображень.`);
    }

    galleryLightbox.refresh();
    console.log(currentPage);
    console.log(data.totalHits);

    scrollToNextGroup();

    if (currentPage * 40 < totalHits) {
      observer.observe(refs.observer);
      isNextPageLoad = true;
    } else {
      observer.unobserve(refs.observer);
      isLastBatchLoaded = true;
      if (currentPage > 1) {
        Notiflix.Notify.info('Ви досягли кінця результатів пошуку.');
      }
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    isNextPageLoad = false;
  }
};

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};

const onLoadMore = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      performSearch(currentValue);
    }
  });
};

const observer = new IntersectionObserver(onLoadMore, options);
const optionsEl = { captionData: 'alt', captionDelay: '250' };
const galleryLightbox = new SimpleLightbox('.gallery a', optionsEl);
const scrollToNextGroup = () => {
  const { height: cardHeight } =
    refs.galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
refs.formEl.addEventListener('submit', onFormSubmit);