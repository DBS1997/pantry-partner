<!-- 
Core Deliverables:
1) log items (by quantity?) in your pantry
2) log recipes you know how to make
3) search recipes by ingredient
4) find "recipes i can make right now"
6) when you make a recipe automatically update your pantry




database structure:
two directories: recipes and pantry
Pantry
    an array of pantry items
        pantry items will be objects with quanitity and name and (for stretch deliv) expir dates
Recipes
    an array of recipes
        recipes will be objects with keys name ingredients and steps
        name will be a string
        both ingredients and steps will have arrays as values
            ingredients array will be populated by objects that mirror pantry items
both will be populated primarily (maybe entirely) by the user



Presentation notes
3 things to pre highlight in presentation 
scroll animations done by manually adding pixels, no css grid or flexboxes (because i didn't know about them)
    -there are some small artifacts that you can see because of this
    -as fun as it was to manually program all of this i cannot wait to use a CSS Framework for the next project
english function and infinite quantities
    change 1 block of cheese to 2
    change eggs from 12 to 1

first lets see what we can make
    can open multiple recipes
    show that we can't make fried eggs cause we only have 1 egg and need 2
    when looking at our recipes point out the nested collapsibles and mention that they were super annoying lol
lets make box mac and cheese
    show that the pantry update works
    show the functional unit conversions in action
show the search function in action
    the things we can make with salt
    the things we can make with cinnamon
lets learn a new recipe
    french toast recipe
    show the flexibility of adding different pieces to it in weird order
when we click the button what can we make?
    nothing has changed :(
    but we can at least see it in our recipe list
lets go grocery shopping for french toast
    cinnamon
    4 floz of vanilla extract
    12 eggs
what can we make now? 
    HEY WE CAN MAKE EGGS TOO NOW!
lets make our french toast

features i could add
the ability to edit existing recipes
the ability to change things in the recipe while youre making them
-->