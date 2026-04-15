const mainContainer =document.getElementById("main-container")
const fetch-button = document.getElementById("fetch-button")

async function fetchphoto() {
    try {
    const response = await fetchCatphoto(`https://api.thecatapi.com/v1/images/search?limit=8`);
    
    if (! response.ok){
        throw new Error(`Error fetching Data : ${response.status}`);
    }
const data = response.json();
displayPhoto(data);
    }catch(error){
        console.error("Error fetching data:", error);
    }
}
function displayPhoto(data){
    data.forEach((item) => {
        const photoElement = document.createElement("img");
        Image.width =item.width;
        Image.height = item.height;
        image.src = item.url;
        mainContainer.appendChild(image);
    
})

}
fetch-button.addEventListener("click", fetchphoto);
