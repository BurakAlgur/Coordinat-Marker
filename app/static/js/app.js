//initialization
var zoom = 13;
var latitude = 41.0233791;
var longitude = 28.9937056;
var map = L.map('map').setView([latitude, longitude], zoom);

var myMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
myMap.addTo(map);


locationsArr =[];
let addLocation = ()=>{
    let centerLat = L.latLng(map.getCenter()).lat;
    let centerLng = L.latLng(map.getCenter()).lng;

    let d = new Date();
    let date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}Z`
    locationObj ={
        "lat": centerLat,
        "lng": centerLng,
        "datetime": date
    }
    locationsArr.push(locationObj);
    html =`
        <li>
            <b>Latitude:</b> <span>${centerLat}</span>
            <br>
            <b>Longitude:</b> <span>${centerLng}</span>
            <br>
            <b>Date:</b> <span>${date}</span>
            <br>
            <button class="markUpBtn" onclick="addMarkUp(${centerLat},${centerLng})">Mark Up</button>
            <button class="deleteLocationBtn" onclick="deleteLocation(${centerLat},${centerLng},${date})">Delete Location</button>
        </li>    
    `
    document.getElementById('locList').innerHTML += html;
}

let addMarkUp = (lat,lng) =>{
    L.marker([lat, lng]).addTo(map).bindPopup(`${lat} <br> ${lng}`).openPopup();
};

let deleteLocation = (lat,lng,date)=>{
    let deleteBtn = document.getElementsByClassName("deleteLocationBtn");
    Array.prototype.slice.call(deleteBtn).forEach(function(item) {
      item.addEventListener("click", function(e) {
        e.target.parentNode.remove()
      });
    });


    for( var i = 0; i < locationsArr.length; i++){  
        if (locationsArr[i].lat == lat && locationsArr[i].lng == lng && locationsArr[i].date == date) { 
            locationsArr.splice(i, 1); 
        }
    }
};

let deleteAll = ()=>{
    locationsArr =[];
    document.getElementById('locList').innerHTML ='';
}

let postJson = ()=>{
    fetch(`${window.origin}/post-json`,{
        method: "POST",
        credentials: "include",
        body: JSON.stringify(locationsArr),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function(response){
        if(response.status !== 200){
            console.log(`Response status is not 200: ${response.status}`);
            return;
        }
        response.json().then(function(data){
            console.log('Response status is 200')
        })
    })
}

let getJson = ()=>{
    fetch(`${window.origin}/get-json`)
    .then(data=>{
        return data.json()
    })
    .then((data)=>{
        data.forEach(item=>{
            html =`
            <li>
                <b>Latitude:</b> <span>${item.lat}</span>
                <br>
                <b>Longitude:</b> <span>${item.lng}</span>
                <br>
                <b>Date:</b> <span>${item.datetime}</span>
                <br>
                <button class="markUpBtn" onclick="addMarkUp(${item.lat},${item.lng})">Mark Up</button>
                <button class="deleteLocationBtn" onclick="deleteLocation(${item.lat},${item.lng})">Delete Location</button>
            </li>    
            `
            document.getElementById('locList').innerHTML += html;
            locationsArr.push(item);
        })
    })
    .catch(error =>{
        console.log(error)
    })
};

getJson()





