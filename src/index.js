//Helper Equations that aren't actually used directly in the functionality of the website

//Generate ingredient with measurement in normal english speach
//(ingredient or pantry item, quantity) => relatively normal english way of saying that amount of things
//I still need a better solution for oregano, salt pepper etc
function english(itemObj, quantity){
    if(quantity > 4999){
        return itemObj.name
    }else{
        if (itemObj.unit){
            if(quantity == 1){
                // 1 cup of milk
                return `${quantity} ${itemObj.unit} of ${itemObj.name}`
            }else{
                // 3 cups of milk
                return `${quantity} ${itemObj.unit}s of ${itemObj.name}`
            }
        }else{
            if (quantity == 1){
                // 1 chicken leg
                return`${quantity} ${itemObj.name}`
            }else{
                // 3 chicken legs
                return`${quantity} ${itemObj.name}s`
            }
        }
    }
}

//make a recipe the active recipe
let activeRecipe
function getRecipe(recipeID){
    fetch(`http://localhost:3000/recipes/${recipeID}`)
    .then(r=>r.json())
    .then(recipe =>{
        console.log(recipe)
        console.log(recipe.ingredients)
        activeRecipe = recipe
    })
}

//a function that checks if we can make the active recipe
function checkActive(){
    console.log(`Can we make ${activeRecipe.name}?`)
    for (ingredient of activeRecipe.ingredients){
        console.log(`looking for ${ingredient.quantity} of ${ingredient.name}`)
        if(!checkIngredient(ingredient)){
            return false
        }
    }
    return true 
}

//check if the pantry has a certain quantity of an ingredient
function checkIngredient(ingredient){
    for (item of pantry){
        console.log(`checking ${item.name}`)
        if (item.name === ingredient.name){
            console.log("the name matches!")
            if (compareIngrs(ingredient, item)){
                console.log("and there is enough of it!")
                return true
            }
        }
    }
    return false
}

//compare an ingredient to a pantry item to see if we have enough of the pantryItem (assumes the names already match)
function compareIngrs(ingredient, pantryItem){
    if (ingredient.unit === pantryItem.unit){
        if (parseFloat(ingredient.quantity) <= parseFloat(pantryItem.quantity)){
            return true
        }
    }else if ((convToCups((ingredient))) <= convToCups((pantryItem))){
            return true
    }
    return false
}


//converts units to either cups or pounds as appropriate so they can be compared
function convToCups(item){
    if (item.unit === "tsp"){
        return (item.quantity/48)
    }
    else if(item.unit === "tbsp"){
        return (item.quantity/16)
    }
    else if(item.unit === "floz"){
        return (item.quantity/8)
    }
    else if(item.unit === "cup"){
        return (item.quantity)
    }
    else if(item.unit === "pint"){
        return (item.quantity*2)
    }
    else if(item.unit === "quart"){
        return (item.quantity*4)
    }
    else if(item.unit === "gallon"){
        return (item.quantity*16)
    }
}
//converts out of cups so the pantry can be updated when a recipe is made
function convOutOfCups(quantity, unit){
    if (unit === "tsp"){
        return (quantity*48)
    }
    else if (unit === "tbsp"){
        return (quantity*16)
    }
    else if (unit === "floz"){
        return (quantity*8)
    }
    else if (unit === "cup"){
        return (quantity)
    }
    else if (unit === "pint"){
        return (quantity/2)
    }
    else if (unit === "quart"){
        return (quantity/4)
    }
    else if (unit === "gallon"){
        return (quantity/16)
    }
    else{
        console.log("!!!!!!!!this shouldn't be happening (in convOutOfCups)!!!!!!!!!!")
    }
}


