/**
 *  this is a simple application that shows the usage of the address book extension module
 */
var window = Ti.UI.createWindow({
    backgroundColor:"white"
});

var loading = Ti.UI.createLabel({
    text:"Loading...",
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE
});

var button = Ti.UI.createButton({
    title:"Email",
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    bottom:10,
    enabled:false
});

window.add(loading);
window.add(button);

window.open();


// load our address book module
var addressbook = require("org.appcelerator.addressbook.ext");

// try and find our 
var people = Ti.Contacts.getPeopleWithName("Haynie");
if (!people || people.length===0)
{
    // this is example from the doc at http://docs.appcelerator.com/titanium/2.1/index.html#!/api/Titanium.Contacts
    // we just need to make sure we have one entry in our address book since simulator initially is empty
    var workAddress = 
    {
          'CountryCode': 'us',
          'Street':  '440 N. Bernardo Avenue',
          'City': 'Mountain View',
          'State': 'California',
          'Country': 'United States',
          'ZIP': '94043'
    };
        
    var person = Ti.Contacts.createPerson(
    {
          firstName:'Jeff',
          lastName:'Haynie',
          address:
          {
            work: [ workAddress ]
          },
          phone:
          {
            work: [ '(650) 528-2914' ]
          },
          url:
          {
            homepage: [ 'blog.jeffhaynie.us' ],
            work: [ 'www.appcelerator.com' ]
          }
    });
}

var vcard;

// show the contact dialog to allow us to pick a person from the address book UI
Ti.Contacts.showContacts(
{
    selectedPerson:function(e)
    {
        var person = e.person;
        // use our module to convert the selected person into a vcard
        vcard = addressbook.createVCardRepresentationWithPeople(person);
        // just coerse the blob into a string and display it
        loading.text = String(vcard);
        // enable our button
        button.enabled = true;
    }
});

// when the user clicks the button, send an email attachment
button.addEventListener("click",function()
{
    var emailDialog = Ti.UI.createEmailDialog()
    emailDialog.subject = "Hello from Titanium";
    emailDialog.toRecipients = ['foobar@gmail.com'];
    emailDialog.html = true;
    emailDialog.messageBody = '<b>Appcelerator Titanium Rocks!</b>';
    // add attachment takes a blob or file, etc. just attach our vcard
    emailDialog.addAttachment(vcard);
    emailDialog.open();
});

