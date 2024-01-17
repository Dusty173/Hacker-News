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

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide();
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

function navStorySubmit(){
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on('click', navStorySubmit);

function navFavorites(){
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on('click', '#nav-favorites', navFavorites);

function navbarProfile(e){
  console.debug('navbarProfile');
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on('click', navbarProfile);

function toggleUserStories(){
  hidePageComponents();
  getUserStories();
  $ownStories.show();
}

