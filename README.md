# Twilio SMS for Salesforce Marketing Cloud Journey Builder 
### Starter template for creating a Twilio SMS activity in Journey Builder using Heroku

**NOTE:** This app and the associated code is NOT production quality, its pure purpose is to demonstrate the full flow of custom interactions in Journey Builder

### Pre-Requisites

* Node.js and npm installed (if you’d like to test locally)
* A Twilio account [sign up for a free Twilio account here](https://www.twilio.com/try-twilio)
* A Marketing Cloud Account with Journey Builder
* A publicly accessible web server (this template was built using a free Heroku account with SSL support)

Also, we’re going to make the assumption that you already have Salesforce Marketing Cloud’s Contact Builder properly setup and configured

### Getting Started

#### Configure web server 
This guide covers Heroku, skip this step if you are familiar on how to deploy a Node.js app

1. Fork and Clone this repository
2. Login into [Heroku](https://heroku.com)
3. Click on New > Create new app
4. Give a name to the app and click on "Create App"
5. Choose your preferred Deployment method (Github or Heroku Cli are nice to work with) 
6. Click on "Deploy branch"
7. Once your branch is deployed, click on the "View" button and verify you see the welcome message
8. Click on “Open App” and copy the URL for your application.  Save for use later.

#### Configuring your Twilio account (Messaging Service recommended) 

1. Login to the Twilio console and navigate to the home screen and click on settings
2. Copy your Account SID and your Auth Token and save it for later
3. Then navigate to Programmable SMS and click on SMS
4. If you don’t already have a Messaging Service setup, please review this [guide](https://www.twilio.com/docs/sms/services)
5. Click on the Messaging Service you would like to use and copy the Service SID and save it for later

While you can certainly tweak this example to send directly from a short code, you’ll have more flexibility when it comes to how you want to configure additional features around a messaging service; Copilot, advanced opt-out management, sticky sender, area code and country code geomatch.

#### Configure your package in Marketing Cloud

1. Login to Marketing Cloud and to the upper right hand corner and click on setup
2. Once in Setup, click into Apps > Installed Packages
3. Click on New and enter a name and a description for your package
4. Copy the JWT Secret value from the Summary page and save it for later
5. Click on Add Component, select Journey Builder Activity and Click next
6. Give you activity a name: Twilio SMS.  Also select the category where this activity will show up within Journey Builder.  Choose Messages.  Last, enter [url of your Heroku app] as your Endpoint URL
7. Click Save
8. Copy the Unique Key value from the Journey Builder Activity panel and save it for later

#### Configure the Twilio SMS Activity

1. Open /public/config.json and:
2. Replace applicationExtensionKey for the value you got from step 8 in configuring your package in Marketing Cloud
3. Replace [your-app-URL] with the domain for your specific heroku app:
- https://YOUR-APP-URL.herokuapp.com/journeybuilder/execute 
- https://YOUR-APP-URL.herokuapp.com/publish
- https://YOUR-APP-URL.herokuapp.com/validate 
- https://YOUR-APP-URL.herokuapp.com/stop 
- https://YOUR-APP-URL.herokuapp.com/save
4. Open public/js/customActivity.js and
5. Replace {{Contact.Attribute.TwilioV1.TwilioNumber}} with the correct data extension and column name that will be used to reference the TO phone number.
- {{Contact.Attribute.YOUR-DATA-EXTENSION-NAME.YOUR-PHONE-NUMBER-COLUMN}}
- This is something that is typically customized when setting up Marketing Cloud but is needed in order for Twilio to understand WHO the message needs to be sent to.

The index.html defines how the Marketer will see/interact with the Twilio Messaging Service.  By default, the code suggested asks for the following as a starting point: 
- Account SID
- Auth Token
- Messaging Service SID
- Message body

If you want, the Account SID, auth token even the Messaging Service SID can be hidden or saved as config variables so that your marketer doesn’t need to include them every time they configure a message through Journey Builder

#### Add Heroku vars

1. Log back into Heroku and navigate to your app
2. Click on "Settings"
3. Click on "Reveal config vars"
4. Add a new var called jwtSecret and paste the App Signature you got from step 3 when configuring your package in Marketing Cloud
- If you want to lock in what Messaging Service SID your marketing team uses, you can also save the Twilio account SID, auth token, as well as the Messaging Service SID as config var.


#### Testing Twilio SMS Activity

1. Login into Marketing Cloud and navigate to Journey Builder and create a new Journey.
2. You should be able to the Twilio SMS custom activity and drag it into the canvas
3. Click into the activity and fill out the Account SID, Auth Token, Messaging Service SID and the body for your SMS/MMS message.
4. Better yet, test out 5 different variations of your SMS message to optimize campaign performance(optional):

#### Want to learn more?

If you'd like to learn more about Twilio and how to integrate its services into Journey Builder Custom Activities, email me at [jmaitz@twilio.com](mailto:jmaitz@twilio.com)

Also, follow Twilio on [LinkedIn](https://www.linkedin.com/company/twilio-inc-/)
