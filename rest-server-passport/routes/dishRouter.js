var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');


var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get(function (req, res, next){
    Dishes.find(req.query)
      .populate('comments.postedBy')
      .exec(function (err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.post(Ver   ify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
    Dishes.create(req.body, function (err, dish) {
        if (err) next(err);
        console.log('Dish created!');
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the dish with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
    Dishes.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

dishRouter.route('/:dishId')
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
    .populate('comments.postedBy')
    .exec(function (err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    }, function (err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
    Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
      if (err) next(err);
        res.json(resp);
    });
});
dishRouter.route('/:dishId/comments')

.get(function (req, res, next) {
        Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
            if (err) next(err);
            res.json(dish.comments);
        });
    })

.post( Verify.verifyOrdinaryUser, function (req, res, next) {
      Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;

        req.body.postedBy = req.decoded._id;

        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) next(err);
            console.log('Updated Comments!');
            res.json(dish);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) next(err);
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function (err, result) {
              if (err) next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });
    });

    dishRouter.route('/:dishId/comments/:commentId')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
            if (err) next(err);
            res.json(dish.comments.id(req.params.commentId));
        });
    })

    .put(Verify.verifyOrdinaryUser,function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) next(err);

            req.body.postedBy = req.decoded._id;

            dish.comments.id(req.params.commentId).remove();
            dish.comments.push(req.body);
            dish.save(function (err, dish) {
                if (err) next(err);
                console.log('Updated Comments!');
                res.json(dish);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {

          if(dish.comments.id(req.params.commentId).postedBy
             != req.decoded._id){
               var err = new Error('You are not authorized to perform this operation!')
               err.status - 403;
               return next(err);
             }
            dish.comments.id(req.params.commentId).remove();
            dish.save(function (err, resp) {
                if (err) next(err);
                res.json(resp);
            });
        });
    });


    .search(Verify.verifyOrdinaryUser, function searchfortable ((inputDate, time, guestnum, section), defaultdates ){
        var dates = {
            var d = inputDate; 
        convert:function(d) {
                
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );
        },

        inRange:function(d,start,end) {
            // Checks if date in d is between dates in start and end.
            // Returns a boolean or NaN:
            //    true  : if d is between start and end (inclusive)
            //    false : if d is before start or after end
            //    NaN   : if one or more of the dates is illegal.
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                 isFinite(d=this.convert(d).valueOf()) &&
                 isFinite(start=this.convert(start).valueOf()) &&
                 isFinite(end=this.convert(end).valueOf()) ?
                 start <= d && d <= end :
                 NaN
             );
        }
      }
        if (inRange(d,start,end)== true){
            var timeary = new Array (5, 6, 7, 8, 9, 10);
            if (time in timeary){
                if (guestnum > 0 && guestnum < 7){
                    var sectionid;
                    if (section = "indoor"){
                        sectionid = 0;
                        //Sudo code for calling the search method in the mongodb
                        //call search db for table (d, time, guestnum, sectionid)
                            //sudo code that goes inside the mongodb shit
                            //for (all elements in table where tabledate ==d && tabletime == time && tablesection ==sectionid) 
                            //  if reservedbit == true
                            //    check next element
                            //  else
                             //  return table id*
                        //ask user if they want to reserve
                        // if input == "yes"
                            // where table id* == table id
                        //    reserve bit  = false
                        // 
                        //else exit
                      
                    }
                    else sectionid =1;
                }
            }

        }
    }

// cnacel reservation 
// user will need to have their table number saved for the table that thay reserved
//

    module.exports = dishRouter;