//function that displays a recipe underneath the "what can i make right now" button
function displayRecipe(recipeObj){
    const recipeContent = document.createElement('div')
    displayArea.appendChild(recipeContent)
    recipeContent.className = "displayedRecipe"
    const title = document.createElement("h4")
    title.textContent = recipeObj.name
    recipeContent.appendChild(title)
    //print ingredient list with a title
    const ingrTitle = document.createElement('h5')
    ingrTitle.className="displayedRecipeContent"
    ingrTitle.textContent = "Ingredients:"
    recipeContent.appendChild(ingrTitle)
    const ingredientList = document.createElement('ul')
    ingredientList.className="displayedRecipeContent"
    recipeContent.appendChild(ingredientList)
    for (ingr of recipeObj.ingredients){
        const newIngr = document.createElement('li')
        newIngr.textContent = english(ingr, ingr.quantity)
        ingredientList.appendChild(newIngr)
    }
    //print steps with a title 
    const stepsTitle = document.createElement('h5')
    stepsTitle.textContent = "Steps:"
    stepsTitle.className="displayedRecipeContent"
    recipeContent.appendChild(stepsTitle)
    const stepsList = document.createElement('ol')
    stepsList.className="displayedRecipeContent"
    recipeContent.appendChild(stepsList)
    for (step of recipeObj.steps){
        const newStep = document.createElement('li')
        newStep.textContent = step
        stepsList.appendChild(newStep)
    }
    //close recipe button
    const closeButton = document.createElement('button')
    closeButton.className = "displayedRecipeButton"
    closeButton.textContent = "Close Recipe"
    recipeContent.appendChild(closeButton)
    closeButton.addEventListener('click', ()=>{
        recipeContent.style.maxHeight = '0px'
    })
    //make recipe button
    const makeButton = document.createElement('button')
    makeButton.className = "displayedRecipeButton"
    makeButton.textContent = "Make Recipe and Update the Pantry"
    recipeContent.appendChild(makeButton)
    makeButton.addEventListener('click', ()=>{
        makeRecipe(recipeObj)
    })
    // attach to the HTML
    displayArea.appendChild(recipeContent)
    recipeContent.style.maxHeight = recipeContent.scrollHeight
}

//"make a recipe"
function makeRecipe(recipe){
    activeRecipe = recipe
    if(checkActive()){
        for (ingredient of recipe.ingredients){
            for (item of pantry){
                if (ingredient.name === item.name){
                    if (ingredient.unit === item.unit){
                        item.quantity = (parseFloat(item.quantity)-parseFloat(ingredient.quantity))
                        fetch(`http://localhost:3000/pantryItems/${item.id}`, {
                            method : 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body:JSON.stringify(item)
                        })
                        .then(loadPantry())
                    }else{
                        item.quantity = convOutOfCups((convToCups(item)-convToCups(ingredient)), item.unit)
                        fetch(`http://localhost:3000/pantryItems/${item.id}`, {
                            method : 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body:JSON.stringify(item)
                        })
                        .then(loadPantry())
                    }
                }
            }
        }
    }else{
        console.log("can't make that recipe")
    }

}


//The actual functionality of the Website

//make now button
let makeNowButton = document.getElementById('makeNow')
const makeNowWrapper = document.getElementById('makeNowWrapper')
makeNowButton.addEventListener('click', makeNow)
const displayArea=document.getElementById('displayArea')
const resultsSpot = document.getElementById('makeNowResults')
//defined this function so that we can make it recursive and make the "okay button function correctly"
function makeNow(){
    fetch(`http://localhost:3000/recipes/`)
    .then(r=>r.json())
    .then(recipeList=>{
        let initialScroll = makeNowWrapper.scrollHeight
        makeNowWrapper.style.maxHeight = initialScroll
        for (i=0; i<recipeList.length; i++){
            activeRecipe = recipeList[i]
            if(checkActive()){
                const recipeResult = activeRecipe
                console.log(`you can make ${activeRecipe.name}!`)
                const goodNews = document.createElement('p')
                goodNews.textContent = `You can make ${activeRecipe.name}!  `
                resultsSpot.appendChild(goodNews)
                const displayButton = document.createElement('button')
                displayButton.textContent = "Display Recipe"
                displayButton.className = "outerButton"
                displayButton.addEventListener('click', ()=>displayRecipe(recipeResult))
                goodNews.appendChild(displayButton)
            }
        }
        makeNowButton.removeEventListener('click', makeNow)
        const okayButton = document.createElement('button')
        okayButton.textContent = "Okay"
        okayButton.className = "outerButton"
        resultsSpot.appendChild(okayButton)
        okayButton.addEventListener('click', ()=>{
            makeNowWrapper.style.maxHeight = initialScroll
            makeNowButton = document.getElementById('makeNow')
            makeNowButton.addEventListener('click', makeNow)
            setTimeout(()=>{
                while (resultsSpot.firstChild){
                    resultsSpot.removeChild(resultsSpot.firstChild)
                }
            }, 200)
        })
        makeNowWrapper.style.maxHeight = makeNowWrapper.scrollHeight
    })
}

