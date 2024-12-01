# ChromeExtension-AutoFormFiller
This Chrome Extension allows users to add or edit fields in job application forms,extratc data from Linkedin profiles, and store it locally. Users can customize the form fields and save their data for later.

## Explanation of Structure and files
Below each member wrote about her part, highlighted important features and structures.


Sara Ismayilova:

popup.html - HTML structure for extension's popup interface
contains buttons for adding fields, saving, creating/ deleting and selecting. For integration, javascript event listeners are linked to these UI elements to handle actions like saving,editing, deleting, also switching between profiles.

popup.css - styling for popup interface
styled the buttons and form inputs. Defines the layout of profile selector and field list. Considered responsive design for different screen size.

manifest.json - Chrome extension development framework(Extension generation task)
Manifest version 3 is used, which is latest version for Chrome Extension.(Improved security and High performance)
"Storage" permission is used for allowing extension to use Chrome's localstroage to store data.
Uploaded an icon from - freepik.com
Ensures the extension has access to necessary resources and defines the fundamental settings for the extension to operate within Chrome.

Customizable Data Fields - popup.js handles customizable data fields
Enabled users to add or edit fields with custom names and values(desired documents can be downloaded manually).Fields are saved to Chrome.s localstorage under a profile-specific namespace. Fields can be edited or updated based on the selected profile. Users can delete the fields from their profile/ with the data being removed from storage also.

Profile switching - managing multiple user profiles
users can create profiles, switch between existing ones, and delete them.
Each profile has its own fields. 
Profile Selector - a dropdown is used to select the active profile, and data is loaded dynamically based on the selected profile.

History Restoring- ensuring that data is not lost when the extension is closed for browser is restarted.
Data persistance - data is stored in chrome's local storage
Ensures the user's fields and selected profile are preserved even after closing. 


Aliya Zulfugarli: