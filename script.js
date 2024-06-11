document.addEventListener('DOMContentLoaded', function () {
    // Klocka och datum funktion
    function updateTime() {
        const now = new Date();
        const timeElement = document.querySelector('.time');
        const dateElement = document.querySelector('.date');
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        const months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
        const month = months[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear();
        const dateString = `${date} ${month} ${year}`;
        
        timeElement.textContent = timeString;
        dateElement.textContent = dateString;
    }
    
    updateTime(); 
    setInterval(updateTime, 1000); 

    // Ändring av rubrik funktion
    const textHead = document.querySelector('.text-head');
    textHead.addEventListener('click', function () {
        const newTitle = prompt('Ange ny rubrik:');
        if (newTitle !== null && newTitle.trim() !== '') {
            textHead.textContent = newTitle;
            localStorage.setItem('dashboardTitle', newTitle);
        }
    });

    const storedTitle = localStorage.getItem('dashboardTitle');
    if (storedTitle) {
        textHead.textContent = storedTitle;
    }

    //Lägg till och ta bort länkar funktioner
    function addRemoveLinkHandlers() {
        const removeButtons = document.querySelectorAll('.remove-link');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const listItem = this.parentElement;
                const linkName = listItem.querySelector('a').innerText;
                const links = JSON.parse(localStorage.getItem('quickLinks')) || [];
                const updatedLinks = links.filter(link => link.name !== linkName);
                localStorage.setItem('quickLinks', JSON.stringify(updatedLinks));
                listItem.remove();
                const addLinkBtn = document.getElementById('add-link-button');
                const quickLinks = document.querySelector('.quick-link-list');
                if (quickLinks.childElementCount < 5) {
                    addLinkBtn.style.display = 'inline-block';
                }
            });
        });
    }
    
    addRemoveLinkHandlers();
    
    const addLinkBtn = document.getElementById('add-link-button');
    const quickLinks = document.querySelector('.quick-link-list');
    
    
    window.addEventListener('load', function() {
        const links = JSON.parse(localStorage.getItem('quickLinks')) || [];
        if (links.length >= 5) {
            addLinkBtn.disabled = true;
        } else {
            addLinkBtn.disabled = false;
        }
    });
    
    function saveLinkToLocalStorage(link) {
        let links = JSON.parse(localStorage.getItem('quickLinks')) || [];
        links.push(link);
        localStorage.setItem('quickLinks', JSON.stringify(links));
    }
    
    function loadLinksFromLocalStorage() {
        const links = JSON.parse(localStorage.getItem('quickLinks'));
        console.log('Loaded links:', links); 
        if (links) {
            const quickLinks = document.querySelector('.quick-link-list');
            links.forEach(link => {
                if (link.url && link.name) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <a href="${link.url}" target="_blank">${link.name}</a>
                        <button class="remove-link removebtn">-</button>`;
                        quickLinks.appendChild(li);
                }
            });
            addRemoveLinkHandlers(); 
        }
        const addLinkBtn = document.getElementById('add-link-button');
        addLinkBtn.style.display = 'inline-block'; 
        
        addLinkBtn.addEventListener('click', function() {
            const url = prompt('Ange URL för din nya länk:');
            if (url) {
                const linkName = prompt('Ange namn för din nya länk:');
                if (linkName) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <a href="${url}" target="_blank">${linkName}</a>
                        <button class="remove-link removebtn">-</button>`;
                        quickLinks.appendChild(li);
                    addRemoveLinkHandlers();
                    const updatedLinks = { url, name: linkName };
                    saveLinkToLocalStorage(updatedLinks);
                } else {
                    alert('Namn för länken måste anges.');
                }
            } else {
                alert('URL för länken måste anges.');
            }
        });
    }
    
    loadLinksFromLocalStorage();
    
    
    
    // Väder funktion
    function updateWeather() {
        const weatherUrl = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.2561/lat/57.1058/data.json';
    
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const weatherIcons = {
                    1: 'fa-sun',
                    2: 'fa-cloud-sun',
                    3: 'fa-cloud',
                    4: 'fa-cloud',
                    5: 'fa-cloud',
                    6: 'fa-smog',
                    7: 'fa-cloud-rain',
                    8: 'fa-bolt',
                    9: 'fa-cloud-rain',
                    10: 'fa-cloud-rain',
                    11: 'fa-cloud-showers-heavy',
                    12: 'fa-bolt',
                    13: 'fa-snowflake',
                    14: 'fa-snowflake',
                    15: 'fa-snowflake',
                    16: 'fa-snowflake'
                };
    
                const currentWeather = data.timeSeries[0].parameters.find(param => param.name === 'Wsymb2').values[0];
                const forecastTomorrow = data.timeSeries[13].parameters.find(param => param.name === 'Wsymb2').values[0];
                const forecastDayAfter = data.timeSeries[25].parameters.find(param => param.name === 'Wsymb2').values[0];
    
                const temperatureCurrent = data.timeSeries[0].parameters.find(param => param.name === 't').values[0] + '°C';
                const temperatureTomorrow = data.timeSeries[13].parameters.find(param => param.name === 't').values[0] + '°C';
                const temperatureDayAfter = data.timeSeries[25].parameters.find(param => param.name === 't').values[0] + '°C';
    
                const weatherIconCurrent = weatherIcons[currentWeather];
                const weatherIconTomorrow = weatherIcons[forecastTomorrow];
                const weatherIconDayAfter = weatherIcons[forecastDayAfter];
    
                document.getElementById('temperature-today').textContent = temperatureCurrent;
                document.getElementById('weather-icon-today').classList.add('fas', weatherIconCurrent);
    
                document.querySelector('.temperature-tomorrow').textContent = temperatureTomorrow;
                document.querySelector('.weather-icon-tomorrow').classList.add('fas', weatherIconTomorrow);
    
                document.querySelector('.temperature-dayafter').textContent = temperatureDayAfter;
                document.querySelector('.weather-icon-dayafter').classList.add('fas', weatherIconDayAfter);
    
                const today = new Date();
                const dayAfterTomorrow = new Date(today);
                dayAfterTomorrow.setDate(today.getDate() + 2);
    
                const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
                const weekday = weekdays[dayAfterTomorrow.getDay()];
    
                document.querySelector('.third-day').textContent = weekday;
    
            })
            .catch(error => {
                console.error('Error fetching weather data', error);
            });
    }
    
    updateWeather();

    //Dad jokes funktion
    fetch('https://icanhazdadjoke.com/', {
        headers: {
        'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const jokeDiv = document.getElementById('API');
        jokeDiv.innerHTML = `<p>${data.joke}</p>`; 
    })
    .catch(error => {
        console.error('Error fetching joke:', error);
});
    
    //Antecking funktion
    const textArea = document.getElementById('textArea');
    textArea.addEventListener('input', function () {
        const notes = textArea.value;
        localStorage.setItem('dashboardNotes', notes);
    });
    const storedNotes = localStorage.getItem('dashboardNotes');
    if (storedNotes) {
        textArea.value = storedNotes;
    }

    // Slumpa bakgrund från Unsplash API
    const randomBackgroundButton = document.getElementById('randomBackground');
    randomBackgroundButton.addEventListener('click', function () {
    fetch('https://picsum.photos/1920/1080')
        .then(response => {
            document.body.style.backgroundImage = `url('${response.url}')`;
        })
        .catch(error => {
            console.error('Error fetching background image:', error);
        });
});

window.addEventListener('load', function () {
    // Sätt random bild som bakgrund
    function setRandomBackground() {
        fetch('https://picsum.photos/1920/1080')
            .then(response => {
                document.body.style.backgroundImage = `url('${response.url}')`;
            })
            .catch(error => {
                console.error('Error fetching background image:', error);
            });
    }

    setRandomBackground();
});

});
