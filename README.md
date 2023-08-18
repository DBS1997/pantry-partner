# Pantry Partner
Pantry Partner is an app designed to help someone manage their pantry and figure out what recipes they can make with the food they have. It can track your pantry for you, serve as a digital recipe book and then search through that recipe book for recipes you can make with the food you have.

It is currently uploaded with an example db.json, which stores a placeholder pantry and a couple example recipes. However, the intended use is for the user to start with a blank slate and input all of the pantry items and recipes themselves. 

## Running the Program
In order run the program, navigate to the project folder in CLI and run the command 
```bash
json-server --watch db.json 
```
Then open index.html and it should work.

## User Instructions
The program will work most consistently if all the user inputs are all lowercase, and any units used are entered as singular. Capitalizing recipe names should not cause any problems though. The program can manage conversions between volumetric measurements including tsp, tbsp, floz, cup, pint, quart, gallon, but currently does not handle other conversions.

## Explanation of other files
I decided to include my "playground" folder which i used to experiment with different ideas before trying to implement them into the project. I also included the DESIGN.md document, which mostly served as a place to track my progress on the project and plan it out. The only files needed to run the program are: index.html /src/index.js style.css and db.json, the rest were just included to show a bit behind the scenes of the process of making Pantry Partner.