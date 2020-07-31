
export default async (accessToken, refreshToken, profile, cb) => {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}


