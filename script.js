
  /**
   * Sample JavaScript code for youtube.search.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/code-samples#javascript
   */
  
var GoogleAuth; // Google Auth object.
var SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

var client;
var access_token;
var searchResults;

function loadClient() {
  gapi.client.setApiKey("AIzaSyA--pIkKHQh4liTYnEJnRxFx_8HiZOQ-qM");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
function initClient() {
  client = google.accounts.oauth2.initTokenClient({
    client_id: '1068596761635-ofl4outtbdmfqub3co8krdqtn4hv7ff8.apps.googleusercontent.com',
    scope: SCOPE,
    callback: (tokenResponse) => {
      access_token = tokenResponse.access_token;
    },
  });
}
function getToken() {
    initClient();
  client.requestAccessToken();
}

function getTokenAndSetApiKey(){
  loadClient();
  getToken();
}

function revokeToken() {
  google.accounts.oauth2.revoke(access_token, () => {console.log('access token revoked')});
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function getVideos(playlistWasCreated, searchResult) {
  const searchInput = playlistWasCreated ? document.querySelector(".playlist-keyword").value : document.querySelector('.search-input').value;
  const playlistSize = playlistWasCreated ? document.querySelector(".num-of-video-resul").value : 15;
  
  if(searchResult !=null){
    console.log('SEARCH RESULT', searchResult);
    present(searchResult.result);
  }
    return gapi.client.youtube.search.list({
      "part": [
        "snippet"
      ],
      "maxResults": playlistSize,
      "q": searchInput
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log('Get Video Response', response);
                present(response.result);
              },
              function(err) { console.error("Execute error", err); });
  }

function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', initClient);
}
  
function createPlaylist(){
    const playlistKeyword = document.querySelector(".playlist-keyword").value;
    const playlistSize = document.querySelector(".num-of-video-resul").value;
    return gapi.client.youtube.search.list({
      "part": [
        "snippet"
      ],
      "maxResults": playlistSize,
      "q": playlistKeyword
    })
        .then(function(response) {
            console.log ('Get Video Id Response', response);
               var idArray= []
               
               for (let r of response.result.items){
                  idArray.push(r.id.videoId);
               }
              console.log ('video ids', idArray);
              createPlaylistTitle(idArray, response);
              },
              function(err) { console.error("Execute error", err); });
  }

  function present(videoResults){
    console.log('video results', videoResults);
    let tab = 
        `<tr>
            <th>Video Title</th>
            <th>ID</th> 
        </tr>`;

    for (let r of videoResults.items){
        tab += 
        `<tr> 
            <td>${r.snippet.title} </td> 
            <td>${r.id.videoId} </td>        
        </tr>`;
    }    
    document.getElementById("videos").innerHTML = tab;
  }

  function createPlaylistTitle(videoArray, searchResult){
    console.log('Search Result from createPlaylist');
    const playlistTitle = document.querySelector(".playlist-title").value;
    return gapi.client.youtube.playlists.insert({
        "part": [
            "snippet",
            "status"
          ],
        "resource": {
          "snippet": {
            "title": playlistTitle
          },
          "status": {
            "privacyStatus": "private"
          }
        }
      })
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response);

                  console.log ('vidArray', videoArray);
          
                  var playlistId= response.result.id;

                  addVideoToPlayList(playlistId,videoArray, 0, searchResult)
                  
                },
                function(err) { console.error("Execute error", err); });
  }
  function addVideoToPlayList(playlistId, videosIdArray, index, searchResult){
    var vId = videosIdArray[index];
    var details = {
        kind: "youtube#video",
        videoId: vId,
    }

    var request = gapi.client.youtube.playlistItems.insert({
      "part": [
        "snippet"
      ],
      "resource": {
        "snippet": {
          "playlistId": playlistId,
          "resourceId": details
        }
      }
    });

    request.execute(function(response) {
        console.log(response);

        if(videosIdArray.length == index+1)
        {
            // End!
        }
        else{
            addVideoToPlayList(playlistId, videosIdArray,++index);
        }
    });
    getVideos(true, searchResult);
}

 