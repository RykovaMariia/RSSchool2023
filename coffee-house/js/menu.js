import productList from "../products.json" assert { type: "json" };
import { Product } from "./Product.js";
import { Modal } from "./Modal.js";

const tabs = document.querySelectorAll(".tab");

window.onload = function () {
  //Tabs
  addTabsClickHandler();
  addCardsLoadMoreClickHandler();
  addModalCardClickHandler();

};

const addTabsClickHandler = () => {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      removeCheckedTabs();
      addCheckedTabs(tab);

      if (productList) {
        renderProductsToDom(productList, tab.innerText);
      }
    });
  });
};

const addCardsLoadMoreClickHandler = () => {
    document.querySelector('.menu__refresh').addEventListener('click', () => {
        document.querySelectorAll('.menu-item:nth-of-type(n+5)').forEach(card => {
            card.style.display = 'block';
        })
        deleteLoadMore();

    })

}

const removeCheckedTabs = () => {
  tabs.forEach((tab) => tab.classList.remove("tab_checked"));
};

const addCheckedTabs = (tab) => {
  tab.classList.add("tab_checked");
};

const renderProductsToDom = (productList, categoryCard) => {
  let menuContainer = cleanContainer();
  
  menuContainer.append(...generateProducts(productList, categoryCard));
  addModalCardClickHandler();
};

const cleanContainer = () => {
  let container = document.querySelector(".menu-coffee");
  container.innerHTML = "";
  return container;
};

const generateProducts = (productList, categoryCard) => {
  let productCards = [];
  let count = 0;

  productList.forEach((productCard) => {
    if (productCard.category.toLowerCase() === categoryCard.toLowerCase()) {

      productCards.push(new Product(productCard).generateProduct());
      count++;
    }
  });

  if (count <= 4){
    deleteLoadMore();
  } else {
    addLoadMore();
  }
  return productCards;
};

const deleteLoadMore = () => {
  document.querySelector('.menu__refresh').classList.add('menu__refresh_none');
}

const addLoadMore = () => {
  document.querySelector('.menu__refresh').classList.remove('menu__refresh_none');
}

//Modal
const addModalCardClickHandler = () => {
  
  document.querySelectorAll('.menu-item').forEach(productCard => {
    productCard.addEventListener('click', () => {
      renderProductModalToDom(productList, productCard.getAttribute("data-name"));
    })
  })

}

const renderProductModalToDom = (productList, nameCard) => {

  productList.forEach((productCard) => {
    if (productCard.name.toLowerCase() === nameCard.toLowerCase()) {
      let modal = new Modal(productCard);

      modal.openModal();
    } 
  });
};

