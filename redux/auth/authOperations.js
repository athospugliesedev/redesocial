import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import db from "../../firebase/config";
import { authSlice } from "./authReducer";
const { updateUserProfile, authSignOut, authStateChange } = authSlice.actions;

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await db.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

export const authSignUpUser =
  ({ email, password, login, avatar }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().createUserWithEmailAndPassword(email, password);

      const user = await db.auth().currentUser;

      const { displayName, uid, photoURL } = await db.auth().currentUser;

      if (avatar) {
        const response = await fetch(avatar);
        const file = await response.blob();
        await db.storage().ref(`avatar/${uid}`).put(file);
        const processedAvatar = await db
          .storage()
          .ref("avatar")
          .child(uid)
          .getDownloadURL();

        await user.updateProfile({
          displayName: login,
          photoURL: processedAvatar,
          email,
        });

        dispatch(
          updateUserProfile({
            userId: uid,
            login: displayName,
            email,
            avatar: photoURL,
          })
        );
        return;
      }

      await user.updateProfile({
        displayName: login,
        email,
      });

      dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
          email,
        })
      );
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };
export const authSignOutUser = () => async (dispatch, getState) => {
  await db.auth().signOut();
  dispatch(authSignOut());
};

export const authStateChangedUser = () => async (dispatch, getState) => {
  db.auth().onAuthStateChanged((user) => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        login: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };
      dispatch(updateUserProfile(userUpdateProfile));
      dispatch(authStateChange({ stateChange: true }));
    }
  });
};
