import User from "../app/models/User";
import Retail from "../app/models/Retail";


export const login = async (req, provider, profile, done) => {
  if (req.session.retail === "true")
    logRetail(profile, provider, done);
  else
    logCustomer(profile, provider, done)

}

const logRetail = async (profile, provider, done) => {
  const { sub, name, picture, email } = profile._json;

  const currentUser = await Retail.findOne({ where: { email } })

  if (currentUser) {
    // if (currentUser.provider_type !== 'google') {
    //   return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
    // }
    return done(null, currentUser);
  }
  else {// create new user if the database doesn't have this user
    try {
      await Retail.create({
        user_id: sub, name, email,
        provider_type: provider,
      })
        .then(newUser => {
          done(null, newUser)
        })
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }
}
const logCustomer = async (profile, provider, done) => {
  const { sub, name, picture, email } = profile._json;

  const currentUser = await User.findOne({ where: { email } })

  if (currentUser) {
    return done(null, currentUser);
  }
  else {// create new user if the database doesn't have this user
    try {
      await User.create({
        user_id: sub, name, email, thumbnail: picture, provider_type: provider,
      })
        .then(newUser => {
          done(null, newUser)
        })
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }
}
