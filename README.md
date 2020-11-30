# Smart Gallery
> Link can be found at <a href= https://www.imagegallery.cf/ > this link</a>. 

## Table of contents
* [General info](#general-info)
* [Modules](#modules)
* [Feature List](#feature-list)
* [Technologies](#technologies)
* [Contributors](#contributors)
* [Status](#status)

## General info
Smart Gallery uses multiple new technologies to ensure that the users have better control and access to their images. From the architectural diagram above, the application is written in React and hosted on AWS Amplify using graphql. The schema has templates for the image object and its information which are stored in both AWS S3 bucket and DynamoDB respectively.

## Modules

Authentication is essential and a core area of our application development. With AWS Amplify, we have authentication using username and password, in addition to email and SMS notifications for registration so that only authorized users can access their application. Images uploaded to the bucket are segregated by username using IAM users, so that only the users that uploaded the image can see their images in the application, while those with Admin roles can view all the images in the S3 bucket. Images can also be downloaded locally or deleted from the S3 bucket directly from the application in the browser.

Smart Labeling using Amazon Rekognition is implemented as functionalities of the project. Since we aim to build a platform like Google Photos for image storage, the labels will be used to search and sort the images. The labels will be linked to the react app using graphql and will be stored in the DynamoDB database. Thus, when a user uploads an image, they can also add labels which can be used to identify similar images in the gallery, which are improved in retrieval performance using  Cloudfront CDN, built into Amplify and Route53.

The uploaded images can also be viewed in Album mode, which presents the images in a nice scrolling gallery mode, where images can be rotated and zoomed in. There is also a provided image search using Unsplash API which allows users to search for new images to download and upload to the S3 bucket.

Finally, the application is hosted on Amplify which is complemented by Route53 for custom domain, so that anyone with the URL can access the application.

During the development process, code was hosted on GitHub for CI/CD purposes with regular commits. In the beginning, we cloned from a central repository branch and developed our components, and then merged them back into a central repository branch which we hosted on AWS Amplify.

## Feature List

* AWS Amplify Hosting
* DynamoDB Tables
* Appsync API with GraphQL
* AWS Rekognition
    * Smart Labeling
    * AWS Polly
* Wider image search using Unsplash API
* Amplify Authentication with Cognito
* Cloudfront CDN 
* Autoscaling
* Multi-AZ Redundancy
* S3 Lifecycle Policy

## Technologies
* React and AWS Amplify

## Contributors

| Team Trinity               | GitHub Repositories                                                     |
|----------------------------|-------------------------------------------------------------------------|
| Archana Shokeen(015237378) | https://github.com/archanashokeeniitg/image-library-appsync/tree/phase2 |
| Eric Cheng(015300506)      | https://github.com/eccx400/image_gallery                                |
| Hung Le(010306088)         | https://github.com/HungVLe/image-library-appsync                        |
## Status
Project is: _Completed_