//Load the pantry into an object in the frontend and then display it
let pantry = []
function loadPantry(){
    fetch("http://localhost:3000/pantryItems")
    .then(r=>r.json())
    .then(data =>{
        pantry = data
        console.log("loading your pantry!")
        displayPantry()
    })
}

//Display pantry function
const pantryList = document.getElementById('pantryList')
const pantryDisplay = document.getElementById('pantryDisplay')
function displayPantry(){
    //reset the list
    pantryList.innerHTML=""
    for (item of pantry){
        const id = item.id
        const unit = item.unit
        const quantity = item.quantity
        const name = item.name
        const listItem = document.createElement('li')
        listItem.textContent = `${english(item, quantity)}  ||  `
        pantryList.appendChild(listItem)
        //create edit button
        const editButton = document.createElement('button')
        editButton.textContent = "edit item"
        listItem.appendChild(editButton)
        //create edit form
        const editForm = document.createElement('form')
        editForm.className = 'pantryUpdateForm'
            //name input
        const nameLabel = document.createElement('label')
        const nameInput = document.createElement('input')
        nameInput.type = 'text'
        nameInput.name = 'name'
        nameInput.value = name
        nameLabel.for = 'name'
        nameLabel.textContent = 'Name: '
        editForm.appendChild(nameLabel)
        editForm.appendChild(nameInput)
            // quantity input
        const quantLabel = document.createElement('label')
        const quantInput = document.createElement('input')
        quantInput.type = 'text'
        quantInput.name = 'quant'
        quantInput.value = quantity
        quantLabel.for = 'quant'
        quantLabel.textContent = 'Quantity: '
        editForm.appendChild(quantLabel)
        editForm.appendChild(quantInput)
            //submit input
        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Update Pantry Item'
        editForm.appendChild(submit)
        //append the editForm
        listItem.appendChild(editForm)
        //add event listener
        editButton.addEventListener('click', ()=>{
            //display edit form
            editForm.style.maxHeight = editForm.scrollHeight+'px'
            pantryDisplay.style.maxHeight = pantryDisplay.scrollHeight +'px'
        })
        //edit on the backend
        editForm.addEventListener('submit', (e)=>{
            e.preventDefault()
            const updatedItem={
                name : e.target.name.value,
                quantity : `${parseFloat(e.target.quant.value)}`,
                unit: unit
            }
            fetch(`http://localhost:3000/pantryItems/${id}`, {
                method : 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(updatedItem)
            })
            .then(r=>r.json())
            .then(()=>loadPantry())
        })
    }
}

loadPantry()


//returns an html div with a recipe that gets appended to the recipe book specifically
function renderRecipe(recipeObj){
    //creatre the div
    const renderedRecipeDiv = document.createElement('div')
    //title collapsible
    const renderedName = document.createElement('button')
    renderedName.className = 'recipeCollapsible'
    renderedName.textContent = recipeObj.name
    renderedRecipeDiv.appendChild(renderedName)
    renderedName.addEventListener('click', function(){
        const content = renderedName.nextElementSibling
        if (parseInt(content.style.maxHeight)){
            content.style.maxHeight = '0px'
            content.style.padding = '0px'
            recipeBook.style.maxHeight = recipeBook.scrollHeight+"px"
        }else{
            content.style.maxHeight = content.scrollHeight +"px"
            // content.style.padding = 18
            recipeBook.style.maxHeight = (recipeBook.scrollHeight+ content.scrollHeight)+"px"
        }
    })
    //create a content div for the collapsible
    const recipeContent = document.createElement('div')
    recipeContent.className = 'recipeContent'
    renderedRecipeDiv.appendChild(recipeContent)
    //print ingredient list with a title
    const ingrTitle = document.createElement('h5')
    ingrTitle.textContent = "Ingredients:"
    recipeContent.appendChild(ingrTitle)
    const ingredientList = document.createElement('ul')
    recipeContent.appendChild(ingredientList)
    for (ingr of recipeObj.ingredients){
        const newIngr = document.createElement('li')
        newIngr.textContent = english(ingr, ingr.quantity)
        ingredientList.appendChild(newIngr)
    }
    //print steps with a title 
    const stepsTitle = document.createElement('h5')
    stepsTitle.textContent = "Steps:"
    recipeContent.appendChild(stepsTitle)
    const stepsList = document.createElement('ol')
    recipeContent.appendChild(stepsList)
    for (step of recipeObj.steps){
        const newStep = document.createElement('li')
        newStep.textContent = step
        stepsList.appendChild(newStep)
    }
    return renderedRecipeDiv
}

