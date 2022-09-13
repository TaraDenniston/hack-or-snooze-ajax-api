"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


/** Show submit story form when user clicks on "submit" on top nav with main 
 *  list of all stories underneath */

function navSubmit(evt) {
  console.debug("navSubmit", evt);
  hidePageComponents();
  $addStoryForm.show();
  putStoriesOnPage();
}

$navSubmit.on("click", navSubmit);

/** Show list of user's favorite stories when "favorites" is clicked */

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  putFavoritesOnPage();
}

$body.on("click", "#nav-favorites", navFavorites);

/** Show list of user's own stories when "my stories" is clicked */

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
