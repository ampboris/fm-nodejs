#### MEAN FM

#### Teach Stack

- Backend: Express + MongoDB+ Moogoose + JWT + bycrptjs token based authentication
- Frontend: AngularJS + Bootstrap3

#### DEMO:
The whole express api has been deployed to heroku with the mongoDB hosting on [MLab](https://mlab.com/), while the frontend is deployed to aws s3.
[DEMO](https://s3-ap-southeast-2.amazonaws.com/fm-last-bucket/index.html#/)

#### Run:
To run on local, please follow correct steps:

1. Clone the repo.
2. run `npm install`
3. make sure mongoDB is running
4. run `npm start`, it should print something like:
5. by default the frontend is available on: http://localhost:8083/static/index.html#/

#### Test
Make sure mongoDB is running locally properly, run `npm test`. The Express side is largely covered by the test.

[![TEST PHOTO](http://res.cloudinary.com/dgatrk4pi/image/upload/v1510866710/Screen_Shot_2017-11-17_at_8.11.14_am_c1pydb.png)


#### Key features
- Login and Sign Up with token based authentication developed on server side.
- Search Favourite artist by name
- Pagination for search
- Add artist to favourite list
- Order favourite list on client side by artist name and artist
- Basic Responsive pages offered by bootstrap and a simple manual styling enhancement using @media query.

#### Project main structure
```
/
├── server
│   ├── api.js (routing for api)
│   ├── server.js (test contents)
│   ├── config.js (congiguration for environments)
│   │── controllers (perform logic control)
│   │── db (manage mongoose connection)
│   │── middleware (express middleware)
│   ├── models (Mongoose data schemas)
│   ├── public (Frontend AngularJS)
│── package.json
```

#### Tech Stack Choice

1. MongoDB and nodejs is the requirement
2. Mongoose is used as a driver for MongoDB. As a popular
ODM, it allows for configuring schema, add hooks, good data validation.
3. Express is a popular node.js server framework and I am more familiar with it.
4. AngularJS is used for frontend as it is one of the most familiar js frameworks to me, the original intention is to use Angular
but due to short amount of time, it was changed.
5. Bootstrap is used also for saving time and produce a nice looking page.

#### Key Decisions

1. The return from last.fm seems to be a bit complex and for a simple project, it would be easier for front end to deal with simpler data structure.
Therefore, I wrote a GET /api/artist that takes artist name and page number, returns result, count, page number.
The artist object is also mapped to contain only one image, mbid, number of listeners and name. The Other benefit is we don't need to
change frontend if we decide to use other music api like spotify and itunes later.

2. The data model in MongoDB is something simple like below, it stores Artist as subdocument instead of creating a new collection. Since the requirement is only list a user's favourite artists
I believe this implementation is appropriate.

```javascript
// server/models/user.js
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {type: String, required: true, trim: true, unique: true},
  password: {type: String, required: true, minlength: 6},
  favArtists: [ArtistSchema], // More...
});
```

#### Authentication Model

The server side has a relative sophisticated token based authentication model.

- For user registration, the user will send its name and password through https, I assume its connection security
and did not do any change to the data due to simplicity. After the data gets passed into server,
the server will generate a hash and store the password into mongodDB and generate a JWT authentication token by user id and jwt secret.
Lastly, it returns this info to user in http header 'x-auth'. A simple Diagram is shown here:

[![TEST PHOTO](http://res.cloudinary.com/dgatrk4pi/image/upload/v1510868624/Screen_Shot_2017-11-17_at_8.43.02_am_a4sahu.png)

- Login is basically the same without generating new token

- For other APIs that requires user identity, an express middleware is used to check whether the 'x-auth' on incoming request matches any users in the mongoDB collection. The workflow is shown in this diagram:

[![TEST PHOTO](http://res.cloudinary.com/dgatrk4pi/image/upload/v1510868624/Screen_Shot_2017-11-17_at_8.43.02_am_a4sahu.png)

#### Shortcuts, Simplifying Assumptions

- The number of listeners, preview image of an artist is stored when user add an singer to favourites. It will not update and may be slightly different to the live data of last.fm.

- The mbid of singer is used as a unique id to identify whether user has added a singer, but sometimes the last.fm returns multiple results in which some has the same mbid. This is because some singer has
different names or other artists he/she collaborated with.

- The authentication token does not expire, if user does not logout, it will be there forever.

#### What Slowed Me Down and how I solved

The biggest thing slowed me down is when I finished the backend and jump back to frontend, I found I cannot get access to the header 'x-auth'
even though obviously it is on the chrome console network section. I tried a number of ways on front end with interceptors, different js frameworks
but the problem was not solved. Then I realise it is a backend problem. It turns out the server side has to return the 'Access-Control-Expose-Headers'.
After adding this to the express, there is no problem.
