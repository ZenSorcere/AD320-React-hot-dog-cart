var express = require('express');
let mysql = require('mysql2');
let dbCreds = require("../../../dbCreds.json");
var router = express.Router();


//CUSTOMER - get full cart details when customer selects a cart (from summary modal)
router.get('/cart/:id', function (req, res, next) {

  let getCartDetails = `SELECT Cart_Id,Menu_Id,Employee_FirstName,Cart_Location,Latitude,longitude,Menu_Name,Menu_Description,Menu_Price FROM employees e JOIN carts c
  USING(Employee_id )
  JOIN cartmenus cm
  USING(Cart_Id)
  JOIN menu m
  USING(Menu_Id)
 where Cart_Id= '${req.params.id}' AND Available = 'Y';`;


  let connection = mysql.createConnection(dbCreds);
  connection.connect();

  connection.query(getCartDetails, (error, results) => {

    if(error){
      res.send(500);
    }
    else {
      res.send(results);
    }
    
  }) 

  connection.end();
});



// CUSTOMER - Info summary for modal for selected cart on map
router.get('/map/:id', function(req, res, next) {
  let connection = mysql.createConnection(dbCreds);
  connection.connect();

  connection.query(`SELECT c.Cart_Id, c.Cart_Name, c.Cart_Location, m.Menu_Name
    FROM carts c
    JOIN cartmenus cm ON c.Cart_Id = cm.Cart_Id
    JOIN menu m ON m.Menu_Id = cm.Menu_Id
    WHERE Available = 'Y' AND c.Cart_Id = '${req.params.id}';`,[req.params.id], (error, results) => {
      /* if req.params.id doesn't match a Cart_Id, return 204 http status and a "no cart found msg"? */
      if (results.length === 0) {
        res.status(404).send("Cart Not Found");
          /* res.status(204).send('Cart Not Found'); */
      } 
      else if (error) {
        res.sendStatus(500);
      }
      else {  
        /*res.send(results, 200); */
        res.status(200).send(results);
      }
    })
  /* test comment */
    connection.end();
})





module.exports = router;
