
var dataProducts=[];
var dataCategories=[];

function getData(url,callback){
    $.ajax({
        url:"https://bogdanjankovic.github.io/SenseiGames/assets/data/"+url,
        method: "get",
        dataType: "json",
        success: function(response){
            callback(response);
        },
        error: function(err){
            console.log(err);
        }
    })
}
$(document).ready(function(){
getData("categories.json",printCategories);
getData("categories.json",printCoverCat);
getData("menu.json",printMenu)
getData("products.json",printTrendyProducts);
getData("products.json",printJustArrivedProducts);
//getData("headerImages.json",printHeader)

//getData("partners.json",getPartners)
getData("socialLinks.json",printSocial)
getData("products.json",printProductsShop)
getData("platforms.json",printPlatforms)
})


function printCategories(data){
    let html='';
    data.forEach(c => {
        html+=`<a href="shop.html" id="${c.id}" class="catLink nav-item nav-link my-2" onclick="getCatId(this.id)">${c.name}</a>`
    });
    $('.navCatMenu').each(function(){
        $(this).html(html)
    })   
    dataCategories=data;
}

var id;
function getCatId(elem){
    id=elem
    console.log(id)
    localStorage.setItem("id",id)
    console.log( localStorage.getItem("id",id))
    filterChange();
}

function printMenu(data){
    let html=``;
    data.forEach(a=>{
            html+=`<a href="${a.href}" id="${a.name}" class="nav-item nav-link active text-dark" onclick="restartStorage(this)">${a.name}</a>`
    });    
    $('.menu').each(function(){
        $(this).html(html)
    }) 
}

function restartStorage(elem){
    if(localStorage.getItem("id")){
        localStorage.removeItem("id")
    }  
    filterChange()
}

function printTrendyProducts(data){
    let randomArray=getRandomElements(data, 4);
    printProducts(randomArray, "#trendyProducts");
}

function printJustArrivedProducts(data){
    let randomArray=getRandomElements(data, 4, true);
    printProducts(randomArray,"#justArrivedProducts")
}

function getRandomElements(array,limit, newProduct=false){
    let result = [];
    while(1){
        let e=array[Math.floor(Math.random()*array.length)];
        if(newProduct && result.indexOf(e)==-1 && e.new){
                result.push(e)
        }  
        else if(!newProduct && result.indexOf(e)==-1){
            result.push(e)
    }   
        if(result.length==limit) break;
    } 
    return result;
}

function printProducts(data, id="#products"){
    let html=``;
    data.forEach(p => {
        html+=`<div  class="col-lg-3 col-md-6 col-sm-12 pb-1">
        <div id="${p.id}" class="card product-item  mb-4">
            <div class="card-header product-img position-relative overflow-hidden bg-transparent  p-0">
                <img class="img-fluid w-100" src="assets/img/${p.image.img}" alt="">
            </div>
            <div class="card-body  text-center p-0 pt-4 pb-3">
                <h6 class="text-truncate mb-3">${p.name}</h6>
                <div class="d-flex justify-content-center">
                    <h6>${p.price.new}</h6><h6 class="text-muted ml-2"><del>${p.price.old?p.price.old:""}</del></h6>
                </div>
            </div>
            <div class="card-footer d-flex justify-content-between bg-light ">
            <a href="detail.html" id="viewDetail" class="btn btn-sm text-dark p-0" onclick="viewDetail(this)"><i class="fas-solid fa-magnifying-glass-plus text-danger"></i>View Details</a>
            </div>
        </div>
    </div>`
    });
    $(id).html(html);
}

function printProductsShop(data){
    console.log(data)
    data=filterSearch(data)
    data=filterCategory(data)
    data=filterPrice(data)
    data=filterPlatform(data)
    data=sort(data)
    printProducts(data)
}

function filterCategory(data){      
   
    let id=localStorage.getItem("id");
    console.log("filter change"+  id)
    if(id){
        return data.filter(x=>x.cat==id);
    }
    return data;
}
function filterPrice(data){
    let value=$("#range").val();
    if(value==100) return data
    $("#rangeValue").text(value + "$");
    return data.filter(x=>parseInt(x.price.new.substring(1))<value);
} 

function filterChange(){
    getData("products.json",printProductsShop);
    console.log("change")
}



function printCoverCat(data){
    let html=``;
    data.forEach(d => {
        html+=`<div class="col-lg-4 col-md-6 pb-1">
        <div class="cat-item d-flex flex-column " style="padding: 30px;">
            
            <a id="${d.id}" href="shop.html" class="cat-img position-relative overflow-hidden mb-3">
                <img class="img-fluid" src="assets/img/${d.cover}" alt="${d.name}" onclick="getCatId(this.id)">
            </a>
            <h5 class="font-weight-semi-bold m-0">${d.name}</h5>
        </div>
    </div>`
    });
    $('#catCover').html(html)
}


