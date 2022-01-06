// récuperation de la chaine de requete depuis l'URL
const queryStringUrlId = window.location.search;
console.log(queryStringUrlId);

// Extraction de l'id par la methode urlSearchParams
const extractionId = new URLSearchParams(queryStringUrlId);
console.log(extractionId);

const productId = extractionId.get("id");
console.log(productId);

// Je vais lier ma page produit correspondant a l'id du produit selectionné.

// Je selectionne la classe ou les id pour inserer les elements du produit
const productImage = document.querySelector(".item__img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColors = document.getElementById("colors");
const productQuantity = document.getElementById("quantity");

// Utilisation de la methode fetch ( vu qu'on depend d'un serveur ) en inserant la valeur de l'id à la fin de l'url de l'API
let product = [];

let cart = {
  product: "",
  color: "",
  quantity: "0",
  name: "",
  image: "",
  alt: "",
  price: "",
};
// Fonction permettant de recuperer les elements du produit depuis l'APi en fonction de son ID ce qui permet d'avoir une page produit par article
 const productFetch = async () => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((Response) => Response.json())
    .then((data) => (product = data));
};
// Cette fonction va permettre de recuperer les données issues de la fonction precedente afin de creer dynamiquement notre article 
const pushProduct = async () => {
  await productFetch();
  // insertion de mon code HTML
  let insertImage = document.createElement("img");
  insertImage.src = product.imageUrl;
  insertImage.alt = product.altTxt;
  let insertTitle = product.name;
  let insertPrice = product.price;
  let insertDescription = product.description;
  let selectColors = product.colors;

  productImage.appendChild(insertImage);
  productTitle.innerText = insertTitle;
  productPrice.innerText = insertPrice;
  productDescription.innerText = insertDescription;

  for (j = 0, l = product.colors.length; j < l; j++) {
    let insertOption = document.createElement("option");
    insertOption.value = selectColors[j];

    productColors.appendChild(insertOption);
    insertOption.innerText = selectColors[j];
  }
  cart.product = product._id;
  cart.image = product.imageUrl;
  cart.alt = product.altTxt;
  cart.price = product.price;
  cart.name = product.name;
};
pushProduct();

// Recuperation de la quantité et des options de couleurs en ecoutant leurs input respectifs

productColors.addEventListener("input", (e) => {
  cart.color = e.target.value;
});

productQuantity.addEventListener("input", (e) => {
  cart.quantity = parseInt(e.target.value);
});

// ************* Rattachement de la composition du futur panier avec notre bouton "ajouter au panier"**********

const btnSendCart = document.getElementById("addToCart");
// ***************Ajout du contenu de mon panier dans le local Storage************

// Cette fonction va permettre de mettre dans un tableau les differents elements de notre produits afin de les pusher dans le local storage , elle ajoute egalement unr condition afin de ne pas avoir un meme produit( meme id et meme couleur) pouvant se doublonner a la place il ajoutera la quantité au meme produit present dans le storage
function productStockage() {
  let cartStockage = JSON.parse(localStorage.getItem("produit"));

  if (cartStockage) {
    const foundProduct = cartStockage.find(
      (p) => p.product == cart.product && p.color == cart.color
    );

    if (foundProduct) {
      foundProduct.quantity += cart.quantity;

      localStorage.setItem("produit", JSON.stringify(cartStockage));
      return;
    }

    cartStockage.push(cart);
    localStorage.setItem("produit", JSON.stringify(cartStockage));
  } else {
    cartStockage = [];
    cartStockage.push(cart);
    localStorage.setItem("produit", JSON.stringify(cartStockage));
  }
};


// On ecoute le click afin de borner les differents cas possibles qui permettent d'envoyer un produit conforme
btnSendCart.addEventListener("click", (e) => {
  e.preventDefault();

  if(productQuantity.value === "0" && productColors.value === "" ){
    alert ("Pour ajouter un produit a votre panier , veuillez selectionner une couleur et une quantité")
  }
else if (productQuantity.value < 1 || productQuantity.value > 100){
  alert ( "Merci de saisir une quantité comprise entre 1 et 100");
}
else if (productColors.value === ""){
  alert (" Merci de choisir la couleur de votre canapé")
}

else{
  productStockage();
  alert ( "Votre article a bien été ajouté a votre panier")
}
 
});
