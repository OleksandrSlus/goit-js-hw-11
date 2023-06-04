import { refs } from "../index.js";
export const galleryMarkup = (data) => {
  const galleryItems = data.hits.map((picture) => `
    <div class="photo-card">
      <a class="gallery__link" href="${picture.largeImageURL}">
        <img 
          src="${picture.webformatURL}" 
          alt="${picture.tags}" 
          title="${picture.tags}" 
          data-source="${picture.largeImageURL}"
          loading="lazy" 
          class="card-img"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>
            <span class="info-label">Likes</span>
            ${picture.likes}
          </b>
        </p>
        <p class="info-item">
          <b>
            <span class="info-label">Views</span>
            ${picture.views}
          </b>
        </p>
        <p class="info-item">
          <b>
            <span class="info-label">Comments</span>
            ${picture.comments}
          </b>
        </p>
        <p class="info-item">
          <b>
            <span class="info-label">Downloads</span>
            ${picture.downloads}
          </b>
        </p>
      </div>
    </div>`).join('');

  refs.galleryEl.insertAdjacentHTML('beforeend', galleryItems);
  
  const galleryLinks = refs.galleryEl.querySelectorAll('.gallery__link');
  galleryLinks.forEach((link) => {
    link.addEventListener('click', handleImageClick);
  });
};
const handleImageClick = (event) => {
  event.preventDefault();
  const imageSource = event.currentTarget.getAttribute('href');
  const imageTitle = event.currentTarget.querySelector('img').getAttribute('title');

};