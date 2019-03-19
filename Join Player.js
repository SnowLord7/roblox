var page = 0;
var url = 'https://api.roblox.com/users/get-by-username?username=' + prompt('Username to find:', 'sparkythesparkz');
var matches = [];
var avatars = [];

var searchGames = function(gid, specifier) {
    var serverURL = `https://www.roblox.com/games/getgameinstancesjson?placeId=${gid}&startindex=${page}`;
    if (page == 0) console.log('Searching', serverURL, 'for user', gid, 'with avatar of', specifier)
    fetch(serverURL)
        .then((resp) => resp.json())
        .then(function(data) {
            console.log('Searching page:', page);
            page++;
            for (let i = 0; i < data['Collection'].length; i++) {
                let server = data['Collection'][i];
                for (let j = 0; j < server['CurrentPlayers'].length; j++) {
                    let player = server['CurrentPlayers'][j];
                    if (player['Thumbnail']['Url'] == specifier) {
                        matches.push(server);
                        console.log('Found server:', server, '\nJoining...');
                        eval(server['JoinScript']);
                        return true;
                    }
                }
            }
            searchGames(gid, specifier);
        });
}

fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        const id = data['Id'];
        console.log('Got ID from username:', id);
        url = `https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=48&height=48&format=png`;
        fetch(url)
            .then(function(resp) {
                const specifier = resp['url'];
                console.log('Got avatar URL:', specifier);
                var gid = Number(window.location.pathname.split('/')[2]) || Number(prompt('Game ID to search in:', '301549746'));
                searchGames(gid, specifier);
            });
    });
