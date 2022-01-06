let cartStockage = JSON.parse(localStorage.getItem("produit"));

// Fonction qui permet de recuperer depuis le localstorage
function getCart() {
  return cartStockage;
}
// Fonction qui permet d'envoyer vers le localstorage
function saveCart() {
  return localStorage.setItem("produit", JSON.stringify(cartStockage));
}

// ********Affichage de la page panier avec ses produits***********

const cartItems = document.getElementById("cart__items");

let componentsCart = [];
orderId = undefined;
// SI nous nous trouvons dans la page panier on execute notre code
if (location.href.search("confirmation") > 0) {
  // SINON c'est que nous sommes sur la page "confirmation.html" donc on affiche le numero de commande stocké dans l'URL
  // et on supprime le panier du localStorage pour pouvoir passer d'autres commandes

  orderId = window.location.search.replace("?", "");
  document.getElementById("orderId").innerHTML = orderId;
  localStorage.removeItem("produit");
} else {
  //Sinon  si le panier est vide on affiche "Votre panier est vide!" à la place

  if (cartStockage == null) {
    cartItems.innerHTML = `<h3 style="text-align: center; margin-bottom: 50px;">Votre panier est vide !</h3>`;
  } else {
    for (k = 0; k < cartStockage.length; k++) {
      componentsCart =
        componentsCart +
        `<article class="cart__item" data-id="${cartStockage[k].product}" data-color="${cartStockage[k].color}">
    <div class="cart__item__img">
                  <img src="${cartStockage[k].image}" alt="${cartStockage[k].alt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${cartStockage[k].name}</h2>
                    <p>${cartStockage[k].color}</p>
                    <p>${cartStockage[k].price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartStockage[k].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;

      cartItems.innerHTML = componentsCart;
    }
  }
}
let itemCart = document.getElementsByClassName("cart__item");
// console.log(itemCart);

// Ajout au click sur le "bouton" supprimer de la methode filter afin de ne garder que les elements non selectionner et ainsi faire sortir l'element selectionné du panier

for (let i = 0; i < itemCart.length; i++) {
  let btnDelete = document.getElementsByClassName("deleteItem");
  let suppr = btnDelete[i];

  suppr.addEventListener("click", () => {
    let idProductSelect = cartStockage[i].product;
    let colorProductSelect = cartStockage[i].color;

    //  console.log(idProductSelect);
    // console.log(colorProductSelect);

    cartStockage = cartStockage.filter(
      (el) => el.product != idProductSelect || el.color != colorProductSelect
    );

    console.log(cartStockage);
    localStorage.removeItem("produit");

    window.location.href = "cart.html";
  });
}
// Ajout de la possibilité de changer les quantités des produits directement dans la page panier avec une contrainte de panier = ou inferieur à 0 pour qu'il soit supprimé

for (let a = 0; a < itemCart.length; a++) {
  const cart = itemCart[a];

  cart.addEventListener("input", (e) => {
    cartStockage[a].quantity = parseInt(e.target.value);

    if (cartStockage[a].quantity <= 0) {
      cartStockage = cartStockage.filter(
        (el) =>
          el.product != cartStockage[a].product &&
          el.color != cartStockage[a].color
      );

      window.location.href = "cart.html";
    } else if (cartStockage[a].quantity > 100) {
      alert(
        "La quantité selectionnée n'est pas disponible , veuillez choisir un maximun de 100"
      );
      cartStockage[a].quantity = parseInt((value = 100));
    }
    window.location.href = "cart.html";
    saveCart();
  });
}
// Recuperation du nombre total de produit present dans le panier

function getNumberProduct() {
  let addCart = getCart();
  let number = 0;
  for (let cartStockage of addCart) {
    number += cartStockage.quantity;
  }
  return number;
}

// Calcul du total prix des differents produits présent au panier

function getTotalPrice() {
  let addCart = getCart();
  let total = 0;
  for (let cartStockage of addCart) {
    total += cartStockage.quantity * cartStockage.price;
  }
  return total;
}

// Inserer le total article et le total prix dans le HTML

let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");

totalQuantity.innerText = getNumberProduct();
totalPrice.innerText = getTotalPrice();

// --------------------------------Le formulaire---------------------
const form = document.querySelector("form");
const inputs = document.querySelectorAll(
  'input[type="text"],input[type="email"]'
);

let firstName, lastName, address, city, email;

// Fonction qui va gerer l'affichage des erreurs en selectionnant grace au tag directement le id de chaque div et y inserant un message si il est valid ou non 
const errorDisplay = (tag, message, valid) => {
  const errorMsg = document.querySelector("#" + tag + "");
  if (!valid) {
    errorMsg.textContent = message;
  } else {
    errorMsg.textContent = message;
  }
};
// Ajout d'une fonction permettant que les inputs se vident après le submit du formulaire
function inputEmpty() {
  inputs.forEach((input) => (input.value = ""));
}
// Fonction qui va permettre de verifier que le prenom grace a la methode regexp en y mettant certaines conditions  au départ . Si la valeur renseigné correspond a ce qui est attendu alors la valeure sera retenue sinon un message indiquera a l'utilisateur de modifier ce qui l'a inseré. Meme fonction pour les autres inputs

const firstnameChecker = (value) => {
  if (value.length > 0 && (value.length < 3 || value.length > 20)) {
    errorDisplay(
      "firstNameErrorMsg",
      "Le prénom doit être compris entre 3 et 20 caractères"
    );
    firstName = null;
  } else if (value.match(/[0-9@€,;/]/)) {
    errorDisplay(
      "firstNameErrorMsg",
      "Le prénom ne peut comporter des caracteres autres qu'alphabétique"
    );
    firstName = null;
  } else {
    errorDisplay("firstNameErrorMsg", "", true);
    firstName = value;
    console.log(firstName);
  }
};

const lastnameChecker = (value) => {
  if (value.length > 0 && (value.length < 3 || value.length > 20)) {
    errorDisplay(
      "lastNameErrorMsg",
      "Le Nom doit être compris entre 3 et 20 caractères"
    );
    lastName = null;
  } else if (value.match(/[0-9@€,;/]/)) {
    errorDisplay(
      "lastNameErrorMsg",
      "Le Nom ne peut comporter des caracteres autres qu'alphabétique"
    );
    lastName = null;
  } else {
    errorDisplay("lastNameErrorMsg", "", true);
    lastName = value;
    console.log(lastName);
  }
};

const addressChecker = (value) => {
  if (value.length > 0 && (value.length < 3 || value.length > 70)) {
    errorDisplay("addressErrorMsg", "Le format de l'adresse est incorrect");
    address = null;
  } else if (value.match(/^([0-9a-z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-])$/)) {
    errorDisplay("addressErrorMsg", "Le format de l'adresse est incorrect");
    address = null;
  } else {
    errorDisplay("addressErrorMsg", "", true);
    address = value;
    console.log(address);
  }
};

const cityChecker = (value) => {
  if (!value.match(/^[a-zA-Z.-]+(?:[\s-][\/a-zA-Z.]+)*$/)) {
    errorDisplay("cityErrorMsg", "La ville saisie n'est pas correct");
    city = null;
  } else {
    errorDisplay("cityErrorMsg", "", true);
    city = value;
    console.log(city);
  }
};

const emailChecker = (value) => {
  if (!value.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/)) {
    errorDisplay("emailErrorMsg", "Le mail saisi n'est pas correct");
    email = null;
  } else {
    errorDisplay("emailErrorMsg", "", true);
    email = value;
    console.log(email);
  }
};
// Maintenant grace à SWITCH on va jouer les fonctions quand l'utilisateur declenchera les differents inputs au fur et à mesure en inserant une valeur
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "firstName":
        firstnameChecker(e.target.value);
        break;
      case "lastName":
        lastnameChecker(e.target.value);
        break;
      case "address":
        addressChecker(e.target.value);
        break;
      case "city":
        cityChecker(e.target.value);
        break;
      case "email":
        emailChecker(e.target.value);
        break;
      default:
        null;
    }
  });
});

// Ecoute du bouton submit pour preparer l'envoi des données et ainsi permettre la mise en tableau des elements de notre formulaire

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (cartStockage !== null) {
    if (firstName && lastName && address && city && email) {
      const contact = {
        firstName,
        lastName,
        address,
        city,
        email,
      };
      let products = [];
      // Cette fonction va permettre de collecter le id du produit present dans le localstorage afin de l'integrer dans le tableau products
      function collectProducts() {
        for (let article of cartStockage) {
          products.push(article.product);
        }
      }
      // Fonction qui va faire une requete POST au serveur avec la methode fetch afin de lui envoyer l'objet contact et le tableau de products, ensuite nous aurons la reponse du serveur ainsi que l'orderId si cela est correct en instance
      async function sendServer() {
        await fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contact, products }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            orderId = data.orderId;
          });

        // Si l'orderId est bien recuperé alors celui ci sera incrementer dans la page de confirmation et se trouvera dans le id du HTML
        if (orderId != undefined || orderId != "") {
          location.href = "confirmation.html?" + orderId;
        }
      }

      collectProducts();
      sendServer();
      alert("Votre commande a bien été envoyé");
      inputEmpty();
    } else {
      alert(
        "Votre formulaire comporte au moins une erreur , veuillez corriger pour envoyer"
      );
    }
  } else {
    alert("Votre panier est vide");
  }
});
