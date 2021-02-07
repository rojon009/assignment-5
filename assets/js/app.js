const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const recipeResultArea = document.getElementById("recipe-result");
const lookupArea = document.getElementById("lookup");
const spinner = document.getElementById("spin");

const displayMeal = (meal) => {
  let mealHTML = `<div onclick="handleLookup(${meal.idMeal})" class="card p-0 bg-gray">
                        <div class="overlay d-flex justify-content-center align-items-center">
                            <h4 class="text-white">
                            <svg height="30px" width="30px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg> Open
                            </h4>
                        </div>
                        <img src="${meal.strMealThumb}"
                            style="height: 170px; object-fit: cover;" class="card-img-top" alt="${meal.strTags}">
                        <div class="card-body">
                            <h6 class="text-center">${meal.strMeal}</h6>
                        </div>
                    </div>`;

  recipeResultArea.insertAdjacentHTML("beforeend", mealHTML);
};

const displayLookup = (meal, list) => {
  if (meal && list) {
    let lookupHTML = `<h1 id="description" class="mt-5">Description:</h1>
                    <div class="row mt-3">
                        <div class="col-12 col-md-8 mx-auto">
                            <div class="mx-auto">
                                <img class="img-fluid rounded-10" style="height: 300px; width: 100%; object-fit: cover;"
                                    src="${meal.strMealThumb}" alt="">
                                <h2 class="my-3">${meal.strMeal}</h2>
                                <h6 class="fw-bold mb-3">Ingredients</h6>
                                <div id="ingredients" class="text-muted fs-6 mb-5">
                                </div>
                            </div>
                        </div>
                    </div>`;
    lookupArea.innerHTML = lookupHTML;
    const ingredientsArea = document.getElementById("ingredients");
    ingredientsArea.appendChild(list);
  } else {
    lookupHTML = `<h1 id="description" class="mt-5">Description:</h1>
                        <h5 class="mb-5 text-danger">We are facing problem to Render this Recipe. Please try another.</h5>`;
    lookupArea.innerHTML = lookupHTML;
  }

  window.location.href = "#description";
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchInputValue = searchInput.value;
  recipeResultArea.innerHTML = "";
  spinner.classList.remove("d-none");
  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputValue}`
  )
    .then((res) => res.json())
    .then((res) => res.meals)
    .then((meals) => {
      if (meals) searchInput.value = "";
      meals.map((el) => displayMeal(el));
      spinner.classList.add("d-none");
    })
    .catch((error) => {
      recipeResultArea.innerText =
        "Couldn't find any Recipe. Try another keyword. ";
      spinner.classList.add("d-none");
    });
});

const handleLookup = (id) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => data.meals[0])
    .then((meal) => {
      let ul = document.createElement("ul");
      for (let i = 1; i <= 20; i++) {
        if (
          meal["strMeasure" + i] != null &&
          meal["strMeasure" + i] != "" &&
          meal["strIngredient" + i] != null &&
          meal["strIngredient" + i] != ""
        ) {
          let li = document.createElement("li");
          li.innerText = `${meal["strMeasure" + i]} ${
            meal["strIngredient" + i]
          }`;
          ul.appendChild(li);
        }
      }
      displayLookup(meal, ul);
    })
    .catch((error) => {
      displayLookup();
    });
};
