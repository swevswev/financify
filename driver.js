import { addUser, chatInput, loginOrSignUp, updateUser } from './ai.mjs';

var answer = "driver blank";

export async function tryLoginOrSignup(newUser, e, p)
{
    try {
        let response = await loginOrSignUp(newUser, e, p);  // Await the result of loginOrSignUp
        console.log(response);

        if (response.success) {
            console.log(response.message, response.user);
            let email = response.user.email;
            addUser(email);
            localStorage.setItem('email', email);
            console.log(localStorage.getItem('email'));

            // Return success response
            return { success: true, message: response.message };
        } else {
            console.log("ERROR :", response.message, response.error);

            // Return failure response
            return { success: false, message: response.message };
        }
    } catch (error) {
        // Handle any errors that may occur
        console.error("Error during login/signup:", error);
        return { success: false, message: "An error occurred." };
    }
}


export async function completeSurvey(data)
{
    console.log(data);
    let email = localStorage.getItem('email');
    if (email != "")
        updateUser(email, data)
    return;
}

export async function chatMessage(message)
{
    event.preventDefault();
    let email = localStorage.getItem('email');
    console.log(message);
    if (email != "")
        return await chatInput(email, message);
    return "";
}
