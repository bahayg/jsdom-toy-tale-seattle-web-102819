let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{
    const addBtn = document.querySelector('#new-toy-btn')
    const toyForm = document.querySelector('.container')
    addBtn.addEventListener('click', () => {
      // hide & seek with the form
      addToy = !addToy
      if (addToy) {
        toyForm.style.display = 'block'
      } else {
        toyForm.style.display = 'none'
      }
    })
    const addToyForm = document.querySelector(".add-toy-form")
    addToyForm.addEventListener("submit", function(e){
      e.preventDefault();
      postToys(e)
      .then(data => appendToy(data))
      e.target.reset()
      toyForm.style.display = 'none'
    })
      getToys()
})

const getToys = () => {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(data => showToys(data))
}

const showToys = (data) => {
  data.forEach(toy => { appendToy(toy)});
}

const appendToy = (toy) => {
  const toyCollection = document.getElementById("toy-collection")
  const div = makeToyCard(toy)
  toyCollection.appendChild(div)
}

const makeToyCard = (toy) => {
  const div = document.createElement("div")
  div.className = "card"

  const h2 = document.createElement("h2")
  h2.innerText = toy.name

  const img = document.createElement("img")
  img.src = toy.image
  img.className = "toy-avatar"

  const p = document.createElement("p")
  p.innerText = `${toy.likes} Likes`
  p.id = toy.id

  const likeButton = document.createElement("button")
  likeButton.className = "like-btn"
  likeButton.innerText = "Like"
  likeButton.addEventListener("click", function(e){
    increaseLikes(e)
    .then(data => showLikes(data, p))
  })

  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(likeButton)

  return div
}

const postToys = (e) => {
  return fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: e.target[0].value,
      image: e.target[1].value,
      likes: 0
    })
  })
  .then(res => res.json())
}

const increaseLikes = (e) => {

  const currentLikes = e.target.parentNode.children[2]
  const updatedLikes = parseInt(currentLikes.innerText) + 1

  return fetch(`http://localhost:3000/toys/${e.target.parentNode.children[2].id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: updatedLikes
    })
  })
  .then(res => res.json())
}

const showLikes = (data, p) => {
  p.innerText = `${data.likes} Likes`
}