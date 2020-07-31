import User from '../models/User';



export default async (accessToken, refreshToken, profile, cb) => {
  User.findOrCreate({ user_id: profile.id, provider_type:'facebook' }, function (err, user) {
    return cb(err, user);
  });
}


