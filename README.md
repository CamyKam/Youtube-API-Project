# You-Tube API for Auto Creation of Playlists 

This project allows for users to utilize an API key from Youtube for their accounts to automatically create a playlist based on search terms. Users specify a search term, how many videos they'd like to add to a playlist using that search term, and the title of the generated playlist. 

Users MUST request an API key from Youtube and register the application in order to use this feature. Details and instructions can be found [Here] (https://developers.google.com/youtube/v3/getting-started#before-you-start). The api key should then be included in the MainYT.py file by updating the variable 'api_key'

## Steps on Application Use
1. The application is to be run on the local server 8000
2. Users must first click on the top button 'Get Token and Set API'. This will open up a window prompting users to log into their Youtube account (it must be the same one registered for the API)
3. Users can enter in a search term and click on 'Search Video Results' to see what kind of videos are pulled from Youtube prior to creating a playlist
4. To create a playlist - users need to enter a search term, the name of the playlist, and the number of videos they'd like to add to the playlist. Youtube will grab the first X number of videos from search and generate a playlist with those videos.
5. Users can check their YouTube account for the new playlist generated. 