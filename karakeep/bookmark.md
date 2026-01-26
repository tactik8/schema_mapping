# Karakeep bookmark

##
|                       |                         |                     |           |                                            |   |   |   |   |
|-----------------------|-------------------------|---------------------|-----------|--------------------------------------------|---|---|---|---|
|                       |                         |                     |           |                                            |   |   |   |   |
|                       |                         |                     |           |                                            |   |   |   |   |
| KaraKeep API Field    | Schema.org JSON-LD Path | Schema.org Property | Data Type | Implementation Note                        |   |   |   |   |
| id                    | identifier              | PropertyID          | Text      | Unique ID for the bookmark record.         |   |   |   |   |
| title                 | name                    | name                | Text      | The user-defined or site title.            |   |   |   |   |
| note                  | text                    | text                | Text      | Your personal annotations or thoughts.     |   |   |   |   |
| summary               | abstract                | abstract            | Text      | Specifically for the AI-generated summary. |   |   |   |   |
| createdAt             | dateCreated             | dateCreated         | DateTime  | ISO 8601 timestamp of creation.            |   |   |   |   |
| modifiedAt            | dateModified            | dateModified        | DateTime  | ISO 8601 timestamp of last edit.           |   |   |   |   |
| tags[].name           | keywords                | keywords            | Text      | Joined array of tag strings.               |   |   |   |   |
| content.url           | about.url               | url                 | URL       | The source link of the bookmarked page.    |   |   |   |   |
| content.title         | about.name              | name                | Text      | The crawled <title> of the source.         |   |   |   |   |
| content.description   | about.description       | description         | Text      | The crawled meta-description.              |   |   |   |   |
| content.bannerImageId | about.image             | image               | URL       | Formatted as an API asset endpoint.        |   |   |   |   |
| highlights[]          | hasPart[]               | Quotation           | Array     | Nested list of clipped text snippets.      |   |   |   |   |
| highlights[].text     | hasPart[].text          | text                | Text      | The specific text content of a highlight.  |   |   |   |   |
| favourited            | mainEntity.result       | actionStatus        | Text      | Maps to a "Favourited" status indicator.   |   |   |   |   |


