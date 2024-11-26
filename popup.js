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

document.addEventListener("DOMContentLoaded", () => {
    const mapFieldBtn = document.getElementById("map-field-btn");
    const linkedinFieldSelect = document.getElementById("linkedin-field");
    const formFieldSelect = document.getElementById("form-field");

    let fieldMappings = {};

   
    function loadMappings() {
        chrome.storage.local.get("fieldMappings", (result) => {
            fieldMappings = result.fieldMappings || {}; 
        });
    }

    // Map LinkedIn field to form field
    mapFieldBtn.addEventListener("click", () => {
        const linkedinField = linkedinFieldSelect.value;
        const formField = formFieldSelect.value;

        
        if (!linkedinField || !formField) {
            alert("Please select both a LinkedIn field and a form field.");
            return;
        }

        // Check if the mapping already exists
        if (fieldMappings[linkedinField]) {
            alert(`The LinkedIn field "${linkedinField}" is already mapped to "${fieldMappings[linkedinField]}".`);
        } else {
            fieldMappings[linkedinField] = formField;
            chrome.storage.local.set({ fieldMappings }, () => {
                alert(`Mapped LinkedIn field "${linkedinField}" to form field "${formField}".`);
            });
        }
    });

    
    function fillFormBasedOnMapping(linkedinData) {
        for (const linkedinField in fieldMappings) {
            const formField = fieldMappings[linkedinField];
            const value = linkedinData[linkedinField];

            if (value !== undefined) { // Check if the LinkedIn data exists for the field
                const fieldElement = document.getElementById(formField);
                if (fieldElement) {
                    if (formField === 'work-history') {
                        fieldElement.value = value; // Example for Work History
                    } else if (formField === 'education-history') {
                        fieldElement.value = value; // Example for Education History
                    } else {
                        fieldElement.value = value; // For other fields
                    }
                } else {
                    console.warn(`Form field with ID "${formField}" not found.`);
                }
            }
        }
    }

    // Load mappings when the DOM is ready
    loadMappings();
});
document.addEventListener("DOMContentLoaded", () => {
    const generateCoverLetterBtn = document.getElementById("generate-cover-letter-btn");
    const coverLetterOutput = document.getElementById("cover-letter-output");
    const jobTitleInput = document.getElementById("job-title-input"); // New input for job title
    const companyNameInput = document.getElementById("company-name-input"); // New input for company name

   
    async function generateCoverLetter() {
        const jobTitle = jobTitleInput.value.trim(); // Get job title from the input
        const companyName = companyNameInput.value.trim(); // Get company name from the input

        if (!jobTitle || !companyName) {
            alert("Job title and company name are required to generate a cover letter.");
            return;
        }

        // AI to generate cover letter
        try {
            const response = await fetch("https://api.example.com/generate-cover-letter", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ jobTitle, companyName }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            coverLetterOutput.value = data.coverLetter; 
        } catch (error) {
            console.error("Error generating cover letter:", error);
            alert("Failed to generate cover letter. Please try again.");
        }
    }

    //  Job Application Tracking Dashboard
    generateCoverLetterBtn.addEventListener("click", generateCoverLetter);

    
    document.getElementById("save-cover-letter-btn").addEventListener("click", () => {
        const coverLetter = coverLetterOutput.value.trim();
        if (!coverLetter) {
            alert("No cover letter to save.");
            return;
        }

        // Save  cover letter to local storage 
        chrome.storage.local.set({ coverLetter }, () => {
            alert("Cover letter saved successfully!");
        });
    });
});
document.getElementById('add-application-btn').addEventListener('click', function() {
    const companyName = document.getElementById('company-name').value;
    const jobTitle = document.getElementById('job-title').value;
    const dateApplied = document.getElementById('date-applied').value;
    const applicationStatus = document.getElementById('application-status').value;
    const notes = document.getElementById('notes').value;

    const applicationList = document.getElementById('application-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${jobTitle} at ${companyName} (Applied on: ${dateApplied}, Status: ${applicationStatus}, Notes: ${notes})`;
    
    // Create  dropdown to update status
    const statusSelect = document.createElement('select');
    ['applied', 'interview-scheduled', 'offer-received', 'rejected'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        statusSelect.appendChild(option);
    });
    
    statusSelect.value = applicationStatus;
    statusSelect.addEventListener('change', function() {
        listItem.textContent = `${jobTitle} at ${companyName} (Applied on: ${dateApplied}, Status: ${statusSelect.value}, Notes: ${notes})`;
    });

    listItem.appendChild(statusSelect);
    applicationList.appendChild(listItem);

    
    document.getElementById('company-name').value = '';
    document.getElementById('job-title').value = '';
    document.getElementById('date-applied').value = '';
    document.getElementById('application-status').value = 'applied';
    document.getElementById('notes').value = '';
});
// Sample data structure to hold your application data
let applicationData = {
    profiles: [],
    fields: [],
    coverLetters: [],
    jobApplications: []
};

// export data as JSON
document.getElementById('export-data-json-btn').addEventListener('click', () => {
    const dataStr = JSON.stringify(applicationData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'application_data.json';
    a.click();
    URL.revokeObjectURL(url);
});

//  export data as CSV
document.getElementById('export-data-csv-btn').addEventListener('click', () => {
    const csvData = convertToCSV(applicationData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'application_data.csv';
    a.click();
    URL.revokeObjectURL(url);
});

// convert application data to CSV format
function convertToCSV(data) {
    const fields = ['Profile', 'Field', 'Cover Letter', 'Job Application']; // Customize based on your data structure
    let csv = fields.join(',') + '\n';
    
    // Add profiles
    data.profiles.forEach(profile => {
        csv += `${profile},,,\n`; // Customize based on your profile structure
    });

    // Add fields
    data.fields.forEach(field => {
        csv += `,,${field},\n`; // Customize based on your field structure
    });

    // Add cover letters
    data.coverLetters.forEach(letter => {
        csv += `,,,${letter}\n`; // Customize based on your cover letter structure
    });

    // Add job applications
    data.jobApplications.forEach(application => {
        csv += `,,,${application.companyName},${application.jobTitle},${application.dateApplied},${application.status}\n`; // Customize based on your application structure
    });

    return csv;
}

// import data
document.getElementById('import-data-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('import-data-file');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = JSON.parse(event.target.result);
            applicationData = data; 
            alert('Data imported successfully!');
            
        };
        reader.readAsText(file);
    } else {
        alert('Please select a file to import.');
    }
});

// send data via email 
document.getElementById('send-data-email-btn').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    
    if (!email) {
        alert('Please enter an email address.');
        return;
    }
    
    const dataStr = JSON.stringify(applicationData, null, 2);
    

    alert(`Data sent to ${email}:\n\n${dataStr}`);
    
});
