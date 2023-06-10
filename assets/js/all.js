"use strict";

// 按鈕展開
var dropdown = document.querySelectorAll('.dropdown-toggle');
var dropdownMenu = document.querySelectorAll('.dropdown-menu');
dropdown.forEach(function (item, index) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    dropdownMenu[index].classList.toggle('show');
  });
}); // 常見問題區塊口風琴展開

var accordion = document.querySelectorAll('.accordion-btn');
var accordionMenu = document.querySelectorAll('.accordion-item');
accordion.forEach(function (item, index) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    accordionMenu[index].classList.toggle('show');
  });
}); // navbar 選單展開效果

var navbar = document.querySelectorAll('.navbar-menu');
var navbarList = document.querySelectorAll('.navbar-mobileList');
navbar.forEach(function (item, index) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    navbar[index].children[0].classList.toggle('close');
    navbar[index].children[1].classList.toggle('show');
    navbarList[index].classList.toggle('show');
  });
}); // loading 效果

var loading = document.querySelector('.loading'); // back to top 效果

var btn = $('#backTop');
btn.on('click', function (e) {
  e.preventDefault();
  $('html, body').animate({
    scrollTop: 0
  }, '300');
}); // 資料串接

var apiPath = 'https://2023-engineer-camp.zeabur.app';
var list = document.querySelector('#list');
var pagination = document.querySelector('#pagination');
var data = {
  type: '',
  sort: 0,
  page: 1,
  search: ''
};
var worksData = [];
var pagesData = {}; // 遠端取得資料

function getData(_ref) {
  var type = _ref.type,
      sort = _ref.sort,
      page = _ref.page,
      search = _ref.search;
  loading.classList.add('d-flex');
  var apiUrl = "".concat(apiPath, "/api/v1/works?sort=").concat(sort, "&page=").concat(page, "&").concat(type ? "type=".concat(type, "&") : '').concat(search ? "search=".concat(search) : '');
  axios.get(apiUrl).then(function (res) {
    worksData = res.data.ai_works.data;
    pagesData = res.data.ai_works.page;
    loading.classList.remove('d-flex');
    renderWorks();
    renderPages();
  });
}

getData(data); // 資料畫面更新

function renderWorks() {
  var productData = worksData.map(function (item) {
    return (
      /*html*/
      "<li class=\"col-4 col-md-12 mb-24\">\n    <div class=\"card overflow-hidden\">\n      <div class=\"overflow-hidden\">\n        <img src=\"".concat(item.imageUrl, "\" alt=\"ai image\"\n        class=\"card-img-top img-fluid\">\n      </div>\n      <div class=\"card-body mb-auto\">\n        <h5 class=\"card-title mb\">").concat(item.title, "</h5>\n        <p class=\"card-text text-muted\">").concat(item.description, "</p>\n      </div>\n        <ul class=\"list-group\">\n          <li class=\"list-group-item d-flex justify-content-between\">\n            <span class=\"fw-bold\">AI \u6A21\u578B</span>\n            <span>").concat(item.model, "</span>\n          </li>\n          <li class=\"list-group-item d-flex justify-content-between\">\n            <span>#").concat(item.type, "</span>\n              <a href=\"").concat(item.link, "\" class=\"material-icons card-link\">share</a>\n          </li>\n        </ul>\n    </div>\n  </li>\n")
    );
  });
  list.innerHTML = productData.join('');
} // 切換分頁


function changePage(pagesData) {
  var pageLinks = document.querySelectorAll('a.page-link');
  var pageId = '';
  pageLinks.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      pageId = e.target.dataset.page;
      data.page = Number(pageId);

      if (!pageId) {
        data.page = Number(pagesData.current_page) + 1;
      }

      getData(data);
    });
  });
} // 分頁選染至畫面


function renderPages() {
  var pageStr = '';

  for (var i = 1; i <= pagesData.total_pages; i += 1) {
    pageStr +=
    /*html*/
    "<li class=\"page-item\" >\n      <a class=\"page-link ".concat(pagesData.current_page == i ? 'active' : '', "\n      ").concat(pagesData.current_page == i ? 'disabled' : '', "\" href=\"#\"  data-page=\"").concat(i, "\">").concat(i, "\n      </a>\n    </li>");
  }

  if (pagesData.has_next) {
    pageStr +=
    /*html*/
    "<li class=\"page-item\">\n    <a class=\"page-link material-icons p-12\" href=\"#\">\n      chevron_right\n    </a>\n  </li>";
  }

  pagination.innerHTML = pageStr;
  changePage(pagesData);
} // 切換作品排序


var desc = document.querySelector('#desc');
var asc = document.querySelector('#asc');
var btnSort = document.querySelector('#btn-sort'); //  由新到舊 -> sort = 0

desc.addEventListener('click', function (e) {
  e.preventDefault();
  data.sort = 0;
  getData(data);
  btnSort.innerHTML = '由新到舊<span class="material-icons">expand_more</span>';
}); //  由舊到新 -> sort = 1

asc.addEventListener('click', function (e) {
  e.preventDefault();
  data.sort = 1;
  getData(data);
  btnSort.innerHTML = '由舊到新<span class="material-icons">expand_more</span>';
}); // 切換作品類型

var filterBtns = document.querySelector('#filter-btn');
filterBtns.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.nodeName !== 'A') return;

  if (e.target.textContent === '全部') {
    data.type = '';
  } else {
    data.type = e.target.textContent;
  }

  getData(data);
}); // 搜尋

var search = document.querySelector('#search');
search.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    data.search = search.value;
    data.page = 1;
    getData(data);
  }
});
//# sourceMappingURL=all.js.map
