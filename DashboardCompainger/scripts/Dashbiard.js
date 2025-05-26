window.addEventListener("load",function(){
let btn=document.getElementById("toggle");
let items=document.getElementById("aside");
 btn.addEventListener("click", function () {
    items.classList.toggle("show");
    console.log(items.classList);
  });
})
