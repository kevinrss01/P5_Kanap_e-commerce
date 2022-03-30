////////// Page Produit //////////

// Stockage de l'url de l'API
const api = 'http://localhost:3000/api/products';

////////////////////////////////////////////////////////////////////////////////
// ------------------------------ Mise en page ------------------------------ //
////////////////////////////////////////////////////////////////////////////////

// Récupération de l'id de la page
let params = new URL(document.location).searchParams;
let id = params.get('id'); // extraire ID

// Fonction de mise en page
let myFunctionProd = fetch(api)
	.then(function (response) {
		return response.json(); // Json
	})

	// Récupération des données de l'API
	.then(function (myData) {
		console.log(myData);
		// On parcours les objets de l'API
		for (i = 0; i < myData.length; i += 1) {
			// Quand on trouve l'objet qui correspond à la page sélectionnée
			if (myData[i]._id == id) {
				// On ajoute une image
				document.querySelector('.item__img').innerHTML =
					'<img>' + document.querySelector('.item__img').innerHTML;

				// On modifie les attributs de l'image
				document
					.querySelector('.item__img img')
					.setAttribute('src', myData[i].imageUrl); //Ajout de l'image
				document
					.querySelector('.item__img img')
					.setAttribute('alt', myData[i].altTxt);

				// NOM
				document.querySelector('#title').innerText = myData[i].name;
				document.querySelector('head title').innerText = myData[i].name;

				// PRIX
				document.querySelector('#price').innerText = myData[i].price;

				// DESCRIPTION
				document.querySelector('#description').innerText =
					myData[i].description;

				// On récupère le nombre d'options de couleurs
				let couleurs = myData[i].colors.length;

				// Pour chaque option de couleur
				for (j = 0; j < couleurs; j += 1) {
					// On crée une option
					document.querySelector('#colors').innerHTML =
						document.querySelector('#colors').innerHTML +
						`<option data-name = "${j}"></option>`;

					// On donne un attribut à l'option
					document
						.querySelector(`[data-name = "${j}"]`)
						.setAttribute('value', myData[i].colors[j]);

					// On donne un texte à l'option
					document.querySelector(`[data-name = "${j}"]`).innerText =
						myData[i].colors[j];
				}
			}
		}
	})
	.catch(function (err) {
		console.log(err);
	});

// Appel de la fonction
myFunctionProd;

///////////////////////////////////////////////////////////////////////////////////
// ------------------------------ Ajout au panier ------------------------------ //
///////////////////////////////////////////////////////////////////////////////////

////////// Fonctions utiles //////////

// Enregistrement du panier
function saveBasket(basket) {
	localStorage.setItem('basket', JSON.stringify(basket));
}

// Récupération du panier
function getBasket() {
	// Récupération du panier
	let basket = localStorage.getItem('basket');

	// Si il n'y a pas encore de panier
	if (basket == null) {
		return [];
	}

	// Si il y a déjà un panier
	else {
		return JSON.parse(basket);
	}
}

// Ajout/modification du panier
function addBasket(product, quantite) {
	// Récupération du panier
	let basket = getBasket();

	// Chercher si le produit existe déjà
	let foundProduct = basket.find(
		(p) => p.id == product.id && p.option == product.option
	);

	// -------------------- Si le produit existe déjà dans le panier -------------------- //
	if (foundProduct != undefined) {
		// Addition des quantités
		foundProduct.quantity =
			parseInt(foundProduct.quantity) + parseInt(quantite);
	}

	// -------------------- Si le produit n'existe pas -------------------- //
	else {
		// Ajout de la quantité
		product.quantity = parseInt(quantite);
		// Ajout du nouveau produit au panier
		basket.push(product);
	}

	// Enregistrement du panier
	saveBasket(basket); ///////
}

// Mise à 0 des quantités
let quantity = 0;

////////// Ecoute du bouton //////////
let button = document.querySelector('#addToCart');

button.addEventListener('click', function () {
	// Récupération des quantités sélectionnées
	quantity = document.querySelector('#quantity').value;

	// -------------------- Si on a une quantité saisie = 0 -------------------- //
	if (quantity == 0) {
		alert("Veuillez saisir une quantité avant d'ajouter au panier");
	}
	// -------------------- Si on a une quantité saisie != 0 -------------------- //
	else {
		// Récupération de la couleur sélectionnée
		let color =
			document.getElementById('colors').options[
				document.getElementById('colors').selectedIndex
			].value;

		// -------------------- Si on a AUCUNE couleur sélectionnée -------------------- //
		if (color == '') {
			alert("Veuillez sélectionner une couleur avant d'ajouter au panier");
		}
		// -------------------- Si on a une couleur sélectionnée -------------------- //
		else {
			// Création de l'élément produit
			let objetProduit = { id: id, quantity: quantity, option: color };

			// Ajout au panier
			addBasket(objetProduit, objetProduit.quantity);

			//Alerte au client
			alert('Le produit a bien été ajouté au panier !');
		}
	}
});
