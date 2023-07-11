const queryInput=  document.querySelector(".whole-query-input");
const tableIdBtn = document.querySelector(".table_in-btn");
const cardContainer = document.querySelector(".card-container");
const popup = document.querySelector(".popup");

function processQuery(){
const query = queryInput.value;

function positionIndex(startStr){ //gets values from provided query input (char and table ID's array)
    posStartIndex = query.indexOf(startStr) + startStr.length;
    posEndIndex = query.indexOf(")", posStartIndex);
    const positionId = query.slice(posStartIndex,posEndIndex);
    return posContentArray = positionId.split(",").map(id => id.trim());

}
const characterIdArray = positionIndex("character_id in (");
const tableIdArray = positionIndex("table_id in (");

const queryTimeStart = query.match(/between(.*)/);
const queryTime = queryTimeStart[1].trim();
const templateSqlCommand = `\\sql select character_id, updated_on, table_id from activity_logs.slots_character_tables where character_id in () and table_id in () and updated_on between `+ queryTime;
let lengthOfQueryWCharacter = templateSqlCommand.length;
let CurrentCharContent = '';
const charChopsArray = [];

function chopCharacterArray(character){
    CurrentCharContent += ", "+ character;
    CurrentCharContent = CurrentCharContent.substring(2);
    charChopsArray.push(CurrentCharContent);
    CurrentCharContent = '';
    lengthOfQueryWCharacter = templateSqlCommand.length;
}
characterIdArray.forEach((character, index)=>{
    if(lengthOfQueryWCharacter < 3000){
        lengthOfQueryWCharacter += character.length +2;
        CurrentCharContent += ", "+ character;
    }
    else{
        chopCharacterArray(character);
    }
    if(index == characterIdArray.length-1){
        chopCharacterArray(character);
    }
});
charChopsArray.forEach((char, index) =>{
    const cards = document.createElement("div");
    cards.classList.add("cards-list");
    const cardRowTitle = document.createElement("p");
    cardRowTitle.classList.add("card-row-title");
    const cardRowDiv = document.createElement("div");
    cardRowDiv.classList.add("card-row");
    cardRowDiv.appendChild(cardRowTitle);
    const firstElement = char.split(", ");
    cardRowTitle.textContent = "Character ID from " +firstElement[0] + " to " +firstElement[firstElement.length-1];
    let lengthOfCurrentStr = lengthOfQueryWCharacter + char.length;
    let currentTableId="";
    let elementIndex=0;
    const charStartIndex = templateSqlCommand.indexOf("character_id in (") + "character_id in (".length;
    const charEndIndex = templateSqlCommand.indexOf(")", charStartIndex);
    const strWithCharId = templateSqlCommand.slice(0, charStartIndex) + char + templateSqlCommand.slice(charEndIndex);
    const tabStartIndex = strWithCharId.indexOf("table_id in (") + "table_id in (".length;
    const tabEndIndex = strWithCharId.indexOf(")", tabStartIndex);

    function chopTableArray(id){
        currentTableId += ", "+ id; // so it will anyway add last one into result
        const currentTableIdWComma = currentTableId.substring(2);
        const queryString = strWithCharId.slice(0, tabStartIndex) + currentTableIdWComma + strWithCharId.slice(tabEndIndex);
        lengthOfCurrentStr = strWithCharId.length;
        currentTableId = "";
        const firstElement = currentTableIdWComma.split(", ");
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <div class="card-header">
        <h2 class="card-title">Table ID from ${firstElement[0]} to ${id}</h2>
        <button class ="copy-to-clipboard">Copy</button>
        </div>
        <p class="result-text">${queryString}</p>`;
        card.addEventListener('mousedown', function() {
            if(this.classList.contains("active")) this.classList.remove("active");
            else this.classList.add("active");
          });
          card.querySelector(".copy-to-clipboard").addEventListener("click", function() {
          navigator.clipboard.writeText(queryString);
          popup.style.display = "flex";
          popup.querySelector(".copied-text").textContent ="Copied to clipboard";
          setTimeout(function() {
            popup.style.display = 'none';
          }, 5000);
        });
        cards.appendChild(card);
        elementIndex++;
    }
    tableIdArray.forEach((id,index) => {
        if(lengthOfCurrentStr <4006){
            lengthOfCurrentStr += id.length+2; //plus two so we take into account comma and space in formatting field
            currentTableId += ", "+ id;
        }
        else{
            chopTableArray(id);
        }
        if(index == tableIdArray.length-1){
            chopTableArray(id);
        }
    });
    cardRowDiv.appendChild(cards);
    cardContainer.appendChild(cardRowDiv);
});

/*
OLD CODE FOR BACKUP
const characterIdArray = 
let lengthOfCurrentStr = query.length;
let currentTableId="";
tableIdArray.forEach((id,index) => {
    if(lengthOfCurrentStr <4010){
        lengthOfCurrentStr += id.length+2; //plus two so we take into account comma and space in formatting field
        currentTableId += ", "+ id;
    }
    else{
        currentTableId += ", "+ id; // so it will anyway add last one into result
        const currentTableIdWComma = currentTableId.substring(2);
        const queryString = query.slice(0, startIndex) + currentTableIdWComma + query.slice(endIndex);
        lengthOfCurrentStr = query.length;
        currentTableId = "";
        console.log(queryString);
    }
    if(index == tableIdArray.length-1){
        currentTableId += ", "+ id; // so it will anyway add last one into result
        const currentTableIdWComma = currentTableId.substring(2);
        const queryString = query.slice(0, startIndex) + currentTableIdWComma + query.slice(endIndex);
        lengthOfCurrentStr = query.length;
        currentTableId = "";
        console.log(queryString);
    }
});
*/
}
tableIdBtn.addEventListener("click",processQuery);
