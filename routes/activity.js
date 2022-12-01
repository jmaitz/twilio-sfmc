'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var http = require('https');

const axios = require('axios');
const { SIGKILL } = require('constants');

exports.logExecuteData = [];

function logData(req) {
    try {
        exports.logExecuteData.push({
            body: req.body,
            headers: req.headers,
            trailers: req.trailers,
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query,
            route: req.route,
            cookies: req.cookies,
            ip: req.ip,
            path: req.path,
            host: req.host,
            fresh: req.fresh,
            stale: req.stale,
            protocol: req.protocol,
            secure: req.secure,
            originalUrl: req.originalUrl
        });
        console.log("body: " + util.inspect(req.body));
        console.log("headers: " + req.headers);
        console.log("trailers: " + req.trailers);
        console.log("method: " + req.method);
        console.log("url: " + req.url);
        console.log("params: " + util.inspect(req.params));
        console.log("query: " + util.inspect(req.query));
        console.log("route: " + req.route);
        console.log("cookies: " + req.cookies);
        console.log("ip: " + req.ip);
        console.log("path: " + req.path);
        console.log("host: " + req.host);
        console.log("fresh: " + req.fresh);
        console.log("stale: " + req.stale);
        console.log("protocol: " + req.protocol);
        console.log("secure: " + req.secure);
        console.log("originalUrl: " + req.originalUrl);
    }
    catch (e) {
        console.log("error in logData");
    }
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    try {
        console.log("begin edit");

        //console.log("Edited: "+req.body.inArguments[0]);    

        // Data from the req and put it in an array accessible to the main app.
        //console.log( req.body );
        logData(req);
        return res.status(200).json({
            success: true,
        });
    }
    catch (e) {
        console.log("error in edit");
        console.log(e)
        return res.status(500).json({
            message: "Error in edit",
            success: false,
        });
    }
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    try {
        console.log("begin save");

        //console.log("Saved: "+req.body.inArguments[0]);

        // Data from the req and put it in an array accessible to the main app.
        console.log(req.body);
        logData(req);
        return res.status(200).json({
            success: true,
        });
    }
    catch (e) {
        console.log("error in save");
        console.log(e)
        return res.status(500).json({
            message: "Error in save",
            success: false,
        });
    }
};


function sendToBraze(email, phone, message) {
    const brazeSuffix = process.env.brazeSuffix;
    const url = "https://api.kustomerapp.com/v1/hooks/form/" + brazeSuffix;
    var payload = {"to_email":email,"to_phone":phone,"message1":message};

    axios.post(url, payload).then(
        (response)=>{
            console.log("in callback after kustomerapp call");
            console.log("status",response.status);
            console.log("header",response.headers);
        }

    ).catch((e)=>{
        console.log("error in Kustomer request");
        console.error(e);
    })
    request.post(
        url,
        payload,
        function (error, response, body) {
            console.log("callback from Braze request");
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.log("some sort of error");
                console.log(error);
                console.log(response);
                console.log(body);
            }
        }
    );

}

function in_whitelist(to_number) {
    const white_list = [
        "+16462461260",
        "+19178554229",
        "+15676741096",
        "+15033299390",
        "+19177277893",
        "+15516669363",
        "+15033299390"
    ]

    return white_list.includes(to_number)
}
/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    try {


        console.log("begin execute");
        console.log("inArguments");
        console.log(req.body.inArguments);
        var requestBody = req.body.inArguments[0];

        const accountSid = process.env.accountSid;
        const authToken = process.env.authToken;
        const messagingService = process.env.messagingService;
        
        const to = requestBody.recipient_mobile;
        
        const body = requestBody.body;

        const client = require('twilio')(accountSid, authToken);

        if (in_whitelist(to)) {
            console.log(to, " is in whitelist, about to send");
            client.messages
                .create({
                    body: body,
                    messagingService: messagingService,
                    to: to,
                    from: '469335'
                })
                .then(message => console.log(message.sid))
                .done();
            console.log("created the message");
        }
        else {
            console.log(to, "not in whitelist");
            return res.status(500).json({
                message: "recipient_mobile not in whitelist",
                success: false,
            });
        }


        sendToBraze('david.ball+braze@zeel.com',to,body);
        // FOR TESTING
        logData(req);
        return res.status(200).json({
            success: true,
        });
    }
    catch (e) {
        console.log("caught an exception in execute")
        console.log(e);
        return res.status(500).json({
            message: "Error attempting to execute",
            success: false,
        });
    }


    // Used to decode JWT
    // JWT(req.body, process.env.jwtSecret, (err, decoded) => {

    //     // verification error -> unauthorized request
    //     if (err) {
    //         console.error(err);
    //         return res.status(401).end();
    //     }

    //     if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {

    //         // decoded in arguments
    //         var decodedArgs = decoded.inArguments[0];

    //         logData(req);
    //         res.send(200, 'Execute');
    //     } else {
    //         console.error('inArguments invalid.');
    //         return res.status(400).end();
    //     }
    // });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    try {
        console.log("Begin publish");

        //console.log("Published: "+req.body.inArguments[0]);        

        // Data from the req and put it in an array accessible to the main app.
        //console.log( req.body );
        logData(req);
        return res.status(200).json({
            success: true,
        });
    }
    catch (e) {
        console.log("error in publish");
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "error in publish"
        });
    }
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    try {
    console.log("Begin validate");

    console.log("Validation request body:");
    console.log(req.body)
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    return res.status(200).json({
        success: true,
    });
    
    }
    catch (e) {
        console.log("error in publish");
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "error in publish"
        });
    }

};
