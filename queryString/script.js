const mainContainer = document.querySelector("#main-container");
const userButtonContainer = document.createElement("div");
userButtonContainer.className =
  "flex items-start justify-start gap-16 border border-gray-300 rounded-md p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out sticky top-0";

const mainPostContainer = document.createElement("div");
mainPostContainer.className =
  "main-post-container flex flex-col items-start justify-start gap-6";

async function fetchData(num) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${num}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    displayTitle(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayTitle(data) {
  const postContainer = document.createElement("div");
  mainPostContainer.innerHTML = "";
  //   console.log(data);
  data.forEach((item) => {
    //   console.log(item);
    console.log(`Title: ${item.title}`);
    console.log(`Body: ${item.body}`);

    postContainer.className =
      "post-container bg-white p-10 rounded-lg shadow-md max-w-4xl flex flex-col items-start justify-start gap-2 gap-4 mb-4 border border-gray-200 hover:border-gray-400 transition-colors hover:duration-3000 ease-in-out cursor-pointer hover:bg-gray-50 hover:shadow-lg hover:scale-105";
    console.log(postContainer);

    const postId = document.createElement("p");
    postId.className = "text-sm text-gray-500";
    postId.textContent = `Post ID: ${item.id}`;

    const titleContainer = document.createElement("h2");
    // console.log(titleContainer);
    titleContainer.className = "text-2xl font-bold mb-4 text-gray-800";
    titleContainer.textContent = `${item.title}`;

    const bodyContainer = document.createElement("p");
    bodyContainer.className = "text-gray-600";
    bodyContainer.textContent = `${item.body}`;
    // console.log(bodyContainer);

    postContainer.appendChild(postId);
    postContainer.appendChild(titleContainer);
    postContainer.appendChild(bodyContainer);

    mainPostContainer.appendChild(postContainer);
    console.log(mainPostContainer);
  });
}

Array(5)
  .fill()
  .map((_, index) => {
    const userButton = document.createElement("button");
    userButton.className =
      "py-3 px-10 rounded-md bg-green-400 active:bg-green-700 active:border-black active:border-2 text-white hover:bg-blue-600 transition-colors duration-300 ease-in-out ";
    userButton.textContent = `User ${index + 1}`;
    userButton.addEventListener("click", () => fetchData(index + 1));

    userButtonContainer.appendChild(userButton);
    mainContainer.appendChild(userButtonContainer);
    mainContainer.appendChild(mainPostContainer);
  });