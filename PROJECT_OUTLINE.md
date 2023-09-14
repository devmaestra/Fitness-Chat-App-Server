# Architectural Outline (My FitNest (?))

## Front-end (mobile first)

### Navigation Bar (Material UI at bottom (footer nav))

### Splash/Entry/Loading Page (Nature Theme / Nesting)
    * Graphic / Branding
    * Dual Nature Theme, Spring/Summer, Egg (?)
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

        - Button to Save To Nest // TODO - (Stretch Goal)
        - Button to Remove a Match // TODO - (Stretch Goal)
        - location tag (necessary?) // TODO - (Stretch Goal)
---

---

### User Manage 
    - Update Profile (or Delete)
    - Logout

### Admin Manage 
    - View All User Profiles
    - Edit All User Profiles
    - Delete User (Move to Archive)

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

---
