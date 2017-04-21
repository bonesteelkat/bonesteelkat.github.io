/* 
connecting to the mysql database
some code provided by Charles Shaeffer's 107 class
*/


    
(function () {
	"use strict";
    
//       const openSshTunnel = require('open-ssh-tunnel');
//      async function openATunnel() {
//        const server = await openSshTunnel({
//          host: 'montreat.cs.unca.edu',
//          username: 'kboneste',
//          password: 'Bone2192',
//          srcPort: 3306,
//          srcAddr: '127.0.0.1',
//          dstPort: 3000,
//          dstAddr: '127.0.0.1',
//          readyTimeout: 1000,
//          forwardTimeout: 1000,
//          localPort: 3000,
//          localAddr: '127.0.0.1'    
//        });
  
        var express = require('express'), 
            aesjs = require('aes-js'),
            pbkdf2 = require('pbkdf2'),
			bodyParser = require('body-parser'),
			mysql = require('mysql'),
			app = express(),
			pool = mysql.createPool({
				connectionLimit : 100,
				host : 'kbonestedb.co3yixcedcfv.us-east-1.rds.amazonaws.com',
				user : 'bonesteelkat',
				password : '8cybd87m7d64v',
				database : 'mechanic_help'
            });
    
//        var express = require('express'), 
//            aesjs = require('aes-js'),
//            pbkdf2 = require('pbkdf2'),
//			bodyParser = require('body-parser'),
//			mysql = require('mysql'),
//			app = express(),
//			pool = mysql.createPool({
//				connectionLimit : 100,
//				host : 'localhost',
//				user : 'root',
//				password : '8Cq67rtnCyd!',
//				database : 'mechanic_help',
//				debug : false
//			});
    
    
    app.use(express.static(__dirname));
	app.use(bodyParser.urlencoded({ extended:true }));
    
    
    
//request login information from the user    
    function login(req, res) {
        //using CBC - Cipher-Block Chaining to hash the password.
        //Documentation kept from the guide here: https://github.com/ricmoo/aes-js
        // 128-bit key
        var key_128 = pbkdf2.pbkdf2Sync("'" + req.body.password +  "'", 'salt', 1, 128/8, 'sha512');
       
        // The initialization vector (must be 16 bytes)
        var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];

        // Convert text to bytes (text must be a multiple of 16 bytes)
        var text = 'TextMustBe16Byte';
        var textBytes = aesjs.utils.utf8.toBytes(text);

        var aesCbc = new aesjs.ModeOfOperation.cbc(key_128, iv);
        var encryptedBytes = aesCbc.encrypt(textBytes);

        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        //console.log(encryptedHex);
        // should be encrypted password
        
        //connect to db
        pool.getConnection(function(err, connection) {
			if (err) {
                console.log("not working?")
				connection.release();
				res.json({"code " : 100, "status" : "Error in connection database"});
			}
			
			console.log("connected as id " + connection.threadId);
         //   console.log(res);
              
         //query to see if the username and password match what's in the database
           connection.query("SELECT password FROM mechanic_help.user_account WHERE username = '" + req.body.username + "'" + " AND password = '" + encryptedHex + "';", function(err, rows, fields){
			     //console.log(req.body.password);
    		     if (err) throw err;
                 if (!rows.length) { 
                     connection.release();
                     console.log("Incorrect username or password.");
                    // res.clearCookie('username', { path: '/' });
                     return res.send({success : false});
                 } else {
                     connection.query("UPDATE mechanic_help.user_account SET loggedOn = 1 WHERE username = '" + req.body.username + "'" + " AND password = '" + req.body.password + "';", function(err, rows, fields) {
                         if (err) throw err;
                     });
                     console.log("Successful login");
                     connection.release();
                     return res.send({success : true});
                 }
            connection.on("error", function(err) {
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}); //connection on
		  }) //connection query
        }); //get connection 
    } //function userlogin
    
    //request login information from the user    
    function userRegister(req, res) {
        //using CBC - Cipher-Block Chaining to hash the password.
        //Documentation kept from the guide here: https://github.com/ricmoo/aes-js
        // An example 128-bit key
        var key_128 = pbkdf2.pbkdf2Sync("'" + req.body.password +  "'", 'salt', 1, 128/8, 'sha512');

        // The initialization vector (must be 16 bytes)
        var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];

        // Convert text to bytes (text must be a multiple of 16 bytes)
        var text = 'TextMustBe16Byte';
        var textBytes = aesjs.utils.utf8.toBytes(text);

        var aesCbc = new aesjs.ModeOfOperation.cbc(key_128, iv);
        var encryptedBytes = aesCbc.encrypt(textBytes);

        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        console.log(encryptedHex);
        // should be encrypted password
        
        //connect to db
        pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				res.json({"code" : 100, "status" : "Error in connection database"});
			}
			
			console.log("connected as id " + connection.threadId);
            //console.log(res);
              
           //query to insert the fields
            connection.query("INSERT INTO mechanic_help.user_account (username, password, email) VALUES (" + "'" + req.body.username + "', '" + encryptedHex + "', '" + req.body.email + "');", function(err, rows, fields){
			     //console.log(req.body.phone);
			    if (err) { 
                     
                     console.log("That username is already taken");
                     connection.release();
                     console.log('Unable to register.');
                     return res.send({success : false});
                 }
                //successful insert redirects		
                console.log("Successfully registered");              
                connection.release();
                return res.send({success : true});
			
            connection.on("error", function(err) {
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}); //connection on
		  }) //connection query
        }); //get connection 
    } //function userregister
    
    //request login information from the employee    
    function empLogin(req, res) {
        //using CBC - Cipher-Block Chaining to hash the password.
        //Documentation kept from the guide here: https://github.com/ricmoo/aes-js
        // 128-bit key
        var key_128 = pbkdf2.pbkdf2Sync("'" + req.body.password +  "'", 'salt', 1, 128/8, 'sha512');
       
        // The initialization vector (must be 16 bytes)
        var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];

        // Convert text to bytes (text must be a multiple of 16 bytes)
        var text = 'TextMustBe16Byte';
        var textBytes = aesjs.utils.utf8.toBytes(text);

        var aesCbc = new aesjs.ModeOfOperation.cbc(key_128, iv);
        var encryptedBytes = aesCbc.encrypt(textBytes);

        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        //console.log(encryptedHex);
        // should be encrypted password
        
        //connect to db
        pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				res.json({"code" : 100, "status" : "Error in connection database"});
			}
			
			console.log("connected as id " + connection.threadId);
         //   console.log(res);
              
           //query to see if the username and password match what's in the database
            connection.query("SELECT username, password FROM mechanic_help.emp_account WHERE username = '" + req.body.username + "'" + " AND password = '" + req.body.password + "';", function(err, rows, fields){
			     if (err) throw err;
                 if (!rows.length) {
                     console.log('Incorrect username or password.');
                     connection.release();
                     return res.send({success : false});
                 }
                 
                connection.query("UPDATE mechanic_help.emp_account SET loggedOn = 1 WHERE username = '" + req.body.username + "'" + " AND password = '" + req.body.password + "';", function(err, rows, fields) {
                    if (err) throw err;
                });

                //successful login redirects		
                console.log("Successful login");
                connection.release();
                return res.send({success : true});
			
            connection.on("error", function(err) {
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}); //connection on
		  }) //connection query
        }); //get connection 
    } //function emplogin
    
    //request login information from the employee    
    function empRegister(req, res) {
        
        //using CBC - Cipher-Block Chaining to hash the password.
        //Documentation kept from the guide here: https://github.com/ricmoo/aes-js
        // An example 128-bit key
        var key_128 = pbkdf2.pbkdf2Sync("'" + req.body.password +  "'", 'salt', 1, 128/8, 'sha512');

        // The initialization vector (must be 16 bytes)
        var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];

        // Convert text to bytes (text must be a multiple of 16 bytes)
        var text = 'TextMustBe16Byte';
        var textBytes = aesjs.utils.utf8.toBytes(text);

        var aesCbc = new aesjs.ModeOfOperation.cbc(key_128, iv);
        var encryptedBytes = aesCbc.encrypt(textBytes);

        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        console.log(encryptedHex);
        // should be encrypted password
        
        //connect to db
        pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				res.json({"code" : 100, "status" : "Error in connection database"});
			}
			
			console.log("connected as id " + connection.threadId);
            //console.log(res);
            Rijn
            
            aes.Blocksize = 128;
           //query to insert the fields
            connection.query("INSERT INTO mechanic_help.emp_account (username, password, phone, email, first_name, last_name) VALUES (" + "'" + req.body.username + "', '" + encryptedHex + "', '" + req.body.phone + "', '" + req.body.email + "', '" + req.body.first_name + "', '" + req.body.last_name + "');", function(err, rows, fields){
			     if (err) { 
                     connection.release();
                     console.log("That username is already taken")
                     console.log('Unable to register.');
                     return res.send({success : false});
                 }
                //successful insert redirects		
                console.log("Successfully registered");
                connection.release();
                return res.send({success : true});
			     
            connection.on("error", function(err) {
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}); //connection on
		  }) //connection query
        }); //get connection 
    } //function empegister
    