//view recipes
const recipeBook = document.getElementById('recipeBook')
loadRecipes()
function loadRecipes(){
fetch('http://localhost:3000/recipes')
.then(r=>r.json())
.then(recipes=>{
    for (recipe of recipes){
        recipeBook.appendChild(renderRecipe(recipe))
    }
    console.log('recipes loaded!')
})}


//Search Recipes by ingredient
const searchByIngredient = document.getElementById('searchByIngredientForm')
searchByIngredient.addEventListener('submit', (e)=>{
    e.preventDefault()
    const targetIngredient = e.target.ingredient.value
    fetch(`http://localhost:3000/recipes/`)
    .then(r=>r.json())
    .then(recipes=>{
        let searchReturn = []
        for (recipe of recipes){
            for (ingredient of recipe.ingredients){
                if (ingredient.name === targetIngredient){
                    searchReturn.push(recipe.name)
                }
            }
        }
        //display search results
        const resultsList = document.getElementById('resultsList')
        while (resultsList.firstChild){
            resultsList.removeChild(resultsList.firstChild)
        }
        const searchWrapper = document.getElementById('searchByIngredientWrapper')
        console.log(searchReturn)
        for (result of searchReturn){
            const resultItem = document.createElement('li')

            resultItem.textContent = result
            resultsList.appendChild(resultItem)
        }
        //message if there are no results
        if (searchReturn.length === 0){
            const sadMessage = document.getElementById('sadMessage')
            sadMessage.textContent = "Sorry, no recipes with that ingredient."
        }else{
            sadMessage.textContent = ""
        }
        //adjust the size of the collapsible
        searchWrapper.style.maxHeight = searchWrapper.scrollHeight +"px"
    })
})


//Add New Pantry Form
const newPantryForm = document.getElementById("newPantry")
const newPantryWrapper = document.getElementById("logNewPantryWrapper")
newPantryForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    if (e.target.quantity.value === "" && e.target.unit.value==""){
        addPantry({
            name : e.target.name.value,
            quantity : "Infinity",
            unit: e.target.unit.value,
        })
    }else{
        addPantry({
            name : e.target.name.value,
            quantity : parseFloat(e.target.quantity.value),
            unit: e.target.unit.value,
        })
    }
    // confirm on the frontend
    const confirmation = document.createElement('p')
    confirmation.textContent = `${e.target.name.value} added to your pantry!`
    newPantryWrapper.appendChild(confirmation)
    setTimeout(()=>{confirmation.style.display = 'none'}, 2000)
})

function addPantry(ingredientObj){
    fetch('http://localhost:3000/pantryItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredientObj)
    })
    .then(r=>r.json())
    .then(data=>{
        console.log(data)
        loadPantry()
    })
}

