const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const recipeResult = document.getElementById("recipe-result");
const lookupArea = document.getElementById("lookup");
const spin = document.getElementById("spin");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInputValue = searchInput.value;
    recipeResult.innerHTML = '';
    spin.classList.remove('d-none');
    fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputValue}`
    )
        .then((res) => res.json())
        .then((res) => res.meals)
        .then((res) => {
            if (res) searchInput.value = "";
            res.map((el) => displayMeal(el));
            spin.classList.add('d-none')
        })
        .catch((error) => {
            recipeResult.innerText = 'Search Result Empty. Try another keyword. ';
            spin.classList.add('d-none');
        });
});

const displayMeal = (meal) => {
    let mealHTML = `
            <div onclick="handleLookup(${meal.idMeal})" class="card p-0 bg-gray">
                <div class="overlay d-flex justify-content-center align-items-center">
                    <h4 class="text-white">
                        <svg height="30px" width="30px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg> Open
                    </h4>
                </div>
                <img src="${meal.strMealThumb}/preview"
                    style="height: 170px; object-fit: cover;" class="card-img-top" alt="${meal.strTags}">
                <div class="card-body">
                    <h6 class="text-center">Vegan Salad Bowl</h6>
                </div>
            </div>
        `;
    recipeResult.insertAdjacentHTML("beforeend", mealHTML);
};

const handleLookup = (id) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((res) => res.meals[0])
        .then((res) => {
            let ul = document.createElement("ul");
            for (let i = 1; i <= 20; i++) {
                if (
                    res["strMeasure" + i] != null &&
                    res["strMeasure" + i] != "" &&
                    res["strIngredient" + i] != null &&
                    res["strIngredient" + i] != ""
                ) {
                    console.log(`${res["strMeasure" + i]} ${res["strIngredient" + i]}`);
                    let li = document.createElement("li");
                    li.innerText = `${res["strMeasure" + i]} ${res["strIngredient" + i]}`;
                    ul.appendChild(li);
                }
            }
            displayLookup(res, ul);
            window.location.href = "#description";
        })
        .catch((error) => console.log("ERROR:" + error));
};

const displayLookup = (meal, list) => {
    let lookupHTML = `
                <h1 id="description" class="mt-5">Description:</h1>
                <div class="row mt-3">
                    <div class="col-6 mx-auto">
                        <div class="mx-auto">
                            <img class="img-fluid rounded-10" style="height: 300px; width: 100%; object-fit: cover;"
                                src="${meal.strMealThumb}" alt="">
                            <h2 class="my-3">${meal.strMeal}</h2>
                            <h6 class="fw-bold mb-3">Ingredients</h6>
                            <div id="ingredients" class="text-muted fs-6 mb-5">
                            </div>
                        </div>
                    </div>
                </div>
                 `;

    lookupArea.innerHTML = lookupHTML;
    const ingredientsArea = document.getElementById("ingredients");
    ingredientsArea.appendChild(list);
};
