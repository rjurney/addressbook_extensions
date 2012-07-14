/**
 * AddressBook extensions
 *
 * Copyright (c) 2012 by Appcelerator, Inc.
 * and licensed under the Apache Public License (version 2)
 */
#import "OrgAppceleratorAddressbookExtModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"
#import "TiContactsPerson.h"

@implementation OrgAppceleratorAddressbookExtModule

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"caf17fe1-cfae-4ca7-b09a-c5756c478cd0";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"org.appcelerator.addressbook.ext";
}

// private APIs

-(ABRecordRef) convertContactProxyToRecord:(id)arg
{
    return [(TiContactsPerson*)arg record];
}

// public API

-(id)createVCardRepresentationWithPeople:(id)args
{
    // the record method of TiContactsPerson requires us to be on the UI thread so check that 
    // and if we're not on the main thread, use a block to run this on the main thread
    if (![NSThread isMainThread]) 
    {
		__block id result;
		TiThreadPerformOnMainThread(^{result = [[self createVCardRepresentationWithPeople:args] retain];}, YES);
		return [result autorelease];
	}

    id array = [args objectAtIndex:0];
    
    // if this is one person object, we convert to a ABRecordRef and add it to an array
    if ([array isKindOfClass:[TiContactsPerson class]])
    {
        array = [NSArray arrayWithObject:[self convertContactProxyToRecord:array]];
    }
    // if this is an array of person objects, we convert to a new array and add them
    else if ([array isKindOfClass:[NSArray class]])
    {
        NSMutableArray *a = [NSMutableArray array];
        for (id obj in array)
        {
            [a addObject:[self convertContactProxyToRecord:obj]];
        }
        array = a;
    }
    else
    {
        //what is this they are passing?
        @throw @"Invalid type passed";
    }

    NSData *vcards = (NSData *)ABPersonCreateVCardRepresentationWithPeople((CFArrayRef)array);
    // this is a new, so autorelease it
    [vcards autorelease];
    
    // vcards are NSData objects, convert it to a blob data object with the VCard mimetype and 
    // return it so we can transport it and attach it to email, etc.
    return [[[TiBlob alloc] initWithData:vcards mimetype:@"text/x-vcard"] autorelease];
}


@end
