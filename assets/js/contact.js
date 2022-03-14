
var regUsername=/^([A-ZČĆŽĐŠ][a-zčćžđš]+([ ]?[a-zčćžđš]?["-]?[A-ZČĆŽĐŠ][a-zčćžđš]+)*)$/;
var regEmail=/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;
var br;
var podaciZaSlanje= [];
var ime,mejl;
function regEx(vrednost,id){
    console.log("usli smo u funkciju");
var getEl=id;

var disableSelection =document.getElementById("submit")
disableSelection.setAttribute("disabled","true");

    


let polje=document.getElementById(getEl);
    if(id=="email"){
        let regex=regEmail;
        if(regex.test(vrednost)){
           polje.nextElementSibling.innerHTML='';
           document.getElementById('submit').disabled = false; 
            polje.classList.remove("alert","alert-danger")
           polje.classList.add("alert","alert-success")
            mejl=vrednost;
        }
        else{
           polje.nextElementSibling.innerHTML="<span class='text text-warning'>Dozvoljen format je: text@mail.domain!</span>";
           disableSelection.setAttribute("disabled","true");
           polje.classList.add("alert","alert-danger")
           br++;
        }
    }
    else if(id=="name"){
       let regex=regUsername;
       if(regex.test(vrednost)){
           polje.nextElementSibling.innerHTML='';
          document.getElementById('submit').disabled = false; 
           polje.classList.remove("alert","alert-danger")
          polje.classList.add("alert","alert-success")
           ime=vrednost;
       }
       else{
          polje.nextElementSibling.innerHTML="<span class='text text-warning'>Imena počinju velikim slovom i ne sadrže brojeve.</span>";
           disableSelection =document.getElementById("submit")
          disableSelection.setAttribute("disabled","true");
          polje.classList.add("alert","alert-danger")
          br++;
       }
   }
 

}
  

   

function slanje(){
     podaciZaSlanje={
        "fnm":ime,
        "mail":mejl
 
     };
     console.log('usli smo u ajax pitanje');
     console.log(podaciZaSlanje);
   $.ajax({
      url:"contact.html",
      method:"POST",
      data:podaciZaSlanje,
      dataType:"JSON",
      success:function(result){
          console.log('uspeh');
          
      },
      error:function(xhr){
        //  console.error(xhr);
      }
    });
    document.getElementById("registration").innerHTML="Message sent successfully!";
    setTimeout(function(){

     window.location.href = 'index.php';
  }, 1000);
}
