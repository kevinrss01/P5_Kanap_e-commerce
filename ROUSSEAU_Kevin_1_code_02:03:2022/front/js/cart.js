////////// Page Panier //////////

// Stockage de l'url de l'API
const api = 'http://localhost:3000/api/products';
const apiPost = 'http://localhost:3000/api/products/order';

// Stockage des éléments à ajouter au HTML //element HTML //productTemplate
const elt = `<article class="cart__item" data-id="" data-color"">
                <div class="cart__item__img">
                    <img src="" alt="">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2></h2>
                        <p data-couleur = "couleur"></p>
                        <p data-prix = "prix">Blabla</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;

////////////////////////////////////////////////////////////////////////////////
// ------------------------------ Mise en page ------------------------------ //
////////////////////////////////////////////////////////////////////////////////
//Suppression ou modication
// Récupération du panier
function getBasket() {
	// Récupération du panier
	let basket = localStorage.getItem('basket');

	// Si il n'y a pas de panier
	if (basket == null) {
		alert('Le panier est vide');
	}

	// Si il y a un panier
	else {
		return JSON.parse(basket);
	}
}

// Enregistrement du panier
function saveBasket(basket) {
	localStorage.setItem('basket', JSON.stringify(basket));
}

// Modification du panier
function addBasket(product, quantite) {
	// Récupération du panier
	let basket = getBasket();

	// Trouver le produit dans le panier
	let foundProduct = basket.find(
		(p) => p.id == product.id && p.option == product.option
	);

	foundProduct.quantity = quantite;

	// Enregistrement du panier
	saveBasket(basket);
}

// Suppression du panier //////////////
function removeFromBasket(product) {
	// Récupération du panier
	let basket = getBasket();

	// On supprime les produits ayant un id similaire à l'id du produit sélectionné
	basket = basket.filter(
		(p) => p.id != product.id || p.option != product.option //
	);

	// Enregistrement du panier
	saveBasket(basket);
}

// Quantité totale
function getTotalNumber() {
	// Récupération du panier
	let basket = getBasket();
	let number = 0;
	for (let product of basket) {
		number += parseInt(product.quantity);
	}
	return number;
}

// Prix Total
function getTotalPrice() {
	// Récupération du panier
	let price = 0;
	// On récupère les données de l'API
	fetch(api)
		.then(function (response) {
			return response.json();
		})
		.then(function (myData) {
			let panier = getBasket();
			for (let i = 0; i < panier.length; i += 1) {
				// On parcours l'API pour trouver le produit
				let foundProduct = myData.find((p) => p._id == panier[i].id);

				// On calcul le prix par produit
				priceProduct = panier[i].quantity * foundProduct.price;

				// On ajoute le prix de chaque produit au prix total
				price += priceProduct;
			}
			document.getElementById('totalPrice').innerText = price;
		});
}

// On récupère les données de l'API
fetch(api) // function diviser les fonctions
	.then(function (response) {
		return response.json();
	})

	.then(function (myData) {
		let panier = getBasket();

		for (let i = 0; i < panier.length; i += 1) {
			// On crée le bloc HTML
			document.getElementById('cart__items').innerHTML += elt;

			// -------------------- Informations du panier -------------------- //
			// ARTICLE - ID
			let articleId = document.querySelectorAll('section article')[i];
			articleId.setAttribute('data-id', panier[i].id);

			// ARTICLE - COLOR
			let articleColor = document.querySelectorAll('section article')[i];
			articleColor.setAttribute('data-color', panier[i].option);

			// COULEUR
			let couleur = document.querySelectorAll(
				'.cart__item__content__description > p[data-couleur]'
			)[i];
			couleur.innerText = panier[i].option;

			// QUANTITE
			let quantity = document.querySelectorAll(
				'.cart__item__content__settings__quantity > input'
			)[i];
			quantity.setAttribute('value', panier[i].quantity);

			// -------------------- Informations de l'API -------------------- //
			// On parcours l'API pour trouver le produit
			let foundProduct = myData.find((p) => p._id == panier[i].id);

			// IMAGE - SRC
			let imageSrc = document.querySelectorAll('.cart__item__img > img')[i];
			imageSrc.setAttribute('src', foundProduct.imageUrl);

			// IMAGE - ALT
			let imageAlt = document.querySelectorAll('.cart__item__img > img')[i];
			imageAlt.setAttribute('alt', foundProduct.altTxt);

			// NOM
			let nom = document.querySelectorAll(
				'.cart__item__content__description > h2'
			)[i];
			nom.innerText = foundProduct.name;

			// PRIX
			let prix = document.querySelectorAll(
				'.cart__item__content__description > p[data-prix]'
			)[i];
			prix.innerHTML = `${foundProduct.price} €`;
		}

		// -------------------- Totaux -------------------- //

		document.getElementById('totalQuantity').innerText = getTotalNumber();

		getTotalPrice(); //

		// -------------------- Modification des quantités -------------------- //
		let input = document.querySelectorAll('.itemQuantity');

		for (let k = 0; k < input.length; k += 1) {
			input[k].addEventListener('change', function () {
				// Récupération de la nouvelle valeur
				let newValue = document.querySelectorAll('.itemQuantity')[k].value;
				addBasket(panier[k], newValue);

				// Recalcul des totaux

				document.getElementById('totalQuantity').innerText = getTotalNumber();

				getTotalPrice();
			});
		}

		// -------------------- Suppression d'un produit -------------------- ///////
		let boutonSupprimer = document.querySelectorAll('.deleteItem');

		for (let j = 0; j < boutonSupprimer.length; j += 1) {
			boutonSupprimer[j].addEventListener('click', function () {
				// Message d'alerte
				if (
					confirm(
						`Êtes-vous certain.e de vouloir retirer cet article du panier ?`
					)
				) {
					// Récupérer le produit lié au bouton
					let productToRemove = boutonSupprimer[j].closest('article');
					let productToDelete = panier[j];

					// Supprimer le produit
					productToRemove.remove();

					// Supprimer le produit du localStorage
					removeFromBasket(productToDelete);

					// Recalcul des totaux

					document.getElementById('totalQuantity').innerText = getTotalNumber();

					getTotalPrice();
				}
			});
		}
	})
	.catch(function (err) {
		console.log(err);
	});

////////////////////////////////////////////////////////////////////////////////////////
// ------------------------------ Validation du panier ------------------------------ //
////////////////////////////////////////////////////////////////////////////////////////

//////Validation du formulaire////////////

//Récupération des input
let firstName = document.querySelector('#firstName');
let lastName = document.querySelector('#lastName');
let address = document.querySelector('#address');
let city = document.querySelector('#city');
let email = document.querySelector('#email');

//Récupération des messages
let firstNameMessage = document.querySelector('#firstNameErrorMsg');
let lastNameMessage = document.querySelector('#lastNameErrorMsg');
let addressMessage = document.querySelector('#addressErrorMsg');
let cityMessage = document.querySelector('#cityErrorMsg');
let emailMessage = document.querySelector('#emailErrorMsg');

// Création reg exp
let regName = new RegExp("^[a-zA-Z-'.\u00C0-\u00FF]*$");
let regAddress = new RegExp('^[a-zA-Z0-9%\'"-&*,\u00C0-\u00FFs]+');
let regEmail = new RegExp(
	"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
);

// FirstName
const validFirstName = function (inputFirstName) {
	// Création test
	let testFirstName = regName.test(inputFirstName.value);
	// Si le nom ne correspond pas au reg exp
	if (testFirstName) {
		firstNameMessage.innerText = '';
		return true;
	} else {
		firstNameMessage.innerText = 'Veuillez saisir un prénom correct';
		return false;
	}
};

// LastName
const validLastName = function (inputLastName) {
	let testLastName = regName.test(inputLastName.value);
	if (testLastName) {
		lastNameMessage.innerText = '';
		return true;
	} else {
		lastNameMessage.innerText = 'Veuillez saisir un nom correct';
		return false;
	}
};

// Address
const validAddress = function (inputAddress) {
	let testAddress = regAddress.test(inputAddress.value);
	if (testAddress) {
		addressMessage.innerText = '';
		return true;
	} else {
		addressMessage.innerText = 'Veuillez saisir une adresse correcte';
		return false;
	}
};

// City
const validCity = function (inputCity) {
	let testCity = regName.test(inputCity.value);
	if (testCity) {
		cityMessage.innerText = '';
		return true;
	} else {
		cityMessage.innerText = 'Veuillez saisir une ville correcte';
		return false;
	}
};

// Email
const validEmail = function (inputEmail) {
	let testEmail = regEmail.test(inputEmail.value);
	if (testEmail) {
		emailMessage.innerText = '';
		return true;
	} else {
		emailMessage.innerText =
			'Veuillez saisir un email valide (exemple: MarcAronie@donuts.com)';
		return false;
	}
};

// Ecoute des modifications
let form = document.querySelector('.cart__order__form');

form.firstName.addEventListener('change', function () {
	validFirstName(this);
});

form.lastName.addEventListener('change', function () {
	validLastName(this);
});

form.address.addEventListener('change', function () {
	validAddress(this);
});

form.city.addEventListener('change', function () {
	validCity(this);
});

form.email.addEventListener('change', function () {
	validEmail(this);
});

//////////////////// Envoi du formulaire /////////////////////

form.addEventListener('submit', function (event) {
	// On empêche le submit par défaut
	event.preventDefault();

	// Si toutes les informations saisies sont valides
	if (
		validFirstName(form.firstName) &&
		validLastName(form.lastName) &&
		validAddress(form.address) &&
		validCity(form.city) &&
		validEmail(form.email)
	) {
		// Récupération des informations fournies
		let prenom = document.querySelector('#firstName').value;
		let nom = document.querySelector('#lastName').value;
		let adresse = document.querySelector('#address').value;
		let ville = document.querySelector('#city').value;
		let mail = document.querySelector('#email').value;

		// -------------------- Objet contact / Object tableau -------------------- //
		// Contact
		let contact = {
			firstName: prenom,
			lastName: nom,
			address: adresse,
			city: ville,
			email: mail,
		};

		// Produits
		let tabProduit = getBasket();
		let products = [];
		for (produit of tabProduit) {
			products.push(produit.id);
		}
		console.log(JSON.stringify({ contact: contact, products: products }));

		// -------------------- Envoi du formulaire -------------------- //
		fetch(apiPost, {
			method: 'POST',
			body: JSON.stringify({ contact: contact, products: products }),
			headers: {
				Accept: 'application/json',
				'Content-type': 'application/json',
			},
		})
			// Récupération du résultat
			.then(async (response) => {
				try {
					// Récupération de la réponse de l'api
					const contenu = await response.json();
					if (response.ok) {
						// Récupération du numéro de commande et envoi page confirmation
						document.location.href = `./confirmation.html?id=${contenu.orderId}`;
					} else {
						console.log('problème coté serveur : ' + response.status);
					}
				} catch (err) {
					console.log(err);
				}
			});
	}
});
