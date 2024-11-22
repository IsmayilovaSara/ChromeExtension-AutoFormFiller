document.addEventListener("DOMContentLoaded", ()=>{
    const addFieldBtn = document.getElementById("add-field-btn");
    const newFieldForm = document.getElementById("new-field-form");
    const saveFieldBtn = document.getElementById("save-field-btn");
    const fieldList = document.getElementById("field-list");
    const fieldNameInput = document.getElementById("field-name");
    const fieldValueInput = document.getElementById("field-value");
    const createProfileBtn = document.getElementById("create-profile-btn");
    const deleteProfileBtn = document.getElementById("delete-profile-btn");
    const profileSelector = document.getElementById("profile-selector");
    
    let isEditMode = false;  //checks if we are editting
    let editIndex = null;   //checks the index of the field being editted
    let currentProfile = null;

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

        if(!currentProfile)
        {
            alert("Please select or create a profile first");
            return;
        }
    
    
    chrome.storage.local.get("fields",(result)=>
    {
        const profiles = result.profiles || {};
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
        
        profiles[currentProfile] = fields;
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
        if(!currentProfile)
        {
            fieldList.innerHTML="<p>Please select or create a profile</p>"
            return;        
        }

        chrome.storage.local.get("profiles", (result) =>
        {
            const profiles = result.profiles || {};
            const fields = profiles[currentProfile] || [];
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
        if(!currentProfile)
        {
            alert("Please select a profile");
            return;
        }

        chrome.storage.local.get("profiles", (result)=> 
        {
            const profiles= result.profiles || {};
            const fields = profiles[currentProfile] || [];
            fields.splice(index, 1);
            profiles[currentProfile]=fields;

            chrome.storage.local.set({profiles},()=>
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

    function createProfile()
    {
        const profileName= prompt ("Enter a name for new profile");
        if(!profileName) return;

        chrome.storage.local.get("profiles",(result)=>
        {
            const profiles = result.profiles || {};

            if(profiles[profileName])
            {
                alert("A profile with this name already exists");
                return;
            }

            profiles[profilName]=[];
            chrome.storage.local.set({profiles}, ()=>
            {
                loadProfiles();
                alert("Profile created successfully");
            });
        });
    }

    function deleteProfile()
    {
        if(!currentProfile)
        {
            alert("Please select a profile first!");
            return;
        }

        if(!confirm(`Are you sure that you want to delete the profile "${currentProfile}"?`)) return;

        chrome.storage.local.get("profiles", (result) =>
        {
            const profiles =result.profiles || {};
            delete profiles[currentProfile];

            chrome.storage.local.set({profiles}, ()=> 
            {
                currentProfile = null;
                loadProfiles();
                loadFields();
                alert("Profile deleted successfully");             
                
            });
        });
    }

    function loadProfiles()
    {
        chrome.storage.local.get("profiles",(result) =>
        {
            const profiles = result.profiles || {};
            profileSelector.innerHTML="";

            Object.keys(profiles).forEach((profile)=>
            {
                const option = document.createElement("option");
                option.value = profile;
                option.textContent= profile;
                profileSelector.appendChild(option);
            });

            currentProfile = Object.keys(profiles)[0] || null;
            if(currentProfile)
            {
                profileSelector.value = currentProfile;
            }
            loadFields();
        });
    }

    profileSelector.addEventListener("change", ()=>
    {
        currentProfile= profileSelector.value;
        loadFields;
    });

    
    
    //Event listeners
    addFieldBtn.addEventListener("click", showNewFieldForm);
    saveFieldBtn.addEventListener("click", saveField);
    createProfileBtn.addEventListener("click", createProfile);
    deleteProfileBtn.addEventListener("click", deleteProfile);
    
    loadFields();
    
    });