const section = document.querySelector(".items");
// Utilisation de fetch afin de recuperer la liste des produits depuis notre APi et de les inserer de façon dynamique a notre HTML
fetch("http://localhost:3000/api/products")
  .then((Response) => Response.json())
  .then((data) => {
    for (i = 0; i < data.length; i++) {
      let newHref = document.createElement("a");
      let newImage = document.createElement("img");
      
      let newArticle = document.createElement("article");
      newHref.href = `./product.html?id=${data[i]._id}`;
      newImage.src = data[i].imageUrl;
      newImage.alt = data[i].altTxt;

      let newTitle = document.createElement("h3");
      newTitle.className = "productName";
      let information = document.createElement("p");
      information.className = "productDescription";

      newTitle.innerText = data[i].name;
      information.innerText = data[i].description;
      newHref.appendChild(newArticle);
      newArticle.appendChild(newImage);
      newArticle.appendChild(newTitle);
      newArticle.appendChild(information);

      section.appendChild(newHref);
    }
  });
