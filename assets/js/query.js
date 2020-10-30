/* window.onload = function(e) {
    alert("Window Loaded");
}; */

(function () {
    // alert("Window has loaded Successfully!");
    // hide file-btn-row class
    // document.querySelector(".file-btn-row").style.display = 'none';
    $(".file-btn-row").hide();
})();

$(document).ready(function(event){
    console.log(event);
    alert("My Document is Ready");
});