function printSocial(data){
    let html=``;
    data.forEach(d => {
        html+=`<a class="text-white pl-2" href="${d.href}">
                 <i class="${d.ico}"></i>
            </a>`
    });
    $('.social').each(function(){
        $(this).html(html)
    })   
}

$("#range").on('change', filterChange)

function printPlatforms(data){
    let html=``;
    data.forEach(d => {
        html+=` <div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
        <input type="checkbox" name="platforms" class="platforms custom-control-input" id="platform-${d.id}" value="${d.id}"/>
        <label class="custom-control-label" for="platform-${d.id}">${d.value}</label>
    </div> `
    });
    $('#platformForm').html(html)
}

$('#platformForm').on('change', '.platforms', filterChange)

function filterPlatform(data){
    let checked=[]
    $(".platforms:checked").each(function(el){
        checked.push(parseInt($(this).val()))
        console.log(checked.push(parseInt($(this).val())));
    })
    if(checked!=0){
        return data.filter(x => x.platform.some(z=>checked.includes(z)))
    }
    return data
}


$("#searchName").keyup(filterChange)

function filterSearch(data){
    let value=$('#searchName').val()
    if(value){
        valueLower=value.toLowerCase();
        return data.filter(function(el){
            return el.name.toLowerCase().indexOf(valueLower) !== -1;
        })
    }
    return data
}

$("#sort").change(filterChange)

function sort(data){

    let value=$("#sort").val()
    console.log(value)
    if(value=="priceAsc"){
        return data.sort((a,b)=>a.price.new.substring(1)-b.price.new.substring(1))
    }
    else if(value=="priceDesc"){
        return data.sort((a,b)=>b.price.new.substring(1)-a.price.new.substring(1))
    }
    else if(value=="namesAsc"){
        return data.sort((a,b) => a.name > b.name ? 1 : -1);
    }
    else if(value=="namesDesc"){
        return data.sort((a,b) => a.name < b.name ? 1 : -1)
    }
    return data
}


function viewDetail(el){
    let selected=$(el).parent().parent().attr('id');

    getData("products.json", getProducts);
    function getProducts(data){
        localStorage.setItem("allProducts",JSON.stringify(data))
        let product=data.filter(x=>x.id==selected)
        localStorage.setItem("product", JSON.stringify(product))
         
    }
    printDetails();
}
printDetails()
function printDetails(){
    let product=JSON.parse(localStorage.getItem("product")) 
    if(!product){
        $("#detailsDiv").html("<p class='bold text-center'>Choose which product you want to see.</p>")
    }
    else{
        let id=product[0].id
        let name=product[0].name
        let cat=product[0].cat
        let platform=product[0].platform
        let price=product[0].price
        let image=product[0].image

        $("#detailName").html(name)
        $("#detailPrice").html(price.new+" $")
        $("#detailImg").attr('src',`assets/img/${image.img}`)
        $("#detailImg").attr('alt',image.alt)
        
        var output="";
        let allPlatforms=$('input[name=platform]')
        for(let i=0; i<allPlatforms.length;i++){
            let id=allPlatforms[i].id
            let platformNumber=id.match(/\d/)[0]
            
            if(platform.indexOf(parseInt(platformNumber))==-1){
               output+=`<div class="custom-control custom-radio custom-control-inline">
               <input type="radio" class="custom-control-input" id="platform-${allPlatforms[i].id}" name="platform" value="${allPlatforms[i].id}">
               <label class="custom-control-label" for="platform-${allPlatforms[i].id}"><img class="platformimg" src="assets/img/${allPlatforms[i].id}.webp" alt="${allPlatforms[i].id} Platform"></label>`
            }    
             
        }
        $('#platform').html=output;
    }
}

$("#addToCart").click(function(){
    let platform=$('input[name="platform"]:checked').val();
    if(!platform){
        $("#choosePlatform").show()
        $("#choosePlatform").css('color','red')
    }
    else{
        $("#choosePlatform").hide()
        let cart=[];
        let platform=[]
        let getProduct=JSON.parse(localStorage.getItem("product"))
        if(JSON.parse(localStorage.getItem("cart")) && JSON.parse(localStorage.getItem("platform"))){
            let cartStorage=JSON.parse(localStorage.getItem("cart"))
            cartStorage.forEach(element => {
                cart.push(element)
            });
            
            if(getProduct){
                cart.push(getProduct)
                
            }           
        }
        else{
            if(getProduct!=null){
                cart.push(getProduct)
                
            }
        }
        localStorage.setItem("cart",JSON.stringify(cart))  
        localStorage.setItem("platform",JSON.stringify(platforms))     
        $('.badge').each(function(){
            $(this).html(cart.length)
        })
        $("#added").text("Success added!")
        fillBasket(cart,platform)
    }
        
   
})

