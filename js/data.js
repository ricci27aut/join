const BASE_URL = "https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
let tasks = [];
let contacts = [];
let taskResponse;

/**
 * Initializes the application by fetching all necessary data.
 */
async function fetchInit() {
    await fetchTasks();
    await fetchUsers();
    await fetchContacts();
}

/**
 * Fetches all contacts and stores them in the global `contacts` array.
 */
async function fetchContacts() {
    contactsResponse = await getAllContacts("contacts");
    contacts = Object.values(contactsResponse);
};

/**
 * Fetches contact data from the specified path and returns it as JSON.
 * 
 * @param {string} path - The path to the contact resource
 * @returns {Promise<Object>} - A Promise that resolves to the parsed JSON data containing all contacts.
 */
async function getAllContacts(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
};

/**
 * Fetches all tasks from the backend and stores them in the global `tasks` array.
 */
async function fetchTasks() {
    taskResponse = await getAllTasks("tasks");
    tasks = [];

    for (const [key, task] of Object.entries(taskResponse)) {
        tasks.push({
            ...task,
            firebaseKey: key
        });
    }
};

/**
 * Fetches all tasks data from the backend as JSON.
 * 
 * @param {string} path - The path to fetch data from
 * @returns {Promise<Object>} The parsed JSON response from the backend.
 */
async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
};

/**
 * Fetches all users and stores them in the global `users` array.
 */
async function fetchUsers() {
    let userResponse = await getAllUsers("users");
    users = Object.values(userResponse);
};

/**
 * Fetches all users from the specified path as JSON.
 * 
 * @param {string} path - The API path to fetch users from.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON response object containing all users.
 */
async function getAllUsers(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
};

/**
 * Sends a PUT request to update data at the specified path.
 * 
 * @param {string} currentTaskPath - The API path where data will be updated.
 * @param {Object} data - The data object to be sent
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function putData(currentTaskPath, data={}) {     
     let response = await fetch(currentTaskPath + ".json",{
        method : "PUT", 
        header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data)                            
    });
    return response = await response.json()
}

/**
 * Sends a POST request to create a new task.
 * 
 * @param {Object} newTask - The task object to be created.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response containing the created task data.
 */
async function postData(newTask) {
    let response = await fetch(BASE_URL + 'tasks' + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });
    let responseData = await response.json();
    return responseData;
};