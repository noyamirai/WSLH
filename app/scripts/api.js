const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '8da66b7f65mshf2b4cd796212686p1cb703jsn1ea04441f625',
        'X-RapidAPI-Host': 'livescore6.p.rapidapi.com'
    }
};

fetch('https://livescore6.p.rapidapi.com/leagues/v2/get-table?Category=soccer&Ccd=england&Scd=fa-women-s-super-league', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

fetch('https://livescore6.p.rapidapi.com/matches/v2/list-by-league?Category=soccer&Ccd=england&Scd=fa-women-s-super-league&Date=20230213&Timezone=-7', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));