//Add New Recipe
const initRecipe = document.getElementById('initializeNewRecipe')
const newRecipeWrapper = document.getElementById('newRecipeWrapper')
let newRecipe
const newRecipeZone = document.getElementById('newRecipeZone')
const finalizeRecipe = document.getElementById('finalizeRecipe')
initRecipe.addEventListener('submit', (e)=>{
    e.preventDefault()
    newRecipe = {
        name : e.target.name.value,
        ingredients : [],
        steps : [],
    }
    newRecipeFollowUp = document.getElementsByClassName('newRecipeForm')
    console.log(newRecipeFollowUp)
    for (i=0; i<newRecipeFollowUp.length; i++){
        const formPiece = newRecipeFollowUp[i]
        console.log(formPiece.scrollHeight)
        formPiece.style.display = 'block'
        formPiece.style.maxHeight = formPiece.scrollHeight+"px"
    }
    finalizeRecipe.addEventListener('click', ()=>{
        fetch('http://localhost:3000/recipes',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newRecipe)
        })
        .then(r=>r.json())
        .then(newRecipeBackend=>{
            //post a confirmation message and clear out the new recipe zone
            const confirmation = document.createElement('p')
            confirmation.textContent = `${newRecipeBackend.name} added to your recipes!`
            newRecipeZone.innerHTML=""
            newRecipeWrapper.appendChild(confirmation)
            setTimeout(()=>{confirmation.style.display = 'none'}, 2000)
            newRecipe = {}
            finalizeRecipe.style.display = 'none'
        })
    })
    printNewRecipe()
})

function printNewRecipe(){
    //clear new recipe zone
    newRecipeZone.innerHTML = ""
    //print title
    const newRecipeName = document.createElement('h4')
    newRecipeName.textContent = newRecipe.name
    newRecipeZone.appendChild(newRecipeName)
    //print ingredient list with a title
    const ingredientsTitle = document.createElement('h5')
    ingredientsTitle.textContent = "Ingredients:"
    newRecipeZone.appendChild(ingredientsTitle)
    const ingredientList = document.createElement('ul')
    newRecipeZone.appendChild(ingredientList)
    for (ingr of newRecipe.ingredients){
        const newIngr = document.createElement('li')
        newIngr.textContent = english(ingr, ingr.quantity)
        ingredientList.appendChild(newIngr)
    }
    //print steps with a title 
    const stepsTitle = document.createElement('h5')
    stepsTitle.textContent = "Steps:"
    newRecipeZone.appendChild(stepsTitle)
    const stepsList = document.createElement('ol')
    newRecipeZone.appendChild(stepsList)
    for (step of newRecipe.steps){
        const newStep = document.createElement('li')
        newStep.textContent = step
        stepsList.appendChild(newStep)
    }
    //make space for the new steps
    newRecipeWrapper.style.maxHeight = newRecipeWrapper.scrollHeight+"px"
}

//add ingredient to new recipe
const newIngredient = document.getElementById('newRecipeIngredientForm')
newIngredient.addEventListener('submit', (e)=>{
    e.preventDefault()
    if (e.target.quantity.value === "" && e.target.unit.value==""){
        newRecipe.ingredients.push({
            name : e.target.ingredient.value,
            quantity : 5000,
            unit: e.target.unit.value,
        })
    }else{
        newRecipe.ingredients.push({
            name : e.target.ingredient.value,
            quantity : parseFloat(e.target.quantity.value),
            unit: e.target.unit.value,
        })
    }
    printNewRecipe()
})

//add step to new recipe
const newStep = document.getElementById('newRecipeStepForm')
newStep.addEventListener('submit', (e)=>{
    e.preventDefault()
    newRecipe.steps.push(e.target.step.value)
    printNewRecipe()
})


//code for collapsibles+animations
const collapsibles = document.getElementsByClassName('collapsible')
{for (i=0; i<collapsibles.length; i++){
    collapsibles[i].addEventListener('click', function(){
        const content = this.nextElementSibling
        if (parseInt(content.style.maxHeight)){
            content.style.maxHeight = '0px'
            setTimeout(()=>{content.style.padding = '0px'}, 200)
            this.style.padding = null
        }else{
            content.style.padding = 8
            this.style.padding = 24
            content.style.maxHeight = (content.scrollHeight) +"px"
        }
    })
}}

const textInputs = document.querySelectorAll('input[type="text"]')
textInputs.forEach((inputField)=>{
    inputField.addEventListener('focus', function(){
        inputField.className="focused"
    })
    inputField.addEventListener('blur', function(){
        inputField.className=""
    })
})