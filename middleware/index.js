

module.exports = function() {
    this.isAdmin = function isAdmin(req, res, next) {
        if(!req.user) {
            res.send("you're not authorized to make that request");
        } else {
            if(req.user.status === "admin"){
                next();
            }
            else {
                res.send("you're not authorized to make that request");
            }
        }
    },
    this.isUser = function isUser(req, res, next) {
        if(!req.user) {
            res.send("you're not authorized to make that request");
        }
        else {
            next();
        }
    };
    this.toLowerCase = function toLowerCase(req, res, next) {
        req.body.username = req.body.username.toLowerCase();
        console.log(req.body.username);
        next();
    }
};