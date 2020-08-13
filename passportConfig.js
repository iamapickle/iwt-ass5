const localStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const popup = require('sweetalert');

function initialize(passport) {

    const authenticate = (name, password, done) => {
        pool.query(`select * from users where name=$1`, [name],
            (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(results.rows)
                if (results.rows.length > 0) {
                    const user = results.rows[0];
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            console.log("wrong password");
                            return done(null, false, { message: "Password incorrect" });
                        }
                    })
                } else {
                    return done(null, false, { message: "Username incorrect" });
                }
            })
    }

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        pool.query(`select * from users
                    where id=$1`, [id],
            (err, results) => {
                if (err) {
                    throw err;
                }
                console.log("deserializer:", results.rows[0])
                return done(false, results.rows[0]);
            })
    })

    passport.use(new localStrategy({
        usernameField: 'name',
        passwordField: 'password'
    }, authenticate));
}

module.exports = initialize;