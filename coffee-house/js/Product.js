export class Product {
  constructor({ name, urlToImage, description, price, category}) {
    this.name = name;
    this.urlToImage = urlToImage;
    this.description = description;
    this.price = price;
    this.category = category;
  }

  generateProduct() {
    let template = "";
    let product = document.createElement("div");
    product.className = "menu-item";
    product.setAttribute("data-name", this.name);

    if (this.urlToImage) {
      template += `<div class="menu-item__img">`;
      template += `<img src="${this.urlToImage}" alt="${this.name}">`;
      template += `</div>`;
    }
    if (this.name || this.description || this.price) {
        template += '<div class="menu-item__description">';
        
        this.name &&
        (template += `<h3>${this.name}</h3>`);

        this.description &&
        (template += `<p>${this.description}</p>`);

        if (this.price) {
            template += `<div class="menu-price">$${this.price}</div>`;
        }

        template += '</div>';
    }
    product.innerHTML = template;
    return product;
  }
  
}
