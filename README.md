# typed.events  
### **by:** *Cab* -- Max Sun, Christian Wu, David Deng, Noah Kuo
#### Quickly add events to your calendar!

## How to Use
Go to http://typed.events to use the *TypedEvents* web application. Enter events such as "CS Lecture in Wheeler 150 every Wednesday 1 to 2pm" or "Tennis Club MWF weekly 2 to 3pm" and press Enter to add them into the queue. When you add to your event, fields such as the location and time will autopopulate. The only required field is the time, but feel free to add any fields nessesary.

Once you finish entering your events, you can either download it as an ICS file on your local calendar or sign into Google to add them into your Google calendar. Typed.events will remember your login on future visits.

## Motivation
Nobody wants to use their voice or their mouse if they don't have to.


While Google Calendar is great for organizing events, sharing events with friends, and displaying schedules, it requires a lot of mouse movement in order to add simple events. In order to add a single recurring event, you have to go though a lot of steps, clicking the schedule, adding the title, editing the start and end time, picking if it is a reminder or an event, adding locations, conferencing, notifications, visiblity, repeatability, guests, and many other options. For a simple event, this is inefficient, especially since all of this needs a mouse input (or an unreasonable amount of shortcuts).

We figured that typing out events, much like you would say to Alexa or Google Assistant, is a much faster way to add simple events. However, voice control is unusable in a library or lecture, in a loud environment, and when you want to maintain your social status among your friends. With our program we could even amplify preformance with shortcuts and shorthand that a voice interpreter could not understand.

In a controlled test we entered in schedules for next semester with our website approximately 3 times faster than we could in google calendar's own interface, by taking advantage of a simplified and intuitive UI and shortcuts that cut down on 'clicks' and time.

## 'Specs'
**Features:**
 Google Calendar and Native Calendar App Integration, Intuitive Date Interpolation, Date Rolling, Instant Input Feedback, Shortcuts
 
 **Stack**
This application uses an HTML and CSS frontend and utilizes JavaScript to create ICS files and access the Google Calendar REST API. 

**Some Supported Syntax**
Today, Tomorrow, Noon, Midnight, Next Friday, Next next Thursday, Mondays, Tuesdays, Wednesdays, Everyday , Daily, Weekly, MWF, TTH, WF, ...

**Default Inputs**

| Field         | Default       |           
| ------------- | ------------  |
| Date          | today         | 
| Time  | 0 min      |  
| Place | none      | 
| Title | none |
| Repeat | none |

## \#TODO
* Iron out some pattern matching regex exceptions
* Match on actual dates such as 12/24/19
* Make interface even more intuitive
* Work on display (particularly some scrollbars) on various browsers
* Minify JS/CSS to make sure website runs as fast as possible

*Created by Cab for Cal Hacks 2018*
