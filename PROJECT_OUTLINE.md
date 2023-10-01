# Architectural Outline

## Front-end (mobile first)

### Navigation Bar (Material UI at bottom (footer nav))

### Splash/Entry/Loading Page SWOULmates
    * Graphic / Branding
    * Theme? Soul? Swole?
    * Fitness For **EVERYONE** (?)
    * 2-5 Seconds or Click to Enter?
---

### Login or Sign Up Then Create Profile (Choice Toggle)
### Login (sub page)
### Signup (sub page)
    
---
### Chat (MAIN PAGE)
    * List of Active Chats (and History)
    * Open A Chat from the List

### View Matches
    * Table of Cards: Matches (Scrolling)
        - Visible **TAGS**
            - sport/activity
            - availability time blocks
        - Chat Button

        - Button to Save To Friends // TODO - (Stretch Goal)
        - Button to Remove a Match // TODO - (Stretch Goal)
        - location tag (necessary?) // TODO - (Stretch Goal)
---

---

### User Manage 
    - Update Profile (or Delete)
    - Logout

### Admin Manage 
    - View All User Profiles COMPLETE
    - Edit All User Profiles 
    - Delete User (Or Suspend)

    // *TODO Stretch Goals 
    - Suspend User (Stretch Goal)
    - Contact User Form (Stretch Goal)
    - Rest Authorization Token (Stretch Goal)


<><><><><><><><><><><><><><>
## Back-end
### Database Server - set up shared database

## USER MODEL - Profile (!* indicates required)
* Username !*
     (*TODO - or Google Account Sign in, Facebook Sign in)
* Password !*
* Location (Zip Code - {AS A STRING}) !*

* First Name (Internal)
* Last Name (Internal)
* Picture(s) (Default Graphic Sport? Face? Birds?)
* Tagline
* Biography (paragraph)
* Gender

* Activity (PRIMARY MATCH CRITERION) // *TODO - Stretch Goal (top SINGLE Activity to Start) - Array of Other Activities?

*! Note **Visible Tags:**
* Self Skill Level (Beginner, Intermediate, Expert, Instructor)
* Seeking Skill Level
* Age Range
* Target Age Range
* Availability (time block)(check boxes)

### EndPoints
---
## Match by:
- ~~Activity !*~~
- Location (compare Zip Code proximity?) !*

    - Age Group // *TODO - Add to Search Logic
    - Skill Levels // *TODO - Add to Search Logic
    - Availability (Time) // *TODO - Add to Search Logic
    - Target Gender(s)  "Prefer to work with..." // *TODO - Add to Search Logic

---
* CREATE Profile (Post) // COMPLETE
* READ (Get All Users by Location, ~~Activity~~) COMPLETE
* UPDATE Profile (Patch) // COMPLETE; can revisit how message is formed
* DELETE Profile (Delete) // Mostly COMPLETE

- Forgot & Reset Password
* CREATE (Post) Forgot PASSWORD
* READ (Get) Reset PASSWORD
* CREATE (Post) Confirm PASSWORD
---

---
## Chat
* CREATE new message (Post) COMPLETE
* READ (Get (all messages by Conversation)) COMPLETE
* READ (Get (all Conversations (one on one message session) by Logged In User)) COMPLETE

    * leave record of deleted message? (empty message) // !*TODO - Stretch Goal
    * UPDATE edit message (Patch) // !*TODO - Stretch Goal
    * DELETE message (Delete) // !*TODO - Stretch Goal
---
### Security
* Block User *! (BUTTON)
* Disconnect Location? // *!TODO - Stretch Goal
* Turn off Notifications? // *! Operating System Option

---