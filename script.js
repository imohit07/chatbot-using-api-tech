let prompt=document.querySelector("#prompt")
let submitbtn=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")

// Use Vercel serverless function for API calls
const Api_Url = "/api/chat";

// User object to store message and file data
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
}
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area")
    
    let requestBody = {
        message: user.message,
        imageData: user.file.data ? user.file : null
    }
    
    let requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }
    
    try {
        let response = await fetch(Api_Url, requestOptions)
        let data = await response.json()
        
        if (data.success && data.response) {
            text.innerHTML = data.response
        } else {
            text.innerHTML = "Sorry, I couldn't process your request. " + (data.error || "Please try again.")
        }
    }
    catch(error) {
        console.error('Error:', error);
        text.innerHTML = "Sorry, there was an error connecting to the AI service. Please try again."
    }
    finally {
        chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"})
        image.src = `image.svg`
        image.classList.remove("choose")
        user.file = {
            mime_type: null,
            data: null
        }
    }
}
function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}
function handlechatResponse(userMessage){
    user.message=userMessage
    let html=`<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`
prompt.value=""
let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)
chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
setTimeout(()=>{
let html=`<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
    <img src="loading.webp" alt="" class="load" width="50px">
    </div>`
    let aiChatBox=createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

},600)}
prompt.addEventListener("keydown",(e)=>{
    prompt.style.color = "black"; 
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)
    }
})
submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
       let base64string=e.target.result.split(",")[1]
       user.file={
        mime_type:file.type,
        data: base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
    }
    
    reader.readAsDataURL(file)
}) 
imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()

})
