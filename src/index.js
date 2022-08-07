let addToy = false;
const displayToys = document.querySelector('#toy-collection');
const form = document.querySelector('.add-toy-form');
const nameText = document.querySelector('#text-input');
const imageUrl = document.querySelector('#url-input');
const toyFormContainer = document.querySelector(".container");
let toyArray = [];
let html = '';


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  getDbToys();
  submitNewToy();
  addBtn.addEventListener("click", () => {

    addToy = !addToy;

});
});

function getDbToys() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(data => {
    toyArray = data;
    renderToyCards(toyArray);
  });
}


function renderToyCards(data) {
  data.forEach(toy => {
    html = html + createHtml(toy);
  });
  displayToys.innerHTML = html;
  toyArray.forEach(toy => {
    const likeButton = document.getElementById(`${toy.id}`);
    likeButton.addEventListener('click', () => {
      updateDb(toy);
    });
  })
};



function createHtml(toy) {
   return `<div class="card">
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}"> Like </button>
  </div>`;
}


function updateDb(item) {
  const numberOfLikes = item.likes + 1;
  const updateLike = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": parseInt(`${numberOfLikes}`)
    })
  };
  fetch(`http://localhost:3000/toys/${item.id}`, updateLike)
  .then(function(response) {
    return response.json();
  })
  .then(function(updatedLikes) {
    const index = toyArray.indexOf(item);
    toyArray.splice(index, 1, updatedLikes)
    html = '';
    renderToyCards(toyArray);
  })
}


function submitNewToy () {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitToDatabase();
    nameText.value = '';
    imageUrl.value = '';
    toyFormContainer.style.display = "none";
  });
}


function submitToDatabase() {
  const newToyInfo = {
    name: `${nameText.value}`,
    image: `${imageUrl.value}`,
    likes: 0
  };
  const toyToSend = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newToyInfo)
  };
fetch("http://localhost:3000/toys", toyToSend)
  .then(function(response) {
  return response.json();
  })
  .then(function(newData) {
    toyArray.push(newData);
    renderToyCards(toyArray);
  });
}