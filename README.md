Appcelerator Titanium Address Book extensions
=============================================

This is a simple Titanium iOS module to show how you can extend the address book to add additional functionality.

Right now, the only new function is the iOS vcard representation of a person object.  

Given a [Titanium.Contacts.Person](http://docs.appcelerator.com/titanium/2.1/index.html#!/api/Titanium.Contacts.Person) object, you can get it using:

~~~
var vcard = addressbook.createVCardRepresentationWithPeople(person);
~~~

This is also a simple example on how to create a module in Titanium for iOS.

License
-------
Apache Public License version 2.
Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
