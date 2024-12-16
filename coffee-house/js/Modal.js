export class Modal {
  constructor({
    name,
    urlToImage,
    description,
    price,
    category,
    sizes,
    additives,
  }) {
    this.name = name;
    this.urlToImage = urlToImage;
    this.description = description;
    this.price = price;
    this.category = category;
    this.sizes = sizes;
    this.additives = additives;
    this.sizePrice = 0;
    this.additivesPrice = 0;
    this.totalPrice = 0;
  }

  generateModal() {
    let template = "";
    let modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("data-name", this.name);

    template += '<div class="modal__window">';

    if (this.urlToImage) {
      template += '<div class="menu-item__img modal__img">';
      template += `<img src="${this.urlToImage}" alt="Irish coffee" />`;
      template += "</div>";
    }

    if (
      this.name ||
      this.urlToImage ||
      this.description ||
      this.price ||
      this.category ||
      this.sizes ||
      this.additives
    ) {
      template += '<div class="modal__content">';

      if (this.name || this.description) {
        template += '<div class="modal__description">';

        this.name && (template += `<h3>${this.name}</h3>`);

        this.description &&
          (template += `<p class="description-product">${this.description}</p>`);

        template += "</div>";
      }

      if (this.sizes) {
        template += '<div class="modal__choose size">';
        template += "<p>Size</p>";
        template += '<div class="modal__tabs">';

        if (this.sizes.s) {
          template += '<div class="tab tab_size tab_checked">';
          template += `<div class="tab__circle modal__circle">S</div>`;
          template += `<span>${this.sizes.s.size}</span>`;
          template += "</div>";
        }
        if (this.sizes.m) {
          template += '<div class="tab tab_size">';
          template += `<div class="tab__circle modal__circle">M</div>`;
          template += `<span>${this.sizes.m.size}</span>`;
          template += "</div>";
        }
        if (this.sizes.l) {
          template += '<div class="tab tab_size">';
          template += `<div class="tab__circle modal__circle">L</div>`;
          template += `<span>${this.sizes.l.size}</span>`;
          template += "</div>";
        }

        template += "</div>";
        template += "</div>";
      }

      if (this.additives) {
        template += '<div class="modal__choose additives">';
        template += "<p>Additives</p>";
        template += '<div class="modal__tabs">';

        this.additives.forEach((_, i) => {
          template += '<div class="tab tab_additive">';
          template += `<div class="tab__circle modal__circle">${i + 1}</div>`;
          template += `<span>${this.additives[i].name}</span>`;
          template += "</div>";
        });

        template += "</div>";
        template += "</div>";
      }

      if (this.price) {
        template += '<div class="modal__total">';
        template += '<div class="total">Total:</div>';
        template += `<div class="price">$${this.price}</div>`;
        template += "</div>";
      }

      template += '<div class="modal__alert">';
      template += '<svg class="alert__icon">';
      template += '<use xlink:href="./img/sprite.svg#info-empty"></use>';
      template += "</svg>";
      template +=
        "<p>The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>";
      template += "</div>";
      template += '<div class="modal__close">Close</div>';
      template += "</div>";
    }

    template += "</div>";

    modal.innerHTML = template;
    return modal;
  }

  openModal() {
    document.body.prepend(this.generateModal());
    this.removeScroll();
    
    this.buttonsCloseClickHandler();
    this.buttonsSizeClickHandler();
    this.buttonsAdditivesClickHandler();
  }

  buttonsCloseClickHandler() {
    document.querySelector(".modal").addEventListener("click", (e) => {
      this.closeModal(e);
    });
  }

  buttonsSizeClickHandler() {
    document.querySelectorAll(".tab_size").forEach((tab) => {
      tab.addEventListener("click", () => {
        this.deleteClassCheckedSize();
        this.addClassChecked(tab);
        this.addFinalPriceDom(this.calcSizePrice(), this.additivesPrice);
      });
    });
  }

  buttonsAdditivesClickHandler() {
    document.querySelectorAll(".tab_additive").forEach((tab, index) => {
      tab.addEventListener("click", () => {
        if (tab.classList.contains("tab_checked")) {
            this.deleteClassChecked(tab);
            this.calcAdditivesPrice(index, true);
            this.addFinalPriceDom(this.calcSizePrice(), this.additivesPrice);
        } else {
          this.addClassChecked(tab);
          this.calcAdditivesPrice(index, false);
          this.addFinalPriceDom(this.calcSizePrice(), this.additivesPrice);
        }
      });
    });
  }

  calcSizePrice() {
    this.sizePrice = (
      +this.price +
      +this.sizes[
        document
          .querySelector(".tab_size.tab_checked .tab__circle")
          .innerText.toLowerCase()
      ]["add-price"]
    ).toFixed(2);

    return this.sizePrice;
  }

  calcAdditivesPrice(index, checked) {
    if (checked) {
        this.additivesPrice = (
            +this.additivesPrice - +this.additives[index]["add-price"]
          ).toFixed(2);
      
    } else {
        this.additivesPrice = (
            +this.additivesPrice + +this.additives[index]["add-price"]
          ).toFixed(2);
    }

    return this.additivesPrice;
  }

  addFinalPriceDom(a, b) {
    this.totalPrice = (+a + +b).toFixed(2);
    document.querySelector(
      ".modal__total .price"
    ).innerText = `$${this.totalPrice}`;
  }

  deleteClassCheckedSize() {
    document.querySelectorAll(".tab_size").forEach((tab) => {
      tab.classList.remove("tab_checked");
    });
  }

  deleteClassChecked(tab) {
    tab.classList.remove("tab_checked");
  }

  addClassChecked(tab) {
    tab.classList.add("tab_checked");
  }

  closeModal(e) {
    if (
      e.target.classList.contains("modal__close") ||
      e.target.classList.contains("modal")
    ) {
      document.querySelector(".modal").remove();
      this.addScroll();
    }
  }

  removeScroll() {
    document.body.classList.add("lock");
  }

  addScroll() {
    document.body.classList.remove("lock");
  }
}
