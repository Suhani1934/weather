const yourweather=document.getElementById("yourweather")
const searchweather=document.getElementById("searchweather")

const grantAccess=document.querySelector(".grantAccess")
const searchBar=document.querySelector(".searchBar")
const searchBtn=document.querySelector("#searchBtn")
const city=document.querySelector(".city")
const locationBtn=document.querySelector(".locationBtn")
const weatherclass=document.querySelector(".weatherclass")
const error=document.querySelector(".error")
const loading=document.querySelector(".loading")

//display elements
const cityname=document.querySelector("#cityname");
const flag=document.querySelector("#flag")
const windspeed=document.querySelector("#windspeed")
const humidity=document.querySelector("#humidity")
const clouds=document.querySelector("#clouds")
const weatherdiscription=document.querySelector("#weatherdiscription")
const weatherImg=document.querySelector("#weatherImg")
const temperature=document.querySelector("#temperature")


const API_Key="7e2068e387f4fc5f86d688d23fd0e00c";

// initial page 
currentTab=searchweather;
switchTab(yourweather);


function renderUI(information){
    information=JSON.parse(information)
    weatherclass.classList.add("active");
    cityname.innerHTML=information.name;
    flag.setAttribute("src",`https://flagcdn.com/144x108/${information.sys.country.toLowerCase()}.png`)
    windspeed.innerHTML=information.wind.speed +" m/sec";
    humidity.innerHTML=information.main.humidity+"%";
    clouds.innerHTML=information.clouds.all +"%";
    weatherdiscription.innerHTML=information.weather?.[0].description;
    weatherImg.setAttribute("src",`https://openweathermap.org/img/w/${information.weather?.[0].icon}.png`)
    let celcius=Math.round(parseInt(information.main.temp)-273.15);
    temperature.innerHTML=celcius + " 'C";
}


async function infoByCity(cityName)
{
        cityName=cityName.trim();
        if(error.classList.contains("active"))
            error.classList.remove("active")

        if(weatherclass.classList.contains("active"))
                weatherclass.classList.remove("active")

        loading.classList.add("active")
        
        let result=fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_Key}`)
        result.then(async()=>{
            try{
                let data=await (await result).json()
                data=JSON.stringify(data)
                renderUI(data);
            }
            catch(err){
                if(weatherclass.classList.contains("active"))
                    weatherclass.classList.remove("active")

                error.classList.add("active")
            }
        })
        result.catch(()=>{
            error.classList.add("active")
        })
        result.finally(()=>{
            if(loading.classList.contains("active"))
                loading.classList.remove("active")
        })        
}



async function infoByCoordinates(lati,longi){

if(grantAccess.classList.contains("active"))
    grantAccess.classList.remove("active")

loading.classList.add("active")

let result=fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${API_Key}`)

result.then(async ()=>{
    let data=await (await result).json()
    data=JSON.stringify(data)
    renderUI(data);
})
result.catch(()=>{
    error.classList.add("active");
})
result.finally(()=>{
    if(loading.classList.contains("active"))
        loading.classList.remove("active")
})
}

function yourLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition((yourCoordinates)=>{
            let lat=yourCoordinates.coords.latitude;
            let long=yourCoordinates.coords.longitude;
            
            let obj={
                    "latitude":lat,
                    "longitude":long
            }
            obj=JSON.stringify(obj);
            sessionStorage.setItem("user-location",obj);
            infoByCoordinates(lat,long)
        });
    }
}

//tab ko switch krne ke liye
function switchTab(clickedTab){
    if(currentTab !== clickedTab)
    {
        currentTab.classList.remove("line")
        currentTab=clickedTab;
        currentTab.classList.add("line");

        if(clickedTab===yourweather)
        {
            if(error.classList.contains("active"))
                error.classList.remove("active")

            if(searchBar.classList.contains("active"))
                searchBar.classList.remove("active");

            if(weatherclass.classList.contains("active"))
                weatherclass.classList.remove("active");

            if(sessionStorage.getItem("user-location"))
            {
                grantAccess.classList.remove("active")
                let coordinates=sessionStorage.getItem("user-location")
                coordinates=JSON.parse(coordinates)
                infoByCoordinates(coordinates.latitude,coordinates.longitude);
            }
            else{
                grantAccess.classList.add("active");
            }
        }
        else if(currentTab===searchweather)
        {
            searchBar.classList.add("active");

            if(grantAccess.classList.contains("active"))
                grantAccess.classList.remove("active"); 

            if(weatherclass.classList.contains("active"))
                weatherclass.classList.remove("active");

            if(city.value)
                infoByCity( city.value)
        }
    }
}



yourweather.addEventListener("click",(e)=>{
    switchTab(e.target)
})

searchweather.addEventListener("click",(e)=>{
    switchTab(e.target)
})
searchBtn.addEventListener("click",()=>{
    infoByCity( city.value)
})
locationBtn.addEventListener("click",yourLocation)
city.addEventListener("keydown",(key)=>{
    if(key.code==="Enter" || key.code=="Search")
        infoByCity( city.value)
})