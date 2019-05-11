# VideoSegments API v4 (alpha)
This is alpha version of new VideoSegments API v4.
Note that this version is under developement.

# Anonymous Routes 
Here you can find all requests that supported by this version of API and does not require registration.

| Method | URL                                              | Params                   | Description                                      |
|--------|--------------------------------------------------|--------------------------|--------------------------------------------------|
| GET    | https://api.videosegments.org/v4/:domain/:id     | none                     | Get segmentation for :domain with :id            |
| POST   | https://api.videosegments.org/v4/:domain/:id     | timestamps, types        | Add new segmentation for :domain with :id        |
| POST   | https://api.videosegments.org/v4/register        | login, password, captcha | Register as new user                             |
| POST   | https://api.videosegments.org/v4/login           | login, password, captcha | Login as registered user                         |
| GET    | https://api.videosegments.org/v4/p/:domain       | none                     | Get last pending segmentations for :domain       |

# Registered Routes 
Here you can find all requests that supported by this version of API and require registration.

| Method | URL                                              | Params                   | Description                                      |
|--------|--------------------------------------------------|--------------------------|--------------------------------------------------|
| POST   | https://api.videosegments.org/v4/:domain/:id     | timestamps, types        | Update segmentation for :domain with :id         |

# Planned Routes (draft)
| Method | URL                                              | Params                   | Description                                      |
|--------|--------------------------------------------------|--------------------------|--------------------------------------------------|
| POST   | https://api.videosegments.org/v4/logout          | none                     | Logout                                           |
| DELETE | https://api.videosegments.org/v4/:domain/:id     | none                     | Delete segmentation for :domain with :id         |
| DELETE | https://api.videosegments.org/v4/p/:domain/:id   | none                     | Delete pending segmentation for :domain with :id |

# Supported Domains 
Right now API works only with YouTube domain.

| Alias   | Domain                   |
|---------|--------------------------|
| youtube | https://www.youtube.com/ |
