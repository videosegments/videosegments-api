# VideoSegments API v4 (draft)
This is working draft of new VideoSegments API v4.
Right now this version is under developement. Source code will be added once stable version will be ready.

# Anonymous Routes (draft)
Here you can find all requests that does not require registration and supported by API.

|Method |URL                                              |Params                   |Description                                      |
|-------|-------------------------------------------------|-------------------------|-------------------------------------------------|
|GET    |https://api.videosegments.org/v4/s/:domain/:id   |none                     |Get segmentation for :domain with :id            |
|POST   |https://api.videosegments.org/v4/s/:domain/:id   |timestamps, types        |Add new segmentation for :domain with :id        |
|GET    |https://api.videosegments.org/v4/p/:domain       |none                     |Get last pending segmentations for :domain       |
|POST   |https://api.videosegments.org/v4/u/register      |login, password, captcha |Register as new user                             |
|POST   |https://api.videosegments.org/v4/u/login         |login, password, captcha |Login as registered user                         |

# Registered Routes (draft)
Here you can find all requests that require registration and supported by API.

|Method |URL                                              |Params                   |Description                                      |
|-------|-------------------------------------------------|-------------------------|-------------------------------------------------|
|PUT    |https://api.videosegments.org/v4/s/:domain/:id   |timestamps, types        |Update segmentation for :domain with :id         |
|DELETE |https://api.videosegments.org/v4/s/:domain/:id   |none                     |Delete segmentation for :domain with :id         |
|DELETE |https://api.videosegments.org/v4/p/:domain/:id   |none                     |Delete pending segmentation for :domain with :id |
|POST   |https://api.videosegments.org/v4/u/logout        |login, password, captcha |Logout                                           |

# Supported Domains (draft)
Right now API works only with YouTube domain.

|Alias  |Domain                   |
|-------|-------------------------|
|youtube|https://www.youtube.com/ |
