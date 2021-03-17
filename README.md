# Avalanche Referral | Shopify plugin

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)


# Installation
### Step 1 - Create api
So first you need is to create your own api, with its creditantials
Go to your app admin panel link
`https://<your-app-link>/admin/apps`

In the bottom you'll be able to see
```sh
Working with a developer on your shop? Manage private apps
```
Where the `Manage private apps` is link to `https://<your-app-link>/admin/apps/private`
> Click on it 

On the opened page click _Create new private app_ 
#### _Notice_ 
> If you alredy have created app, you have your api and api creditentials. Go to step 2

So after you will be on page `https://<your-app-link>/admin/apps/private/new`
Fill form fields

##### App information

`Private app name` - Any name of your API, we name it `Avalanche Referral System`
`Emergency developer email` - set your real email

##### Admin API

Click on `Show inactive Admin API permissions` to explode API permissions

`Assigned fulfillment orders` - Read and write
`Customers` - Read and write
`Draft orders` - Read and write
`Fulfillment services` -Read and write
`Online Store pages` -Read and write
`Order editing` - Read and write
`Orders` - Read and write
`Reports` - Read and write
`Resource feedback` - Read and write
`Script tags` - Read and write
`Shipping` - Read and write
`Shopify Payments accounts` - Read access
`Shopify Payments bank accounts` - Read access
`Shopify Payments disputes` - Read access
`Shopify Payments payouts` - Read access
`Store content` - Read and write
`Themes` - set your real email
`Third-party fulfillment orders` - set your real email
`Analytics` - No access
`Discounts` - No access
`GDPR data requests` - No access
`Gift cards` - No access
`Inventory` - No access
`Kit Skills` - No access
`Legal policies` - No access
`Locations` - No access
`Marketing events` - No access
`Merchant-managed fulfillment orders` - No access
`Price rules` - No access
`Product listings` - No access
`Products` - No access
`Shop locale` - No access
`Translations` - No access

##### Webhook API version

Always pick lates version, we recommend `2021-01 (latest)`

##### Storefront API
Just pick everything

If all done go to the bottom and click on `Save` buttin

After you will be able to have your `API key` and `Password` in your `Admin API` section of just created API


### Step 2 - Set up your store

Go to your base admin section and choose your sale channel
Basically it wolud be `SALES CHANNELS` - `Online store` - `Themes`

In your `Current theme` click on expand menu `Actions` and choose `Edit code`

###### Add JS file

1. Click on `Assets` folder
2. Click on `Add a new asset`
3. In modal window choose `Create a blank file`
4. In text field write `avalanche`
5. In selection field shoose `.js`
6. Click on `Add`
7. Click on just created file in `Assets` folder `avalanche.js`
8. Paste code from `avlanche.js` placed in this repository
9. Click on `Save` button

We will comeback to this file later
Now we need to config your environment variables

1. Click on `Config` folder (if u don't see it, click first on `Assets` folder to close it expanded)
2. Click on `setting_data.json` file (Notice: it could be named different from basic way)
3. You will see someting like 

```sh
{
  "current": {
    "sections": {
      "header": {
        "type": "header",
        "settings": {
        }
      },
      "hero-1": {
        "type": "hero",
        "settings": {
          "hero_size": "large",
          "text_size": "large"
        }
      },
      "feature-row": {
      ...
```

4. Change it to

```sh
{
  "current": {
    "avalanche_client_id": "your-client-id-in-avalanche",
    "avalanche_client_secret": "your-client-secret-in-avalanche",
    "avalanche_audience": "https://useavalanche.us.auth0.com/api/v2/",
    "avalanche_grant_type": "client_credentials",
    "avalanche_oauth_url": "https://useavalanche.us.auth0.com/oauth/token",
    "avalanche_referapp_api_url": "http://salty-reef-38656.herokuapp.com",
    "avalanche_site_base_url": "https://your-site-base-url",
    "avalanche_site_redirect": "https://your-site-redirect-url-for-referral",
    "avalanche_site_premium_url": "https://your-site-premium-url-for-reward",
    "avalanche_email_field": "checkout_email",
    "avalanche_firstname_field": "checkout_shipping_address_first_name",
    "avalanche_lastname_field": "checkout_shipping_address_last_name",
    "sections": {
      "header": {
        "type": "header",
        "settings": {
        }
      },
      "hero-1": {
        "type": "hero",
        "settings": {
          "hero_size": "large",
          "text_size": "large"
        }
      },
      "feature-row": {
```
Where 
`avalanche_email_field` - your cart field's id for email
`avalanche_firstname_field` - your cart field's id for first name
`avalanche_lastname_field` - your cart field's id for last name

5. Click on `Save` button

At this moment your should have:
1. Your API key
2. Your Password from API
3. Name of your settings file
4. Variables's path in setting file

Now we should go back to our `Assets` folder and open `avalanche.js` file

1. Replace `7e1a63f175cb00e327c6a161aee5fa39` to your API key
2. Replace `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` to your Password from API
3. Replace string
```sh
themes/120702304415/assets.json?asset[key]=config/settings_data.json
```
to
```sh
themes/theme_id/assets.json?asset[key]=config_folder/settings_file.json
```

`theme_id` - you can find if in your url. It would be like /admin/themes/120702304415?key=assets/avalanche.js, where `120702304415` is your theme id

4. Last thing your should do is to give your variables's path to script. In `avalanche.js` code you can see this

```sh
    ...
         window.avalanche = {
          token: token.token,
          baseUrl: json.current.avalanche_site_base_url,
          redirectUrl: json.current.avalanche_site_redirect,
          premiumUrl: json.current.avalanche_site_premium_url,
          email_field: json.current.avalanche_email_field,
          firstname_field: json.current.avalanche_firstname_field,
          lastname_field: json.current.avalanche_lastname_field
        }
    ...
```
Where:
`json` - just a variable of response, no need to change it

`current` - if and object variable, its parent for `avalanche_client_id`, `avalanche_client_secret` etc.

`avalanche_site_base_url`, `avalanche_site_redirect` and others are stored in `current`.

So if you have different path for it, pls replace it on right one.

5. Click on `Save` button
6. Go to `Layout` folder and click on `theme.liquid` file
7. Betwee `<head>` and `</head>` tags insert

```sh
<script src="{{ 'avalanche.js' | asset_url }}" async="async"></script>
```

### Step 3 - Inset frame to your desired place

In code customization mode you can see folders like `Layouts`, `Teamplates` and `Sections` - default folders

So click on them and click needed file. After pick the place you want to display referral window and inset a simple html code there
```sh
<div id="avalancheReferral"></div>
```

And it's done. Thank you for your attantion.
#### Video instruction comming soon..
