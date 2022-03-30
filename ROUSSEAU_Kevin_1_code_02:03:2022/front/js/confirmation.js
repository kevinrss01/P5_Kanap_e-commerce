////// Page Confirmation /////

// Récupération de l'id de la page
let params = new URL(document.location).searchParams;
let id = params.get('id');

document.querySelector('#orderId').innerText = id;
