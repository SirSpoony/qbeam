var PEERJS_KEY = 'lwjd5qra8257b9';
var peer;
var localID = -1;
var localName;

var connection = null;
var isSending = false;

$(document).ready(function() {
    peer = new Peer({
        key: PEERJS_KEY
    });

    peer.on('open', function(id) {
        localID = id;

        $('#submit-button').prop("disabled", false);
        $('#name-field-help').animate({opacity:0}); // Using animate instead of fadeOut prevents elements from being moved around.
    });

    peer.on('connection', function(conn) {
        console.log("Incoming connection...");

        conn.on('open', function(data) {
            if (connection !== null) {
                console.log("Rejected connection because connection is already in progress.");
                conn.close();
                return false;
            } else {
                console.log("Successfully opening incoming connection.");

                connection = conn;
                isSending = false;
            }
        });

        conn.on('data', function(data) {
            if (data.label === 'info') {
                console.log('Received file info.')
                $('#sender-peer-name').text(data.un);
                $('#sender-filename').text(data.fn);
                $('#receive-file-modal').modal('show');
            } else if (data.label === 'file') {
                // Downloads the file in a bit of a hacky way
                download(data.contents, data.filename, data.type);
                $('#receive-file-modal').modal('hide');
            }
        });
    });

    $('#name-form').on('submit', function(e) {
        e.preventDefault();
        submitNameButton();
        return false;
    });

    $('#send-file-form').on('submit', function(e) {
        e.preventDefault();
        sendFileButton();
        return false;
    });

    $('#name-field').focus();

    // LOGIC FOR MODAL WHEN RECEIVING FILES
    $('#receive-file-modal').on('hidden.bs.modal', function(e) {
        console.log('Modal was closed by user. Closing connection...')
        connection.close();
        connection = null;
    });

    $('#accept-file-button').click(function(e) {
        console.log('File was accepted by user. Sending accept...')
        connection.send({
            label: 'accept'
        });
    });
});

function submitNameButton() {
    localName = $('#name-field').val();

    $.post('/id', {
        'name': name,
        'id': localID
    }, function(data) {
        localName = data.name;

        $('.set-name').hide();

        $('#verified-username').html('<b>' + localName + '</b>');
        $('#verified-uuid').html('<b>' + localID + '</b>');

        $('.send-or-receive').show();
    });

    return false;
}

function sendFileButton() {
    var peer_name = $('#destination-field').val();

    $.get('/id', {
        'name': peer_name
    }, function(data) {
        if (data.status === 'valid') {
            attemptConnection(data.id);
        } else {
            console.log('The server rejected the peer\'s name.');
        }
    });

    return false;
}

function attemptConnection(destpeerid) {
    console.log("Attempting connection...");

    if (connection !== null) {
        console.log("There is already a connection in progress!");
        return false;
    }

    var conn = peer.connect(destpeerid);
    connection = conn;
    isSending = true;

    conn.on('open', function() {
        console.log('Open connection with peer: ' + destpeerid);

        var filename = $('#file-field')[0].files[0].name;
        conn.send({
            label: 'info',
            fn: filename,
            un: localName
        });
    });

    conn.on('data', function(data) {
        if (data.label === 'accept') {
            console.log('Peer accepted the file. Sending...');
            var file = $('#file-field')[0].files[0];

            console.log('Reading file...');
            var reader = new FileReader();
            reader.onload = function(evt) {
                conn.send({
                    label: 'file',
                    filename: file.name,
                    contents: evt.target.result,
                    type: file.type
                });
                console.log('File sent.');
            }
            reader.readAsArrayBuffer(file);
        }
    });

    conn.on('close', function() {
        console.log('Connection was closed by peer, not sending the file.');
        connection = null;
    });

    return true;
}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {
        type: type
    });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
