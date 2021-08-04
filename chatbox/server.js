const mongo = require('mongodb').MongoClient;
const user = require('socket.io').listen(4000).sockets;

mongo.connect('mongodb://127.0.0.1/chatbox', function(err, db){
    if(err){
        throw err;
    }

    console.log(' connected...');

    user.on('connection', function(socket){
        let chat = db.collection('chating');

        sendStatus = function(s){
            socket.emit('status', s);
        }

        chat.find().limit(5).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            socket.emit('mess', res);
        });

        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            if(name == '' || message == ''){
                sendStatus('Please fill the blank!!');
            } else {
                chat.insert({name: name, message: message}, function(){
                    client.emit('mess', [data]);

                    sendStatus({
                        message: 'Message sent',
                    });
                });
            }
        });

    });
});