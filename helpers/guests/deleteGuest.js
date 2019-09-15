const db = require('../db');

module.exports = (req, res) => {
    if(req.params.id !== "" && req.params.id !== undefined) {
        if(typeof req.params.id === "string" && req.params.id.length>0) {
            //remove guest
            db.get().collection('guests')
                .deleteOne({_id : db.mongo.ObjectID(req.params.id)}, err=>{
                    if(err) {
                        res.status(500);
                        res.json({error: 'Internal server error'})
                    }
                    else {
                        //update companionId to an empty string, if the deleted one had a companion
                        db.get().collection('guests')
                        .updateOne({
                            companionId : db.mongo.ObjectID(req.params.id)
                        },
                        {
                            $set: {
                                companionId : ''
                            }
                        }, 
                        err => {
                            if(err) {
                                res.status(500);
                                res.json({error: 'Internal server error'})
                            }
                            else {
                                res.json({message: 'Guest has been removed successfully'});
                            }
                        })
                    }
                });
        }
        else {
            res.status(400);
            res.json({error: 'The id should be a non-empty string'});
        }
    }
    else {
        res.status(400);
        res.json({error: 'The request body should contain an id field'});
    }
}