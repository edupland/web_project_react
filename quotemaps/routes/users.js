const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = mongoose.model('user');

module.exports = (app) => {

  // Send the list of registered users
  app.get('/api/user/list', async (req, res) => {
    let users = await UserModel.find();
    return res.status(200).send(users);
  });

  // Send the currently logged in user
  app.get('/api/user/loggedInUser', async (req, res) => {
    if (req.session.user !== undefined) {
      res.send(req.session.user);
    }
  });

  app.post('/api/user/register', async (req, res) => {
    const nickname = req.body.user.nickname;
    const password = req.body.user.password;

    const newUser = new UserModel({
      nickname: nickname,
      password: password
    });

    // Encrypt password using bcrypt
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(_ => {
            console.log("add new user \"" + nickname + "\"");
            res.sendStatus(200);
          })
          .catch(err => {
              console.log(err)
              res.sendStatus(500);
          });
      })
    });

  });

  app.post('/api/user/login', async (req, res) => {
    if (req.session.user !== undefined && req.session.user.nickname) {
      console.log("Quelqu'un est déja connecté!");
      return res.status(401).end();
    }

    const nickname = req.body.user.nickname;
    const password = req.body.user.password;

    // Find if this user has an account
    UserModel.findOne({ nickname: nickname })
      .then(user => {
        if (!user) {
          console.log("Ce pseudo n'existe pas");
          return res.status(401).end();
        }

        // This user has an account, compare the password
        bcrypt.compare(password, user.password, (err, isCorrectPassword) => {
          if (err) throw err;
          if (isCorrectPassword) {
            console.log("\"" + nickname + "\" logged in");
            req.session.user = {
              nickname: nickname
            };
            return res.status(200).end();
          } 
          else {
            console.log("Mot de passe incorrect");
            return res.status(401).end();
          }
        });
      })
      .catch(err => console.log(err));
  });

  app.get('/api/user/logout', (req, res) => {
    req.session.destroy();

    return res.status(200).end();
  });

}