//////////////////////////////////////////////////////////////////////////
//googleStrategy.js
//The following code sets up the app with OAuth authentication using
//the 'google' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////
import { GoogleLogin } from "react-google-login";
import User from '../models/User.js';

// Render GoogleLogin component
const googleStrategy = new GoogleLogin({
  clientId: process.env.GOOGLE_CLIENT_ID,
  buttonText: "Login with Google",
  onSuccess: async (response) => {
    console.log("User authenticated through Google. In passport callback.");
    //Our convention is to build userId from displayName and provider
    const userId = `${response.profileObj.name}@${response.profileObj.provider}`;
    //See if document with this unique userId exists in database
    let currentUser = await User.findOne({"accountData.id": userId});
    if (!currentUser) { //Add this user to the database
      currentUser = await new User({
        accountData: {id: userId},
        identityData: {displayName: response.profileObj.name,
                        profilePic: response.profileObj.imageUrl},
        speedgolfData: {bio: "",
                        homeCourse: "",
                        personalBest: {},
                        clubs: {},
                        clubComments: ""}
      }).save();
    }
    return done(null,currentUser);
  },
  onFailure: (response) => {
    console.log("User failed to authenticate through Google. In passport callback.");
    return done(null,false);
  }
});

export default googleStrategy;