// 輪播效果
const swiper = new Swiper('.swiper', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    992: {
      slidesPerView: 3
    },
    768: {
      slidesPerView: 2
    },
    375: {
      slidesPerView: 1
    }
  },
  spaceBetween: 24,
});
// 按鈕展開
const dropdown = document.querySelectorAll('.dropdown-toggle');
const dropdownMenu = document.querySelectorAll('.dropdown-menu');
dropdown.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu[index].classList.toggle('show');
  });
});
// 常見問題區塊口風琴展開
const accordion = document.querySelectorAll('.accordion-btn');
const accordionMenu = document.querySelectorAll('.accordion-item');
accordion.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    accordionMenu[index].classList.toggle('show');
  });
});
// navbar 選單展開效果
const navbar = document.querySelectorAll('.navbar-menu');
const navbarList = document.querySelectorAll('.navbar-mobileList');
navbar.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navbar[index].children[0].classList.toggle('close');
    navbar[index].children[1].classList.toggle('show');
    navbarList[index].classList.toggle('show');
  });
});
// loading 效果
const loading = document.querySelector('.loading');

// back to top 效果
const btn = $('#backTop');

btn.on('click', (e) => {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, '300');
});

// 資料串接
const apiPath = 'https://2023-engineer-camp.zeabur.app';
const list = document.querySelector('#list');
const pagination = document.querySelector('#pagination');

const data = {
  type: '',
  sort: 0,
  page: 1,
  search: '',
};

let worksData = [];
let pagesData = {};
// 遠端取得資料
function getData({ type, sort, page, search }) {
  loading.classList.add('d-flex');
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${
    type ? `type=${type}&` : ''
  }${search ? `search=${search}` : ''}`;
  axios.get(apiUrl).then(function (res) {
    worksData = res.data.ai_works.data;
    pagesData = res.data.ai_works.page;
    loading.classList.remove('d-flex');
    renderWorks();
    renderPages();
  });
}
getData(data);

// 資料畫面更新
function renderWorks() {
  const productData = worksData.map((item) => {
    return /*html*/ `<li class="col-4 col-md-12 mb-24">
    <div class="card overflow-hidden">
      <div class="overflow-hidden">
        <img src="${item.imageUrl}" alt="ai image"
        class="card-img-top img-fluid">
      </div>
      <div class="card-body mb-auto">
        <h5 class="card-title mb">${item.title}</h5>
        <p class="card-text text-muted">${item.description}</p>
      </div>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            <span class="fw-bold">AI 模型</span>
            <span>${item.model}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>#${item.type}</span>
              <a href="${item.link}" class="material-icons card-link">share</a>
          </li>
        </ul>
    </div>
  </li>
`;
  });
  list.innerHTML = productData.join('');
}
// 切換分頁
function changePage(pagesData) {
  const pageLinks = document.querySelectorAll('a.page-link');
  let pageId = '';

  pageLinks.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      pageId = e.target.dataset.page;
      data.page = Number(pageId);

      if (!pageId) {
        data.page = Number(pagesData.current_page) + 1;
      }

      getData(data);
    });
  });
}
// 分頁選染至畫面
function renderPages() {
  let pageStr = '';

  for (let i = 1; i <= pagesData.total_pages; i += 1) {
    pageStr += /*html*/ `<li class="page-item" >
      <a class="page-link ${pagesData.current_page == i ? 'active' : ''}
      ${
        pagesData.current_page == i ? 'disabled' : ''
      }" href="#"  data-page="${i}">${i}
      </a>
    </li>`;
  }

  if (pagesData.has_next) {
    pageStr += /*html*/ `<li class="page-item">
    <a class="page-link material-icons p-12" href="#">
      chevron_right
    </a>
  </li>`;
  }
  pagination.innerHTML = pageStr;

  changePage(pagesData);
}

// 切換作品排序
const desc = document.querySelector('#desc');
const asc = document.querySelector('#asc');
const btnSort = document.querySelector('#btn-sort');
//  由新到舊 -> sort = 0
desc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 0;
  getData(data);
  btnSort.innerHTML = '由新到舊<span class="material-icons">expand_more</span>';
});
//  由舊到新 -> sort = 1
asc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 1;
  getData(data);
  btnSort.innerHTML = '由舊到新<span class="material-icons">expand_more</span>';
});

// 切換作品類型
const filterBtns = document.querySelector('#filter-btn');
filterBtns.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.nodeName !== 'A') return;
  if (e.target.textContent === '全部') {
    data.type = '';
  } else {
    data.type = e.target.textContent;
  }
  getData(data);
});

// 搜尋
const search = document.querySelector('#search');
search.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    data.search = search.value;
    data.page = 1;
    getData(data);
  }
});
