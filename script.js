let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let imagePreview = document.querySelector("#image img"); // Changed variable name for clarity
let imageinput = document.querySelector("#image input");

// WARNING: Do NOT expose your API key in client-side code in a real application.
// This is for demonstration purposes only.
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDSHTQJqC5yZkFPan0nOLIP5PnGew4wpnk";
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

async function generateResponse(aiChatBox) {
    let textElement = aiChatBox.querySelector(".ai-chat-area");

    // --- FIX 1: Correctly build the 'parts' array ---
    const parts = [{
        text: user.message
    }];

    if (user.file.data) {
        parts.push({
            inline_data: {
                mime_type: user.file.mime_type,
                data: user.file.data
            }
        });
    }

    const RequestOption = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "contents": [{
                "parts": parts // Use the correctly constructed parts array
            }]
        })
    };

    try {
        const response = await fetch(Api_Url, RequestOption);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        // --- FIX 2: Safer response parsing ---
        if (data.candidates && data.candidates.length > 0) {
            const apiResponse = data.candidates[0].content.parts[0].text;
            // The replace for markdown bolding is fine, but let's make the text display cleaner
            textElement.innerHTML = apiResponse.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        } else {
             textElement.textContent = "Sorry, I couldn't get a response. Please try again.";
        }

    } catch (error) {
        console.error("API Error:", error);
        textElement.textContent = "Oops! Something went wrong. Please check the console for details."; // Display error to user
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        // --- FIX 3: Reset UI and user object state correctly ---
        imagePreview.src = `image.svg`;
        imagePreview.classList.remove("choose");
        user.message = null;
        user.file = { mime_type: null, data: null };
        imageinput.value = ""; // Clear the file input
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handlechatResponse() {
    const userMessage = prompt.value.trim();
    if (!userMessage && !user.file.data) return; // Don't send empty messages

    user.message = userMessage;

    let userHtml = `<img src="user.png" alt="User" id="userImage" width="8%">
    <div class="user-chat-area">
        ${user.message}
        ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
    </div>`;
    
    prompt.value = "";
    let userChatBox = createChatBox(userHtml, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let aiHtml = `<img src="ai.png" alt="AI" id="aiImage" width="10%">
        <div class="ai-chat-area">
            <img src="loading.webp" alt="Loading..." class="load" width="50px">
        </div>`;
        let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        generateResponse(aiChatBox);
    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevents new line on Enter
        handlechatResponse();
    }
});

submitbtn.addEventListener("click", () => {
    handlechatResponse();
});

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        imagePreview.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        imagePreview.classList.add("choose");
    };

    reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click();
});
