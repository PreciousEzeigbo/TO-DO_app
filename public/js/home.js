let menuBtn = document.getElementById("menu-button");
let sidebar = document.querySelector(".sidebar");

menuBtn.onclick = function () {
    sidebar.classList.toggle("active")
};