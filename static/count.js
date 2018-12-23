'use strict';

/**
 * @fileoverview Multi-user counting
 */

/**
 * @param gameKey - a unique key for this game
 * @param me - my user id
 * @param token - secure token passed from the server
 * @param channelId - id of the 'channel' we'll be listening to
 */

function initGame(gameKey, me, token, channelId, initialMessage)
{
    var state = {
        gameKey: gameKey,
        me: me,
        count: 0
    };

    // This is our Firebase realtime DB path that we'll listen to 
    // for updates. Initialise later in openChannel()
    var channel = null;

    /**
     * Updates the displayed number
     */
    function updateGame(newState)
    {
        //Update the old state with the new data
        $.extend(state, newState);

        //Change the number onscreen
        var count = $("#number");
        count.html(state.count);
        
        // console.log(state.count);
        // console.log(newState);

        //Make sure we aren't stuck in waiting mode
        var displayArea = $('#display-area');

        displayArea[0].className='your-move';
    }

    function onMessage(newState)
    {
        updateGame(newState);

        /*
        If we have a count of 10 or more, close
        the channel
        */
    //    if (state.count >= 10) {
    //        channel.off();
    //        deleteChannel();
    //        console.log("End of game");
    //    }
    }

    function countUp(e) {
        $.post('/count/up');
    }

    function onOpened() {
        console.log("Opening...");
        $.post('/count/open');
    }

    function deleteChannel() {
        $.post('/count/delete');
    }


    function openChannel() {
        // [START auth_login]
        // sign into Firebase with the token passed from the server
        firebase.auth().signInWithCustomToken(token).catch(
            function(error){
                console.log('Login Failed: ', error.code);
                console.log('Error message: ', error.message);
            });
        // [END auth_login]
        console.log("Logged in")
        // [START add_listener]
        channel = firebase.database().ref('channels/' + channelId);
        // add a listener to the path that fires any time the
        // value of the data changes
        channel.on('value', function(data) {
            // console.log("Something happened!");
            // console.log(data.val());
            onMessage(data.val());
        });
        // [END add_listener]
        onOpened();
    }

    /**
   * This function opens a communication channel with the server
   * then it adds listeners to all the squares on the board
   * next it pulls down the initial game state from template values
   * finally it updates the game state with those values by calling onMessage()
   */
    function initialize() {
        // Always include the gamekey in our requests
        $.ajaxPrefilter(function(opts) {
          if (opts.url.indexOf('?') > 0)
            opts.url += '&g=' + state.gameKey;
          else
            opts.url += '?g=' + state.gameKey;
        });
    
        $('#board').on('click', '.cell', countUp);
    
        openChannel();
    
        onMessage(initialMessage);
      }

      setTimeout(initialize, 100);
}