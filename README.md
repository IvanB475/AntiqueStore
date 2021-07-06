
## Short description
Antique store is a portfolio project of online web/book shop that contains all the functionality web shop needs. 
You can check out preview version at: http://18.195.203.94:8000/


### Project status
In development(forever), playground for learning new stuff.

### Project's purpose
Portfolio, learning and experimenting, maybe to have a bit of fun too.


### Tech stack
- Node.js
- Express.js (framework)  
- MongoDB (DB)
- Mongoose (ODM)

Preview version of the project is hosted on AWS.



## To run project on your local machine follow:

1. clone the project
2. run npm install
3. start the app with: node app.js

If you haven't specified env variables, project will run on localhost, port 5000.


### Further usage
If you want to use this project as a base for your project, go ahead. Do not use this project as is, it is not production ready. 
You can contact me if you want my advice where to go from here to prepare it for production.


### Few notes about the project:
- Frontend is purely for demonstration purposes of backend funcionality, it is not responsive and is intended for 21.5 - 27 inch monitors.
- At the moment preview application is available only in Croatian.

# User guide

- Landing page is just an ugly landing page, runaway from it as quickly as possible by clicking on a big button in a middle of a screen.
- You will be redirected to page where you can browse books, you can keep browsing and view book details, but to add to cart/purchase book, you will have to login.
- At this point you probably noticed navbar at top of the page, navbars links go as follow(from left to right):
1. "Početna" - back to landing
2. "Knjige" - page you're on right now
3. "eKnjige" - same page as "Knjige", but displaying eBooks in the offer.
4. "Prijava" - sign in
5. "Registracija" - sign up

If you want to sign up on the preview project, please use dummy data. Project uses basic joi validation, so make sure that email has a proper email structure (E.G. example@example.com) and that password has at least 6 characters.

To sign in into preview project I've prepared a few test accounts: test user 1-5, with password 123456 (E.G.  username: test user 1, password: 123456).

App supports accounts with 2 levels of privileges: "user" and "admin"
User account - has only necessary functionalities for users ( add to cart, remove from cart, buy book, edit email address...)
Admin account - has all user functionalities + ability to add/edit/delete books

All test accounts on the preview application have user privileges.


