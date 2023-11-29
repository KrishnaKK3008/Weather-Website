const userTab=document.querySelector("[data-userWeather]");
const SearchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weathercontainer");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-SearchForm]");
const loadingscreen=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container");
//need of the initial variables
let currentTab=userTab;
const API_KEY="fa9376646bd32a00b79d82b92db749f4";
currentTab.classList.add("current-tab");

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            userContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            userinfocontainer.classList.remove("active"); 
        }
        else{
            searchForm.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromSessionStorage();
        }
        if (currentTab === userTab) {
            searchForm.classList.remove("active");
            userinfocontainer.classList.remove("active");
        } else {
            searchForm.classList.add("active");
        }
    }
}
userTab.addEventListener("click", () => {
    switchTab(userTab);
});
SearchTab.addEventListener("click",() => {
    switchTab(SearchTab);
});
//coordinates
function getfromSessionStorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingscreen.classList.add("active");
    //API Call
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(e){
        loadingscreen.classList.remove("active");
    }
}

function renderweatherinfo(weatherinfo){
    const cityname=document.querySelector("[data-cityName]");
    const flag=document.querySelector("[data-countryName]");
    const des=document.querySelector("[data-weatherdes]");
    const icon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloud]");
    cityname.innerText=weatherinfo?.name;
    flag.src=`https://flagcdn.com/80x60/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    des.innerText = weatherinfo?.weather?.[0]?.description;
    icon.src= `https://openweathermap.org/img/wn/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText=weatherinfo?.main?.temp;
    windspeed.innerText = weatherinfo?.wind?.speed;
    humidity.innerText=weatherinfo?.main?.humidity+"%";
    cloudiness.innerText = weatherinfo?.clouds?.all+"%";
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported");
    }
}
function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantaccessbutton =document.querySelector("[data-grantAccess]");
grantaccessbutton.addEventListener("click",getLocation);
const searchinput =document.querySelector("[data-SearchInput]");
searchForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    let city=searchinput.value;
    if(city===""){
        return;
    }
    else{
        fetchUserWeatherInfo(city);
    }
})
/* async function fetchUserWeatherInfo(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(e){
        alert("Entered City Does not exist");
    }
} */
async function fetchUserWeatherInfo(location) {
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        let response;
        if (typeof location === "object") {
            const { lat, lon } = location;
            response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        } else {
            response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
        }

        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    } catch (e) {
        alert("Error fetching weather information");
    }
}