$('.badge').each(function(){
    let cart=JSON.parse(localStorage.getItem("cart"))
    if(cart)  $(this).html(cart.length)
 
})
var total=[]
//$('#cartDiv').html('<p class="text-center col-12">Your cart is empty.</p>')
$(document).ready(function(){
    fillBasket()
    subtotal();
})
function fillBasket(){
    if(localStorage.getItem("cart")){
        let cart=JSON.parse(localStorage.getItem("cart"))
        let platform=JSON.parse(localStorage.getItem("platform"))
        let html=``;
        var productTotal=[];
        for(let i=0; i<cart.length;i++){ 
            productTotal.push(cart[i][0].price.new.substring(1))
            total.push(cart[i][0].price.new.substring(1))
            html+=`<tr id="${i}">
            <td class="align-middle"><img src="assets/img/${cart[i][0].image.img}" alt=" ${cart[i][0].image.alt}" style="width: 100px;"> ${cart[i][0].image.alt}</td>
            <td class="align-middle">${cart[i][0].price.new}</td>
            <td class="align-middle">
                <div class="input-group quantity mx-auto" style="width: 100px;">
                    <div class="input-group-btn">
                        <button id="${i+1}minus" class="changeQuantity btn btn-sm btn-danger btn-minus" >
                        <i class="fa fa-minus"></i>
                        </button>
                    </div>
                    <input type="text" id="quantity" class="form-control form-control-sm bg-secondary text-center" value="1">
                    <div class="input-group-btn">
                        <button id="${i+1}plus" class="changeQuantity btn btn-sm btn-danger btn-plus">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
            </td>
            <td  class="align-middle productTotal">$${productTotal[i]}</td>
            <td class="align-middle"><button class="btn btn-sm btn-danger"><i class="fa fa-times"></i></button></td>
            </tr>`
        }    console.log("Initial "+total);
         
        
        
    
        $("#cartTable").html(html)
        $(".changeQuantity").click(function(){
    
            if($(this).hasClass('btn-plus')){
                console.log("tajna")
                let currently=$(this).parent().parent().find("input[type=text]").val()
                let currentlyInt=parseInt(currently)
                let next=currentlyInt+1
                $(this).parent().parent().find("input[type=text]").val(next)
                let string=$(this).attr("id")
                
                $(this).parent().parent().parent().parent().find(".productTotal").html(("$"+(parseFloat(productTotal[string.charAt(0)-1])*next).toFixed(2)))
                total[string.charAt(0)-1]=parseFloat(productTotal[string.charAt(0)-1])*next.toFixed(2)
            }
            else if($(this).hasClass('btn-minus')){
                let currently=($(this).parent().parent().find("input[type=text]")).val()
                let currentlyInt=parseInt(currently)
                let next=currentlyInt-1  
                   
                $(this).parent().parent().find("input[type=text]").val(next) 
                let string=$(this).attr("id") 
                $(this).parent().parent().parent().parent().find(".productTotal").html(("$"+(parseFloat(productTotal[string.charAt(0)-1])*next).toFixed(2)))
                total[string.charAt(0)-1]=parseFloat(productTotal[string.charAt(0)-1])*next.toFixed(2)    
                if(next==0){
                    total[string.charAt(0)-1]=parseFloat(productTotal[string.charAt(0)-1])*next.toFixed(2)
                    let idOfProduct=$(this).parent().parent().parent().parent().attr('id')
                    console.log("id proizvoda: "+idOfProduct)
                    let itemsProducs = JSON.parse(localStorage.getItem('cart'));
                    
                    //localStorage.setItem('cart', JSON.stringify(filteredProducts));
                    //localStorage.setItem('sizes', JSON.stringify(filteredSize));
                    //$(this).parent().parent().parent().parent().remove()
                }
            }
             
            subtotal()        
        })
    }
    }



    function subtotal(){
        console.log("usli u subtotal")
        let sum=0;
    for(let i in total){
        sum+=parseFloat(total[i]);
    }
    $('#subtotal').html(sum.toFixed(2));
    $('#total').html("$"+(sum+10).toFixed(2));
    }
    



