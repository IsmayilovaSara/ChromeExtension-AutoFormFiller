document.addEventListener("DOMContentLoaded", ()=>{
const addFieldBtn = document.getElementById("add-field-btn");
const newFieldForm = document.getElementById("new-field-form");
const saveFieldBtn = document.getElementById("save-field-btn");
const fieldList = document.getElementById("field-list");
const fieldNameInput = document.getElementById("field-name");
const fieldValueInput = document.getElementById("field-value");

let isEditMode = false;  //checks if we are editting
let editIndex = null;   //checks the index of the field being editted

function showNewFieldForm()
{
    newFieldForm.style.display = "block";
    fieldNameInput.value="";
    fieldValueInput.value="";
    isEditMode=false;
    editIndex=null;
}

function resetForm()
{
    newFieldForm.style.display="none";
    fieldNameInput.value="";
    fieldValueInput.value="";
    isEditMode =false;
    editIndex=null;
}

//Func to add new field
function saveField()
{
    const fieldName = fieldNameInput.value.trim();
    const fieldValue = fieldValueInput.value.trim();

    if(!fieldName || !fieldValue)
    {
        alert("Both field name and value are required!");
        return;
    }


chrome.storage.local.get("fields",(result)=>
{
    const fields = result.fields || [];

    if(isEditMode)
    {
        fields[editIndex] ={name: fieldName, value:fieldValue};
        alert("Field updated successfully");
    }
    else
    {
        fields.push({name: fieldName, value:fieldValue});
        alert("Field added succesfully");
    }

    chrome.storage.local.set({fields}, ()=>
    {
        loadFields();
        resetForm();
        
    });
});

}



//Below func for loading fields from local storage
function loadFields()
{
    chrome.storage.local.get("fields", (result) =>
    {
        const fields = result.fields || [];
        fieldList.innerHTML = "";
        
        fields.forEach((field,index) =>  
        {
            const fieldDiv = document.createElement("div");
            fieldDiv.classList.add("field-item");
            fieldDiv.innerHTML = 
            `
            <p><strong>${field.name}:</strong> ${field.value}</p>
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            

            fieldDiv.querySelector(".edit-btn").addEventListener("click", ()=>
            {
                startEditing(index,field);
            });

            fieldDiv.querySelector(".delete-btn").addEventListener("click", ()=>
            {
                deleteField(index);
            });      
            
            fieldList.appendChild(fieldDiv);

        });
        
    });
}



//Function to delete a field
function deleteField(index)
{
    chrome.storage.local.get("fields", (result)=> 
    {
        const fields = result.fields || [];
        fields.splice(index, 1);
        chrome.storage.local.set({fields},()=>
        {
            alert("Field deleted successfully");
            loadFields();
        });
    });
}

//function to edit a field
function startEditing(index,field)
{
    isEditMode=true;
    editIndex=index;
    newFieldForm.style.display ="block";
    fieldNameInput.value= field.name;
    fieldValueInput.value=field.value;
    
}


//Event listeners
addFieldBtn.addEventListener("click", showNewFieldForm);
saveFieldBtn.addEventListener("click", saveField);

loadFields();

});