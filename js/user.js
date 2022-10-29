"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle clicking on star of story to add/remove favorite */

async function toggleFavorite(evt) {
  console.debug("toggleFavorite", evt);
  evt.preventDefault();

  const $star = $(evt.target);

  // Fetch the storyId from the event's parent  
  const storyId = $star.parent().attr("id");

  // If clicked story has a hollow star...
  if ($star.attr("class") === "fav fa-regular fa-star") {
    // ...change the star to solid and add to favorites
    $star.attr("class", "fav fa-solid fa-star");
    currentUser = await currentUser.addFavorite(storyId);

  // If clicked story has a solid star...
  } else if ($star.attr("class") === "fav fa-solid fa-star") {
    // ...change the star to hollow and remove from favorites
    $star.attr("class", "fav fa-regular fa-star");
    currentUser = await currentUser.removeFavorite(storyId);
  } 
}

$body.on("click", "i.fav", toggleFavorite);

/** Handle clicking on trash icon of own story to delete */

async function deleteOwnStory(evt) {
  console.debug("toggleFavorite", evt);
  evt.preventDefault();

  const $trash = $(evt.target);

  // Fetch the storyId from the event's parent  
  const storyId = $trash.parent().attr("id");

  // Delete user's story from API and update currentUser and storyList
  currentUser = await currentUser.deleteStory(storyId);
  storyList = await StoryList.getStories();

  // Reload list of user's own stories without the deleted one
  putMyStoriesOnPage();
}

$body.on("click", "i.del", deleteOwnStory);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();
  $loginForm.hide();
  $signupForm.hide();

  updateNavOnLogin();
}



