[![ISC License](https://img.shields.io/badge/license-ISC-brightgreen.svg?style=flat)](https://tldrlegal.com/license/-isc-license)
[![Build Status](https://travis-ci.org/opengh/open-event.svg?branch=master)](https://travis-ci.org/opengh/open-event)
[![Coverage Status](https://coveralls.io/repos/github/opengh/open-event/badge.svg?branch=master)](https://coveralls.io/github/opengh/open-event?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Open Event

`open-event` specifies a way to store information on events/meetups/meetings 
as JSON files. It also contains a JavaScript library to process and validate
those JSON files.

## Specification

The specification consists of three parts

1. A [JSON Scheme](http://json-schema.org/) that specified the structure of a
file [event.schema.v1.json](https://github.com/opengh/open-event/blob/master/event.schema.v1.json)
2. A [file-name specification](#file-name-specification) that has to be used
for an event.
3. A [combinatory specification](#combinatory-specification) that considers
both the file content and the path.

Only if a file adheres to all three aspects it is considered a event.

## JSON Properties

| Property | Type | Description | Example | Note |
|----------|------|-------------|---------|------|
| **name** | string | Name of the event. | `'First Hangout'. ` | _If not given, it will default to {user}/{repo}/#{number-of-event}._ |
| **online** `**` | object | Location of an online event. |  |  |
| _online._**url** `*` | string | URL at which people will be able to meet. | `'http://online-events.com/evt1'.` |  |
| _online._**timeZone** `*` | string | [IANA Timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) to use for the time specification. | `'Asia/Tokyo'.` |  |
| **location** `**` | object | Location of an offline event. |  |  |
| _location._**place** `*` | string | Name or address of location. | `'Joyent, Sausolito California'` |  |
| _location._**directions** | string | Instructions on how to find the location. | `'Take the elevator Nr. 3 next to the south entrance.'` |  |
| _location._**url** | string | URL of the location. | `'http://events.com/evt1'` |  |
| _location._**lat** `*` | number | Latitude of the position. | `12 ` | _Together with `lng` forms the geographic position of the event. The time-zone is evaluated using this position._ |
| _location._**lng** `*` | number | Longitude of the position. | `140` |  |
| **openTime** | string | Time at which the location is available to enter. | `'19-30'` |  |
| **endDate** | string | Date at which the event ends. | `'1999-12-31'` |  |
| **endTime** | string | Time at which the event ends. | `'21-30' ` | _Specifies together with endDate the finishing time of the event._ |
| **contact** `*` | string | Email of the person that is responsible for this event. | `'email@example.com'` |  |
| **url** `*` | string | URL to sign-up for the event or get more information. | `'http://events.com/evt1'` |  |
| **coc** | string | URL for the Code of Conduct. | `'https://events.com/coc.html'` |  |

 `*`: Required.
 `**`: Conditionally Required.


## File-name specification

The file name **must start** with a start time specification in the format:
`YYYY-MM-DD_HH-MM`. It then **must** have a `_` followed by a freely definable
name and **has to** have the file ending `.json`.

Summary: `YYYY-MM-DD_HH-MM_{name}.json` is the file format.

_Note: The time specifies the moment at which the events start. If the venue
is available before use `openTime`_

## Combinatory specification

If given, the event's end time **has to** be **after** the start time.
If given, the event's open time **has to** be **before** the start time. 

## JavaScript Usage

Additionally to the specification this project also contains a Node.js
validator. It can be installed with `$ npm install open-event`.

```JavaScript
var openEvent = require('open-event')
```

For more information on the api, look into the [examples folder](https://github.com/opengh/open-event/tree/master/example).

## Detailed Rationale

This specification considers several priorities.

- It provides only one way to write down information in order to ease 
implementation and usage of the file format.
- It only assumes the minimum required information.
- It aims to be consistent and human friendly.
- It supports online or offline events as well as online and offline events.

### Why is a contact-email required?

Through experience of running events it has become apparant that the 
legitimization as organizer of an event is important for various reasons.
Email addresses are chosen because:

- ... everybody knows how to interact with them
- ... unlike html links, emails are cheaper to maintain and thus less likely to be deleted
- ... unlike a instant messaging account they are more likely to be actually
received by someone
- ... it is easy and common for people to setup one email address to reach multiple persons (if the organizer is not alone)

### Why require latitude and longitude for offline events?

Validating and writing addresses properly is a very difficult task that would 
make this file format depending on an address-lookup service to work. With a
latitude and longitude this data is easy to put on a map and allows together
with description to be easily reached. As it doesn't require a lookup the geo
location also supports a timezone lookup which is important to make sure that
the time entered is placed to the right place.

### Why the start time in the file path?

By having the start time in the file path multiple events get automatically correctly sorted by age.

### Why is the end time split in two different properties?

We have considered to specify the end in a single property that contains both
the end date and end time with the date being optional, like:
`end: "(YYYY-MM-DD_)HH-MM"`. This might reduce the amount of text to type but 
will result in a less verbose JSON file where the act of __adding__ the 
optional date would be to __modify__ the time. _In short_: we chose the more 
verbose way to write which humans make less errors to write.

### Why the requirement on the name in the path?

Experience shows that it is important to be able to address an event properly
which means that having a name is required. A name in the file path allows us
to see which event it is by just glimpsing over the folder which is important 
and good practice. The name property in JSON is optionally available in case
you want to improve the text formatting.

### Why `HH-MM` for the time definitions?

The usual time notation `HH:MM` is not possible in the file path. As such the start and end specification would 

### Why JSON?

Other file formats such as `YAML` are easier to manually edit but they are
harder to process in various languages. JSON files are immediately usable
in web projects.