//    //check login information from the user
//    function loginCheck(req, res) {
//        console.log("login authentication");
//        //connect to db
//        pool.getConnection(function(err, connection) {
//			if (err) {
//				connection.release();
//				res.json({"code" : 100, "status" : "Error in connection database"});
//			}
//			
//			console.log("connected as id " + connection.threadId);
//        
//        //check if loggedOn variable in db is true
//        connection.query("SELECT * FROM mechanic.help WHERE loggedOn = 1;");
//            connection.release();
//        }); //get connection 
//    } //function login
    
      //check login information from the user
    function logout(req, res) {
        console.log("logging out");
        //connect to db
        pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				res.json({"code" : 100, "status" : "Error in connection database"});
			}
			
			console.log("connected as id " + connection.threadId);
        
        //check if loggedOn variable in db is true
        connection.query("");
        
        }); //get connection 
    } //function login
    
    function emailPass(req, res) {
        connection.query("SELECT password FROM mechanic_help WHERE email = '" + req.body.email + "';", function(err, rows, fields) {
            if (err) { 
                connection.release();
                console.log("That email does not exist");
                return res.send({success: false});
            } else {
                console.log(rows[0]);
                return res.send(rows);
            }
        }); //connection query
    } //function emailPass
    
    app.post("/checkpass", function(req, res) {
        emailPass(req, res);
    });
    
	app.post("/userlogin", function(req, res) {
        login(req, res);
	});
    
    app.post("/emplogin", function(req, res) {
        empLogin(req, res);
	});
    
    app.post("/user_register", function(req, res) {
        userRegister(req, res);
    });
    
    app.post("/emp_register", function(req, res) {
        empRegister(req, res);
    });
    
//    app.post("/checklogin", function(req, res) {
//        loginCheck(req, res);
//	});
        
    app.post("/logout", function(req, res) {
        logout(req, res);
    });
	
	var io = require('socket.io').listen(app.listen(3000));
    

io.sockets.on('connection', function (socket) {
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});
	console.log("server listening on port 3000");
}());