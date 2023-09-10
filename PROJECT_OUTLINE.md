# Architectural Outline (My FitNest (?))

## Front-end (mobile first)

### Splash/Entry Page (Nature Theme / Nesting)
    * Graphic / Branding
    * 2-5 Seconds or Click to Enter?
---

### Login or Sign Up and Create Profile (Toggle?)
    * Dual Nature Theme, Spring/Summer, Egg (?)
    * Fitness For **EVERYONE** (?)
---

### Chat
    * List of Active Chats (and History)
    * Open A Chat from the List
---

### FitNest Matches
    * Cards of Matches (Scrolling)
        - Visible **TAGS** (activities)
        - Button to Save To Nest/Send **CHIRPS**
        - Button to Eliminate
---

### Manage 
    - Update Profile (or Delete)
    - Logout

<><><><><><><><><><><><><><>
## Back-end
### Database Server - set up shared database

## USER MODEL - Profile (!* indicates required)
* Username !*
     (*TODO - or Google Account Sign in, Facebook Sign in)
* Password !*
* Location (Zip Code) !*

* First Name (Internal)
* Last Name (Internal)
* Picture(s) (Default Graphic Sport? Face? Birds?)
* Tagline
* Biography (paragraph)

* Activity (PRIMARY MATCH CRITERION) // *TODO - Stretch Goal (top SINGLE Activity to Start) - Array of Other Activities?

*!Note **Visible Tags:**
* Self Skill Level (Beginner, Intermediate, Expert, Instructor)
* Seeking Skill Level
* Age Range
* Target Age Range
* Availability (time block)(check boxes)

### EndPoints
---
## Match by:
- Activity !*
- Location (compare Zip Code proximity?) !*

    - Age Group // *TODO - Add to Search Logic
    - Skill Levels // *TODO - Add to Search Logic
    - Availability (Time) // *TODO - Add to Search Logic
---
* CREATE Profile (Post) 
* READ (Get All Users by Location, Activity) 
* UPDATE Profile (Patch) 
* DELETE Profile (Delete)
---

---
## Chat
* CREATE new message (Post) 
* READ (Get (all messages by Room))
* READ (Get (all Rooms (one on one message session)))

    * leave record of deleted message? (empty message) // !*TODO - Stretch Goal
    * UPDATE edit message (Patch) // !*TODO - Stretch Goal
    * DELETE message (Delete) // !*TODO - Stretch Goal
---
### Security
* Block User *! (BUTTON)
* Disconnect Location? // *!TODO - Stretch Goal
* Turn off Notifications? // *! Operating System Option

##### Kelsey test 2 hehe
##### Jake test 4