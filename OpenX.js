
async function getUsers() {
    var response = await fetch('https://fakestoreapi.com/users');
    var json = await response.json();
    return json;
}

async function getCarts() {
    var response = await fetch("https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07");
    var json = await response.json();
    return json;
}

async function getProducts() {
    var response = await fetch("https://fakestoreapi.com/products");
    var json = await response.json();
    return json;
}

async function showProductCategories(data){
    var json = data;
    const categories = new Map();

    for (var i = 0; i < json.length; i++){
        
        var category = json[i].category;
        var price = json[i].rating.count * json[i].price;

        if (categories.has(json[i].category)){
            var curr = categories.get(category) + price;
            categories.set(category, curr);
        }
        else{
            categories.set(category, price);
        }
    }


    document.getElementById("products").innerText = "CATEGORIES AND PRICES" + "\n\n";
    for (let [key, value] of categories){
        document.getElementById("products").innerText += key + ": " + value + "\n";
    }

    
}



async function highestValueCart(users, carts, products){
    var users2 = users;
    var carts2 = carts;
    var products2 = products;

    //creating a Map [productID, price]
    const prodMap = new Map();
    for (var i = 0; i < products2.length; i++){
        if (prodMap.has(products2[i].id)){
            continue;
        }
        else{
            prodMap.set(products2[i].id, products2[i].price);
        }
    }


    //creating a Map [userID, name]
    const userMap = new Map();
    for (var i = 0; i < users2.length; i++){
        if (userMap.has(users2[i].id)){
            continue;
        }
        else{
            userMap.set(users2[i].id, users2[i].name.firstname + " " + users2[i].name.lastname);
        }
    }
    

    //finding the most expensive cart
    //[cartID, price]
    const cartMap = new Map();
    var maxID = -1;
    var maxPrice = -1;
    for (var i = 0; i < carts2.length; i++){
        var cartPrice = 0;
        if (cartMap.has(carts2[i].id)){
            continue;
        }
        else{
            for (var j = 0; j < carts2[i].products.length; j++){
                var tmp = carts2[i].products[j];
                cartPrice += prodMap.get(tmp.productId) * prodMap.get(tmp.quantity);
            }

            if (cartPrice > maxPrice){
                maxPrice = cartPrice;
                maxID = carts2[i].userId;
            }
        }

    }

    var owner = userMap.get(maxID);

    document.getElementById("cart").innerText = "\n\n\n\n Value of the most expensive cart: " + maxPrice + ", owner: " + owner;

}


async function neighbours(users){ 
    var users2 = users;
    var maxDist = -1;
    var user1;
    var user2;

    for (var i = 0; i < users2.length; i++){
        var x1 = users2[i].address.geolocation.lat;
        var y1 = users2[i].address.geolocation.long;

        for (var j = i + 1; j < users2.length; j++){
            var x2 = users2[j].address.geolocation.lat;
            var y2 = users2[j].address.geolocation.long;

            var dist = Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1) * (y2 - y1));
            if (dist > maxDist){
                maxDist = dist;
                user1 = users2[i].name.firstname + " " + users2[i].name.lastname;
                user2 = users2[j].name.firstname + " " + users2[j].name.lastname;
            }
        }
    }

    document.getElementById("users").innerText = "\n\n\n\n" + user1 + " and " + user2 + " live furthest away";
}



async function answers() {
    var users = await getUsers();
    var carts = await getCarts();
    var products = await getProducts();

    showProductCategories(products);
    highestValueCart(users, carts, products);
    neighbours(users);



}

answers();