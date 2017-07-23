# State of JavaScript HQ

The State of JavaScript Headquarters.
The place where we process and analyze the "State of JavaScript 2017" survey results.

GOAL: Generate useful statistic from more than 17,000 responses collected since 2017/07/18.

## Strategy

* Download JSON data from Typeform API
* Normalize data and convert from JSON to CSV rows, to try to generate a file as small as possible
* Query the local data and aggregate data (JSON files)
* Create nice visualization

## Survey configuration

All survey questions are defined through JSON configuration files.
A survey is made of questions, every question has at least a `type` and a `text` field.

### Available types

#### Basic

* `text`: a simple question rendered by a basic input field
* `single`: a single choice question
* `multi`: a multiple choice question

#### Examples

```json
{
  "type": "text",
  "text": "What is your email?"
}
```

```json
{
  "type": "single",
  "text": "What is your main text editor?",
  "options": ["Sublime Text", "Atom", "Visual Studio", "Other"]
}
```

### State of JS custom types

#### `"type": "knowledge"`

* "I've never heard of it"
* "I've HEARD of it, and WOULD like to learn it"
* "I've HEARD of it, and am NOT interested"
* "I've USED it before, and WOULD use it again"
* "I've USED it before, and would NOT use it again"

#### `"type": "happiness"`

* 1
* 2
* 3
* 4
* 5

#### `"type": "feature"`

* "I don't know what that is",
* "Not needed",
* "Nice-to-have, but not important",
* "Major feature",
* "Vital feature"

#### `"type": "opinion"`

* 0 Disagree
* 1
* 2 Neutral
* 3
* 4 Agree
