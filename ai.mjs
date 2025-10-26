import { getFirestore, collection, updateDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { db, realTimeDb } from './firebase.js';

const MAX_MESSAGE_HISTORY = 20;
const AI_INSTRUCTIONS = "You are a financial assistant primarily focused on advising clients about banking options. Make sure to list your sources and the authors for each source of information that you provide. Personalize your information based on the user's input data provided if relevant. Read the message history first before sending and ignore any irrelevant messages to the topic.";
const API_KEY = 
const API_URL = "https://api.openai.com/v1/chat/completions";

async function askOpenAI(messages) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o-mini", // Adjust the model name if necessary
            messages: messages,
        }),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`OpenAI API error: ${response.statusText} - ${errorDetails}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function addUser(accEmail) {
    try {
        const userRef = doc(db, "userData", accEmail);  // Use email as the document ID
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists())
        {
            await setDoc(userRef, {
                messages: [],
            });
            console.log("Document written with ID: ", userRef.id);
        }
        else
        {
            console.log("already exists");
        }
    } catch (e) {
        return false;
    }
}

export async function updateUser(accEmail, data) {
    const userRef = doc(db, "userData", accEmail); 
        const docSnap = await getDoc(userRef);
        if (docSnap.exists())
        {
            await updateDoc(userRef, data);
        }
}

async function newMessage(accEmail, message, response)
{
    const userRef = doc(db, "userData", accEmail); 
    const docSnap = await getDoc(userRef);
    console.log("EDUCATION");
    if (docSnap.exists())
    {
        const userData = docSnap.data();
        const messages = userData.messages;
        if (messages.length >= MAX_MESSAGE_HISTORY)
        {
            messages.shift();
            messages.shift();
        }
        messages.push(message);
        messages.push(response);
        await updateUser(accEmail, {messages: messages})
    }
    return message;
}

async function checkRelevantDatastore(message)
{
    let messageHistory = [
        { role: "system", content: "given a list of options choose a relevant data set name exactly as listed, return the word none if none applicable if any to use for this prompt: " + message }
    ];
    
    const dbRef = ref(realTimeDb);  // Reference to the root of the database
    const snapshot = await get(dbRef);
    if (snapshot.exists())
    {
        const data = snapshot.val();
        const keys = Object.keys(data);
        console.log("ALL KEYS: " + keys)
        messageHistory.push({
            role: "user",
            content: "the dataset is " + keys
        });
        const completion = await askOpenAI(messageHistory);
        const output = completion.choices[0].message.content;
       let returnOutput = "";
        if (output != "none" && (keys.includes(output)))
        {
            const value = data[output];
            returnOutput = JSON.stringify(value);
            console.log(returnOutput);
            return returnOutput;
        }
        return returnOutput;
    }
    return "";
}

export async function chatInput(accEmail, message)
{
    let messages = [];
    let userData = [];
    const userRef = doc(db, "userData", accEmail); 
    const docSnap = await getDoc(userRef);
    let messageHistory = [
        { role: "system", content: AI_INSTRUCTIONS }
    ];

    const dataSet = await checkRelevantDatastore(message);
    console.log(dataSet);

    if (docSnap.exists())
    {
        const userData = docSnap.data();
        messages = userData.messages || [];
        for (let field in userData) {
            const value = userData[field];
            console.log("Field: ", field, " Data: ", value);
            if (field == "messages")
            {
                for (let i = 0; i < messages.length; i++) {
                    if (i % 2 === 0) {  // Even index: user message
                        messageHistory.push({
                            role: "user",
                            content: messages[i]
                        });
                    } else {  // Odd index: assistant response
                        messageHistory.push({
                            role: "assistant",
                            content: messages[i]
                        });
                    }
                }
            }
            else
            {
                messageHistory.push({
                    role: "user",
                    content: "my " + field + " is " + value
                });
            }
        }
        
    }
    // Add the new user message to the history
    messageHistory.push({ role: "user", content: message });
    console.log(messageHistory);

    const completion = await askOpenAI(messageHistory);
    console.log(completion.choices[0].message.content);
    newMessage(accEmail, message, completion.choices[0].message.content);
    console.log("DO HICKY");
    return completion.choices[0].message.content;
}

const auth = getAuth();

export async function loginOrSignUp(newUserStatus, email, password) {
    if (newUserStatus == true)
    {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // New user created

            console.log("User signed up:", user);
            return { success: true, message: "User signed up", user };
        } catch (signUpError) {
            console.error("Error during sign up:", signUpError.message);
            return { success: false, message: "Error during sign up", error: signUpError.message };
        }
    }
    else
    {
        try {
            // Try to sign in first
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // User found, logged in
    
            console.log("User logged in:", user);
            return { success: true, message: "User logged in", user };
        } catch (error) {
            console.error("Error during login:", error.message);
            return { success: false, message: "Invalid username or password", error: error.message };
        }
    }
}

// Logging in


//on account creation:
//console.log(addUser("blowbiden@gmail.com"));
//updateUser("blowbiden@gmail.com", {name: "Joe Biden"});

//console.log("FORTNITE: ", chatInput("blowbiden@gmail.com", "give me some info about interest rates from your dataset"));
