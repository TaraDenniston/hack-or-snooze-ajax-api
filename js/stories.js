"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/** Compare given storyID with the storyIDs in the user's list of favorites.
 *  If there is a match, return true; if not, return false */

function isFavorite(storyId) {
  if (currentUser.favorites !== 0) {
    for (let story of currentUser.favorites) {
      if (story.storyId === storyId) {
        return true;
      }
    }
  }

  return false;
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // Decide whether to use hollow or solid star based on whether the story
  // is favorited or not
  let symbol = "";

  if (isFavorite(story.storyId)) {
    symbol = "fa-solid fa-star";
  } else {
    symbol = "fa-regular fa-star";
  }

  return $(`
      <li id="${story.storyId}">
        <i class="${symbol}"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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

/** Get the data from the #add-story-form, call the .addStory method, and 
 * put the new story on the page. */

async function addNewStoryOnPage(evt) {
  console.debug("addNewStoryOnPage", evt);
  evt.preventDefault();

  // Create object from form data
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const newStory = {title, author, url};

  // Create instance of Story class using currentUser and form data
  const storyInst = await storyList.addStory(currentUser, newStory);

  // Create HTML to display new story and add it to the top of #all-stories-list
  const $story = generateStoryMarkup(storyInst);
  $allStoriesList.prepend($story);

  // Clear and hide form
  $addStoryForm.trigger("reset");
  $addStoryForm.hide();
}

  // Handle submit event on form
  $addStoryForm.on("submit", addNewStoryOnPage);


  function putFavoritesOnPage() {
    console.debug("putFavoritesOnPage");
  
    // If the user does not have any favorites, show a message
    if (currentUser.favorites.length === 0) {
      $favoriteStoriesList.append("<p>No favorites have been added yet</p>")
      
    // Otherwise loop through all of the user's favorite stories and generate 
    // HTML for them
    } else {
      for (let story of currentUser.favorites) {
        const $story = generateStoryMarkup(story);
        $favoriteStoriesList.append($story);
      }
    }
  
    $favoriteStoriesList.show();
  }

