import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
	getFirestore,
	collection,
	onSnapshot,
	doc,
	updateDoc,
	deleteDoc,
	addDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnpudAe8UD65KZ7IPm8UtZl72KTYMKzXg",
    authDomain: "advanced-frontend-e2d51.firebaseapp.com",
    projectId: "advanced-frontend-e2d51",
    storageBucket: "advanced-frontend-e2d51.appspot.com",
    messagingSenderId: "407869533641",
    appId: "1:407869533641:web:fee7b71b904a6f1e0b4c18"
  };

// Initialize Firebase
initializeApp(firebaseConfig);

// reference to database
const _db = getFirestore();
// reference to users collection in database
const _usersRef = collection(_db, "produkter");
// global variable: users array & selectedUserId
let _users = [];
let _selectedUserId = "";
let _selectedImgFile ="";

// ========== READ ==========

// onSnapshot: listen for realtime updates
onSnapshot(_usersRef, snapshot => {
	// mapping snapshot data from firebase in to user objects
	_users = snapshot.docs.map(doc => {
		const user = doc.data();
		user.id = doc.id;
		console.log(user);
		return user;
	});
	console.log(_users);
	appendUsers(_users);
	// showLoader(false);
});

// append users to the DOM
function appendUsers(users) {
	let htmlTemplate = "";
	for (const user of users) {
		htmlTemplate += /*html*/ `
    <article>
      <h3>Navn: ${user.name}</h3>
	  <p>Beskrivelse: ${user.description}</p>
	  <p>Kategori: ${user.category}</p>
	  <p>Pris: ${user.price}</p>
	  <p>Vægt: ${user.weight}</p>
	  <img src="${user.img}">
      <button class="btn-update-user" data-id="${user.id}">Update</button>
      <button class="btn-delete-user" data-id="${user.id}">Delete</button>
    </article>
    `;
	}
	document.querySelector("#content").innerHTML = htmlTemplate;

	//attach events to update and delete btns
	document.querySelectorAll(".btn-update-user").forEach(btn => {
		btn.onclick = () => selectUser(btn.getAttribute("data-id"));
	});

	document.querySelectorAll(".btn-delete-user").forEach(btn => {
		btn.onclick = () => deleteUser(btn.getAttribute("data-id"));
	});
}

// ========== CREATE ==========
// add a new user to firestore (database)
function createUser() {
	// references to the input fields
	let nameInput = document.querySelector("#name");
	let descriptionInput = document.querySelector("#description");
	let cutInput = document.querySelector("#cut");
	let categoryInput = document.querySelector("#category");
	let priceInput = document.querySelector("#price");
	let weightInput = document.querySelector("#weight")
	let imageInput = document.querySelector("#imagePreview");

	const newUser = {
		name: nameInput.value,
		description: descriptionInput.value,
		cut: cutInput.value,
		category: categoryInput.value,
		price: priceInput.value,
		weight: weightInput.value,
		img: imageInput.src
		
	};

	addDoc(_usersRef, newUser);

	

  //reset
  nameInput.value = "";
  descriptionInput.value = "";
  cutInput.value = "";
  categoryInput.value = "";
  priceInput.value = "";
  weightInput.value = "";
  imageInput.src = "";
}

// ========== UPDATE ==========
function selectUser(id) {
	_selectedUserId = id;
	const user = _users.find(user => user.id == _selectedUserId);
	// references to the input fields
	document.querySelector("#name-update").value = user.name;
	document.querySelector("#description-update").value = user.description;
	document.querySelector("#cut-update").value = user.cut;
	document.querySelector("#category-update").value = user.category;
	document.querySelector("#price-update").value = user.price;
	document.querySelector("#weight-update").value = user.weight;
	document.querySelector("#imagePreviewUpdate").src = user.img;
	//scroll to update form
	document.querySelector("#form-update").scrollIntoView({ behavior: "smooth" });
}

function updateUser() {
	const userToUpdate = {
		name: document.querySelector("#name-update").value,
		description: document.querySelector("#description-update").value,
		cut: document.querySelector("#cut-update").value,
		category: document.querySelector("#category-update").value,
		price: document.querySelector("#price-update").value,
		weight: document.querySelector("#weight-update").value,
		img: document.querySelector("#imagePreviewUpdate").src
	};
		const userRef = doc(_usersRef, _selectedUserId);
		updateDoc(userRef, userToUpdate);
}

// ========== DELETE ==========
function deleteUser(id) {
	const docRef = doc(_usersRef, id);
	deleteDoc(docRef);
}
function previewImage(file, previewId) {
	if (file) {
	  _selectedImgFile = file;
	  let reader = new FileReader();
	  reader.onload = event => {
		document.querySelector('#' + previewId).setAttribute('src', event.target.result);
	  };
	  reader.readAsDataURL(file);
	}
  }
// =========== Loader functionality =========== //

// function showLoader(show = true) {
// 	const loader = document.querySelector("#loader");
// 	if (show) {
// 		loader.classList.remove("hide");
// 	} else {
// 		loader.classList.add("hide");
// 	}
// }

// =========== attach events =========== //
document.querySelector("#btn-update").onclick = () => updateUser();
document.querySelector("#btn-create").onclick = () => createUser();
