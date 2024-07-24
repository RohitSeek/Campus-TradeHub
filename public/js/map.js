
// let map_token= map_token
console.log(map_token);
console.log(location);
console.log(typeof(location));
listingData = JSON.parse(listingData);
mapboxgl.accessToken =map_token ;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    
    zoom: 9, 
    center:listingData.geometry.coordinates  //starting co-ordinates //longititute and then lattitute  
});

const marker1 = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(listingData.geometry.coordinates)
        
        .setPopup(
            new mapboxgl.Popup({ offset: 25}).setHTML(
                `<h4>Welcome to ${listingData.location} </h4> <p>Exact location provided after booking</p>`
            )
        )
        .addTo(map);

