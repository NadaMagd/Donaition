function uploadFile(){
let inputImage=document.getElementById("image");
let target_div=document.getElementById("Part_image");
let imageDisplay=document.getElementById("ImageCasas");
inputImage.addEventListener("change",()=>{
    let fileImage=inputImage.files[0];
    console.log(fileImage);
    if(fileImage){
        imageDisplay.src=`/assets/images/${fileImage.name}`
        imageDisplay.classList.add("image");
        // inputImage.style.display="none"
    }
})

}
export{uploadFile}