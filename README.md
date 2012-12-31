This app is a mobile application
server which users (signing up using weibo simple registrations) 

**Note:** You need to have node.js and mongodb installed and running

## Install
```sh
  $ git clone https://github.com/ben46/chichichi-server.git
  $ npm install
  $ cp config/config.example.js config/config.js
  $ cp config/imager.example.js config/imager.js
  $ npm start
```

**NOTE:** Do not forget to update your weibo APP_ID and APP_SECRET in `config/config.js`. Also if you want to use image uploads, don't forget to replace the upcloud keys in `config/imager.js`.

Then visit [http://localhost:3000/](http://localhost:3000/)

## Directory structure
```
-app/
  |__controllers/
  |__models/
  |__views/
-config/
  |__routes.js
  |__config.js
  |__passport.js (auth config)
  |__express.js (express.js configs)
  |__middlewares/ (custom middlewares)
```

---