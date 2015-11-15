var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var mongoOp         = require("./models/mongo");

var router          = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

router.get("/", function(req, res){
	res.json({"error": false, "message": "Hello World"})
});

//route() possibilita usar diferentes métodos para o mesmo caminho

router.route("/users")
	.get(function(req,res){
		var response = {};
		//comando para retornar todos os dados de uma collection
		mongoOp.find({}, function(err, data){
			if(err){
				response = {"error": true, "message": "Error fetching data"}
			}else{
				response = {"error": false, "message": data}
			}

			res.json(response);
		})
	})
	.post(function(req, res){
		var db = new mongoOp();
		var response = {};

		db.userEmail = req.body.email;
		// Aplica um HASH no password usando o algoritmo SHA1
		db.userPassword = require('crypto')
					      .createHash('sha1')
					      .update(req.body.password)
					      .digest('base64');
		//save() vai inserir um documento no MongoDB
		db.save(function(err){
			if(err){
				response = {"error": true, "message": "Error adding data"};
			}else{
				response = {"error": false, "message": "Data added"};
			}
			res.json(response);
		});
	});

router.route("/users/:id")
	.get(function(req,res){
		var response = {};
		//findById() procurará informações do objeto pelo ID
		mongoOp.findById(req.params.id, function(err, data){
			if(err){
				response = {"error": true, "message": "Error fetching data"};
			}else{
				response = {"error": false, "message": data};
			}
			res.json(response);
		})
	})
	.put(function(req, res){
		var response = {};
		//findById() procurará informações do objeto pelo ID
		mongoOp.findById(req.params.id, function(err, data){
			if(err){
				response = {"error": true, "message": "Error fetching data"};
			}else{
				//caso o e-mail seja informado e seja diferente
				//do e-mail que está salvo, o atualizamos	
				if(req.body.email !== undefined && 
					req.body.email !== data.userEmail){
					data.userEmail = req.body.email;
				}
				//caso a senha seja informada e seja diferente
				//da senha que está salva, a atualizamos
				if(req.body.password !== undefined){
					var hashedBodyPassword = require('crypto')
											 .createHash('sha1')
											 .update(req.body.password)
											 .digest('base64');
					if(hashedBodyPassword !== data.userPassword)
					{
						data.userPassword = hashedBodyPassword;	
					}					
				}
				data.save(function(err){
					if(err){
						response = {"error": true, "message": "Error adding data"};
					}else{
						response = {"error": false, "message": "Data is updated for: " + req.params.id};
					}
					res.json(response);
				});		
			}
		})		
	})
	.delete(function(req, res){
		var response = {};
		mongoOp.findById(req.params.Id, function(err, data){
			if(err){
				response = {"error": true, "message": "Error fetching data"};
			}else{
				mongoOp.remove({_id: req.params.id}, function(err){
					if(err){
						response = {"error": true, "message": "Error deleting data"};
					}else{
						response = {"error": false, "message": "Data associated with: " + req.params.id + " is deleted"};
					}
					res.json(response);
				})
			}
		})
	})

app.use('/', router);
app.listen(3000);
console.log("Listening to PORT 3000");