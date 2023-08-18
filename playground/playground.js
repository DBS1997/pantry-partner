//converter
    //support specific measurement families
        //weight everything is in pounds on the backend of the pantry item
            //each pantry item has a displayUnit
            //whenever recipes talks to pantryItems run the converter equation on the quanitity value
        //volume everything is in cups
        //custom and no units

// function recipeConverter(recipe){
    // .....
    // return recipe in the standard backend pantry unit
//  }
// function itemToDisplayConverter(item){
    // .....
    // return item with display units instead
//  }


//  function coreConverter (quantity, unit){
    // if (unit === one of the supported weight units){
        // convert quantity to the standardized one
//  }else if (...
        // ...
//  ...
//  }if (it's not any of the supported units){
    //  just use the og one
//  }



//  messing around with infiniti
fetch('http://localhost:3000/numbers')
.then(r=>r.json())
.then(data=>{
    for (number of data){
        console.log(number.num)
        if (number.num>1000){
            console.log("it's more than 1000")
        }
        if (number.num<1000){
            console.log("it's less than 1000")
        }
        if (number.num === Infinity){
            console.log("it works with true equality")
        }
        if (number.num == Infinity){
            console.log("it works with imperfect equality")
        }
        if (number.num === "Infinity"){
            console.log("it true equals the string")
        }
        if (parseFloat(number.num) > 4000){
            console.log("parse float works!")
            console.log(parseFloat(number.num))
            console.log(parseFloat(number.num)-1000)
        }
    }
})

// volume conversions
// (tsp)=>cup
// (input/48)
// (tbsp)=>cup
// input/16
// (floz)=>cup
// input/8
// (pint)=>cup
// input*2
// quart=>cup
// input*4
// gallon=>cup
// input*16

// takes a volume in a unit of measurement as an input and returns the same volume in cups
function convToCups(item){
    if (item.unit === "tsp"){
        return (item.quantity/48)
    }
    else if(item.unit === "tbsp"){
        return (item.quantity/16)
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


function compareIngrs(ingredient, pantryItem){
    if (ingredient.unit === pantryItem.unit){
        if (ingredient.quantity <= pantryItem.quantity){
            return true
        }
    }else if (convToCups(ingredient) <= convToCups(pantryItem)){
            return true
    }
    return false
}