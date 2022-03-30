////////// Page d'accueil //////////

// Stockage de l'url de l'API
const api = 'http://localhost:3000/api/products';

// Stockage des éléments à ajouter au HTML
const elt = `<a href=""> 
                <article> 
                        <img src="" alt=""> 
                        <h3 class="productName"> </h3> 
                        <p class="productDescription"> </p> 
                </article> 
             </a>`;

// Fonction générale | json
let myFunction = fetch(api)
	.then(function (response) {
		return response.json();
	})
	// Récupération des données de l'API
	.then(function (myData) {
		// Boucle qui crée des éléments HTML pour chaque objet récupéré de l'API
		for (i = 0; i < myData.length; i += 1) {
			// On crée les éléments HTML pour chaque élément de l'objet
			document.querySelector('section').innerHTML =
				elt + document.querySelector('section').innerHTML;

			// On complète les informations correspondantes de l'objet
			// LIEN
			document
				.querySelector('section a')
				.setAttribute('href', `./product.html?id=${myData[i]._id}`);
			// IMAGE
			document
				.querySelector('article img')
				.setAttribute('src', myData[i].imageUrl);
			document
				.querySelector('article img')
				.setAttribute('alt', myData[i].altTxt);

			// NOM
			document.querySelector('article h3').innerText = myData[i].name;

			// DESCRIPTION
			document.querySelector('article p').innerText = myData[i].description;
		}
	})
	.catch(function (err) {
		console.log(err);
	});

// Appel de la fonction
myFunction;
