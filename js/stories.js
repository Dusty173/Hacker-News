"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeletebtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeletebtn ? getDeleteBtn() : ''}
        ${showStar ? getStar(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

function getDeleteBtn(){
  return `<span class="deletebtn"><i class="fas fa-trash-alt"></i></span>`
}

function getStar(story, user){
  const favStory = user.isFavorite(story);
  const isStarred = favStory ? 'fas' : 'far';
  return `<span class="star"><i class="${isStarred} fa-star"></i></span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function removeThisStory(e){
  const $LI = $(e.target).closest('li');
  const storyId = $LI.attr('id');

  await storyList.removeStory(currentUser, storyId);

  getUserStories();
}

$ownStories.on('click', '.deletebtn', removeThisStory);

function getUserStories(){
  $ownStories.empty();

  if(currentUser.ownStories.length === 0){
    $ownStories.append('<h3>You have no stories</h3>');
  } else {
    for(let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

async function submitStory(e){
  e.preventDefault();

  const title = $('#create-title').val();
  const url = $('#create-url').val();
  const author = $('#create-author').val();
  const username = currentUser.username;
  const storyInfo = {title, url, author, username};

  const story = await storyList.addStory(currentUser, storyInfo);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on('submit', submitStory);

function putFavoritesListOnPage(){
  $favoritedStories.empty();
  if (currentUser.favorites.length === 0){
    $favoritedStories.append('<h3>You have not favorited anything yet.</h3>');
  } else {
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story)
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}


async function toggleFavorites(e){
  const $targt = $(e.target);
  const $Li = $targt.closest('li');
  const storyId = $Li.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($targt.hasClass('fas')){
    await currentUser.removeFavorite(story);
    $targt.closest('i').toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $targt.closest('i').toggleClass("fas far");
  }
}

$storiesLists.on('click', '.star', toggleFavorites);