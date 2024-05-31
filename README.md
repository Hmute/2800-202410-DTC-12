# 2800-202410-DTC-12

## WellBot

	Welcome to DTC-12 app WellBot. WellBot is a routine/wellness app dedicated to help you to find daily workout routines and keep track of your calorie intake to make sure you are maximizing the time to put into your fitness.

## Project description:
	
	This project uses Ai to create and modify daily workouts based on what the users inputs and chooses, it changes daily and helps out with new recommendations, it helps keep track of food intake and their components and it’s a lifestyle app as well, to help the user connect with the community. We used JS, EJS, MongoDB for the mainframe of our product since these tools gave us the freedom to achieve what we wanted to implement. 

## Technologies Used:

Front End: CSS, EJS, JS, HTML
Middleware: Rate Limiting, Static Files, Session Management, Body Parsing
Backend: JS
Database: MongoDB

## Table of Contents:

│   .env \
│   .gitignore \ 
│   package-lock.json \
│   package.json \
│   README.md \
│   server.js \
│ \ 
├───.vscode \
│       settings.json \
│ \
├───css \
│       addFood.css \
│       blog.css \
│       blogCreate.css \
│       blogPosts.css \
│       blogView.css \
│       easterEgg.css \
│       forgotPasswordReset.css \
│       homeBot.css \
│       homeTop.css \
│       launch.css \
│       logExercise.css \
│       login.css \
│       signup.css \
│       style.css \
│       userProfile.css \
│       weight.css \
│ \
├───images \
│   │   dance.mp3 \
│   │   Default_pfp.png \
│   │   discoball.gif \
│   │   dog.jpg \
│   │   robot.gif \
│   │   Wellbot.png \
│   │ \
│   └───Easter_Egg \
│           dumbbell.png \
│           dumbbell_press.png \
│           exercise.png \
│           fitness.png \
│           mobile-phone.png \
│           muscle.png \
│           schedule.png \
│           weights1.png \
│           Wellbot.png \
│           yoga-pose.png \
│ \
├───middlewares \
│       blogMiddlewares.js \
│ \
├───routes \
│       addFoodRoute.js \
│       blogRoute.js \
│       blogSchema.js \
│       botRoute.js \
│       forgotPasswordResetRoute.js \
│       healthRoutes.js \
│       historyRoute.js \
│       homeRoute.js \
│       launchRoute.js \
│       logExerciseRoute.js \
│       loginRoute.js \
│       PastRoutine.js \
│       Routine.js \
│       signupRoute.js \
│       User.js \
│       userProfileRoute.js \
│       weightRoute.js \
│       Workout.js \
│ \
├───script \
│       addExercise.js \
│       addMeal.js \
│       blogCreateContent.js \
│       blogCreateImage.js \
│       blogCreateTags.js \
│       blogDeletePost.js \
│       blogPage.js \
│       blogView.js \
│       botResults.js \
│       calendar.js \
│       calender.js \
│       deleteExercise.js \
│       easterEgg.js \
│       footer.js \
│       homeHiddenPTag.js \
│       macroProgression.js \
│       progression.js \
│       savePopup.js \
│       userProfile.js \
│       weight.js \
│ \
├───setup \
│       cloudinary.js \
│ \
└───views \
    │   addfood.ejs \
    │   addMeal.ejs \
    │   blogCreate.ejs \
    │   blogPage.ejs \
    │   blogUserPost.ejs \
    │   blogView.ejs \
    │   botInitial.ejs \
    │   botResults.ejs  \
    │   completeProfile.ejs \
    │   forgotPasswordReset.ejs \
    │   history.ejs \
    │   home.ejs \
    │   homeBot.ejs \
    │   homeTop.ejs \
    │   launch.ejs \
    │   logExercise.ejs \
    │   login.ejs \
    │   macroProgression.ejs \
    │   meals.ejs \
    │   setWeightGoal.ejs \
    │   signup.ejs \
    │   userProfile.ejs \
    │   weight.ejs \
    │ \
    └───templates \
            footer.ejs \
            header.ejs \


## How to Install and Run

### Prerequisites:

Node.js and npm installed on your system.
A MongoDB database (you can use MongoDB Atlas for a cloud-based solution).
API keys for SENDGRID and WGER.

### Step-by-Step Guide: 

a. Clone the Repository to your local machine

b. Install Dependencies (in your terminal run the required use “npm install”)

c. Set Up Environment Variables: Create a .env file in the root directory of your project and add the following environment variables: 

MONGODB_USER=<your_mongodb_user>  \
MONGODB_PASSWORD=<your_mongodb_password> \
MONGODB_HOST=<your_mongodb_host> \
MONGODB_OPTIONS=<your_mongodb_options> \
SESSION_SECRET=<your_session_secret> \
PORT=3000  \
WORKOUT_API_KEY=<your_workout_api_key> \
MEAL_API_KEY=<your_meal_api_key> \

d. Directory Structure: Ensure your project directory structure matches the expected setup.

e. Run the Project: using “npm start” on your terminal. Alternatively, you can use nodemon for automatic restarts:  npm nodemon server.js

f. Verifying Setup: Open your browser and navigate to http://localhost:3000 (or the specified port in your .env file). Ensure the application connects to the MongoDB database and starts serving requests.



### How to Use WellBot

a. Sign up if you do not have an account. Log in if you do.

b. Navigate to your profile page and click edit profile.

c. Fill up the fields with proper information or details about yourself.

d. Click the save profile button.

e. Go to the ‘Workout Settings’ page and generate a workout.

f. Check the workouts you want to save after the bot gives the list of generated workout.

g. Go to the homepage  and click the exercise card to view your chosen exercises.

h. Edit the exercises that are already done for the day.

i. Go back to the homepage and click the ‘Weight’ card to track your fitness progress.

j. Go back to the homepage and click the ‘Meals’ card to log your meals and find out its nutrition values.

k. Go back to the homepage and click the ‘Calories’ card to view your current calories based on the food that you log on the ‘Meals’ card.

l. Go to ‘Blog Posts’ and click a blog post to read its contents.

m. Click the close button and then click the (+) button floating on the right to create a blog post.

n. Fill in the fields and click the ‘POST’ button.

o. Click the list icon on top of the (+) icon to view your posts and you can decide if you want to delete your post or not.

p. Navigate back to your profile page and click the ‘Sign out’ button to sign out.

## Credits

	Heraldo Abreu A01383752 Hmute
	Marc Arnaldo A01383660 Togo1
	Richard Li A00995183 RichardLi6
	Sebastian Taylor A01368621 Sebastian-Taylor
	Ben Oh A0137682 Ben Oh


